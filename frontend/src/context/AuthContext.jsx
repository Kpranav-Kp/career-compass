import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setUser({ token });
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        if (isLoggingIn) {
            return;
        }
        setIsLoggingIn(true);
        try {
            const response = await fetch('http://localhost:8000/api/v1/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message || 'Invalid credentials');
            }

            localStorage.setItem('token', data.access);
            localStorage.setItem('refreshToken', data.refresh);
            setUser({ token: data.access });
            return data;
        } catch (error) {
            throw error;
        } finally {
            setIsLoggingIn(false);
        }
    };

    const register = async (username, email, password) => {
        try {
            const response = await fetch('http://localhost:8000/api/v1/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // backend expects 'name' key
                body: JSON.stringify({ name: username, email, password })
            });

            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message || 'Registration failed');
            }
            return data;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setUser(null);
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
