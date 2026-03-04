import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import useAuth from '../auths/useAuth'; 

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth(); 
    const navigate = useNavigate(); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);

        if (result.success) {
            navigate('/dashboard'); 
        } else {
            setError(result.error || 'Invalid email or password');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="w-full max-w-md p-8 bg-gray-950 rounded-2xl shadow-2xl border border-gray-800">
                <div>
                    <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
                    <p className="mt-2 text-sm text-gray-400">
                        Please enter your credentials to access your dashboard.
                    </p>

                    {error && (
                        <p className="mt-4 text-red-400 text-sm font-medium">{error}</p>
                    )}

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
                            <a href="/forgot-password" className="text-sm text-gray-400 hover:text-gray-300 transition-colors">
                                Forgot Password?
                            </a>
                        </div>
                        <div>
                            <a href="/signup" className="text-sm text-gray-400 hover:text-gray-300 transition-colors">
                                Don't have an account? Sign Up
                            </a>
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
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;