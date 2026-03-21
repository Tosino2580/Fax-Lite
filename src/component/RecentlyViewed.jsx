import { Link } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';

function RecentlyViewed({ currentProductId }) {
  const { recentlyViewed } = useRecentlyViewed();
  const { formatPrice } = useCurrency();

  const items = recentlyViewed.filter(p => p.id !== currentProductId);

  if (items.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-10 py-12">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight">Recently Viewed</h2>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <div className="flex gap-4 overflow-x-auto pb-3 no-scrollbar">
        {items.map(product => (
          <Link
            key={product.id}
            to={product.route}
            className="flex-shrink-0 w-40 md:w-52 group"
          >
            <div className="relative overflow-hidden rounded-xl bg-zinc-900">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 md:h-64 object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="mt-2.5 space-y-1 px-0.5">
              <p className="text-sm font-medium text-white leading-tight line-clamp-2">{product.name}</p>
              <p className="text-sm font-bold text-yellow-400 font-cinzel">{formatPrice(product.price)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default RecentlyViewed;
