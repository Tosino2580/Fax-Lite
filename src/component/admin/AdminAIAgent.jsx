import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { FaRobot, FaPhone, FaPhoneAlt, FaPlay, FaCheckCircle, FaTimesCircle, FaSpinner, FaHistory, FaClock, FaUser, FaPlus, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAdmin } from '../../context/AdminContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function AdminAIAgent() {
  const { adminToken } = useAdmin();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [setupLoading, setSetupLoading] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [testPhone, setTestPhone] = useState('');
  const [calls, setCalls] = useState([]);
  const [callsLoading, setCallsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [twilioSid, setTwilioSid] = useState('');
  const [twilioToken, setTwilioToken] = useState('');
  const [twilioNumber, setTwilioNumber] = useState('');
  const [showToken, setShowToken] = useState(false);

  const headers = { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' };

  // Fetch agent status
  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/vapi/agent-status`, { headers });
      const data = await res.json();
      setStatus(data);
    } catch {
      setStatus({ configured: false });
    } finally {
      setLoading(false);
    }
  };

  // Fetch call logs
  const fetchCalls = async () => {
    setCallsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/vapi/calls`, { headers });
      const data = await res.json();
      setCalls(data.calls || []);
    } catch {
      setCalls([]);
    } finally {
      setCallsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchCalls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set up AI agent
  const handleSetup = async () => {
    setSetupLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`${API_BASE}/api/vapi/setup-agent`, {
        method: 'POST',
        headers,
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({
          type: 'success',
          text: data.phoneNumber
            ? `AI Phone Agent activated! Phone number: ${data.phoneNumber.number}`
            : 'AI Assistant created! Now click "Get Phone Number" to assign a number.',
        });
        fetchStatus();
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to set up agent. Check your VAPI_API_KEY.' });
    } finally {
      setSetupLoading(false);
    }
  };

  // Import Twilio phone number
  const handlePurchaseNumber = async () => {
    if (!twilioSid || !twilioToken || !twilioNumber) {
      setMessage({ type: 'error', text: 'Please fill in all three Twilio fields.' });
      return;
    }
    setPhoneLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`${API_BASE}/api/vapi/purchase-number`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          twilioAccountSid: twilioSid.trim(),
          twilioAuthToken: twilioToken.trim(),
          twilioPhoneNumber: twilioNumber.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: data.message });
        setTwilioSid('');
        setTwilioToken('');
        setTwilioNumber('');
        fetchStatus();
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to import Twilio number.' });
    } finally {
      setPhoneLoading(false);
    }
  };

  // Make test call
  const handleTestCall = async () => {
    if (!testPhone) {
      setMessage({ type: 'error', text: 'Enter a phone number to test.' });
      return;
    }
    setTestLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`${API_BASE}/api/vapi/test-call`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ phone_number: testPhone }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: `Test call initiated! Call ID: ${data.callId}` });
        setTestPhone('');
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to make test call.' });
    } finally {
      setTestLoading(false);
    }
  };

  const assistants = status?.assistants || [];
  const phoneNumbers = status?.phoneNumbers || [];
  const hasAssistant = assistants.length > 0;
  const hasPhone = phoneNumbers.length > 0;

  return (
    <div className="space-y-6 p-1 sm:p-2 md:p-0 overflow-hidden max-w-full min-w-0 w-full">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-400/20 flex items-center justify-center">
            <FaRobot className="text-purple-400" />
          </div>
          AI Phone Agent
        </h1>
        <p className="text-zinc-500 text-xs sm:text-sm mt-2 ml-0 sm:ml-[3.25rem]">
          Automated phone support powered by Vapi.ai — handles customer calls 24/7
        </p>
      </motion.div>

      {/* Status Banner */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-2xl p-4 sm:p-5 border ${
            hasAssistant && hasPhone
              ? 'bg-green-400/5 border-green-400/20'
              : hasAssistant
              ? 'bg-blue-400/5 border-blue-400/20'
              : 'bg-yellow-400/5 border-yellow-400/20'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
              hasAssistant && hasPhone ? 'bg-green-400/20' : hasAssistant ? 'bg-blue-400/20' : 'bg-yellow-400/20'
            }`}>
              {hasAssistant && hasPhone
                ? <FaCheckCircle className="text-green-400 text-base sm:text-lg" />
                : <FaPhone className={`${hasAssistant ? 'text-blue-400' : 'text-yellow-400'} text-base sm:text-lg`} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-semibold text-sm sm:text-base ${hasAssistant && hasPhone ? 'text-green-400' : hasAssistant ? 'text-blue-400' : 'text-yellow-400'}`}>
                {hasAssistant && hasPhone
                  ? 'AI Agent Fully Active'
                  : hasAssistant
                  ? 'Assistant Created — Phone Number Needed'
                  : 'AI Agent Not Configured'}
              </p>
              <p className="text-zinc-400 text-xs sm:text-sm mt-0.5">
                {hasAssistant && hasPhone
                  ? 'Your AI agent is live and ready to handle customer calls.'
                  : hasAssistant
                  ? 'Your assistant is ready! Get a phone number so customers can call.'
                  : 'Set up your AI phone agent to start handling customer calls automatically.'}
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto">
              {!hasAssistant && (
                <button
                  onClick={handleSetup}
                  disabled={setupLoading}
                  className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer w-full sm:w-auto"
                >
                  {setupLoading ? <FaSpinner className="animate-spin text-xs" /> : <FaPlay className="text-xs" />}
                  {setupLoading ? 'Setting up...' : 'Activate Agent'}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Message */}
      {message && (
        <div className={`rounded-xl p-3 sm:p-4 text-xs sm:text-sm break-words ${
          message.type === 'success' ? 'bg-green-400/10 text-green-400 border border-green-400/20' : 'bg-red-400/10 text-red-400 border border-red-400/20'
        }`}>
          {message.text}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && (
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 min-w-0">
          {/* Agent Info / Capabilities Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-6"
          >
            <h2 className="text-white font-semibold text-sm sm:text-base mb-4 flex items-center gap-2">
              <FaRobot className="text-purple-400 text-sm" /> Agent Capabilities
            </h2>
            <div className="space-y-3">
              {[
                { label: 'Order Tracking', desc: 'Looks up order status in real-time using customer order ID', dotColor: 'rgba(96,165,250,0.6)' },
                { label: 'Product Inquiries', desc: 'Searches catalog and answers availability, sizing, pricing questions', dotColor: 'rgba(74,222,128,0.6)' },
                { label: 'Returns & Exchanges', desc: 'Guides customers through return policy and process', dotColor: 'rgba(250,204,21,0.6)' },
                { label: 'Complaint Handling', desc: 'Empathetic resolution with escalation to human support when needed', dotColor: 'rgba(248,113,113,0.6)' },
              ].map((cap, i) => (
                <div key={i} className="flex items-start gap-3 bg-zinc-900/50 rounded-xl p-3">
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: cap.dotColor }} />
                  <div>
                    <p className="text-sm font-medium text-zinc-200">{cap.label}</p>
                    <p className="text-zinc-500 text-xs mt-0.5">{cap.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Active assistants */}
            {assistants.length > 0 && (
              <div className="mt-5 pt-5 border-t border-zinc-800">
                <h3 className="text-zinc-400 text-xs uppercase tracking-wider mb-3">Active Assistants</h3>
                {assistants.map((asst) => (
                  <div key={asst.id} className="flex items-center gap-3 bg-zinc-900/50 rounded-xl p-3 mb-2">
                    <FaRobot className="text-purple-400 text-xs" />
                    <span className="text-white text-sm">{asst.name || 'Unnamed Assistant'}</span>
                    <span className="ml-auto text-green-400 text-xs font-medium">Active</span>
                  </div>
                ))}
              </div>
            )}

            {/* Phone numbers */}
            {phoneNumbers.length > 0 && (
              <div className="mt-4 pt-4 border-t border-zinc-800">
                <h3 className="text-zinc-400 text-xs uppercase tracking-wider mb-3">Phone Numbers</h3>
                {phoneNumbers.map((pn) => (
                  <div key={pn.id} className="flex items-center gap-3 bg-zinc-900/50 rounded-xl p-3 mb-2 min-w-0">
                    <FaPhoneAlt className="text-green-400 text-xs flex-shrink-0" />
                    <span className="text-white text-xs sm:text-sm font-mono truncate">{pn.number || 'Pending assignment'}</span>
                    <span className="ml-auto text-green-400 text-xs font-medium flex-shrink-0">Active</span>
                  </div>
                ))}
              </div>
            )}

            {/* Twilio setup form */}
            {hasAssistant && !hasPhone && (
              <div className="mt-5 pt-5 border-t border-zinc-800">
                <div className="bg-blue-400/5 border border-blue-400/20 rounded-xl p-4">
                  <p className="text-blue-400 text-sm font-medium mb-1">Connect Your Twilio Number</p>
                  <p className="text-zinc-400 text-xs leading-relaxed mb-4">
                    Import your own Twilio phone number so customers can call your AI agent directly. Get a free Twilio account and number at twilio.com.
                  </p>
                  <div className="space-y-3">
                    <div>
                      <label className="text-zinc-400 text-xs mb-1 block">Account SID</label>
                      <input
                        type="text"
                        value={twilioSid}
                        onChange={(e) => setTwilioSid(e.target.value)}
                        placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxx"
                        className="w-full bg-zinc-800/60 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-blue-400/50 transition-colors font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-zinc-400 text-xs mb-1 block">Auth Token</label>
                      <div className="relative">
                        <input
                          type={showToken ? 'text' : 'password'}
                          value={twilioToken}
                          onChange={(e) => setTwilioToken(e.target.value)}
                          placeholder="Your Twilio Auth Token"
                          className="w-full bg-zinc-800/60 border border-zinc-700 rounded-lg px-3 py-2.5 pr-10 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-blue-400/50 transition-colors font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowToken(!showToken)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                        >
                          {showToken ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-zinc-400 text-xs mb-1 block">Phone Number</label>
                      <input
                        type="tel"
                        value={twilioNumber}
                        onChange={(e) => setTwilioNumber(e.target.value)}
                        placeholder="+1234567890"
                        className="w-full bg-zinc-800/60 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-blue-400/50 transition-colors font-mono"
                      />
                    </div>
                    <button
                      onClick={handlePurchaseNumber}
                      disabled={phoneLoading}
                      className="w-full bg-blue-500 hover:bg-blue-400 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                    >
                      {phoneLoading ? <FaSpinner className="animate-spin text-xs" /> : <FaPlus className="text-xs" />}
                      {phoneLoading ? 'Importing...' : 'Import Twilio Number'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Test Call Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-6"
          >
            <h2 className="text-white font-semibold text-sm sm:text-base mb-4 flex items-center gap-2">
              <FaPhoneAlt className="text-yellow-400 text-sm" /> Test Call
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm mb-4">
              Make a test call to hear your AI agent in action. Enter your phone number with country code (e.g., +234...).
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="tel"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                placeholder="+234 800 000 0000"
                className="flex-1 bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-yellow-400/50 transition-colors"
              />
              <button
                onClick={handleTestCall}
                disabled={testLoading || !hasAssistant || !hasPhone}
                className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-5 py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-40 cursor-pointer"
              >
                {testLoading ? <FaSpinner className="animate-spin text-xs" /> : <FaPhone className="text-xs" />}
                Call
              </button>
            </div>
            {(!hasAssistant || !hasPhone) && (
              <p className="text-zinc-600 text-xs mt-3">
                {!hasAssistant ? 'Activate the agent first to make test calls.' : 'Get a phone number first to make test calls.'}
              </p>
            )}

            {/* How it works */}
            <div className="mt-6 pt-6 border-t border-zinc-800">
              <h3 className="text-zinc-400 text-xs uppercase tracking-wider mb-3">How It Works</h3>
              <div className="space-y-3">
                {[
                  { step: '1', text: 'Customer calls your AI phone number' },
                  { step: '2', text: 'AI greets them and asks how it can help' },
                  { step: '3', text: 'Customer describes their need (order status, product question, return, etc.)' },
                  { step: '4', text: 'AI looks up real data from your store and responds naturally' },
                  { step: '5', text: 'Complex issues are escalated to human support via email' },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-zinc-800 text-zinc-400 text-xs font-bold flex items-center justify-center flex-shrink-0">{item.step}</span>
                    <p className="text-zinc-400 text-sm">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Call Logs */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden w-full min-w-0 max-w-full"
        >
          <div className="flex items-center justify-between px-3 sm:px-6 py-5 border-b border-zinc-800">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <FaHistory className="text-zinc-400 text-sm" /> Recent Calls
            </h2>
            <button
              onClick={fetchCalls}
              disabled={callsLoading}
              className="text-xs text-yellow-400 hover:text-yellow-300 font-semibold transition-colors cursor-pointer"
            >
              {callsLoading ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          {calls.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-center px-6">
              <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
                <FaPhone className="text-zinc-600 text-lg" />
              </div>
              <p className="text-zinc-400 font-medium text-sm">No calls yet</p>
              <p className="text-zinc-600 text-xs max-w-xs">Call logs will appear here once customers start calling your AI agent.</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-800/60 w-full overflow-hidden">
              {calls.slice(0, 10).map((call, i) => {
                const callStatus = call.status || '';
                const isEnded = callStatus === 'ended';
                const isFailed = call.endedReason?.includes('error') || call.endedReason?.includes('failed');
                const duration = call.startedAt && call.endedAt
                  ? Math.round((new Date(call.endedAt) - new Date(call.startedAt)) / 1000)
                  : null;

                return (
                  <div key={call.id || i} className="px-3 sm:px-6 py-4 flex items-center gap-2 sm:gap-4 hover:bg-zinc-900/50 transition-colors overflow-hidden min-w-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isFailed ? 'bg-red-400/10' : isEnded ? 'bg-green-400/10' : 'bg-zinc-800'
                    }`}>
                      {isFailed ? <FaTimesCircle className="text-red-400 text-xs" /> :
                       isEnded ? <FaCheckCircle className="text-green-400 text-xs" /> :
                       <FaPhone className="text-zinc-400 text-xs" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs sm:text-sm font-medium flex items-center gap-2 truncate">
                        <FaUser className="text-zinc-500 text-[10px] flex-shrink-0" />
                        <span className="truncate">{call.customer?.number || call.type || 'Unknown'}</span>
                      </p>
                      <p className="text-zinc-500 text-[10px] sm:text-xs mt-0.5 truncate max-w-full">
                        {call.analysis?.summary || call.endedReason || 'No summary available'}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-auto">
                      <p className="text-zinc-500 text-[10px] sm:text-xs flex items-center gap-1 justify-end whitespace-nowrap">
                        <FaClock className="text-[9px]" />
                        {duration ? `${Math.floor(duration / 60)}m ${duration % 60}s` : '—'}
                      </p>
                      <p className="text-zinc-600 text-[10px] mt-0.5 whitespace-nowrap">
                        {call.createdAt ? new Date(call.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : ''}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
