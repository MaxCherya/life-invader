import axios from 'axios'

import { SERVER_URL } from '../constants/constants'

const BASE_URL = SERVER_URL

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
})

api.interceptors.response.use(
    (response) => response,
    async error => {
        const original_request = error.config
        if (error.response?.status === 401 && !original_request._retry) {
            original_request._retry = true;
            try {
                await refresh_token();
                return api(original_request)
            } catch (refreshError) {
                window.location.href = '/login'
                return Promise.reject(refreshError)
            }
        }
        return Promise.reject(error)
    }
)

export const get_auth = async () => {
    const response = await api.get('authenticated/')
    return response.data
}

export const get_user_profile_data = async (username) => {
    const response = await api.get(`user_data/${username}/`)
    return response.data
}

const refresh_token = async () => {
    const response = await api.post(`/token/refresh/`);
    return response.data
}

export const login = async (username, password) => {
    const response = await api.post(`/token/`, { username, password });
    return response.data
}

export const register = async (username, email, first_name, last_name, password) => {
    const response = await api.post(`/register/`, { username, email, first_name, last_name, password });
    return response.data
}

export const toggleFollow = async (username) => {
    const response = await api.post(`/toggle-follow/`, { username });
    return response.data
}

export const get_users_posts = async (username, num) => {
    const response = await api.get(`/posts/${username}/?page=${num}`)
    return response.data
}

export const toggleLike = async (id) => {
    const response = await api.post(`/toggle-like/`, { id })
    return response.data
}

export const createPost = async (description) => {
    const response = await api.post(`/create-post/`, { description })
    return response.data
}

export const getPosts = async (num) => {
    const response = await api.get(`/get-posts/?page=${num}`)
    return response.data
}

export const search_users = async (search) => {
    const response = await api.get(`/search/?query=${search}`)
    return response.data
}

export const logout = async () => {
    const response = await api.post('/logout/')
    return response.data
}

export const update_user = async (values) => {
    try {
        const response = await api.patch('/update-user/', values, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            return error.response.data;
        }
        return { success: false, error: "Something went wrong." };
    }
};

export const auth_google = async (code) => {
    const response = await api.post('/auth/google/', { code })
    return response.data
}