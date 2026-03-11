import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const Register = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error(t('auth.passwordsMismatch'));
            return;
        }

        setSubmitting(true);
        try {
            await register(formData.firstName, formData.lastName, formData.email, formData.password);
            toast.success(t('auth.accountCreated'));
            navigate('/');
        } catch (err) {
            toast.error(err.message || 'Registration failed');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen pt-28 pb-16 px-4 flex items-center justify-center">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold">{t('auth.createAccount')}</h1>
                    <p className="text-gray-400 mt-2 text-sm">{t('auth.joinDesc')}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                                {t('auth.firstName')}
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-yellow-400 transition-colors"
                                placeholder="John"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                                {t('auth.lastName')}
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-yellow-400 transition-colors"
                                placeholder="Doe"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                            {t('auth.email')}
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-yellow-400 transition-colors"
                            placeholder="john@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                            {t('auth.password')}
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-yellow-400 transition-colors"
                            placeholder="Min. 6 characters"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                            {t('auth.confirmPassword')}
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            minLength={6}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-yellow-400 transition-colors"
                            placeholder="Re-enter password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3.5 rounded-xl transition-all duration-200 hover:shadow-[0_0_24px_rgba(250,204,21,0.3)] cursor-pointer text-sm uppercase tracking-wider"
                    >
                        {submitting ? t('auth.creatingAccount') : t('auth.createAccount')}
                    </button>
                </form>

                <p className="text-center text-gray-400 text-sm mt-6">
                    {t('auth.alreadyHave')}{' '}
                    <Link to="/login" className="text-yellow-400 hover:text-yellow-300 font-medium underline underline-offset-4">
                        {t('auth.signInLink')}
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
