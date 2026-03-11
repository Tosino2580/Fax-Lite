import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useCurrency } from "../../context/CurrencyContext";
import toast from "react-hot-toast";
import { FaTruck, FaCreditCard, FaUniversity, FaLock, FaShieldAlt } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa6";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
const PAYSTACK_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT",
  "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi",
  "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo",
  "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];

const PAYMENT_METHODS = [
  {
    id: "cash_on_delivery",
    label: "Cash on Delivery",
    icon: FaTruck,
    description: "Pay when your order is delivered to your doorstep.",
  },
  {
    id: "card",
    label: "Pay with Card",
    icon: FaCreditCard,
    description: "Secure payment via Paystack — Visa, Mastercard, Verve & more.",
  },
  {
    id: "bank_transfer",
    label: "Bank Transfer",
    icon: FaUniversity,
    description: "Transfer to our bank account and confirm payment.",
  },
];

const inputClasses =
  "w-full bg-zinc-900 border border-zinc-700 text-white rounded-lg px-4 py-3 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/30 outline-none transition-colors placeholder:text-zinc-500";

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const { user, token } = useAuth();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(`${user.firstName || ""} ${user.lastName || ""}`.trim());
      setEmail(user.email || "");
    }
  }, [user]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingFee = subtotal >= 500000 ? 0 : 5000;
  const totalAmount = subtotal + shippingFee;

  // Build the order payload
  const buildOrderPayload = useCallback((paystackRef = null) => ({
    items: cartItems.map((item) => ({
      productId: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      size: item.selectedSize,
      image: item.image,
    })),
    shippingAddress: {
      fullName: fullName.trim(),
      address: address.trim(),
      city: city.trim(),
      state,
      phone: phone.trim(),
    },
    paymentMethod,
    totalAmount,
    ...(paystackRef && { paystackReference: paystackRef }),
  }), [cartItems, fullName, address, city, state, phone, paymentMethod, totalAmount]);

  // Validate form fields
  const validateForm = () => {
    if (!fullName.trim() || !email.trim() || !phone.trim() || !address.trim() || !city.trim() || !state) {
      toast.error("Please fill in all required fields.");
      return false;
    }
    return true;
  };

  // Place the order in the backend
  const placeOrder = async (paystackRef = null) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/orders/place`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(buildOrderPayload(paystackRef)),
      });

      const data = await res.json();

      if (data.success || res.ok) {
        clearCart();
        toast.success("Order placed successfully!");
        navigate(`/order-success/${data.order._id}`);
      } else {
        toast.error(data.message || "Failed to place order.");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Paystack payment handler
  const initiatePaystack = () => {
    if (!PAYSTACK_KEY) {
      toast.error("Payment gateway not configured. Please contact support.");
      return;
    }

    const handler = window.PaystackPop?.setup({
      key: PAYSTACK_KEY,
      email: email.trim(),
      amount: totalAmount * 100, // Paystack uses kobo (100 kobo = 1 naira)
      currency: "NGN",
      ref: `FAX-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
      metadata: {
        custom_fields: [
          { display_name: "Customer Name", variable_name: "customer_name", value: fullName },
          { display_name: "Phone", variable_name: "phone", value: phone },
        ],
      },
      callback: (response) => {
        // Payment successful
        toast.success("Payment successful!");
        placeOrder(response.reference);
      },
      onClose: () => {
        toast("Payment cancelled", { icon: "ℹ️" });
      },
    });

    if (handler) {
      handler.openIframe();
    } else {
      // Fallback: load Paystack inline script if PaystackPop not available
      loadPaystackAndPay();
    }
  };

  // Load Paystack script dynamically if not already loaded
  const loadPaystackAndPay = () => {
    if (document.querySelector('script[src="https://js.paystack.co/v1/inline.js"]')) {
      // Script loaded but PaystackPop not ready yet, retry
      setTimeout(initiatePaystack, 500);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => {
      setTimeout(initiatePaystack, 300);
    };
    script.onerror = () => {
      toast.error("Failed to load payment gateway. Please try again.");
    };
    document.head.appendChild(script);
  };

  // Load Paystack script on mount if card payment might be used
  useEffect(() => {
    if (!document.querySelector('script[src="https://js.paystack.co/v1/inline.js"]')) {
      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v1/inline.js";
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (paymentMethod === "card") {
      // Use Paystack for card payment
      initiatePaystack();
    } else {
      // Cash on delivery or bank transfer — place order directly
      placeOrder();
    }
  };

  // ---------- Not logged in ----------
  if (!token) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-10 text-center max-w-md w-full">
          <h2
            className="text-2xl font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Sign In Required
          </h2>
          <p className="text-zinc-400 mb-6">
            Please log in to your account to proceed with checkout.
          </p>
          <Link
            to="/login"
            className="inline-block bg-yellow-400 text-black font-bold uppercase tracking-wider px-8 py-3 rounded-lg hover:bg-yellow-500 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // ---------- Empty cart ----------
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-10 text-center max-w-md w-full">
          <h2
            className="text-2xl font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Your Cart is Empty
          </h2>
          <p className="text-zinc-400 mb-6">
            Add some items to your cart before checking out.
          </p>
          <Link
            to="/collections"
            className="inline-block bg-yellow-400 text-black font-bold uppercase tracking-wider px-8 py-3 rounded-lg hover:bg-yellow-500 transition-colors"
          >
            Browse Collections
          </Link>
        </div>
      </div>
    );
  }

  // ---------- Main checkout ----------
  return (
    <div
      className="min-h-screen bg-black text-white pt-28 pb-16 px-4 md:px-10"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-zinc-400 mb-8 max-w-7xl mx-auto">
        <Link to="/" className="hover:text-yellow-400 transition-colors">
          Home
        </Link>
        <FaChevronRight className="text-xs text-zinc-600" />
        <span className="text-yellow-400">Checkout</span>
      </nav>

      <h1
        className="text-3xl md:text-4xl font-bold mb-10 max-w-7xl mx-auto"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Checkout
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8"
      >
        {/* ====== Left Column ====== */}
        <div className="lg:col-span-3 space-y-8">
          {/* --- Shipping Information --- */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2
              className="text-xl font-bold mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Shipping Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="md:col-span-2">
                <label className="block text-sm text-zinc-400 mb-1.5">
                  Full Name <span className="text-yellow-400">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className={inputClasses}
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">
                  Email <span className="text-yellow-400">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className={inputClasses}
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">
                  Phone Number <span className="text-yellow-400">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+234 800 000 0000"
                  className={inputClasses}
                  required
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm text-zinc-400 mb-1.5">
                  Address <span className="text-yellow-400">*</span>
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street address"
                  className={inputClasses}
                  required
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">
                  City <span className="text-yellow-400">*</span>
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter your city"
                  className={inputClasses}
                  required
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">
                  State <span className="text-yellow-400">*</span>
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className={`${inputClasses} appearance-none cursor-pointer`}
                  required
                >
                  <option value="" disabled>
                    Select a state
                  </option>
                  {NIGERIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Additional Notes */}
              <div className="md:col-span-2">
                <label className="block text-sm text-zinc-400 mb-1.5">
                  Additional Notes{" "}
                  <span className="text-zinc-600">(optional)</span>
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special delivery instructions..."
                  rows={3}
                  className={`${inputClasses} resize-none`}
                />
              </div>
            </div>
          </div>

          {/* --- Payment Method --- */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2
              className="text-xl font-bold mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Payment Method
            </h2>

            <div className="space-y-4">
              {PAYMENT_METHODS.map((method) => {
                const Icon = method.icon;
                const isSelected = paymentMethod === method.id;

                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left cursor-pointer ${
                      isSelected
                        ? "border-yellow-400 bg-yellow-400/5"
                        : "border-zinc-700 bg-zinc-900/50 hover:border-zinc-600"
                    }`}
                  >
                    <div
                      className={`mt-0.5 p-2.5 rounded-lg ${
                        isSelected
                          ? "bg-yellow-400/10 text-yellow-400"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      <Icon className="text-lg" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white">{method.label}</p>
                      <p className="text-sm text-zinc-400 mt-0.5">
                        {method.description}
                      </p>

                      {/* Card payment security badges */}
                      {isSelected && method.id === "card" && (
                        <div className="mt-4 p-4 bg-zinc-950 border border-zinc-800 rounded-lg">
                          <div className="flex items-center gap-2 mb-3">
                            <FaShieldAlt className="text-green-400 text-sm" />
                            <span className="text-green-400 text-xs font-semibold uppercase tracking-wider">
                              Secure Payment
                            </span>
                          </div>
                          <p className="text-zinc-400 text-xs mb-3">
                            Your payment is processed securely by Paystack. We never store your card details.
                          </p>
                          <div className="flex items-center gap-3">
                            <div className="bg-white rounded px-2 py-1">
                              <span className="text-[10px] font-bold text-blue-700">VISA</span>
                            </div>
                            <div className="bg-white rounded px-2 py-1">
                              <span className="text-[10px] font-bold text-red-600">MC</span>
                            </div>
                            <div className="bg-white rounded px-2 py-1">
                              <span className="text-[10px] font-bold text-green-700">VERVE</span>
                            </div>
                            <div className="flex items-center gap-1 ml-auto text-zinc-500">
                              <FaLock className="text-[10px]" />
                              <span className="text-[10px]">256-bit SSL</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Bank transfer details */}
                      {isSelected && method.id === "bank_transfer" && (
                        <div className="mt-4 p-4 bg-zinc-950 border border-zinc-800 rounded-lg text-sm space-y-2">
                          <p className="text-zinc-300">
                            <span className="text-zinc-500">Bank:</span>{" "}
                            <span className="font-medium">
                              First Bank of Nigeria
                            </span>
                          </p>
                          <p className="text-zinc-300">
                            <span className="text-zinc-500">
                              Account Name:
                            </span>{" "}
                            <span className="font-medium">
                              FAX Collections Ltd
                            </span>
                          </p>
                          <p className="text-zinc-300">
                            <span className="text-zinc-500">
                              Account Number:
                            </span>{" "}
                            <span className="font-medium text-yellow-400">
                              0123456789
                            </span>
                          </p>
                          <p className="text-xs text-zinc-500 mt-2">
                            Please use your order ID as the payment reference
                            after placing your order.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Radio indicator */}
                    <div
                      className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        isSelected ? "border-yellow-400" : "border-zinc-600"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ====== Right Column — Order Summary ====== */}
        <div className="lg:col-span-2">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 lg:sticky lg:top-28">
            <h2
              className="text-xl font-bold mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Order Summary
            </h2>

            {/* Cart Items */}
            <div className="space-y-4 max-h-80 overflow-y-auto pr-1 mb-6">
              {cartItems.map((item, index) => (
                <div
                  key={`${item.id}-${item.selectedSize}-${index}`}
                  className="flex gap-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg border border-zinc-800 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Size: {item.selectedSize} &middot; Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-white whitespace-nowrap">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-zinc-800 pt-4 space-y-3">
              {/* Subtotal */}
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Subtotal</span>
                <span className="text-white">{formatPrice(subtotal)}</span>
              </div>

              {/* Shipping */}
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Shipping</span>
                <span
                  className={
                    shippingFee === 0 ? "text-green-400 font-medium" : "text-white"
                  }
                >
                  {shippingFee === 0 ? "FREE" : formatPrice(shippingFee)}
                </span>
              </div>

              {shippingFee > 0 && (
                <p className="text-xs text-zinc-500">
                  Free shipping on orders over {formatPrice(500000)}
                </p>
              )}

              {/* Total */}
              <div className="flex justify-between text-lg font-bold pt-3 border-t border-zinc-800">
                <span className="text-white">Total</span>
                <span className="text-yellow-400">
                  {formatPrice(totalAmount)}
                </span>
              </div>
            </div>

            {/* Place Order / Pay Now Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold uppercase tracking-wider py-4 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Processing...
                </>
              ) : paymentMethod === "card" ? (
                <>
                  <FaLock className="text-sm" />
                  Pay {formatPrice(totalAmount)}
                </>
              ) : (
                "Place Order"
              )}
            </button>

            {/* Security note */}
            {paymentMethod === "card" && (
              <p className="text-center text-zinc-500 text-xs mt-3 flex items-center justify-center gap-1">
                <FaLock className="text-[10px]" />
                Secured by Paystack
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
