console.log('Script Starting...');
require('dotenv').config();

const requiredParams = [
    'CLOUDINARY_NAME',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET'
];

console.log('--- Environment Check ---');
const missing = [];
const found = [];

requiredParams.forEach(param => {
    const value = process.env[param];
    if (!value || value.trim() === '') {
        missing.push(param);
    } else {
        found.push(param);
    }
});

console.log('Found:', found.join(', '));
console.log('Missing/Empty:', missing.join(', '));

if (found.includes('CLOUDINARY_NAME') || found.includes('CLOUDINARY_CLOUD_NAME')) {
    if (found.includes('CLOUDINARY_API_KEY') && found.includes('CLOUDINARY_API_SECRET')) {
        console.log('STATUS: OK (Minimum requirements met)');
    } else {
        console.log('STATUS: FAILED (Missing API Key or Secret)');
    }
} else {
    console.log('STATUS: FAILED (Missing Cloud Name)');
}
console.log('-------------------------');
