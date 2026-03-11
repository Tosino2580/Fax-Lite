import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaTimes,
  FaCloudUploadAlt,
  FaBox,
  FaToggleOn,
  FaToggleOff,
  FaTag,
  FaExclamationTriangle,
} from 'react-icons/fa';
import { useAdmin } from '../../context/AdminContext';
import { useCurrency } from '../../context/CurrencyContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const CATEGORIES = ['Collections', 'Jalabiya', 'Agbada', 'Kaftan', 'Abaya', 'CropTop', 'Kids'];
const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  oldPrice: '',
  category: 'Collections',
  sizes: [],
  inStock: '',
  badge: '',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function SkeletonCard() {
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-zinc-800" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-zinc-800 rounded w-3/4" />
        <div className="h-3 bg-zinc-800 rounded w-1/2" />
        <div className="h-3 bg-zinc-800 rounded w-1/3" />
        <div className="flex gap-2 pt-2">
          <div className="h-8 bg-zinc-800 rounded flex-1" />
          <div className="h-8 bg-zinc-800 rounded flex-1" />
        </div>
      </div>
    </div>
  );
}

function StockBadge({ count }) {
  if (count === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-400">
        <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
        Out of stock
      </span>
    );
  }
  if (count <= 5) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-yellow-400">
        <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />
        Low stock ({count})
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-400">
      <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
      In stock ({count})
    </span>
  );
}

// ---------------------------------------------------------------------------
// Image Upload Area
// ---------------------------------------------------------------------------

function ImageUploadArea({ images, onChange }) {
  const inputRef = useRef();
  const [dragging, setDragging] = useState(false);

  const addFiles = (files) => {
    const remaining = 4 - images.length;
    if (remaining <= 0) {
      toast.error('Maximum 4 images allowed');
      return;
    }
    const toAdd = Array.from(files).slice(0, remaining);
    const previews = toAdd.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    onChange([...images, ...previews]);
  };

  const remove = (index) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
          dragging
            ? 'border-yellow-400 bg-yellow-400/5'
            : 'border-zinc-700 hover:border-zinc-500'
        }`}
      >
        <FaCloudUploadAlt className="mx-auto text-3xl text-zinc-500 mb-2" />
        <p className="text-sm text-zinc-400">
          Drag & drop or <span className="text-yellow-400 font-medium">click to upload</span>
        </p>
        <p className="text-xs text-zinc-600 mt-1">Up to 4 images · PNG, JPG, WEBP</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((img, i) => (
            <div key={i} className="relative group rounded-lg overflow-hidden aspect-square">
              <img
                src={img.url}
                alt={`preview-${i}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); remove(i); }}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <FaTimes className="text-white text-lg" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Product Form Modal (Add / Edit)
// ---------------------------------------------------------------------------

