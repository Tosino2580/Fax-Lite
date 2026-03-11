import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

const chatRouter = express.Router();

const FRONTEND_URL = process.env.FRONTEND_URL || 'https://fax-lite-5cfa.vercel.app';

const SYSTEM_PROMPT = `You are a friendly, professional customer service assistant for FAX Collections — a premium African fashion e-commerce brand based in Lagos, Nigeria.

ABOUT FAX COLLECTIONS:
- We sell premium African menswear: Agbadas, Kaftans, Jalabiya, Abaya, CropTop, Kids wear, and modern collections
- Based in Lagos, Nigeria with worldwide shipping
- Website: ${FRONTEND_URL}
- Business hours: Monday-Friday 9AM-6PM, Saturday 10AM-4PM, Sunday closed

WEBSITE PAGES (share these links when helpful):
- Homepage: ${FRONTEND_URL}/
- All Collections: ${FRONTEND_URL}/collections
- Agbada Collection: ${FRONTEND_URL}/collections?category=Agbada
- Kaftan Collection: ${FRONTEND_URL}/collections?category=Kaftan
- Jalabiya Collection: ${FRONTEND_URL}/collections?category=Jalabiya
- Abaya Collection: ${FRONTEND_URL}/collections?category=Abaya
- Kids Collection: ${FRONTEND_URL}/collections?category=Kids
- Contact Page: ${FRONTEND_URL}/contact
- Track Order: ${FRONTEND_URL}/track-order
- My Account / Orders: ${FRONTEND_URL}/account/orders
- Cart: ${FRONTEND_URL}/cart
- Checkout: ${FRONTEND_URL}/checkout

HOW TO HELP CUSTOMERS SHOP:
- When a customer wants to buy/order something, share the direct link to the relevant collection or product
- To order: browse products → add to cart → go to checkout → fill shipping address → choose payment method (Card, Bank Transfer, or Cash on Delivery) → place order
- After placing an order, they'll get an order confirmation with a tracking ID
- They can track orders on the Track Order page or in My Account > Orders

POLICIES:
- RETURNS & EXCHANGES: 7-day return window from delivery, items must be unworn with original tags, custom orders non-refundable, free exchanges for wrong sizes, refunds in 3-5 business days
- DELIVERY: Lagos 1-3 days, other Nigerian states 3-7 days, international 7-14 days, free shipping over ₦50,000
- PAYMENT: Card via Paystack (Visa, Mastercard, Verve), bank transfer, cash on delivery (Lagos only)
- SIZING: S (36-38"), M (38-40"), L (40-42"), XL (42-44"), XXL (44-46") — recommend sizing up for comfort

STYLE:
- Be warm, concise, and helpful
- Use simple, clear language
- When sharing product info, include the name, price, available sizes, and a link to view it
- IMPORTANT: You ARE able to show images! The chat supports markdown. When product data includes an Image URL, you MUST display it using this exact markdown format: [View Product](image_url) — the chat interface will render it as a clickable image thumbnail. NEVER say you cannot show images.
- When a customer asks to see products, pictures, or images, ALWAYS include the image URLs from the PRODUCT DATA below using the markdown link format
- If you can't resolve something, suggest emailing support@faxcollections.com or using the contact form
- Only share product/order info from the CONTEXT DATA provided below — don't make up products or prices
- Keep responses short (2-4 sentences max unless listing products)`;

