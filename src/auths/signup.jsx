import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { name }, 
                },
            });

            if (error) throw error;

            // If email confirmation is off, user is auto-signed-in
            if (data.user) {
                navigate('/dashboard'); 
            } else {
                setError('Check your email to confirm signup');
            }
        } catch (err) {
            setError(err.message || 'Signup failed');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="w-full max-w-md p-8 bg-gray-950 rounded-2xl shadow-2xl border border-gray-800">
                <div>
                    <h1 className="text-3xl font-bold text-white">Create Account</h1>
                    <p className="mt-2 text-sm text-gray-400">
                        Sign up to start tracking your bugs and solutions.
                    </p>

                    {error && (
                        <p className="mt-4 text-red-400 text-sm font-medium">{error}</p>
                    )}

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-500 shadow-sm focus:border-gray-400 focus:ring-gray-400 sm:text-sm px-4 py-3 transition-colors"
                                placeholder="Abebe Bekele"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-500 shadow-sm focus:border-gray-400 focus:ring-gray-400 sm:text-sm px-4 py-3 transition-colors"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-500 shadow-sm focus:border-gray-400 focus:ring-gray-400 sm:text-sm px-4 py-3 transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirm-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-500 shadow-sm focus:border-gray-400 focus:ring-gray-400 sm:text-sm px-4 py-3 transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                                loading
                                    ? 'bg-gray-700 cursor-not-allowed'
                                    : 'bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400'
                            } transition-colors`}
                        >
                            {loading ? 'Creating account...' : 'Sign Up'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;