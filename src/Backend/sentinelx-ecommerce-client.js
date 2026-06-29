/**
 * SentinelX E-Commerce Telemetry Client
 * 
 * Drop this helper file into your Node.js / Express e-commerce codebase to forward
 * security events to SentinelX for real-time monitoring and threat scoring.
 * 
 * Setup:
 * 1. Install Axios: npm install axios
 * 2. Set the environment variable: SENTINELX_API_URL="http://your-sentinelx-ip:8000"
 */

import axios from 'axios';

const SENTINELX_API_URL = process.env.SENTINELX_API_URL || 'http://localhost:8000';
const SENTINELX_API_KEY = process.env.SENTINELX_API_KEY || ''; // Optional: for future authentication

/**
 * Capture and forward user activity from an Express request to the SentinelX SIEM.
 * 
 * @param {Object} req - The Express Request object (to extract IP, Headers, and Geo info)
 * @param {string} userId - The username or database ID of the user performing the action
 * @param {string} eventType - The action type ('login', 'logout', 'checkout', 'payment_attempt', 'cart_update', 'mfa_attempt')
 * @param {string} result - The status of the action ('success', 'failure', 'blocked', 'pending')
 * @param {Object} details - Optional metadata (e.g., { cart_value: 120.00, items: 3, payment_method: "card" })
 * @param {string} userRole - Optional role ('customer', 'merchant', 'support_agent'). Defaults to 'customer'.
 */
export async function logEventToSentinelX(req, userId, eventType, result, details = {}, userRole = 'customer') {
  // 1. Extract the client's actual public IP (Vercel forwards this in x-forwarded-for)
  const xForwardedFor = req.headers['x-forwarded-for'];
  const clientIp = xForwardedFor ? xForwardedFor.split(',')[0].trim() : (req.socket.remoteAddress || '127.0.0.1');

  // 2. Parse GeoLocation headers (Vercel automatically populates geolocation headers)
  const country = req.headers['x-vercel-ip-country'] || 'NG'; // Default to NG (Nigeria) if local testing
  const city = req.headers['x-vercel-ip-city'] ? decodeURIComponent(req.headers['x-vercel-ip-city']) : 'Lagos';
  const latitude = req.headers['x-vercel-ip-latitude'] ? parseFloat(req.headers['x-vercel-ip-latitude']) : 6.5244;
  const longitude = req.headers['x-vercel-ip-longitude'] ? parseFloat(req.headers['x-vercel-ip-longitude']) : 3.3792;

  // 3. Extract Device Fingerprint / User Agent
  const userAgent = req.headers['user-agent'] || 'unknown_browser';

  // 4. Construct the UnifiedLog schema payload
  const payload = {
    timestamp: new Date().toISOString(),
    user_id: userId,
    user_role: userRole,
    peer_group: userRole,
    event_type: eventType,
    event_result: result,
    source_ip: clientIp,
    device_id: `device_${Buffer.from(userAgent).toString('base64').substring(0, 16)}`, // Basic stable hash
    geo: {
      country: country,
      city: city,
      latitude: latitude,
      longitude: longitude
    },
    resource: req.originalUrl || req.url || '/api',
    metadata: {
      ...details,
      platform: 'vercel',
      user_agent: userAgent
    }
  };

  // 5. Send POST request to SentinelX backend Ingestion Router
  const url = `${SENTINELX_API_URL.replace(/\/$/, '')}/api/v1/ingest`;
  const headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'SentinelX-Express-Agent/1.0'
  };
  if (SENTINELX_API_KEY) {
    headers['Authorization'] = `Bearer ${SENTINELX_API_KEY}`;
  }

  try {
    const response = await axios.post(url, payload, { headers, timeout: 5000 });
    return response.data;
  } catch (error) {
    console.error('[SentinelX Telemetry] Ingestion delivery failure:', error.response ? error.response.data : error.message);
    return null;
  }
}
