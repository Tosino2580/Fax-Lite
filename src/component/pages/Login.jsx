import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const Login = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await login(email, password);
            toast.success(t('auth.welcomeToast'));
            navigate('/');
        } catch (err) {
            toast.error(err.message || 'Login failed');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen pt-28 pb-16 px-4 flex items-center justify-center">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold">{t('auth.welcomeBack')}</h1>
                    <p className="text-gray-400 mt-2 text-sm">{t('auth.signInDesc')}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                            {t('auth.email')}
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-yellow-400 transition-colors"
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3.5 rounded-xl transition-all duration-200 hover:shadow-[0_0_24px_rgba(250,204,21,0.3)] cursor-pointer text-sm uppercase tracking-wider"
                    >
                        {submitting ? t('auth.signingIn') : t('auth.signIn')}
                    </button>
                </form>

                <p className="text-center text-gray-400 text-sm mt-6">
                    {t('auth.noAccount')}{' '}
                    <Link to="/register" className="text-yellow-400 hover:text-yellow-300 font-medium underline underline-offset-4">
                        {t('auth.createOne')}
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
