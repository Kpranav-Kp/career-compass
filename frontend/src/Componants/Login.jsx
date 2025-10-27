import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const data = await authService.login(email, password);
            if (!data.success) {
                throw new Error(data.message || 'Invalid credentials');
            }
            navigate('/main');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='w-full min-h-screen bg-black flex items-center justify-center p-4'>
            <div className='w-full max-w-md p-9 flex flex-col gap-7 box-border rounded-3xl border border-[#0089ED] bg-white text-gray-900'>
                <div className='flex items-start justify-between p-2'>
                    <div className='flex flex-col gap-5'>
                        <h1 className='text-xl font-normal'>Welcome to <Link to="/" className='text-[#0089ED] font-bold hover:underline'>CareerCompass</Link></h1>
                        <h1 className='text-5xl font-medium'>Sign in</h1>
                    </div>
                </div>
                <form className='flex flex-col gap-3' onSubmit={handleSubmit}>
                    <div className='flex gap-3 flex-col'>
                        <label htmlFor="email" className='font-medium text-gray-900'>Email</label>
                        <input 
                            className='p-3 rounded-xl border border-[#4285F4] bg-white text-gray-900 placeholder-gray-400'
                            type="email" 
                            id="email" 
                            placeholder='Email' 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className='flex gap-3 flex-col mt-5'>
                        <label htmlFor="password" className='font-medium text-gray-900'>Enter your Password</label>
                        <input 
                            className='p-3 rounded-xl border border-[#4285F4] bg-white text-gray-900 placeholder-gray-400'
                            type="password" 
                            id="password" 
                            placeholder='Password' 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <Link to="/forgot-password" className='text-[#4285F4] hover:underline'>
                        <h3 className='text-right'>Forget Password</h3>
                    </Link>
                    {error && <p className='text-red-400'>{error}</p>}
                    <button type="submit" className='bg-[#0089ED] p-3 mt-3 rounded-xl text-white font-semibold hover:bg-[#0089ED]/90 disabled:opacity-50' disabled={isLoading}>
                        {isLoading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>
                <p className='text-center text-gray-600'>
                    Don't have an account? {' '}
                    <Link to="/register" className='text-[#0089ED] hover:underline'>Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
