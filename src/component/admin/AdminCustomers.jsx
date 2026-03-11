import { useState, useEffect, useMemo } from 'react';
import {
    FaUsers,
    FaSearch,
    FaUserPlus,
    FaCalendarAlt,
    FaEnvelope,
    FaCircle,
} from 'react-icons/fa';
import { useAdmin } from '../../context/AdminContext';

// ── Helpers ──────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
    'bg-rose-500',
    'bg-orange-500',
    'bg-amber-500',
    'bg-emerald-500',
    'bg-teal-500',
    'bg-sky-500',
    'bg-blue-500',
    'bg-violet-500',
    'bg-purple-500',
    'bg-pink-500',
];

function getAvatarColor(name = '') {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

function isThisMonth(dateStr) {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const now = new Date();
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
}

// ── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonRow() {
    return (
        <tr className="border-b border-zinc-800/60">
            {[...Array(5)].map((_, i) => (
                <td key={i} className="px-4 py-4">
                    <div className="h-4 bg-zinc-800 rounded animate-pulse" style={{ width: i === 0 ? '32px' : i === 1 ? '60%' : '80%' }} />
                </td>
            ))}
        </tr>
    );
}

function SkeletonCard() {
    return (
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-3 animate-pulse">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-800" />
                <div className="flex-1 space-y-1.5">
                    <div className="h-4 bg-zinc-800 rounded w-2/3" />
                    <div className="h-3 bg-zinc-800 rounded w-1/2" />
                </div>
            </div>
            <div className="h-3 bg-zinc-800 rounded w-full" />
        </div>
    );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, accent }) {
    return (
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 ${accent}`}>
                <span className="text-lg">{icon}</span>
            </div>
            <div>
                <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider mb-0.5">{label}</p>
                <p className="text-white text-2xl font-bold leading-none">{value}</p>
            </div>
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────

const AdminCustomers = () => {
    const { adminToken } = useAdmin();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');

    // Fetch customers
    useEffect(() => {
        let cancelled = false;

        const fetchCustomers = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/admin/customers`, {
                    headers: { Authorization: `Bearer ${adminToken}` },
                });
                const data = await res.json();
                if (!data.success) throw new Error(data.message || 'Failed to load customers');
                if (!cancelled) {
                    // Sort by most recently joined
                    const sorted = [...(data.users || data.customers || [])].sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    );
                    setCustomers(sorted);
                }
            } catch (err) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchCustomers();
        return () => { cancelled = true; };
    }, [adminToken]);

    // Filtered list
    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return customers;
        return customers.filter((c) => {
            const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
            return fullName.includes(q) || (c.email || '').toLowerCase().includes(q);
        });
    }, [customers, search]);

    const totalCount = customers.length;
    const newThisMonth = customers.filter((c) => isThisMonth(c.createdAt)).length;

    // ── Empty State ────────────────────────────────────────────────────────────
    const EmptyState = () => (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
                <FaUsers className="text-2xl text-zinc-500" />
            </div>
            <p className="text-white font-semibold text-base mb-1">
                {search ? 'No customers found' : 'No customers yet'}
            </p>
            <p className="text-zinc-500 text-sm max-w-xs">
                {search
                    ? `No results for "${search}". Try a different name or email.`
                    : 'Customers who register on the store will appear here.'}
            </p>
        </div>
    );

    return (
        <div className="space-y-6">

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StatCard
                    icon={<FaUsers className="text-yellow-400" />}
                    label="Total Customers"
                    value={loading ? '—' : totalCount}
                    accent="bg-yellow-400/10"
                />
                <StatCard
                    icon={<FaUserPlus className="text-emerald-400" />}
                    label="New This Month"
                    value={loading ? '—' : newThisMonth}
                    accent="bg-emerald-400/10"
                />
            </div>

            {/* ── Header ── */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Title + badge */}
                    <div className="flex items-center gap-3 flex-1">
                        <h2
                            className="text-white font-bold text-lg leading-none"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            Customer Management
                        </h2>
                        {!loading && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs font-semibold">
                                {totalCount}
                            </span>
                        )}
                    </div>

                    {/* Search */}
                    <div className="relative w-full sm:w-64">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search by name or email…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm placeholder-zinc-500 rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:border-yellow-400/60 focus:ring-1 focus:ring-yellow-400/30 transition-colors"
                        />
                    </div>
                </div>
            </div>

            {/* ── Error ── */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-4 text-red-400 text-sm">
                    {error}
                </div>
            )}

            {/* ── Desktop Table ── */}
            <div className="hidden md:block bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-zinc-800 text-zinc-400 text-xs uppercase tracking-wider">
                            <th className="px-4 py-3 text-left font-medium w-10" />
                            <th className="px-4 py-3 text-left font-medium">Full Name</th>
                            <th className="px-4 py-3 text-left font-medium">Email</th>
                            <th className="px-4 py-3 text-left font-medium">Joined</th>
                            <th className="px-4 py-3 text-left font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            [...Array(6)].map((_, i) => <SkeletonRow key={i} />)
                        ) : filtered.length === 0 ? (
                            <tr>
                                <td colSpan={5}>
                                    <EmptyState />
                                </td>
                            </tr>
                        ) : (
                            filtered.map((customer) => {
                                const initial = (customer.firstName || '?')[0].toUpperCase();
                                const fullName = `${customer.firstName || ''} ${customer.lastName || ''}`.trim();
                                const avatarColor = getAvatarColor(fullName);

                                return (
                                    <tr
                                        key={customer._id}
                                        className="border-b border-zinc-800/60 last:border-0 hover:bg-zinc-800/50 transition-colors duration-100"
                                    >
                                        {/* Avatar */}
                                        <td className="px-4 py-3.5">
                                            <div
                                                className={`w-9 h-9 rounded-full ${avatarColor} flex items-center justify-center text-white font-bold text-sm select-none flex-shrink-0`}
                                            >
                                                {initial}
                                            </div>
                                        </td>

                                        {/* Full Name */}
                                        <td className="px-4 py-3.5">
                                            <span className="text-white font-medium">{fullName || '—'}</span>
                                        </td>

                                        {/* Email */}
                                        <td className="px-4 py-3.5">
                                            <span className="text-zinc-400">{customer.email || '—'}</span>
                                        </td>

                                        {/* Joined */}
                                        <td className="px-4 py-3.5">
                                            <div className="flex items-center gap-1.5 text-zinc-400">
                                                <FaCalendarAlt className="text-zinc-600 text-xs" />
                                                <span>{formatDate(customer.createdAt)}</span>
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 py-3.5">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                                                <FaCircle className="text-[6px]" />
                                                Active
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* ── Mobile Cards ── */}
            <div className="md:hidden space-y-3">
                {loading ? (
                    [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
                ) : filtered.length === 0 ? (
                    <div className="bg-zinc-950 border border-zinc-800 rounded-xl">
                        <EmptyState />
                    </div>
                ) : (
                    filtered.map((customer) => {
                        const initial = (customer.firstName || '?')[0].toUpperCase();
                        const fullName = `${customer.firstName || ''} ${customer.lastName || ''}`.trim();
                        const avatarColor = getAvatarColor(fullName);

                        return (
                            <div
                                key={customer._id}
                                className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-colors"
                            >
                                {/* Top row: avatar + name + status */}
                                <div className="flex items-center gap-3 mb-3">
                                    <div
                                        className={`w-10 h-10 rounded-full ${avatarColor} flex items-center justify-center text-white font-bold text-sm select-none flex-shrink-0`}
                                    >
                                        {initial}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-semibold text-sm truncate">{fullName || '—'}</p>
                                        <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-medium">
                                            <FaCircle className="text-[5px]" />
                                            Active
                                        </span>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex items-center gap-2 text-zinc-400 text-xs mb-2">
                                    <FaEnvelope className="text-zinc-600 flex-shrink-0" />
                                    <span className="truncate">{customer.email || '—'}</span>
                                </div>

                                {/* Joined date */}
                                <div className="flex items-center gap-2 text-zinc-500 text-xs">
                                    <FaCalendarAlt className="text-zinc-600 flex-shrink-0" />
                                    <span>Joined {formatDate(customer.createdAt)}</span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

        </div>
    );
};

export default AdminCustomers;