// Pre-fetch relevant data based on the user's message
async function getContextData(msg) {
  const lower = msg.toLowerCase();
  let context = '';

  // Check for order tracking
  const idMatch = lower.match(/[a-f0-9]{8,24}/i);
  if (idMatch || lower.includes('track') || lower.includes('order') || lower.includes('status') || lower.includes('where is my')) {
    if (idMatch) {
      const id = idMatch[0].trim().replace(/^#/, '');
      let order = null;

      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        order = await Order.findById(id);
      }
      if (!order) {
        const allOrders = await Order.find({}, '_id items totalAmount status shippingAddress createdAt');
        order = allOrders.find((o) => o._id.toString().slice(-8).toUpperCase() === id.toUpperCase());
      }

      if (order) {
        const itemNames = order.items.map((i) => `${i.name} (x${i.quantity || 1})`).join(', ');
        context += `\n\nORDER DATA: Order ID: ...${order._id.toString().slice(-8).toUpperCase()}. Status: ${order.status}. Items: ${itemNames}. Total: ₦${order.totalAmount?.toLocaleString()}. Placed: ${new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}.`;
      } else {
        context += `\n\nORDER DATA: No order found with ID "${id}". Suggest the customer double-check their order ID from their confirmation email or My Orders page at ${FRONTEND_URL}/account/orders.`;
      }
    }
  }

  // Always fetch catalog summary for product-related and general queries
  const productKeywords = ['product', 'buy', 'purchase', 'shop', 'dress', 'wear', 'cloth', 'agbada', 'kaftan', 'jalabiya', 'abaya', 'crop', 'kid', 'collection', 'catalog', 'price', 'cost', 'how much', 'available', 'stock', 'sell', 'have', 'show', 'see', 'browse', 'what do you', 'what you', 'image', 'picture', 'photo', 'look', 'new', 'latest', 'popular', 'best', 'recommend', 'suggest', 'cheap', 'affordable', 'expensive', 'item', 'help me', 'i want', 'i need', 'checkout', 'cart', 'add to'];
  const wantsProducts = productKeywords.some((k) => lower.includes(k));

  if (wantsProducts) {
    // Extract search terms
    const categoryMap = {
      agbada: 'Agbada',
      kaftan: 'Kaftan',
      jalabiya: 'Jalabiya',
      abaya: 'Abaya',
      'crop top': 'CropTop',
      croptop: 'CropTop',
      kid: 'Kids',
      kids: 'Kids',
      children: 'Kids',
    };

    let products;
    const matchedCategory = Object.keys(categoryMap).find((k) => lower.includes(k));

    if (matchedCategory) {
      products = await Product.find({ category: categoryMap[matchedCategory], isActive: { $ne: false } })
        .sort({ createdAt: -1 })
        .limit(8);
    } else {
      // General search or latest products
      const searchTerms = lower.match(/\b(shirt|cap|pant|suit|trouser|gown|top|dress|white|black|blue|red|green|gold)\b/gi);
      if (searchTerms) {
        const regex = searchTerms.join('|');
        products = await Product.find({
          isActive: { $ne: false },
          $or: [
            { name: { $regex: regex, $options: 'i' } },
            { description: { $regex: regex, $options: 'i' } },
          ],
        }).limit(8);
      }
      if (!products || products.length === 0) {
        products = await Product.find({ isActive: { $ne: false } }).sort({ createdAt: -1 }).limit(8);
      }
    }

    if (products.length > 0) {
      const list = products
        .map((p) => {
          const img = p.images?.[0] ? ` | Image: ${p.images[0]}` : '';
          const sizes = p.sizes?.length ? ` | Sizes: ${p.sizes.join(', ')}` : '';
          const stock = p.inStock > 0 ? `In Stock (${p.inStock})` : 'Out of Stock';
          const oldPrice = p.oldPrice ? ` (was ₦${p.oldPrice.toLocaleString()})` : '';
          const badge = p.badge ? ` [${p.badge}]` : '';
          const link = ` | View: ${FRONTEND_URL}/product/${p._id}`;
          return `• ${p.name}${badge} — ₦${p.price?.toLocaleString()}${oldPrice} | ${p.category} | ${stock}${sizes}${img}${link}`;
        })
        .join('\n');
      context += `\n\nPRODUCT DATA (${products.length} items):\n${list}`;
    } else {
      context += `\n\nPRODUCT DATA: No matching products found. Suggest browsing all collections at ${FRONTEND_URL}/collections.`;
    }

    // Also add category counts
    try {
      const categoryCounts = await Product.aggregate([
        { $match: { isActive: { $ne: false } } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]);
      if (categoryCounts.length > 0) {
        const summary = categoryCounts.map((c) => `${c._id}: ${c.count} items`).join(', ');
        context += `\n\nCATALOG SUMMARY: ${summary}. Total active products: ${categoryCounts.reduce((sum, c) => sum + c.count, 0)}.`;
      }
    } catch {
      // Ignore aggregation error
    }
  }

  return context;
}

// Smart fallback responses (works without Groq)
async function getSmartReply(lastMsg) {
  const msg = lastMsg.toLowerCase();

  if (msg.includes('track') || msg.includes('order') || msg.includes('status')) {
    const idMatch = msg.match(/[a-f0-9]{8,24}/i);
    if (idMatch) {
      const id = idMatch[0].trim().replace(/^#/, '');
      let order = null;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        order = await Order.findById(id);
      }
      if (!order) {
        const allOrders = await Order.find({}, '_id items totalAmount status shippingAddress createdAt');
        order = allOrders.find((o) => o._id.toString().slice(-8).toUpperCase() === id.toUpperCase());
      }
      if (order) {
        const itemNames = order.items.map((i) => i.name).join(', ');
        return `Order found! ID: ...${order._id.toString().slice(-8).toUpperCase()}. Status: ${order.status}. Items: ${itemNames}. Total: ₦${order.totalAmount?.toLocaleString()}. Placed: ${new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}.`;
      }
      return 'Order not found. Please double-check the order ID from your confirmation email or My Orders page.';
    }
    return "I'd love to help you track your order! Please share your order ID. You can find it in your confirmation email or on the My Orders page.";
  }

  if (msg.includes('buy') || msg.includes('purchase') || msg.includes('shop') || msg.includes('dress') || msg.includes('wear') || msg.includes('cloth')) {
    return "Great choice! We have a stunning collection of premium African menswear. Browse our collections at faxcollections.com/collections — we have Agbadas, Kaftans, Jalabiya, and modern styles. Would you like me to search for something specific?";
  }

  if (msg.includes('product') || msg.includes('agbada') || msg.includes('kaftan') || msg.includes('jalabiya') || msg.includes('collection') || msg.includes('catalog')) {
    return "We have a beautiful collection of African menswear including Agbadas, Kaftans, and Jalabiya. Browse our full catalog at faxcollections.com/collections or tell me what specific style you're looking for!";
  }

  if (msg.includes('price') || msg.includes('cost') || msg.includes('how much') || msg.includes('expensive') || msg.includes('cheap') || msg.includes('affordable')) {
    return "Our prices vary by style and fabric. Kaftans start from around ₦15,000, while premium Agbadas can go up to ₦150,000+. Browse our collections to see current prices, or tell me what you're looking for and I'll search for you!";
  }

  if (msg.includes('return') || msg.includes('refund') || msg.includes('exchange')) {
    return "Our return policy: 7-day return window from delivery. Items must be unworn with original tags. Custom orders are non-refundable. We offer free exchanges for wrong sizes. Refunds are processed within 3-5 business days. To initiate a return, email us with your order ID.";
  }

  if (msg.includes('delivery') || msg.includes('shipping') || msg.includes('ship') || msg.includes('arrive') || msg.includes('long')) {
    return "Delivery timelines: Lagos 1-3 business days, other Nigerian states 3-7 days, international 7-14 days. Free shipping on orders over ₦50,000! We ship worldwide.";
  }

  if (msg.includes('payment') || msg.includes('pay') || msg.includes('card') || msg.includes('transfer') || msg.includes('money')) {
    return "We accept: Card payments via Paystack (Visa, Mastercard, Verve), bank transfers, and cash on delivery (Lagos only). All transactions are SSL encrypted for your security.";
  }

  if (msg.includes('size') || msg.includes('sizing') || msg.includes('fit') || msg.includes('measure')) {
    return 'Our sizing guide: S (Chest 36-38"), M (38-40"), L (40-42"), XL (42-44"), XXL (44-46"). When in doubt, we recommend sizing up for a comfortable fit. Bespoke/custom sizing is also available!';
  }

  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('good morning') || msg.includes('good afternoon') || msg.includes('good evening')) {
    return "Hello! Welcome to FAX Collections. How can I help you today? I can assist with order tracking, product info, returns, delivery details, and more!";
  }

  if (msg.includes('thank') || msg.includes('thanks') || msg.includes('appreciate')) {
    return "You're welcome! If you need anything else, feel free to ask. We're always happy to help at FAX Collections!";
  }

  if (msg.includes('bye') || msg.includes('goodbye') || msg.includes('see you')) {
    return "Goodbye! Thank you for choosing FAX Collections. Have a wonderful day!";
  }

  if (msg.includes('contact') || msg.includes('support') || msg.includes('help') || msg.includes('human') || msg.includes('agent') || msg.includes('speak')) {
    return "You can reach our support team via: Email at support@faxcollections.com, our contact form on the website, or call our AI phone line. Business hours: Mon-Fri 9AM-6PM, Sat 10AM-4PM.";
  }

  if (msg.includes('hour') || msg.includes('open') || msg.includes('close') || msg.includes('when')) {
    return "Our business hours are: Monday-Friday 9AM-6PM, Saturday 10AM-4PM. We're closed on Sundays. Our AI assistant (that's me!) is available 24/7 though!";
  }

  if (msg.includes('where') || msg.includes('location') || msg.includes('address') || msg.includes('store') || msg.includes('lagos')) {
    return "FAX Collections is based in Lagos, Nigeria. We primarily operate online at faxcollections.com with worldwide shipping. For specific location inquiries, please contact us at support@faxcollections.com.";
  }

  if (msg.includes('custom') || msg.includes('bespoke') || msg.includes('tailor') || msg.includes('made to')) {
    return "Yes, we offer bespoke/custom tailoring! You can get any of our designs customized to your exact measurements. Contact us through the website's contact form or email support@faxcollections.com with your requirements.";
  }

  return "Thank you for reaching out to FAX Collections! I can help with: order tracking, product info, sizing, returns, delivery timelines, and payment options. What would you like to know?";
}

