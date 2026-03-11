import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FaLock, FaEnvelope } from 'react-icons/fa';
import Logo from '/src/assets/fax_logo-removebg-preview.png';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { login, isAdmin } = useAdmin();
    const navigate = useNavigate();

    // Redirect if already logged in as admin
    useEffect(() => {
        if (isAdmin) {
            navigate('/admin', { replace: true });
        }
    }, [isAdmin, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await login(email, password);
            toast.success('Welcome back, Admin!');
            navigate('/admin', { replace: true });
        } catch (err) {
            toast.error(err.message || 'Invalid admin credentials');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4 py-16">
            {/* Background subtle grid pattern */}
            <div
                className="fixed inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(rgba(250,204,21,0.5) 1px, transparent 1px),
                                      linear-gradient(90deg, rgba(250,204,21,0.5) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-full max-w-md relative"
            >
                {/* Card */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl shadow-black/60">

                    {/* Branding */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-24 h-24 mb-3 flex items-center justify-center">
                            <img
                                src={Logo}
                                alt="FAX Collections"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <h1
                            className="text-2xl font-bold text-white tracking-tight"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            FAX Collections
                        </h1>
                        <div className="mt-1 flex items-center gap-2">
                            <div className="h-px w-8 bg-yellow-400/40" />
                            <span className="text-yellow-400 text-xs font-semibold uppercase tracking-widest">
                                Admin Dashboard
                            </span>
                            <div className="h-px w-8 bg-yellow-400/40" />
                        </div>
                    </div>

                    {/* Heading */}
                    <div className="text-center mb-7">
                        <h2 className="text-xl font-semibold text-white">Sign in to manage your store</h2>
                        <p className="text-zinc-500 text-sm mt-1">Restricted access — authorized personnel only</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">
                                    <FaEnvelope />
                                </span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg pl-10 pr-4 py-3 text-white text-sm outline-none focus:border-yellow-400 transition-colors placeholder:text-zinc-600"
                                    placeholder="admin@faxcollections.com"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">
                                    <FaLock />
                                </span>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg pl-10 pr-4 py-3 text-white text-sm outline-none focus:border-yellow-400 transition-colors placeholder:text-zinc-600"
                                    placeholder="Enter your password"
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <motion.button
                            type="submit"
                            disabled={submitting}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3.5 rounded-xl transition-all duration-200 hover:shadow-[0_0_28px_rgba(250,204,21,0.35)] cursor-pointer text-sm uppercase tracking-wider mt-2"
                        >
                            {submitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    Signing In...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </motion.button>
                    </form>

                    {/* Divider */}
                    <div className="my-6 flex items-center gap-3">
                        <div className="flex-1 h-px bg-zinc-800" />
                        <span className="text-zinc-600 text-xs">or</span>
                        <div className="flex-1 h-px bg-zinc-800" />
                    </div>

                    {/* Back to store */}
                    <div className="text-center">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-yellow-400 text-sm transition-colors duration-200"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Store
                        </Link>
                    </div>
                </div>

                {/* Footer note */}
                <p className="text-center text-zinc-700 text-xs mt-6">
                    &copy; {new Date().getFullYear()} FAX Collections. All rights reserved.
                </p>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
