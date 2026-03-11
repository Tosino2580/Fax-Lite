import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => console.log('MongoDB connected'));
mongoose.connection.on('error', (err) => console.error('MongoDB error:', err));

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

// Product schema (inline to avoid import issues)
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true },
    oldPrice: { type: Number },
    category: {
      type: String,
      required: true,
      enum: ['Collections', 'Jalabiya', 'Agbada', 'Kaftan', 'Abaya', 'CropTop', 'Kids'],
    },
    images: { type: [String], default: [] },
    sizes: { type: [String], default: ['S', 'M', 'L', 'XL', 'XXL'] },
    inStock: { type: Number, default: 10 },
    isActive: { type: Boolean, default: true },
    badge: { type: String, trim: true },
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

// Base path for images
const assetsBase = path.join(__dirname, '..', 'assets', 'images');

// Helper to upload image to Cloudinary
async function uploadImage(relativePath) {
  const fullPath = path.join(assetsBase, relativePath);
  try {
    const result = await cloudinary.uploader.upload(fullPath, {
      folder: 'fax_products',
      resource_type: 'image',
    });
    console.log(`  ✓ Uploaded: ${path.basename(relativePath)}`);
    return result.secure_url;
  } catch (err) {
    console.error(`  ✗ Failed to upload ${relativePath}:`, err.message);
    return null;
  }
}

