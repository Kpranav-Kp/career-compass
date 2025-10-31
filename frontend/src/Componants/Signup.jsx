import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const { register, login } = useAuth();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const data = await register(username, email, password);
            if (!data.success) {
                throw new Error(data.message || 'Registration failed');
            }
            try {
                await login(email, password);
            } catch (err) {}
            navigate('/main');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className='w-full min-h-screen bg-black flex items-center justify-center p-4'>
            <div className='w-full max-w-md p-9 flex flex-col gap-7 box-border rounded-3xl border border-[#0089ED] bg-white text-gray-900'>
                <div className='flex items-start justify-between p-2'>
                    <div className='flex flex-col gap-5'>
                        <h1 className='text-xl font-normal'>Welcome to <Link to="/" className='text-[#0089ED] font-bold hover:underline'>CareerCompass</Link></h1>
                        <h1 className='text-5xl font-medium'>Sign Up</h1>
                    </div>
                </div>
                <form className='flex flex-col gap-3' onSubmit={handleSubmit}>
                    <div className='flex gap-3 flex-col'>
                        <label className='font-medium text-gray-900' htmlFor='username'>Name</label>
                        <input
                            className='p-3 rounded-xl border border-[#4285F4] bg-white text-gray-900 placeholder-gray-400'
                            type='text'
                            id='username'
                            name='username'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className='flex gap-3 flex-col'>
                        <label className='font-medium text-gray-900' htmlFor='email'>Email</label>
                        <input
                            className='p-3 rounded-xl border border-[#4285F4] bg-white text-gray-900 placeholder-gray-400'
                            type='email'
                            id='email'
                            name='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className='flex gap-3 flex-col'>
                        <label className='font-medium text-gray-900' htmlFor='password'>Password</label>
                        <input
                            className='p-3 rounded-xl border border-[#4285F4] bg-white text-gray-900 placeholder-gray-400'
                            type='password'
                            id='password'
                            name='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className='flex gap-3 flex-col'>
                        <label className='font-medium text-gray-900' htmlFor='confirmPassword'>Confirm Password</label>
                        <input
                            className='p-3 rounded-xl border border-[#4285F4] bg-white text-gray-900 placeholder-gray-400'
                            type='password'
                            id='confirmPassword'
                            name='confirmPassword'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className='text-red-400'>{error}</p>}
                    <button type="submit" className='bg-[#0089ED] p-3 mt-3 rounded-xl text-white font-semibold hover:bg-[#0089ED]/90'>
                        Sign Up
                    </button>
                </form>
                <p className='text-center text-gray-600'>
                    Already have an account? {' '}
                    <Link to="/login" className='text-[#0089ED] hover:underline'>Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
