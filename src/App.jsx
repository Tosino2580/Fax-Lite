import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './App.css';
import { Toaster } from 'react-hot-toast';
import Home from './component/pages/Home';
import NavBar from './component/NavBar';
import Collections from './component/pages/NavPages/Collections';
import Kids from './component/pages/NavPages/Kids';
import Agbada from './component/pages/NavPages/Mens/Agbada';
import Jalabiya from './component/pages/NavPages/Mens/Jalabiya';
import JalabiyaDetails from './MenDetails/JalabiyaDetails';
import AgbadaDetails from './MenDetails/AgbadaDetails';
import Footer from './component/Footer';
import Kaftan from './component/pages/NavPages/Mens/Kaftan';
import KaftanDetails from './MenDetails/KaftanDetails';
import CartDrawer from './component/CartDrawer';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';
import ProductList from './component/ProductList';
import ProductDetails from './component/ProductDetails';
import Login from './component/pages/Login';
import Register from './component/pages/Register';
import Account from './component/pages/Account';
import Orders from './component/pages/Orders';
import Wishlist from './component/pages/Wishlist';
import Vouchers from './component/pages/Vouchers';
import Checkout from './component/pages/Checkout';
import OrderSuccess from './component/pages/OrderSuccess';
import Blog from './component/pages/Blog';
import FAQ from './component/pages/FAQ';
import TrackOrder from './component/pages/TrackOrder';
import Contact from './component/pages/Contact';
import Terms from './component/pages/Terms';
import ReturnPolicy from './component/pages/ReturnPolicy';
import DeliveryPolicy from './component/pages/DeliveryPolicy';
import PrivacyPolicy from './component/pages/PrivacyPolicy';
import { WishlistProvider } from './context/WishlistContext';
import { CurrencyProvider } from './context/CurrencyContext';
import AdminLogin from './component/admin/AdminLogin';
import AdminLayout from './component/admin/AdminLayout';
import AdminDashboard from './component/admin/Dashboard';
import AdminOrders from './component/admin/AdminOrders';
import AdminProducts from './component/admin/AdminProducts';
import AdminCustomers from './component/admin/AdminCustomers';
import AdminAIAgent from './component/admin/AdminAIAgent';
import ChatBot from './component/ChatBot';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white px-6 pt-20">
      <h1 className="text-7xl md:text-9xl font-bold text-yellow-500">404</h1>
      <p className="text-xl md:text-2xl mt-4 font-semibold">{t('notFound.heading')}</p>
      <p className="text-gray-400 mt-2 text-center">{t('notFound.description')}</p>
      <Link to="/" className="mt-8 py-3 px-8 bg-yellow-500 text-black font-bold rounded-md hover:bg-yellow-400 transition-colors uppercase text-sm tracking-wider">
        {t('notFound.backHome')}
      </Link>
    </div>
  );
}

// Main site layout — wraps NavBar, CartDrawer, Footer around store routes
function StoreLayout() {
  return (
    <>
      <NavBar />
      <CartDrawer />
      <main>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/collections' element={<Collections />} />
          <Route path='/kids' element={<Kids />} />
          <Route path='/products' element={<ProductList />} />
          <Route path='/agbada' element={<Agbada />} />
          <Route path='/kafans-shirts' element={<Kaftan />} />
          <Route path='/jalabiya' element={<Jalabiya />} />
          <Route path='/jalabiya/:id' element={<JalabiyaDetails />} />
          <Route path='/agbada/:id' element={<AgbadaDetails />} />
          <Route path='/kafans-shirts/:id' element={<KaftanDetails />} />
          <Route path='/products/:id' element={<ProductDetails />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/account' element={<Account />} />
          <Route path='/account/orders' element={<Orders />} />
          <Route path='/account/wishlist' element={<Wishlist />} />
          <Route path='/account/vouchers' element={<Vouchers />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/order-success/:orderId' element={<OrderSuccess />} />
          <Route path='/blog' element={<Blog />} />
          <Route path='/faq' element={<FAQ />} />
          <Route path='/track-order' element={<TrackOrder />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/terms' element={<Terms />} />
          <Route path='/return-policy' element={<ReturnPolicy />} />
          <Route path='/delivery-policy' element={<DeliveryPolicy />} />
          <Route path='/privacy-policy' element={<PrivacyPolicy />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <ChatBot />
    </>
  );
}

function App() {
  return (
    <AdminProvider>
    <AuthProvider>
    <CurrencyProvider>
    <WishlistProvider>
    <CartProvider>
      <div className='bg-black min-h-screen'>
        <Router>
          <ScrollToTop />
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              style: { background: '#1a1a1a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
            }}
          />
          <Routes>
            {/* ── Admin routes (no NavBar / Footer) ── */}
            <Route path='/admin/login' element={<AdminLogin />} />
            <Route path='/admin' element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path='orders' element={<AdminOrders />} />
              <Route path='products' element={<AdminProducts />} />
              <Route path='customers' element={<AdminCustomers />} />
              <Route path='ai-agent' element={<AdminAIAgent />} />
            </Route>

            {/* ── Store routes (with NavBar / Footer) ── */}
            <Route path='/*' element={<StoreLayout />} />
          </Routes>
        </Router>
      </div>
    </CartProvider>
    </WishlistProvider>
    </CurrencyProvider>
    </AuthProvider>
    </AdminProvider>
  );
}

export default App;
