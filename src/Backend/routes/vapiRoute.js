import express from 'express';
import vapiAPI, { getAgentPrompt } from '../config/vapiAI.js';
import adminAuth from '../middleware/adminAuth.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

const vapiRouter = express.Router();

// ─── Admin: Create the AI phone assistant ────────────────────────────────────
vapiRouter.post('/setup-agent', adminAuth, async (req, res) => {
  try {
    if (!process.env.VAPI_API_KEY) {
      return res.status(400).json({ success: false, message: 'VAPI_API_KEY not configured in .env' });
    }

    const backendUrl = process.env.BACKEND_URL || `${process.env.FRONTEND_URL?.replace('5173', '4000') || 'http://localhost:4000'}`;

    // 1. Create assistant
    const assistantRes = await vapiAPI.post('/assistant', {
      name: 'FAX Collections Support',
      firstMessage: 'Thank you for calling FAX Collections! How may I help you today?',
      model: {
        provider: 'openai',
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: getAgentPrompt(),
          },
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'track_order',
              description: 'Look up an order status by order ID. Use when a customer wants to check their order status.',
              parameters: {
                type: 'object',
                properties: {
                  order_id: { type: 'string', description: 'The order ID provided by the customer' },
                },
                required: ['order_id'],
              },
            },
          },
          {
            type: 'function',
            function: {
              name: 'search_products',
              description: 'Search for products by name or category. Use when a customer asks about product availability.',
              parameters: {
                type: 'object',
                properties: {
                  query: { type: 'string', description: 'Product name or category to search for' },
                },
                required: ['query'],
              },
            },
          },
        ],
      },
      voice: {
        provider: '11labs',
        voiceId: 'paula',
      },
      server: {
        url: `${backendUrl}/api/vapi/webhook`,
      },
      maxDurationSeconds: 900,
    });

    const assistantId = assistantRes.data.id;

    // 2. Try to purchase a Vapi phone number and link it to the assistant
    let phoneData = null;
    try {
      const phoneRes = await vapiAPI.post('/phone-number', {
        provider: 'vapi',
        assistantId,
      });
      phoneData = phoneRes.data;
    } catch (phoneErr) {
      console.warn('Could not auto-purchase phone number:', phoneErr.response?.data?.message || phoneErr.message);
    }

    res.json({
      success: true,
      message: phoneData
        ? 'AI phone agent created with phone number!'
        : 'AI assistant created! Assign a phone number in the Vapi dashboard.',
      assistant: { id: assistantId, name: 'FAX Collections Support' },
      phoneNumber: phoneData ? { id: phoneData.id, number: phoneData.number } : null,
    });
  } catch (error) {
    console.error('Vapi setup error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to set up AI agent',
    });
  }
});

// ─── Admin: Get agent status ────────────────────────────────────────────────
vapiRouter.get('/agent-status', adminAuth, async (req, res) => {
  try {
    if (!process.env.VAPI_API_KEY) {
      return res.json({ success: true, configured: false, message: 'VAPI_API_KEY not set' });
    }

    // Get assistants
    const assistantRes = await vapiAPI.get('/assistant');
    const assistants = assistantRes.data || [];

    // Get phone numbers
    const phoneRes = await vapiAPI.get('/phone-number');
    const phoneNumbers = phoneRes.data || [];

    res.json({
      success: true,
      configured: true,
      assistants: Array.isArray(assistants) ? assistants : [],
      phoneNumbers: Array.isArray(phoneNumbers) ? phoneNumbers : [],
    });
  } catch (error) {
    console.error('Vapi status error:', error.response?.data || error.message);
    res.json({ success: true, configured: false, assistants: [], phoneNumbers: [] });
  }
});

// ─── Admin: Purchase a phone number ─────────────────────────────────────────
vapiRouter.post('/purchase-number', adminAuth, async (req, res) => {
  try {
    if (!process.env.VAPI_API_KEY) {
      return res.status(400).json({ success: false, message: 'VAPI_API_KEY not configured' });
    }

    // Get the first assistant to link
    const assistantRes = await vapiAPI.get('/assistant');
    const assistants = assistantRes.data || [];
    if (assistants.length === 0) {
      return res.status(400).json({ success: false, message: 'Create an assistant first by clicking Activate Agent.' });
    }

    const assistantId = assistants[0].id;
    const { areaCode } = req.body;

    const phoneRes = await vapiAPI.post('/phone-number', {
      provider: 'vapi',
      assistantId,
      ...(areaCode ? { numberDesiredAreaCode: areaCode } : {}),
    });

    res.json({
      success: true,
      message: `Phone number purchased: ${phoneRes.data.number}`,
      phoneNumber: { id: phoneRes.data.id, number: phoneRes.data.number },
    });
  } catch (error) {
    console.error('Vapi purchase number error:', error.response?.data || error.message);
    const msg = error.response?.data?.message || error.message || 'Failed to purchase phone number';
    res.status(500).json({
      success: false,
      message: msg.includes('limit') ? 'Free number limit reached. Import a Twilio number from the Vapi dashboard instead.' : msg,
    });
  }
});

