import { Link } from 'react-router-dom';

const Tshirt = () => (
  <div className="min-h-screen pt-28 pb-16 flex items-center justify-center">
    <div className="text-center space-y-6 max-w-md mx-auto px-4">
      <div className="w-16 h-16 mx-auto rounded-full bg-zinc-800 flex items-center justify-center">
        <span className="text-2xl">&#10024;</span>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold">T-Shirts</h1>
      <p className="text-gray-400">This collection is coming soon. Stay tuned for our latest styles.</p>
      <Link
        to="/collections"
        className="inline-block bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 px-8 rounded-xl transition-all duration-200 text-sm uppercase tracking-wider"
      >
        Browse Collections
      </Link>
    </div>
  </div>
);

export default Tshirt;
