import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { get_auth } from '../api/endpoints';
import { useNavigate } from 'react-router-dom'
import { login } from "../api/endpoints";

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
            navigate('/feed')
        } else {
            alert('Invalid username or password')
        }
    }

    useEffect(() => {
        check_auth();
    }, []);

    return (
        <AuthContext.Provider value={{ auth, authLoading, auth_login }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)