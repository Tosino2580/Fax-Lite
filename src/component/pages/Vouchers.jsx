import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaTag, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const Vouchers = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [promoCode, setPromoCode] = useState('');

    if (!user) {
        navigate('/login');
        return null;
    }

    const handleApplyCode = (e) => {
        e.preventDefault();
        if (!promoCode.trim()) return;
        toast.error(t('voucherPage.invalidCode'));
        setPromoCode('');
    };

    const sampleVouchers = [
        { code: 'WELCOME10', discount: '10% OFF', description: 'Welcome discount on your first order', minSpend: '₦20,000', expires: 'Apr 30, 2026', active: true },
        { code: 'FAXFREE', discount: 'Free Delivery', description: 'Free shipping on all orders', minSpend: '₦50,000', expires: 'May 15, 2026', active: true },
    ];

    return (
        <div className="min-h-screen pt-28 pb-16 px-4 md:px-10">
            <div className="max-w-4xl mx-auto">
                {/* Back + Header */}
                <Link to="/account" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-yellow-400 transition-colors mb-6">
                    <FaArrowLeft className="text-xs" /> {t('account.backToAccount')}
                </Link>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('voucherPage.title')}</h1>
                <p className="text-gray-400 text-sm mb-10">{t('voucherPage.subtitle')}</p>

                {/* Apply Code Section */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">{t('voucherPage.haveCode')}</h3>
                    <form onSubmit={handleApplyCode} className="flex gap-3">
                        <input
                            type="text"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                            placeholder={t('voucherPage.enterCode')}
                            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-yellow-400 transition-colors uppercase tracking-wider"
                        />
                        <button
                            type="submit"
                            className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-6 py-3 rounded-lg transition-colors cursor-pointer text-sm"
                        >
                            {t('voucherPage.apply')}
                        </button>
                    </form>
                </div>

                {/* Available Vouchers */}
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">{t('voucherPage.available')}</h3>
                <div className="space-y-4">
                    {sampleVouchers.map((voucher) => (
                        <div key={voucher.code} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex">
                            {/* Left accent */}
                            <div className="w-24 md:w-32 bg-yellow-400/10 flex flex-col items-center justify-center p-4 border-r border-dashed border-zinc-700 flex-shrink-0">
                                <FaTag className="text-yellow-400 text-lg mb-1" />
                                <span className="text-yellow-400 font-bold text-sm text-center leading-tight">{voucher.discount}</span>
                            </div>
                            {/* Details */}
                            <div className="flex-1 p-4 flex flex-col justify-center">
                                <div className="flex items-center gap-2 mb-1">
                                    <code className="text-xs font-mono bg-zinc-800 px-2 py-0.5 rounded text-yellow-400">{voucher.code}</code>
                                    {voucher.active && <FaCheckCircle className="text-green-400 text-xs" />}
                                </div>
                                <p className="text-sm text-white font-medium">{voucher.description}</p>
                                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                    <span>{t('voucherPage.minSpend')}: {voucher.minSpend}</span>
                                    <span>{t('voucherPage.expires')}: {voucher.expires}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Vouchers;
