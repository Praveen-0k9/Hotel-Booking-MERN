const User = require('../models/User');
const cookieToken = require('../utils/cookieToken');
const bcrypt = require('bcryptjs')
const cloudinary = require('cloudinary').v2;


// Register/SignUp user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email and password are required',
      });
    }

    if (!email.endsWith('@gmail.com')) {
      return res.status(400).json({
        message: 'Email must be a @gmail.com address',
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters',
      });
    }

    // check if user is already registered
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: 'User already registered!',
      });
    }

    user = await User.create({
      name,
      email,
      password,
    });

    // after creating new user in DB send the token
    cookieToken(user, res);
  } catch (err) {
    res.status(500).json({
      message: 'Internal server Error',
      error: err,
    });
  }
};

// Login/SignIn user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check for presence of email and password
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required!',
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: 'User does not exist!',
      });
    }

    // match the password
    const isPasswordCorrect = await user.isValidatedPassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: 'Email or password is incorrect!',
      });
    }

    // if everything is fine we will send the token
    cookieToken(user, res);
  } catch (err) {
    res.status(500).json({
      message: 'Internal server Error',
      error: err,
    });
  }
};

// Google Login
exports.googleLogin = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400), json({
        message: 'Name and email are required'
      })
    }

    // check if user already registered
    let user = await User.findOne({ email });

    // If the user does not exist, create a new user in the DB  
    if (!user) {
      user = await User.create({
        name,
        email,
        password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10)
      })
    }

    // send the token
    cookieToken(user, res)
  } catch (err) {
    res.status(500).json({
      message: 'Internal server Error',
      error: err,
    });
  }
}

const streamifier = require('streamifier');

// Upload picture
exports.uploadPicture = async (req, res) => {
  if (!req.file) {
    console.log('No file received');
    return res.status(400).json({ message: 'No file uploaded' });
  }

  console.log('Starting manual stream upload...');

  const streamUpload = (req) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'Airbnb/Users',
        },
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            console.error('Stream Upload Error:', error);
            reject(error);
          }
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
  };

  try {
    const result = await streamUpload(req);
    console.log('Upload success:', result.secure_url);
    res.status(200).json(result.secure_url);
  } catch (error) {
    console.error('Upload Failed Catch:', error);
    res.status(500).json({
      message: 'UPLOAD_FAIL: ' + (error.message || JSON.stringify(error)),
      error
    });
  }
}

// update user
exports.updateUserDetails = async (req, res) => {
  try {
    const { name, password, email, picture } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404), json({
        message: 'User not found'
      })
    }

    // user can update only name, only password,only profile pic or all three

    // properly handle partial updates
    user.name = name;
    if (picture) user.picture = picture;
    if (password) {
      if (password.length < 8) {
        return res.status(400).json({
          message: 'Password must be at least 8 characters',
        });
      }
      user.password = await bcrypt.hash(password, 10);
    }
    const updatedUser = await user.save()
    cookieToken(updatedUser, res)
  } catch (error) {
    console.error('Update User Error:', error);
    res.status(500).json({
      message: 'UPDATE_ERR: ' + (error.message || JSON.stringify(error)),
      error
    })
  }
}

// Logout
exports.logout = async (req, res) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: true,   // Only send over HTTPS
    sameSite: 'none' // Allow cross-origin requests
  });
  res.status(200).json({
    success: true,
    message: 'Logged out',
  });
};