// All products with their local image paths
const allProducts = [
  // ═══ ProductData.js — Collections/Casual (7 items) ═══
  {
    name: 'Pocket Art Shirt x Baggy Pant',
    price: 300000,
    oldPrice: 450000,
    inStock: 8,
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XS'],
    category: 'Collections',
    images: ['MEN/Casual/casual-1.webp'],
    badge: 'New',
  },
  {
    name: 'Stripe Linen Safari Shirt & Baggy Pant',
    price: 240000,
    oldPrice: 320000,
    inStock: 4,
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XS'],
    category: 'Collections',
    images: ['MEN/Casual/casual-2.webp', 'MEN/Casual/casual-3.webp'],
  },
  {
    name: 'Button-Up Linen Escape',
    price: 240000,
    oldPrice: 300000,
    inStock: 3,
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XS'],
    category: 'Collections',
    images: ['MEN/Casual/casual-4.webp', 'MEN/Casual/casual-5.webp'],
  },
  {
    name: 'Blue Hand-Painted Abstract Guitar Man Linen Shirt',
    price: 300000,
    oldPrice: 350000,
    inStock: 7,
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XS'],
    category: 'Collections',
    images: ['MEN/Casual/casual-6.webp', 'MEN/Casual/casual-7.webp'],
  },

  // ═══ ProductData.js — T-Shirts (4 items) ═══
  {
    name: 'Relaxed fit T-shirt Ft Hand Painted Fela Art',
    price: 150000,
    oldPrice: 250000,
    inStock: 9,
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XS'],
    category: 'Collections',
    images: ['MEN/T-Shirt/tshirt-1.webp', 'MEN/T-Shirt/tshirt-2.webp'],
  },
  {
    name: 'Relaxed fit T-shirt Ft Hand Painted Arts',
    price: 150000,
    oldPrice: 250000,
    inStock: 9,
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XS'],
    category: 'Collections',
    images: ['MEN/T-Shirt/tshirt-3.webp', 'MEN/T-Shirt/tshirt-4.webp'],
  },
  {
    name: 'Relaxed fit T-shirt Ft Hand Painted Igbo man art',
    price: 150000,
    oldPrice: 250000,
    inStock: 12,
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XS'],
    category: 'Collections',
    images: ['MEN/T-Shirt/tshirt-5.webp', 'MEN/T-Shirt/tshirt-6.webp'],
  },
  {
    name: 'Relaxed fit Red T-shirt Ft Hand Painted Basquit inspired Art',
    price: 150000,
    oldPrice: 250000,
    inStock: 10,
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XS'],
    category: 'Collections',
    images: ['MEN/T-Shirt/tshirt-7.webp', 'MEN/T-Shirt/tshirt-8.webp'],
  },

  // ═══ ProductData.js — Agbada (3 items, also in agbadaDatas) ═══
  {
    name: 'The Historic Ozo x NFL Agbada',
    price: 1273800,
    oldPrice: 1543000,
    inStock: 4,
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XS'],
    category: 'Agbada',
    images: ['MEN/Agbada/agbada-1.webp', 'MEN/Agbada/agbada-2.webp'],
    badge: 'Premium',
  },
  {
    name: 'Macallan Reserve Agbada',
    price: 885000,
    oldPrice: 1000000,
    inStock: 7,
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XS'],
    category: 'Agbada',
    images: ['MEN/Agbada/agbada-3.webp', 'MEN/Agbada/agbada-4.webp'],
    badge: 'Premium',
  },
  {
    name: 'Onìńówọ & Olori Patched Aso-Oke Agbada',
    price: 3315000,
    oldPrice: 3450000,
    inStock: 3,
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XS'],
    category: 'Agbada',
    images: ['MEN/Agbada/agbada-5.webp', 'MEN/Agbada/agbada-6.webp'],
    badge: 'Exclusive',
  },

  // ═══ agbadaDatas.js — Extra Agbada (2 items not in ProductData) ═══
  {
    name: 'Turquoise Blue Agbada Kaftan and Aso Oke Pant',
    price: 344300,
    oldPrice: 400000,
    inStock: 10,
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XS'],
    category: 'Agbada',
    images: ['MEN/Agbada/agbada-7.webp', 'MEN/Agbada/agbada-8.webp'],
  },
  {
    name: 'Lion King Agbada, Aso Oke Pant and Cap Set',
    price: 344300,
    oldPrice: 500000,
    inStock: 7,
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XS'],
    category: 'Agbada',
    images: ['MEN/Agbada/agbada-9.webp', 'MEN/Agbada/agbada-10.webp'],
    badge: 'Best Seller',
  },

  // ═══ ProductData.js — Kaftan from main (4 items) ═══
  {
    name: 'Hand-Painted Black Kaftan and Aso Oke Pant',
    price: 345000,
    oldPrice: 450000,
    inStock: 5,
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XS'],
    category: 'Kaftan',
    images: ['MEN/Kaftan&Shirts/SHIRTKAFTAN_5.webp', 'MEN/Kaftan&Shirts/SHIRTKAFTAN_6.webp'],
  },
  {
    name: 'Line Art Kaftan and Pant',
    price: 345800,
    oldPrice: 450000,
    inStock: 4,
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XS'],
    category: 'Kaftan',
    images: ['MEN/Kaftan&Shirts/SHIRTKAFTAN_7.webp', 'MEN/Kaftan&Shirts/SHIRTKAFTAN_8.webp'],
  },
  {
    name: 'Hand-Painted Kaftan and Aso Oke Pant Set',
    price: 345800,
    oldPrice: 450000,
    inStock: 6,
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XS'],
    category: 'Kaftan',
    images: ['MEN/Kaftan&Shirts/SHIRTKAFTAN_10.webp', 'MEN/Kaftan&Shirts/SHIRTKAFTAN_11.webp'],
  },
  {
    name: 'Hand-Painted Kaftan and Aso Oke Pant Set II',
    price: 345800,
    oldPrice: 450000,
    inStock: 6,
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XS'],
    category: 'Kaftan',
    images: ['MEN/Kaftan&Shirts/SHIRTKAFTAN_12.webp', 'MEN/Kaftan&Shirts/SHIRTKAFTAN_13.webp'],
  },

  // ═══ KaftanData.js — Extra Kaftans (8 items not duplicated) ═══
  {
    name: 'Line Art Hand-painted Kaftan',
    price: 195800,
    oldPrice: 250000,
    inStock: 4,
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XS'],
    category: 'Kaftan',
    images: ['MEN/Kaftan&Shirts/SHIRTKAFTAN_1.webp'],
  },
  {
    name: 'Moon Girl Hand Painted Kaftan and Pant',
    price: 195800,
    oldPrice: 250000,
    inStock: 4,
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XS'],
    category: 'Kaftan',
    images: ['MEN/Kaftan&Shirts/SHIRTKAFTAN_2.webp'],
  },
  {
    name: 'Afro Panther Fangs Piece - Kaftan Set',
    price: 195800,
    oldPrice: 250000,
    inStock: 3,
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XS'],
    category: 'Kaftan',
    images: ['MEN/Kaftan&Shirts/SHIRTKAFTAN_3.webp', 'MEN/Kaftan&Shirts/SHIRTKAFTAN_4.webp'],
  },
  {
    name: 'Hand-Painted White Kaftan and Aso Oke Pant Set',
    price: 345800,
    oldPrice: 450000,
    inStock: 9,
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XS'],
    category: 'Kaftan',
    images: ['MEN/Kaftan&Shirts/SHIRTKAFTAN_9.webp'],
  },
  {
    name: 'Bespoke Cashmere Native Set',
    price: 345800,
    oldPrice: 450000,
    inStock: 7,
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XS'],
    category: 'Kaftan',
    images: ['MEN/Kaftan&Shirts/SHIRTKAFTAN_14.webp', 'MEN/Kaftan&Shirts/SHIRTKAFTAN_15.webp'],
  },
  {
    name: 'Pin Stripe Kaftan and Pant',
    price: 345800,
    oldPrice: 450000,
    inStock: 8,
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XS'],
    category: 'Kaftan',
    images: ['MEN/Kaftan&Shirts/SHIRTKAFTAN_16.webp', 'MEN/Kaftan&Shirts/SHIRTKAFTAN_17.webp'],
  },
  {
    name: 'Hand-painted Black Splash Kaftan Set',
    price: 345800,
    oldPrice: 450000,
    inStock: 3,
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XS'],
    category: 'Kaftan',
    images: ['MEN/Kaftan&Shirts/SHIRTKAFTAN_18.webp', 'MEN/Kaftan&Shirts/SHIRTKAFTAN_19.webp'],
  },
  {
    name: 'Hand-painted Dragon Kaftan Shirt and Pant Set',
    price: 345800,
    oldPrice: 450000,
    inStock: 11,
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XS'],
    category: 'Kaftan',
    images: ['MEN/Kaftan&Shirts/SHIRTKAFTAN_20.webp', 'MEN/Kaftan&Shirts/SHIRTKAFTAN_21.webp'],
  },

  // ═══ JalabiyaDatas.js — Jalabiya (8 items) ═══
  {
    name: 'Man Hand-painted Jalabiya',
    price: 255000,
    oldPrice: 300000,
    inStock: 5,
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XS'],
    category: 'Jalabiya',
    images: ['MEN/Jalabiya/Jalabiya-3.webp', 'MEN/Jalabiya/Jalabiya-4.webp'],
  },
  {
    name: 'Line Art Jalabiya and Cap Set',
    price: 255000,
    oldPrice: 300000,
    inStock: 7,
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XS'],
    category: 'Jalabiya',
    images: ['MEN/Jalabiya/DSC05551-Edit.webp', 'MEN/Jalabiya/Jalabiya-2.webp'],
  },
  {
    name: 'Hand painted V-Neck Jalabiya',
    price: 318000,
    oldPrice: 420000,
    inStock: 6,
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XS'],
    category: 'Jalabiya',
    images: ['MEN/Jalabiya/Jalabiya-5.webp', 'MEN/Jalabiya/Jalabiya-6.webp'],
    badge: 'Popular',
  },
  {
    name: 'Line Art Jalabiya',
    price: 255000,
    oldPrice: 300000,
    inStock: 10,
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XS'],
    category: 'Jalabiya',
    images: ['MEN/Jalabiya/Jalabiya-7.webp', 'MEN/Jalabiya/Jalabiya-8.webp'],
  },
  {
    name: 'Map of Africa Hand Painted Jalabiya',
    price: 255000,
    oldPrice: 350000,
    inStock: 13,
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XS'],
    category: 'Jalabiya',
    images: ['MEN/Jalabiya/Jalabiya-9.webp'],
    badge: 'Best Seller',
  },
  {
    name: 'Male Hand-Painted Jalabiya',
    price: 255000,
    oldPrice: 300000,
    inStock: 6,
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XS'],
    category: 'Jalabiya',
    images: ['MEN/Jalabiya/Jalabiya-10.webp', 'MEN/Jalabiya/Jalabiya-11.webp'],
  },
  {
    name: 'Benin Head Painted Jalabiya',
    price: 255000,
    oldPrice: 300000,
    inStock: 15,
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XS'],
    category: 'Jalabiya',
    images: ['MEN/Jalabiya/Jalabiya-12.webp'],
  },
  {
    name: 'Line Art White Jalabiya and Cap Set',
    price: 255000,
    oldPrice: 300000,
    inStock: 8,
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XS'],
    category: 'Jalabiya',
    images: ['MEN/Jalabiya/Jalabiya-13.webp', 'MEN/Jalabiya/Jalabiya-14.webp'],
  },

  // ═══ ProductData.js — CropTop (4 items) ═══
  {
    name: 'Takunsi Aso Oke Cargo Pant and Crop Top',
    price: 345000,
    oldPrice: 450000,
    inStock: 8,
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XS'],
    category: 'CropTop',
    images: ['WOMEN/Crop-top/crop-top1.webp', 'WOMEN/Crop-top/crop-top2.webp'],
  },
  {
    name: 'Bishop Collar Shirt x High Waist Pant',
    price: 397500,
    oldPrice: 500000,
    inStock: 7,
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XS'],
    category: 'CropTop',
    images: ['WOMEN/Crop-top/crop-top3.webp', 'WOMEN/Crop-top/crop-top4.webp'],
  },
  {
    name: 'Takunsi Aso Oke Fringe Pant x Crop Top',
    price: 345000,
    oldPrice: 450000,
    inStock: 9,
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XS'],
    category: 'CropTop',
    images: ['WOMEN/Crop-top/crop-top7.webp', 'WOMEN/Crop-top/crop-top8.webp'],
  },
  {
    name: 'Hand Painted Crop Top and Patched Skirt',
    price: 345000,
    oldPrice: 450000,
    inStock: 6,
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XS'],
    category: 'CropTop',
    images: ['WOMEN/Crop-top/crop-top9.webp', 'WOMEN/Crop-top/crop-top10.webp'],
  },

  // ═══ ProductData.js — Abaya (4 items) ═══
  {
    name: 'Large Aso Oke Bag x Negasi Linen Abaya',
    price: 350700,
    oldPrice: 453000,
    inStock: 9,
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XS'],
    category: 'Abaya',
    images: ['WOMEN/Abaya/abaya-3.webp', 'WOMEN/Abaya/abaya-4.webp'],
  },
  {
    name: 'Negasi Dress in Wool - Red Abaya',
    price: 230700,
    oldPrice: 350000,
    inStock: 8,
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XS'],
    category: 'Abaya',
    images: ['WOMEN/Abaya/abaya-5.webp', 'WOMEN/Abaya/abaya-6.webp'],
  },
  {
    name: 'Small Aso Oke Bag x Black Abaya Set',
    price: 350700,
    oldPrice: 450000,
    inStock: 5,
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XS'],
    category: 'Abaya',
    images: ['WOMEN/Abaya/abaya-7.webp', 'WOMEN/Abaya/abaya-8.webp'],
  },
  {
    name: 'Hand-Painted Abaya',
    price: 230700,
    oldPrice: 330000,
    inStock: 8,
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XS'],
    category: 'Abaya',
    images: ['WOMEN/Abaya/abaya-9.webp', 'WOMEN/Abaya/abaya-10.webp'],
  },
];

