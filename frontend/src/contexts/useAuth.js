import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { get_auth } from '../api/endpoints';
import { useNavigate } from 'react-router-dom'
import { login, auth_google } from "../api/endpoints";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(false)
    const [authLoading, setAuthLoading] = useState(true)
    const navigate = useNavigate()
    const hasCheckedAuth = useRef(false);

    const check_auth = async () => {
        if (hasCheckedAuth.current) return;
        hasCheckedAuth.current = true;
        try {
            await get_auth();
            setAuth(true);
        } catch (err) {
            setAuth(false);
        } finally {
            setAuthLoading(false);
        }
    };

    const auth_login = async (username, password) => {
        const data = await login(username, password)
        if (data.success) {
            setAuth(true)
            const userData = {
                "username": data.user.username,
                "bio": data.user.bio,
                "email": data.user.email,
                "first_name": data.user.first_name,
                "last_name": data.user.last_name,
                "profile_image": data.user.profile_image,
            }
            localStorage.setItem('userData', JSON.stringify(userData))
            navigate('/feed')
        } else {
            alert('Invalid username or password')
        }
    }

    const auth_login_google = async (code) => {
        const data = await auth_google(code);
        console.log(data)
        if (data.success) {
            setAuth(true)
            const userData = {
                "username": data.user.username,
                "bio": data.user.bio,
                "email": data.user.email,
                "first_name": data.user.first_name,
                "last_name": data.user.last_name,
                "profile_image": data.user.profile_image,
            }
            localStorage.setItem('userData', JSON.stringify(userData))
            navigate('/feed')
        } else {
            alert('Error has occurred')
        }
    }

    useEffect(() => {
        check_auth();
    }, []);

    return (
        <AuthContext.Provider value={{ auth, authLoading, auth_login, auth_login_google }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)