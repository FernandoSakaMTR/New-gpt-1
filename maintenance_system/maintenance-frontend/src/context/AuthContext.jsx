import { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null);
    const [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwtDecode(JSON.parse(localStorage.getItem('authTokens')).access) : null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const loginUser = async (username, password) => {
        const response = await fetch('http://localhost:8000/api/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();

        if (response.ok) {
            setAuthTokens(data);
            const decodedUser = jwtDecode(data.access);
            setUser(decodedUser);
            localStorage.setItem('authTokens', JSON.stringify(data));
            // Redirect based on role
            if (decodedUser.role === 'maintenance') {
                navigate('/manutencao');
            } else {
                navigate('/request');
            }
        } else {
            // This will be caught by the calling component
            throw new Error(data.detail || 'Failed to login');
        }
    };

    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
        navigate('/login');
    };

    const contextData = {
        user,
        authTokens,
        loginUser,
        logoutUser,
    };

    useEffect(() => {
        // This is a simplified logic. A real app would handle token refreshing.
        if (loading) {
            // You might want to verify the token here with the backend
            setLoading(false);
        }
    }, [authTokens, loading]);

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