// Chat endpoint
chatRouter.post('/', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ success: false, message: 'Messages are required' });
    }

    const lastMsg = messages[messages.length - 1]?.content || '';
    const groqKey = process.env.GROQ_API_KEY;

    // No API key — use smart fallback
    if (!groqKey) {
      const reply = await getSmartReply(lastMsg);
      return res.json({ success: true, reply });
    }

    // Try Groq with context injection (no tool calling needed)
    try {
      // Pre-fetch relevant data and inject into system prompt
      const contextData = await getContextData(lastMsg);
      console.log('Chat context data length:', contextData.length, contextData ? 'has data' : 'empty');
      const fullSystemPrompt = SYSTEM_PROMPT + contextData;

      const aiMessages = [
        { role: 'system', content: fullSystemPrompt },
        ...messages.slice(-10),
      ];

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: aiMessages,
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Groq error:', data);
        const reply = await getSmartReply(lastMsg);
        return res.json({ success: true, reply });
      }

      const reply = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't generate a response. Please try again.";
      return res.json({ success: true, reply });
    } catch (aiError) {
      console.error('Groq call failed, using fallback:', aiError.message);
      const reply = await getSmartReply(lastMsg);
      return res.json({ success: true, reply });
    }
  } catch (error) {
    console.error('Chat error:', error.message);
    res.status(500).json({ success: false, message: 'Something went wrong' });
  }
});

export default chatRouter;
