import express from 'express';
import blandAPI, { getAgentPrompt } from '../config/blandAI.js';
import adminAuth from '../middleware/adminAuth.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

const blandRouter = express.Router();

// ─── Admin: Create/update the AI phone agent ───────────────────────────────
blandRouter.post('/setup-agent', adminAuth, async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!process.env.BLAND_API_KEY) {
      return res.status(400).json({ success: false, message: 'BLAND_API_KEY not configured in .env' });
    }

    // Create an inbound agent on Bland.ai
    const response = await blandAPI.post('/inbound/purchase', {
      phone_number: phoneNumber || null, // null = Bland assigns one
      prompt: getAgentPrompt(),
      voice: 'maya',
      first_sentence: 'Thank you for calling FAX Collections! How may I help you today?',
      model: 'enhanced',
      language: 'en',
      max_duration: 15,
      webhook: `${process.env.FRONTEND_URL?.replace('5173', '4000') || 'http://localhost:4000'}/api/bland/webhook`,
      tools: [
        {
          name: 'track_order',
          description: 'Look up an order status by order ID. Use this when a customer wants to check their order status.',
          input_schema: {
            type: 'object',
            properties: {
              order_id: { type: 'string', description: 'The order ID provided by the customer' },
            },
            required: ['order_id'],
          },
          speech: 'Let me look up that order for you...',
        },
        {
          name: 'search_products',
          description: 'Search for products by name or category. Use this when a customer asks about product availability.',
          input_schema: {
            type: 'object',
            properties: {
              query: { type: 'string', description: 'Product name or category to search for' },
            },
            required: ['query'],
          },
          speech: 'Let me check our catalog for you...',
        },
      ],
    });

    res.json({
      success: true,
      message: 'AI phone agent created successfully!',
      data: response.data,
    });
  } catch (error) {
    console.error('Bland setup error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to set up AI agent',
    });
  }
});

// ─── Admin: Get agent status ────────────────────────────────────────────────
blandRouter.get('/agent-status', adminAuth, async (req, res) => {
  try {
    if (!process.env.BLAND_API_KEY) {
      return res.json({ success: true, configured: false, message: 'BLAND_API_KEY not set' });
    }

    const response = await blandAPI.get('/inbound');
    const agents = response.data?.inbound_agents || response.data || [];

    res.json({
      success: true,
      configured: true,
      agents: Array.isArray(agents) ? agents : [],
    });
  } catch (error) {
    console.error('Bland status error:', error.response?.data || error.message);
    res.json({ success: true, configured: false, agents: [] });
  }
});

// ─── Admin: Get call logs ───────────────────────────────────────────────────
blandRouter.get('/calls', adminAuth, async (req, res) => {
  try {
    if (!process.env.BLAND_API_KEY) {
      return res.json({ success: true, calls: [] });
    }

    const response = await blandAPI.get('/calls');
    res.json({
      success: true,
      calls: response.data?.calls || [],
    });
  } catch (error) {
    console.error('Bland calls error:', error.response?.data || error.message);
    res.json({ success: true, calls: [] });
  }
});

// ─── Admin: Make an outbound test call ──────────────────────────────────────
blandRouter.post('/test-call', adminAuth, async (req, res) => {
  try {
    const { phone_number } = req.body;
    if (!phone_number) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    const response = await blandAPI.post('/calls', {
      phone_number,
      task: getAgentPrompt(),
      voice: 'maya',
      first_sentence: 'Hello! This is a test call from FAX Collections AI assistant. How may I help you today?',
      model: 'enhanced',
      language: 'en',
      max_duration: 5,
    });

    res.json({
      success: true,
      message: 'Test call initiated!',
      callId: response.data?.call_id,
    });
  } catch (error) {
    console.error('Bland test call error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || 'Failed to make test call',
    });
  }
});

// ─── Webhook: Bland.ai tool calls during conversation ───────────────────────
blandRouter.post('/webhook', async (req, res) => {
  try {
    const { tool, tool_input } = req.body;

    if (tool === 'track_order') {
      const id = (tool_input?.order_id || '').trim().replace(/^#/, '');
      let order = null;

      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        order = await Order.findById(id);
      }
      if (!order) {
        const allOrders = await Order.find({}, '_id items totalAmount status shippingAddress createdAt');
        order = allOrders.find(o => o._id.toString().slice(-8).toUpperCase() === id.toUpperCase());
      }

      if (order) {
        const itemNames = order.items.map(i => i.name).join(', ');
        res.json({
          result: `Order found! Order ID ending in ${order._id.toString().slice(-8).toUpperCase()}. Status: ${order.status}. Items: ${itemNames}. Total: ₦${order.totalAmount?.toLocaleString()}. Placed on: ${new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}.`,
        });
      } else {
        res.json({
          result: 'I could not find an order with that ID. Could you please double-check the order ID? You can find it in your order confirmation email or on the My Orders page of our website.',
        });
      }
      return;
    }

    if (tool === 'search_products') {
      const query = (tool_input?.query || '').toLowerCase();
      const products = await Product.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { category: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
        ],
      }).limit(5);

      if (products.length > 0) {
        const productList = products.map(p =>
          `${p.name} — ₦${p.price?.toLocaleString()}${p.category ? ` (${p.category})` : ''}`
        ).join('. ');
        res.json({
          result: `I found ${products.length} product${products.length > 1 ? 's' : ''}: ${productList}. Would you like more details about any of these?`,
        });
      } else {
        res.json({
          result: `I didn't find any products matching "${tool_input?.query}". You can browse our full collection on our website at faxcollections.com. Would you like help with anything else?`,
        });
      }
      return;
    }

    // Default webhook response (call completed, etc.)
    console.log('Bland webhook:', JSON.stringify(req.body).slice(0, 500));
    res.json({ status: 'ok' });
  } catch (error) {
    console.error('Bland webhook error:', error.message);
    res.json({ result: 'I apologize, I am having trouble looking that up right now. Please try again or visit our website at faxcollections.com for assistance.' });
  }
});

export default blandRouter;
