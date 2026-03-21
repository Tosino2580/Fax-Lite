import { useEffect, useRef, useState } from 'react'
import DropdownMen from './DropdownMen.jsx'
import DropdownWomen from './DropdownWomen.jsx'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from '/src/assets/fax_logo-removebg-preview.png'
import { FaSearch, FaRegUser, FaBars, FaTimes, FaChevronDown, FaChevronRight, FaArrowLeft, FaUser, FaBox, FaHeart, FaTag, FaSignOutAlt } from "react-icons/fa"
import { MdOutlineShoppingBag } from "react-icons/md"
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import SearchOverlay from './SearchOverlay.jsx'
import { useTranslation } from 'react-i18next'
import { useCurrency } from '../context/CurrencyContext.jsx'

const languages = [
    { code: 'en', label: 'EN', name: 'English' },
    { code: 'fr', label: 'FR', name: 'Français' },
    { code: 'es', label: 'ES', name: 'Español' },
];

const NavBar = () => {
    const { cartItems, setShowCart } = useCart();
    const { user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [subMenuOpen, setSubMenuOpen] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [mobileLangOpen, setMobileLangOpen] = useState(false);
    const [mobileCurrOpen, setMobileCurrOpen] = useState(false);
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const { currencyCode, changeCurrency, currencies } = useCurrency();

    const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

    const handleNavigation = (path) => {
        setMenuOpen(false);
        setSubMenuOpen(null);
        navigate(path);
    }

    const menuRef = useRef(null);
    const subMenuRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
            if (subMenuRef.current && !subMenuRef.current.contains(event.target)) {
                setSubMenuOpen(null);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [subMenuOpen])

    return (
        <>
        <nav className={`flex items-center justify-between py-3 px-6 md:px-12 fixed top-0 left-0 w-full text-white z-50 transition-all duration-300 ${scrolled ? 'bg-black/95 backdrop-blur-md shadow-lg' : 'bg-black shadow-md'}`}>
            <button onClick={() => setMenuOpen(true)} className="md:hidden text-white text-2xl cursor-pointer" aria-label="Open menu">
                <FaBars />
            </button>

            <div className='hidden md:flex items-center gap-2'>
                <DropdownMen />
                <DropdownWomen />
                <Link to="/kids" className='text-white group relative w-fit'>{t('nav.kids')}
                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link to="/collections" className='text-white ml-4 group relative w-fit'>{t('nav.collections')}
                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
            </div>

            <Link to={'/'} className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
                <img src={Logo} alt="FAX Collections" className='w-16 h-16 md:w-18 md:h-18 object-contain' />
            </Link>

            <div className='flex items-center space-x-6'>
                {/* Language Switcher — Desktop */}
                <div className="hidden md:flex relative group">
                    <div className="flex items-center cursor-pointer">
                        <span className="group-hover:text-yellow-400 transition-colors text-white text-sm font-medium tracking-wide">{currentLang.label}</span>
                        <FaChevronDown className="ml-1 transition-transform duration-300 group-hover:rotate-180 text-white w-3" />
                    </div>
                    <div className="absolute right-0 top-full pt-2 w-32 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                        <div className="bg-black/95 backdrop-blur-md text-white border border-white/10 shadow-xl rounded-md">
                            <ul className="py-1">
                                {languages.filter(l => l.code !== i18n.language).map(lang => (
                                    <li key={lang.code}>
                                        <button
                                            onClick={() => i18n.changeLanguage(lang.code)}
                                            className="block w-full text-left px-4 py-2 hover:bg-white/10 text-sm cursor-pointer transition-colors"
                                        >
                                            {lang.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="hidden md:flex relative group">
                    <div className="flex items-center cursor-pointer">
                        <span className="group-hover:text-yellow-400 transition-colors text-white text-sm font-medium tracking-wide">{currencyCode}</span>
                        <FaChevronDown className="ml-1 transition-transform duration-300 group-hover:rotate-180 text-white w-3" />
                    </div>
                    <div className="absolute right-0 top-full pt-2 w-28 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                        <div className="bg-black/95 backdrop-blur-md text-white border border-white/10 shadow-xl rounded-md">
                            <ul className="py-1">
                                {Object.keys(currencies).filter(c => c !== currencyCode).map(code => (
                                    <li key={code}>
                                        <button
                                            onClick={() => changeCurrency(code)}
                                            className="block w-full text-left px-4 py-2 hover:bg-white/10 text-sm cursor-pointer transition-colors"
                                        >
                                            {currencies[code].symbol} {code}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <FaSearch onClick={() => setSearchOpen(true)} className='text-white text-lg cursor-pointer hover:text-yellow-400 transition-colors' />

                {/* Account Icon — Desktop */}
                {user ? (
                    <div className="hidden md:flex relative group">
                        <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center cursor-pointer text-black font-bold text-sm">
                            {user.firstName.charAt(0).toUpperCase()}
                        </div>
                        {/* Invisible bridge to prevent hover gap */}
                        <div className="absolute right-0 top-full pt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                            <div className="bg-black/95 backdrop-blur-md border border-white/10 shadow-xl rounded-lg overflow-hidden">
                                <div className="px-4 py-3 border-b border-white/10">
                                    <p className="text-sm font-medium text-white">{user.firstName} {user.lastName}</p>
                                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                </div>
                                <div className="py-1">
                                    {[
                                        { label: t('nav.myAccount'), icon: FaUser, path: '/account' },
                                        { label: t('nav.orders'), icon: FaBox, path: '/account/orders' },
                                        { label: t('nav.wishlist'), icon: FaHeart, path: '/account/wishlist' },
                                        { label: t('nav.vouchers'), icon: FaTag, path: '/account/vouchers' },
                                    ].map((item) => (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-white hover:bg-white/10 transition-colors"
                                        >
                                            <item.icon className="text-xs text-gray-400" />
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                                <div className="border-t border-white/10">
                                    <button
                                        onClick={() => { logout(); navigate('/'); }}
                                        className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-white/10 cursor-pointer transition-colors"
                                    >
                                        <FaSignOutAlt className="text-xs" />
                                        {t('nav.signOut')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <FaRegUser onClick={() => navigate('/login')} className='hidden md:block text-white text-lg cursor-pointer hover:text-yellow-400 transition-colors' />
                )}
                <div className="relative cursor-pointer" onClick={() => setShowCart(true)}>
                    <MdOutlineShoppingBag className="text-white text-xl hover:text-yellow-400 transition-colors" />
                    {cartItems.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                            {cartItems.length}
                        </span>
                    )}
                </div>
            </div>

            <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
        </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        onClick={() => setMenuOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        ref={menuRef}
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "tween", duration: 0.3 }}
                        className="fixed inset-y-0 left-0 w-80 bg-black border-r border-white/10 text-white p-6 z-50 overflow-y-auto"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <img src={Logo} alt="FAX Collections" className="w-12 h-12 object-contain" />
                            <button onClick={() => setMenuOpen(false)} className='text-white text-xl cursor-pointer hover:text-yellow-400 transition-colors'>
                                <FaTimes />
                            </button>
                        </div>

                        <ul className='space-y-1 mb-10'>
                            <li onClick={() => setSubMenuOpen('men')}
                                className="flex justify-between items-center cursor-pointer py-3 px-2 rounded-md hover:bg-white/5 transition-colors font-medium">
                                {t('nav.men')} <FaChevronRight className="text-sm text-gray-400" />
                            </li>
                            <li onClick={() => setSubMenuOpen('women')}
                                className="flex justify-between items-center cursor-pointer py-3 px-2 rounded-md hover:bg-white/5 transition-colors font-medium">
                                {t('nav.women')} <FaChevronRight className="text-sm text-gray-400" />
                            </li>
                            <li className="py-3 px-2 rounded-md hover:bg-white/5 transition-colors">
                                <Link to="/kids" onClick={() => setMenuOpen(false)} className="block font-medium">{t('nav.kids')}</Link>
                            </li>
                            <li className="py-3 px-2 rounded-md hover:bg-white/5 transition-colors">
                                <Link to="/collections" onClick={() => setMenuOpen(false)} className="block font-medium">{t('nav.collections')}</Link>
                            </li>
                        </ul>

                        <div className="border-t border-white/10 pt-6">
                            <h2 className='text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4'>{t('nav.myAccount')}</h2>
                            {user ? (
                                <div className="space-y-1">
                                    <div className="px-2 pb-3 mb-2 border-b border-white/10">
                                        <p className="text-sm text-white font-medium">{user.firstName} {user.lastName}</p>
                                        <p className="text-xs text-gray-400">{user.email}</p>
                                    </div>
                                    {[
                                        { label: t('nav.myAccount'), icon: FaUser, path: '/account' },
                                        { label: t('nav.orders'), icon: FaBox, path: '/account/orders' },
                                        { label: t('nav.wishlist'), icon: FaHeart, path: '/account/wishlist' },
                                        { label: t('nav.vouchers'), icon: FaTag, path: '/account/vouchers' },
                                    ].map((item) => (
                                        <button
                                            key={item.path}
                                            onClick={() => handleNavigation(item.path)}
                                            className="flex items-center gap-3 w-full py-3 px-2 rounded-md hover:bg-white/5 transition-colors cursor-pointer"
                                        >
                                            <item.icon className="text-sm text-gray-400" />
                                            <span className="text-sm font-medium">{item.label}</span>
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => { logout(); handleNavigation('/'); }}
                                        className='flex items-center gap-3 w-full py-3 px-2 rounded-md hover:bg-red-500/10 transition-colors cursor-pointer mt-2 border-t border-white/10 pt-3'
                                    >
                                        <FaSignOutAlt className="text-sm text-red-400" />
                                        <span className="text-sm font-medium text-red-400">{t('nav.signOut')}</span>
                                    </button>
                                </div>
                            ) : (
                                <div className='flex flex-col gap-3'>
                                    <button onClick={() => handleNavigation('/login')} className='py-2.5 px-4 bg-yellow-500 text-black rounded-md font-semibold transition-all duration-300 hover:bg-yellow-400 cursor-pointer'>{t('nav.logIn')}</button>
                                    <button onClick={() => handleNavigation('/register')} className='py-2.5 px-4 rounded-md font-semibold border border-white/30 hover:bg-white/10 transition-all duration-300 cursor-pointer'>{t('nav.register')}</button>
                                </div>
                            )}
                        </div>

                        {/* Mobile Language & Currency Switcher */}
                        <div className='flex gap-3 mt-8 pt-6 border-t border-white/10'>
                            {/* Language Dropdown */}
                            <div className="relative flex-1">
                                <button
                                    onClick={() => { setMobileLangOpen(!mobileLangOpen); setMobileCurrOpen(false); }}
                                    className="w-full flex items-center justify-between px-3 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-white cursor-pointer hover:border-zinc-500 transition-colors"
                                >
                                    <span>{currentLang.name}</span>
                                    <FaChevronDown className={`text-xs text-gray-400 transition-transform duration-200 ${mobileLangOpen ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {mobileLangOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute bottom-full left-0 right-0 mb-1 bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden shadow-xl z-10"
                                        >
                                            {languages.map(lang => (
                                                <button
                                                    key={lang.code}
                                                    onClick={() => { i18n.changeLanguage(lang.code); setMobileLangOpen(false); setMenuOpen(false); }}
                                                    className={`block w-full text-left px-3 py-2.5 text-sm cursor-pointer transition-colors ${lang.code === i18n.language ? 'text-yellow-400 bg-yellow-400/10' : 'text-gray-300 hover:bg-white/5'}`}
                                                >
                                                    {lang.name}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Currency Dropdown */}
                            <div className="relative flex-1">
                                <button
                                    onClick={() => { setMobileCurrOpen(!mobileCurrOpen); setMobileLangOpen(false); }}
                                    className="w-full flex items-center justify-between px-3 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-white cursor-pointer hover:border-zinc-500 transition-colors"
                                >
                                    <span>{currencies[currencyCode]?.symbol} {currencyCode}</span>
                                    <FaChevronDown className={`text-xs text-gray-400 transition-transform duration-200 ${mobileCurrOpen ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {mobileCurrOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute bottom-full left-0 right-0 mb-1 bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden shadow-xl z-10"
                                        >
                                            {Object.keys(currencies).map(code => (
                                                <button
                                                    key={code}
                                                    onClick={() => { changeCurrency(code); setMobileCurrOpen(false); setMenuOpen(false); }}
                                                    className={`block w-full text-left px-3 py-2.5 text-sm cursor-pointer transition-colors ${code === currencyCode ? 'text-yellow-400 bg-yellow-400/10' : 'text-gray-300 hover:bg-white/5'}`}
                                                >
                                                    {currencies[code].symbol} {code}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Sub-Menu */}
            <AnimatePresence>
                {subMenuOpen && (
                    <motion.div
                        ref={subMenuRef}
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "tween", duration: 0.3 }}
                        className="fixed inset-y-0 right-0 w-full bg-black text-white p-6 z-50"
                    >
                        <button onClick={() => setSubMenuOpen(null)} className="mb-6 flex items-center text-yellow-400 hover:text-yellow-300 transition-colors cursor-pointer">
                            <FaArrowLeft className="mr-2" /> <span className='font-medium'>Back</span>
                        </button>

                        <h3 className="text-lg font-semibold mb-4">{subMenuOpen === 'men' ? t('nav.men') : t('nav.women')}</h3>

                        {subMenuOpen === 'men' && (
                            <ul className="space-y-1">
                                {[
                                    { path: "/jalabiya", key: "jalabiya" },
                                    { path: "/kafans-shirts", key: "kaftans" },
                                    { path: "/agbada", key: "agbada" },
                                    { path: "/casuals", key: "casuals" },
                                    { path: "/t-shirts", key: "tshirts" },
                                    { path: "/pants", key: "pants" },
                                ].map(item => (
                                    <li key={item.path}>
                                        <button
                                            onClick={() => handleNavigation(item.path)}
                                            className="block px-4 py-3 hover:bg-white/5 w-full text-left rounded-md transition-colors cursor-pointer"
                                        >
                                            {t(`menu.${item.key}`)}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                        {subMenuOpen === 'women' && (
                            <ul className="space-y-1">
                                {[
                                    { path: "/abaya", key: "abaya" },
                                    { path: "/croptop", key: "cropTop" },
                                ].map(item => (
                                    <li key={item.path}>
                                        <button
                                            onClick={() => handleNavigation(item.path)}
                                            className="block px-4 py-3 hover:bg-white/5 w-full text-left rounded-md transition-colors cursor-pointer"
                                        >
                                            {t(`menu.${item.key}`)}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default NavBar
