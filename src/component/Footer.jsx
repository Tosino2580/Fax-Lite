import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import { FaFacebookF, FaPinterestP, FaInstagram, FaWhatsapp, FaTwitter } from "react-icons/fa";
import Logo from '/src/assets/fax_logo-removebg-preview.png';

const FooterLink = ({ to, children }) => (
    <Link to={to} className="block text-gray-300 hover:text-yellow-400 mt-2.5 group relative w-fit transition-colors duration-200">
        {children}
        <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
    </Link>
);

const SocialIcon = ({ href, children, label }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
        className="p-3 rounded-full bg-white/10 text-white transition-all duration-300 hover:bg-yellow-500 hover:text-black hover:scale-110">
        {children}
    </a>
);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const Footer = () => {
    const { t } = useTranslation();
    const [showImportantLinks, setShowImportantLinks] = useState(false);
    const [showInformation, setShowInformation] = useState(false);
    const [showFollowUs, setShowFollowUs] = useState(false);
    const [email, setEmail] = useState('');
    const [subStatus, setSubStatus] = useState(null); // { type: 'success'|'error', msg }
    const [subLoading, setSubLoading] = useState(false);

    const handleSubscribe = async () => {
        if (!email || !email.includes('@')) {
            setSubStatus({ type: 'error', msg: 'Please enter a valid email.' });
            return;
        }
        setSubLoading(true);
        setSubStatus(null);
        try {
            const res = await fetch(`${API_URL}/api/subscribers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (data.success) {
                setSubStatus({ type: 'success', msg: data.message });
                setEmail('');
            } else {
                setSubStatus({ type: 'error', msg: data.message });
            }
        } catch {
            setSubStatus({ type: 'error', msg: 'Network error. Please try again.' });
        } finally {
            setSubLoading(false);
        }
    };

    return (
        <footer className="border-t border-white/10">
            {/* Newsletter Section */}
            <div className="bg-gradient-to-r from-yellow-500/10 to-transparent py-12 px-6 md:px-16">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-semibold text-white">{t('footer.newsletter')}</h2>
                        <p className="text-gray-400 mt-1">{t('footer.newsletterDesc')}</p>
                    </div>
                    <div className="w-full md:w-auto">
                        <div className="flex">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setSubStatus(null); }}
                                onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                                placeholder={t('footer.emailPlaceholder')}
                                className="bg-white/10 border border-white/20 py-3 px-5 text-white placeholder-gray-400 text-sm md:w-72 rounded-l-md focus:outline-none focus:border-yellow-400 transition-colors"
                                disabled={subLoading}
                            />
                            <button
                                onClick={handleSubscribe}
                                disabled={subLoading}
                                className="bg-yellow-500 text-black font-semibold px-6 py-3 rounded-r-md hover:bg-yellow-400 transition-colors cursor-pointer text-sm disabled:opacity-60 disabled:cursor-not-allowed min-w-[100px]"
                            >
                                {subLoading ? 'Sending...' : t('footer.subscribe')}
                            </button>
                        </div>
                        {subStatus && (
                            <p className={`mt-2 text-sm ${subStatus.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                                {subStatus.msg}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between py-12 px-6 md:px-16 text-white gap-8">
                {/* Brand Column */}
                <div className="space-y-4 md:max-w-xs">
                    <img src={Logo} alt="FAX Collections" className="w-14 h-14 object-contain" />
                    <p className="text-gray-400 text-sm leading-relaxed">
                        {t('footer.brand')}
                    </p>
                </div>

                {/* Quick Links */}
                <div className="mt-2 md:mt-0">
                    <div
                        className="flex items-center justify-between cursor-pointer md:cursor-default"
                        onClick={() => setShowImportantLinks(!showImportantLinks)}
                    >
                        <h4 className="uppercase text-sm font-semibold text-yellow-400 tracking-wider">{t('footer.quickLinks')}</h4>
                        <FaChevronDown className={`transition-transform duration-300 text-sm ${showImportantLinks ? "rotate-180" : ""} md:hidden`} />
                    </div>
                    <div className={`mt-3 md:block ${showImportantLinks ? "block" : "hidden"}`}>
                        <FooterLink to="/blog">{t('footer.blog')}</FooterLink>
                        <FooterLink to="/faq">{t('footer.faqs')}</FooterLink>
                        <FooterLink to="/track-order">{t('footer.trackOrder')}</FooterLink>
                        <FooterLink to="/contact">{t('footer.contactUs')}</FooterLink>
                    </div>
                </div>

                {/* Information */}
                <div className="mt-2 md:mt-0">
                    <div
                        className="flex items-center justify-between cursor-pointer md:cursor-default"
                        onClick={() => setShowInformation(!showInformation)}
                    >
                        <h4 className="uppercase text-sm font-semibold text-yellow-400 tracking-wider">{t('footer.information')}</h4>
                        <FaChevronDown className={`transition-transform duration-300 text-sm ${showInformation ? "rotate-180" : ""} md:hidden`} />
                    </div>
                    <div className={`mt-3 md:block ${showInformation ? "block" : "hidden"}`}>
                        <FooterLink to="/terms">{t('footer.terms')}</FooterLink>
                        <FooterLink to="/return-policy">{t('footer.returnPolicy')}</FooterLink>
                        <FooterLink to="/delivery-policy">{t('footer.deliveryPolicy')}</FooterLink>
                        <FooterLink to="/privacy-policy">{t('footer.privacyPolicy')}</FooterLink>
                    </div>
                </div>

                {/* Social */}
                <div className="mt-2 md:mt-0">
                    <div
                        className="flex items-center justify-between cursor-pointer md:cursor-default"
                        onClick={() => setShowFollowUs(!showFollowUs)}
                    >
                        <h4 className="uppercase text-sm font-semibold text-yellow-400 tracking-wider">{t('footer.followUs')}</h4>
                        <FaChevronDown className={`transition-transform duration-300 text-sm ${showFollowUs ? "rotate-180" : ""} md:hidden`} />
                    </div>
                    <div className={`mt-4 md:flex gap-3 ${showFollowUs ? "flex" : "hidden"}`}>
                        <SocialIcon href="#" label="Pinterest"><FaPinterestP /></SocialIcon>
                        <SocialIcon href="#" label="Facebook"><FaFacebookF /></SocialIcon>
                        <SocialIcon href="#" label="Instagram"><FaInstagram /></SocialIcon>
                        <SocialIcon href="#" label="Twitter"><FaTwitter /></SocialIcon>
                        <SocialIcon href="#" label="WhatsApp"><FaWhatsapp /></SocialIcon>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10 py-5 px-6 flex items-center justify-center gap-3">
                <p className="text-gray-500 text-center text-sm">
                    &copy; {new Date().getFullYear()} {t('footer.rights')}
                </p>
                <span className="text-gray-700">·</span>
                <Link to="/admin/login" className="text-gray-600 hover:text-yellow-400 text-xs transition-colors duration-200">
                    Admin
                </Link>
            </div>
        </footer>
    );
};

export default Footer;