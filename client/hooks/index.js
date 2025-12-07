import { useState, useEffect, useContext } from 'react';
import jwt_decode from 'jwt-decode';

import { UserContext } from '@/providers/UserProvider';
import { PlaceContext } from '@/providers/PlaceProvider';

import { getItemFromLocalStorage, setItemsInLocalStorage, removeItemFromLocalStorage } from '@/utils';
import axiosInstance from '@/utils/axios';

// USER
export const useAuth = () => {
    return useContext(UserContext)
}

export const useProvideAuth = () => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const storedUser = getItemFromLocalStorage('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false)
    }, [])

    const register = async (formData) => {
        const { name, email, password } = formData;

        try {
            const { data } = await axiosInstance.post('/users/register', {
                name,
                email,
                password,
            });
            if (data.user && data.token) {
                setUser(data.user)
                // save user and token in local storage
                setItemsInLocalStorage('user', data.user)
                setItemsInLocalStorage('token', data.token)
            }
            return { success: true, message: 'Registration successfull' }
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed';
            return { success: false, message }
        }
    }

    const login = async (formData) => {
        const { email, password } = formData;

        try {
            const { data } = await axiosInstance.post('/users/login', {
                email,
                password,
            });
            if (data.user && data.token) {
                setUser(data.user)
                // save user and token in local storage
                setItemsInLocalStorage('user', data.user)
                setItemsInLocalStorage('token', data.token)
            }
            return { success: true, message: 'Login successfull' }
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            return { success: false, message }
        }
    }

    const googleLogin = async (credential) => {
        const decoded = jwt_decode(credential);
        try {
            const { data } = await axiosInstance.post('/users/google/login', {
                name: `${decoded.given_name} ${decoded.family_name}`,
                email: decoded.email,
            });
            if (data.user && data.token) {
                setUser(data.user)
                // save user and token in local storage
                setItemsInLocalStorage('user', data.user)
                setItemsInLocalStorage('token', data.token)
            }
            return { success: true, message: 'Login successfull' }
        } catch (error) {
            return { success: false, message: error.message }
        }
    }

    const logout = async () => {
        try {
            const { data } = await axiosInstance.get('/users/logout');
            if (data.success) {
                setUser(null);

                // Clear user data and token from localStorage when logging out
                removeItemFromLocalStorage('user');
                removeItemFromLocalStorage('token');
            }
            return { success: true, message: 'Logout successfull' }
        } catch (error) {
            console.log(error)
            return { success: false, message: 'Something went wrong!' }
        }
    }

    const uploadPicture = async (picture) => {
        try {
            const formData = new FormData()
            formData.append('picture', picture)
            const { data } = await axiosInstance.post('/users/upload-picture', formData)
            return { success: true, data }
        } catch (error) {
            console.log(error);
            let message = 'Image upload failed';
            if (error.response?.data) {
                if (typeof error.response.data === 'string') {
                    // Start of HTML response?
                    message = 'Server Error (HTML Response)';
                } else {
                    message = error.response.data.message || error.message || message;
                }
            }
            return { success: false, message };
        }
    }

    const updateUser = async (userDetails) => {
        const { name, password, picture } = userDetails;

        if (!user) {
            return { success: false, message: 'User not authenticated' };
        }

        try {
            const { data } = await axiosInstance.put('/users/update-user', {
                name, password, email: user.email, picture
            })
            if (data.success && data.user) {
                setUser(data.user);
                setItemsInLocalStorage('user', data.user);
                return { success: true, message: 'Profile updated successfully', user: data.user };
            }
            return { success: false, message: 'Update failed' };
        } catch (error) {
            console.log(error)
            const message = error.response?.data?.message || error.message || 'Update failed';
            return { success: false, message }
        }
    }


    return {
        user,
        setUser,
        register,
        login,
        googleLogin,
        logout,
        loading,
        uploadPicture,
        updateUser
    }
}


// PLACES
export const usePlaces = () => {
    return useContext(PlaceContext)
}

export const useProvidePlaces = () => {
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);

    const getPlaces = async () => {
        const { data } = await axiosInstance.get('/places');
        setPlaces(data.places);
        setLoading(false);
    };

    useEffect(() => {
        getPlaces();
    }, [])

    return {
        places,
        setPlaces,
        loading,
        setLoading
    }
}