function ProductModal({ mode, product, onClose, onSaved, adminToken }) {
  const [form, setForm] = useState(
    mode === 'edit' && product
      ? {
          name: product.name || '',
          description: product.description || '',
          price: product.price ?? '',
          oldPrice: product.oldPrice ?? '',
          category: product.category || 'Collections',
          sizes: product.sizes || [],
          inStock: product.inStock ?? '',
          badge: product.badge || '',
        }
      : { ...EMPTY_FORM }
  );
  const [images, setImages] = useState([]);
  const [saving, setSaving] = useState(false);

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const toggleSize = (size) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Product name is required');
    if (!form.price || isNaN(Number(form.price))) return toast.error('Valid price is required');

    setSaving(true);
    try {
      let res;
      if (mode === 'add') {
        const fd = new FormData();
        fd.append('name', form.name);
        fd.append('description', form.description);
        fd.append('price', form.price);
        if (form.oldPrice) fd.append('oldPrice', form.oldPrice);
        fd.append('category', form.category);
        fd.append('inStock', form.inStock || 0);
        if (form.badge) fd.append('badge', form.badge);
        form.sizes.forEach((s) => fd.append('sizes', s));
        images.forEach((img) => fd.append('images', img.file));

        res = await fetch(`${API_BASE}/api/products`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${adminToken}` },
          body: fd,
        });
      } else {
        res = await fetch(`${API_BASE}/api/products/${product._id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${adminToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: form.name,
            description: form.description,
            price: Number(form.price),
            oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
            category: form.category,
            sizes: form.sizes,
            inStock: Number(form.inStock) || 0,
            badge: form.badge || undefined,
          }),
        });
      }

      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to save product');

      toast.success(mode === 'add' ? 'Product created!' : 'Product updated!');
      onSaved();
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-end">
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <motion.div
        key="panel"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative z-10 w-full max-w-lg bg-zinc-900 flex flex-col h-full shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <h2 className="text-lg font-semibold text-white">
            {mode === 'add' ? 'Add New Product' : 'Edit Product'}
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-zinc-800"
          >
            <FaTimes />
          </button>
        </div>

        {/* Scrollable body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-6 py-5 space-y-5"
        >
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Product Name <span className="text-yellow-400">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={set('name')}
              placeholder="e.g. Premium Kaftan Set"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-yellow-400 transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={set('description')}
              rows={3}
              placeholder="Product description..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-yellow-400 transition-colors resize-none"
            />
          </div>

          {/* Price row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Price (₦) <span className="text-yellow-400">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={set('price')}
                placeholder="0"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-yellow-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Old Price (₦)
              </label>
              <input
                type="number"
                min="0"
                value={form.oldPrice}
                onChange={set('oldPrice')}
                placeholder="0"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-yellow-400 transition-colors"
              />
            </div>
          </div>

          {/* Category & Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Category
              </label>
              <select
                value={form.category}
                onChange={set('category')}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-yellow-400 transition-colors"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Stock Qty
              </label>
              <input
                type="number"
                min="0"
                value={form.inStock}
                onChange={set('inStock')}
                placeholder="0"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-yellow-400 transition-colors"
              />
            </div>
          </div>

          {/* Badge */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Badge <span className="text-zinc-600 font-normal">(optional — e.g. "New", "Hot")</span>
            </label>
            <input
              type="text"
              value={form.badge}
              onChange={set('badge')}
              placeholder="New"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-yellow-400 transition-colors"
            />
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Available Sizes
            </label>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((size) => {
                const active = form.sizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                      active
                        ? 'bg-yellow-400 text-zinc-900 border-yellow-400'
                        : 'bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Images (add mode only) */}
          {mode === 'add' && (
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Product Images <span className="text-zinc-600 font-normal">(up to 4)</span>
              </label>
              <ImageUploadArea images={images} onChange={setImages} />
            </div>
          )}

          {mode === 'edit' && (
            <p className="text-xs text-zinc-600 italic">
              Image editing is not available in edit mode. Re-create the product to change images.
            </p>
          )}
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-800 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 px-4 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-zinc-900 font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : mode === 'add' ? 'Create Product' : 'Save Changes'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Delete Confirmation Modal
// ---------------------------------------------------------------------------

function DeleteModal({ product, onClose, onDeleted, adminToken }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/api/products/${product._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to delete');
      toast.success('Product deleted');
      onDeleted();
    } catch (err) {
      toast.error(err.message || 'Delete failed');
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="relative z-10 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
            <FaExclamationTriangle className="text-red-400" />
          </div>
          <h3 className="text-base font-semibold text-white">Delete Product</h3>
        </div>
        <p className="text-sm text-zinc-400 mb-6">
          Are you sure you want to delete{' '}
          <span className="text-white font-medium">"{product.name}"</span>? This
          action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors font-medium text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white font-semibold transition-colors disabled:opacity-60 text-sm"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Product Card
// ---------------------------------------------------------------------------

function ProductCard({ product, onEdit, onDelete, onToggle }) {
  const { formatPrice } = useCurrency();
  const [toggling, setToggling] = useState(false);

  const imageUrl =
    product.images && product.images.length > 0 ? product.images[0] : null;

  const handleToggle = async () => {
    setToggling(true);
    await onToggle(product._id, product.isActive);
    setToggling(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: product.isActive ? 1 : 0.5, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col group hover:border-zinc-700 transition-colors"
    >
      {/* Image */}
      <div className="relative w-full h-48 bg-zinc-800 flex-shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FaBox className="text-4xl text-zinc-700" />
          </div>
        )}

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-2 left-2 bg-yellow-400 text-zinc-900 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide flex items-center gap-1">
            <FaTag className="text-[8px]" />
            {product.badge}
          </span>
        )}

        {/* Active toggle */}
        <button
          onClick={handleToggle}
          disabled={toggling}
          title={product.isActive ? 'Deactivate' : 'Activate'}
          className={`absolute top-2 right-2 text-2xl transition-colors disabled:opacity-50 ${
            product.isActive
              ? 'text-yellow-400 hover:text-yellow-300'
              : 'text-zinc-600 hover:text-zinc-400'
          }`}
        >
          {product.isActive ? <FaToggleOn /> : <FaToggleOff />}
        </button>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        {/* Category */}
        <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">
          {product.category}
        </span>

        {/* Name */}
        <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-yellow-400 font-bold text-sm">
            {formatPrice(product.price)}
          </span>
          {product.oldPrice > 0 && (
            <span className="text-zinc-600 text-xs line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>

        {/* Stock */}
        <StockBadge count={product.inStock ?? 0} />

        {/* Inactive label */}
        {!product.isActive && (
          <span className="text-[10px] font-medium text-zinc-600 uppercase tracking-wide">
            Inactive
          </span>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-3">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors text-xs font-medium"
          >
            <FaEdit />
            Edit
          </button>
          <button
            onClick={() => onDelete(product)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors text-xs font-medium"
          >
            <FaTrash />
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function AdminProducts() {
  const { adminToken } = useAdmin();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [modal, setModal] = useState(null); // null | { type: 'add' } | { type: 'edit', product } | { type: 'delete', product }

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/products`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to fetch');
      setProducts(data.products || []);
    } catch (err) {
      toast.error(err.message || 'Could not load products');
    } finally {
      setLoading(false);
    }
  }, [adminToken]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleToggle = async (id, currentActive) => {
    try {
      const res = await fetch(`${API_BASE}/api/products/${id}/toggle`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Toggle failed');
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, isActive: !currentActive } : p))
      );
      toast.success(currentActive ? 'Product deactivated' : 'Product activated');
    } catch (err) {
      toast.error(err.message || 'Toggle failed');
    }
  };

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const closeModal = () => setModal(null);
  const afterSaved = () => { closeModal(); fetchProducts(); };
  const afterDeleted = () => { closeModal(); fetchProducts(); };

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ---------------------------------------------------------------- */}
        {/* Header                                                            */}
        {/* ---------------------------------------------------------------- */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Product Management</h1>
            <p className="text-sm text-zinc-500 mt-0.5">
              {loading ? '—' : `${products.length} product${products.length !== 1 ? 's' : ''} total`}
            </p>
          </div>
          <button
            onClick={() => setModal({ type: 'add' })}
            className="flex items-center gap-2 px-5 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-zinc-900 font-semibold rounded-xl transition-colors shadow-lg shadow-yellow-400/10 whitespace-nowrap self-start sm:self-auto"
          >
            <FaPlus />
            Add Product
          </button>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Filters                                                           */}
        {/* ---------------------------------------------------------------- */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-sm pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-yellow-400 transition-colors text-sm"
            />
          </div>

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-yellow-400 transition-colors text-sm min-w-[160px]"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Content                                                           */}
        {/* ---------------------------------------------------------------- */}

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center mb-5">
              <FaBox className="text-3xl text-zinc-700" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">
              {search || categoryFilter !== 'All'
                ? 'No products match your filters'
                : 'No products yet'}
            </h3>
            <p className="text-sm text-zinc-500 mb-6">
              {search || categoryFilter !== 'All'
                ? 'Try adjusting your search or category filter'
                : 'Create your first product to get started'}
            </p>
            {!search && categoryFilter === 'All' && (
              <button
                onClick={() => setModal({ type: 'add' })}
                className="flex items-center gap-2 px-5 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-zinc-900 font-semibold rounded-xl transition-colors"
              >
                <FaPlus />
                Add Product
              </button>
            )}
          </div>
        )}

        {/* Product grid */}
        {!loading && filtered.length > 0 && (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onEdit={(p) => setModal({ type: 'edit', product: p })}
                  onDelete={(p) => setModal({ type: 'delete', product: p })}
                  onToggle={handleToggle}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Modals                                                              */}
      {/* ------------------------------------------------------------------ */}
      <AnimatePresence>
        {modal?.type === 'add' && (
          <ProductModal
            key="add-modal"
            mode="add"
            onClose={closeModal}
            onSaved={afterSaved}
            adminToken={adminToken}
          />
        )}
        {modal?.type === 'edit' && (
          <ProductModal
            key="edit-modal"
            mode="edit"
            product={modal.product}
            onClose={closeModal}
            onSaved={afterSaved}
            adminToken={adminToken}
          />
        )}
        {modal?.type === 'delete' && (
          <DeleteModal
            key="delete-modal"
            product={modal.product}
            onClose={closeModal}
            onDeleted={afterDeleted}
            adminToken={adminToken}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
