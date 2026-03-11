import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaWhatsapp, FaInstagram, FaTwitter, FaPaperPlane } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setStatus({ type: 'error', msg: 'Please fill in all required fields.' });
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setStatus({ type: 'success', msg: 'Message sent successfully! We\'ll get back to you soon.' });
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus({ type: 'error', msg: data.message || 'Failed to send message.' });
      }
    } catch {
      setStatus({ type: 'error', msg: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Get In <span className="text-yellow-400">Touch</span>
          </h1>
          <p className="text-zinc-400 mt-3 max-w-lg mx-auto text-sm sm:text-base">
            Have a question, custom order request, or just want to say hello? We&apos;d love to hear from you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Info Cards */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-yellow-400/10 flex items-center justify-center flex-shrink-0">
                  <FaMapMarkerAlt className="text-yellow-400 text-sm" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Visit Us</p>
                  <p className="text-zinc-400 text-sm mt-1">Lagos, Nigeria</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-yellow-400/10 flex items-center justify-center flex-shrink-0">
                  <FaEnvelope className="text-yellow-400 text-sm" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Email Us</p>
                  <a href="mailto:support@faxcollections.com" className="text-zinc-400 text-sm mt-1 hover:text-yellow-400 transition-colors">
                    support@faxcollections.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-yellow-400/10 flex items-center justify-center flex-shrink-0">
                  <FaPhone className="text-yellow-400 text-sm" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Call Us</p>
                  <a href="tel:+2348000000000" className="text-zinc-400 text-sm mt-1 hover:text-yellow-400 transition-colors">
                    +234 800 000 0000
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-green-400/10 flex items-center justify-center flex-shrink-0">
                  <FaWhatsapp className="text-green-400 text-sm" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">WhatsApp</p>
                  <a href="https://wa.me/2348000000000" target="_blank" rel="noopener noreferrer" className="text-zinc-400 text-sm mt-1 hover:text-green-400 transition-colors">
                    Chat with us
                  </a>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-white font-semibold text-sm mb-4">Business Hours</h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Monday - Friday</span>
                  <span className="text-white font-medium">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Saturday</span>
                  <span className="text-white font-medium">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Sunday</span>
                  <span className="text-zinc-500 font-medium">Closed</span>
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-white font-semibold text-sm mb-4">Follow Us</h3>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-yellow-400 hover:text-black transition-all">
                  <FaInstagram />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-yellow-400 hover:text-black transition-all">
                  <FaTwitter />
                </a>
                <a href="https://wa.me/2348000000000" className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-green-500 hover:text-white transition-all">
                  <FaWhatsapp />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-zinc-300 text-sm font-medium mb-2 block">Name <span className="text-red-400">*</span></label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="w-full bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-yellow-400/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 text-sm font-medium mb-2 block">Email <span className="text-red-400">*</span></label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-yellow-400/50 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-300 text-sm font-medium mb-2 block">Subject</label>
                <input
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="What is this about?"
                  className="w-full bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-yellow-400/50 transition-colors"
                />
              </div>

              <div>
                <label className="text-zinc-300 text-sm font-medium mb-2 block">Message <span className="text-red-400">*</span></label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Tell us how we can help..."
                  className="w-full bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-yellow-400/50 transition-colors resize-none"
                />
              </div>

              {status && (
                <p className={`text-sm ${status.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                  {status.msg}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <FaPaperPlane className="text-xs" />
                )}
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