async function seed() {
  console.log(`\n🌱 Seeding ${allProducts.length} products into MongoDB...\n`);

  // Wait for connection
  await new Promise((resolve) => {
    if (mongoose.connection.readyState === 1) return resolve();
    mongoose.connection.once('connected', resolve);
  });

  // Check existing products
  const existing = await Product.countDocuments();
  if (existing > 0) {
    console.log(`⚠️  Database already has ${existing} products.`);
    console.log('   Clearing existing products before seeding...\n');
    await Product.deleteMany({});
  }

  let success = 0;
  let failed = 0;

  for (let i = 0; i < allProducts.length; i++) {
    const product = allProducts[i];
    console.log(`[${i + 1}/${allProducts.length}] ${product.name} (${product.category})`);

    // Upload images to Cloudinary
    const uploadedImages = [];
    for (const imgPath of product.images) {
      const url = await uploadImage(imgPath);
      if (url) uploadedImages.push(url);
    }

    try {
      await Product.create({
        name: product.name,
        description: product.description || `Premium ${product.category} from FAX Collections`,
        price: product.price,
        oldPrice: product.oldPrice,
        category: product.category,
        images: uploadedImages,
        sizes: product.sizes,
        inStock: product.inStock,
        isActive: true,
        badge: product.badge || undefined,
      });
      success++;
      console.log(`  ✓ Created with ${uploadedImages.length} image(s)\n`);
    } catch (err) {
      failed++;
      console.error(`  ✗ Failed to create: ${err.message}\n`);
    }
  }

  console.log(`\n✅ Seeding complete! ${success} created, ${failed} failed.`);
  console.log(`📊 Total products in DB: ${await Product.countDocuments()}`);

  // Show category breakdown
  const categories = await Product.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
  console.log('\nCategory breakdown:');
  categories.forEach((c) => console.log(`  ${c._id}: ${c.count}`));

  await mongoose.disconnect();
  console.log('\nDone! Database disconnected.');
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