// ─── Admin: Get call logs ───────────────────────────────────────────────────
vapiRouter.get('/calls', adminAuth, async (req, res) => {
  try {
    if (!process.env.VAPI_API_KEY) {
      return res.json({ success: true, calls: [] });
    }

    const response = await vapiAPI.get('/call', { params: { limit: 20 } });
    res.json({
      success: true,
      calls: response.data || [],
    });
  } catch (error) {
    console.error('Vapi calls error:', error.response?.data || error.message);
    res.json({ success: true, calls: [] });
  }
});

// ─── Admin: Make an outbound test call ──────────────────────────────────────
vapiRouter.post('/test-call', adminAuth, async (req, res) => {
  try {
    const { phone_number } = req.body;
    if (!phone_number) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    // Get assistant and phone number
    const assistantRes = await vapiAPI.get('/assistant');
    const assistants = assistantRes.data || [];
    if (assistants.length === 0) {
      return res.status(400).json({ success: false, message: 'No assistant found. Set up the agent first.' });
    }

    const phoneRes = await vapiAPI.get('/phone-number');
    const phoneNumbers = phoneRes.data || [];
    if (phoneNumbers.length === 0) {
      return res.status(400).json({ success: false, message: 'No phone number found. Purchase one in the Vapi dashboard.' });
    }

    const response = await vapiAPI.post('/call', {
      assistantId: assistants[0].id,
      phoneNumberId: phoneNumbers[0].id,
      customer: {
        number: phone_number,
      },
    });

    res.json({
      success: true,
      message: 'Test call initiated!',
      callId: response.data?.id,
    });
  } catch (error) {
    console.error('Vapi test call error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || 'Failed to make test call',
    });
  }
});

// ─── Webhook: Vapi tool calls during conversation ───────────────────────────
vapiRouter.post('/webhook', async (req, res) => {
  try {
    const { message } = req.body;

    // Handle tool-calls event
    if (message?.type === 'tool-calls') {
      const results = [];

      for (const toolCall of message.toolCallList || []) {
        const { id, name, arguments: args } = toolCall;

        if (name === 'track_order') {
          const orderId = (args?.order_id || '').trim().replace(/^#/, '');
          let order = null;

          if (orderId.match(/^[0-9a-fA-F]{24}$/)) {
            order = await Order.findById(orderId);
          }
          if (!order) {
            const allOrders = await Order.find({}, '_id items totalAmount status shippingAddress createdAt');
            order = allOrders.find(o => o._id.toString().slice(-8).toUpperCase() === orderId.toUpperCase());
          }

          if (order) {
            const itemNames = order.items.map(i => i.name).join(', ');
            results.push({
              toolCallId: id,
              result: `Order found! Order ID ending in ${order._id.toString().slice(-8).toUpperCase()}. Status: ${order.status}. Items: ${itemNames}. Total: ₦${order.totalAmount?.toLocaleString()}. Placed on: ${new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}.`,
            });
          } else {
            results.push({
              toolCallId: id,
              result: 'I could not find an order with that ID. Could you please double-check the order ID? You can find it in your order confirmation email or on the My Orders page of our website.',
            });
          }
        } else if (name === 'search_products') {
          const query = (args?.query || '').toLowerCase();
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
            results.push({
              toolCallId: id,
              result: `I found ${products.length} product${products.length > 1 ? 's' : ''}: ${productList}. Would you like more details about any of these?`,
            });
          } else {
            results.push({
              toolCallId: id,
              result: `I didn't find any products matching "${args?.query}". You can browse our full collection on our website at faxcollections.com. Would you like help with anything else?`,
            });
          }
        } else {
          results.push({
            toolCallId: id,
            result: 'Tool not recognized.',
          });
        }
      }

      return res.json({ results });
    }

    // Default: acknowledge other webhook events
    console.log('Vapi webhook:', message?.type || 'unknown', JSON.stringify(req.body).slice(0, 300));
    res.json({ status: 'ok' });
  } catch (error) {
    console.error('Vapi webhook error:', error.message);
    res.json({
      results: [{
        toolCallId: 'unknown',
        result: 'I apologize, I am having trouble looking that up right now. Please try again or visit our website at faxcollections.com.',
      }],
    });
  }
});

export default vapiRouter;
