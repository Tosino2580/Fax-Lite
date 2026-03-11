import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaHome,
    FaBox,
    FaShoppingBag,
    FaUsers,
    FaRobot,
    FaBars,
    FaTimes,
    FaSignOutAlt,
    FaChevronRight,
} from 'react-icons/fa';
import Logo from '/src/assets/fax_logo-removebg-preview.png';

const navItems = [
    { to: '/admin', label: 'Dashboard', icon: <FaHome />, exact: true },
    { to: '/admin/orders', label: 'Orders', icon: <FaBox /> },
    { to: '/admin/products', label: 'Products', icon: <FaShoppingBag /> },
    { to: '/admin/customers', label: 'Customers', icon: <FaUsers /> },
    { to: '/admin/ai-agent', label: 'AI Agent', icon: <FaRobot /> },
];

const pageTitles = {
    '/admin': 'Dashboard',
    '/admin/orders': 'Orders',
    '/admin/products': 'Products',
    '/admin/customers': 'Customers',
    '/admin/ai-agent': 'AI Agent',
};

const AdminLayout = () => {
    const { isAdmin, logout, loading } = useAdmin();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Redirect to login if not admin
    useEffect(() => {
        if (!loading && !isAdmin) {
            navigate('/admin/login', { replace: true });
        }
    }, [isAdmin, loading, navigate]);

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
        navigate('/admin/login', { replace: true });
    };

    const pageTitle = pageTitles[location.pathname] || 'Admin';

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                    <p className="text-zinc-400 text-sm">Loading admin panel...</p>
                </div>
            </div>
        );
    }

    if (!isAdmin) return null;

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center gap-3 px-5 py-6 border-b border-zinc-800">
                <img src={Logo} alt="FAX Collections" className="w-10 h-10 object-contain" />
                <div>
                    <p
                        className="text-white font-bold text-sm leading-none"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        FAX Collections
                    </p>
                    <span className="text-yellow-400 text-[10px] font-semibold uppercase tracking-widest">
                        Admin Panel
                    </span>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.exact}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group
                            ${isActive
                                ? 'bg-yellow-400 text-black'
                                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <span className={`text-base ${isActive ? 'text-black' : 'text-zinc-500 group-hover:text-yellow-400'}`}>
                                    {item.icon}
                                </span>
                                <span>{item.label}</span>
                                {isActive && (
                                    <span className="ml-auto">
                                        <FaChevronRight className="text-xs text-black/60" />
                                    </span>
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Logout */}
            <div className="px-3 pb-6 border-t border-zinc-800 pt-4">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-150 cursor-pointer"
                >
                    <FaSignOutAlt className="text-base" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-zinc-900 flex">
            {/* ── Desktop Sidebar ── */}
            <aside className="hidden lg:flex flex-col w-64 bg-zinc-950 border-r border-zinc-800 fixed inset-y-0 left-0 z-30">
                <SidebarContent />
            </aside>

            {/* ── Mobile Sidebar Overlay ── */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />

                        {/* Drawer */}
                        <motion.aside
                            key="drawer"
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'tween', duration: 0.25 }}
                            className="fixed inset-y-0 left-0 w-64 bg-zinc-950 border-r border-zinc-800 z-50 lg:hidden flex flex-col"
                        >
                            {/* Close button */}
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-md hover:bg-zinc-800 transition-colors cursor-pointer"
                            >
                                <FaTimes />
                            </button>
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* ── Main Content ── */}
            <div className="flex-1 flex flex-col lg:ml-64 min-h-screen">
                {/* Top Bar */}
                <header className="sticky top-0 z-20 bg-zinc-950/90 backdrop-blur border-b border-zinc-800 px-4 lg:px-6 h-14 flex items-center gap-4">
                    {/* Hamburger (mobile) */}
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden text-zinc-400 hover:text-white p-1.5 rounded-md hover:bg-zinc-800 transition-colors cursor-pointer"
                        aria-label="Open sidebar"
                    >
                        <FaBars className="text-lg" />
                    </button>

                    {/* Page title */}
                    <h1
                        className="text-white font-semibold text-base flex-1"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        {pageTitle}
                    </h1>

                    {/* Right section */}
                    <div className="flex items-center gap-3">
                        {/* Admin badge */}
                        <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs font-semibold uppercase tracking-wider">
                            Admin
                        </span>

                        {/* Avatar */}
                        <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold text-sm select-none">
                            A
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-4 lg:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
