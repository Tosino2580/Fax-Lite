import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaArrowRight, FaClock } from 'react-icons/fa';

const blogPosts = [
  {
    id: 1,
    title: 'The Rise of African Fashion on the Global Stage',
    excerpt: "African fashion is no longer a niche — it's a global movement. From Lagos Fashion Week to Paris runways, African designers are redefining what high fashion looks like.",
    image: 'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=800&q=80',
    category: 'Trends',
    date: 'Mar 5, 2026',
    readTime: '5 min read',
    content: `African fashion has experienced an extraordinary rise on the global stage over the past decade. What was once considered niche or "ethnic" is now celebrated as high fashion, with African designers showing at major fashion weeks worldwide.\n\nDesigners like Duro Olowu, Lisa Folawiyo, and Orange Culture have paved the way for a new generation of African creatives who blend traditional techniques with contemporary aesthetics. The result is fashion that feels both rooted in heritage and completely modern.\n\nAt FAX Collections, we're proud to be part of this movement. Every piece in our collection tells a story — from the rich Ankara prints that celebrate West African textile traditions to the sleek modern silhouettes that appeal to a global audience.\n\nThe key to African fashion's success lies in its authenticity. Unlike fast fashion trends that come and go, African fashion is built on centuries of textile craftsmanship, storytelling, and community. When you wear African fashion, you're not just wearing clothes — you're wearing culture.`,
  },
  {
    id: 2,
    title: 'How to Style Your Agbada for Any Occasion',
    excerpt: "The Agbada is more than traditional wear — it's a statement. Learn how to style this iconic piece for weddings, celebrations, and even modern casual settings.",
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
    category: 'Style Guide',
    date: 'Feb 28, 2026',
    readTime: '4 min read',
    content: `The Agbada is one of the most iconic pieces of West African fashion. Originally worn by Yoruba men for ceremonial occasions, it has evolved into a versatile garment that can be styled for virtually any setting.\n\n**For Weddings & Ceremonies:**\nOpt for rich fabrics like Aso-Oke or high-quality Guinea Brocade. Pair with a matching fila (cap) and traditional accessories. Gold or silver embroidery adds an extra layer of elegance.\n\n**For Modern Casual:**\nChoose a simpler Agbada in cotton or linen. You can pair it with fitted trousers instead of traditional Sokoto for a contemporary look. Sneakers work surprisingly well for a street-style vibe.\n\n**For Business Events:**\nA well-tailored Agbada in solid colors (navy, black, charcoal) with subtle embroidery makes a powerful statement at corporate events while maintaining cultural pride.\n\nAt FAX Collections, our Agbada range is designed for the modern man who values both tradition and style.`,
  },
  {
    id: 3,
    title: 'Kaftan: The Ultimate Comfort Meets Style',
    excerpt: 'Discover why the Kaftan remains one of the most popular choices for men who want to look effortlessly stylish while staying comfortable all day.',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80',
    category: 'Fashion',
    date: 'Feb 20, 2026',
    readTime: '3 min read',
    content: `The Kaftan (also known as Danshiki or Boubou in different regions) is perhaps the most versatile piece in African menswear. Its flowing silhouette offers unmatched comfort while maintaining an air of sophistication.\n\n**Why Kaftans Are Timeless:**\n- They suit all body types — the relaxed fit is universally flattering\n- Available in endless fabric choices from simple cotton to luxurious silk\n- Can be dressed up or down depending on the occasion\n- Perfect for the African climate while looking polished\n\n**Caring for Your Kaftan:**\nAlways check the care label first. Most cotton Kaftans can be machine washed on a gentle cycle. For embroidered or beaded pieces, dry cleaning is recommended. Store hanging rather than folded to maintain the drape.\n\nOur collection at FAX features Kaftans in premium fabrics with meticulous attention to detail in every stitch and embellishment.`,
  },
  {
    id: 4,
    title: 'Fashion Trends to Watch in 2026',
    excerpt: 'From bold prints to sustainable fashion, these are the trends that will define African menswear this year. Stay ahead of the curve with our style forecast.',
    image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80',
    category: 'Trends',
    date: 'Feb 12, 2026',
    readTime: '6 min read',
    content: `2026 is shaping up to be an exciting year for African fashion. Here are the key trends we're watching:\n\n**1. Sustainable & Ethical Fashion**\nConsumers are increasingly demanding transparency. Expect more brands to highlight ethical sourcing, fair wages for artisans, and sustainable materials.\n\n**2. Bold Geometric Prints**\nWhile Ankara prints remain popular, geometric patterns inspired by traditional African art are making a strong comeback. Think clean lines, bold shapes, and striking color combinations.\n\n**3. Gender-Fluid Designs**\nThe lines between menswear and womenswear continue to blur. Oversized silhouettes, flowing fabrics, and unisex pieces are becoming mainstream.\n\n**4. Tech-Integrated Fashion**\nSmart fabrics and wearable tech are making their way into African fashion, from UV-protective textiles to temperature-regulating materials.\n\n**5. Revival of Traditional Weaving**\nHandwoven fabrics like Aso-Oke and Kente are being used in modern designs, creating a beautiful bridge between past and present.\n\nAt FAX Collections, we're already incorporating many of these trends into our upcoming collections.`,
  },
  {
    id: 5,
    title: 'The Art of Choosing the Right Fabric',
    excerpt: "Not all fabrics are created equal. Understanding fabric quality and types is essential for building a wardrobe that looks great and lasts for years.",
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80',
    category: 'Guide',
    date: 'Feb 5, 2026',
    readTime: '4 min read',
    content: `Choosing the right fabric is the foundation of great style. Here's your guide to the most common fabrics in African fashion:\n\n**Ankara (African Wax Print)**\n100% cotton with vibrant, colorful patterns. Durable, breathable, and easy to care for. Perfect for everyday wear and casual occasions.\n\n**Guinea Brocade (Atiku)**\nA lightweight, lustrous fabric ideal for Agbadas and Kaftans. It drapes beautifully and is available in a wide range of colors.\n\n**Aso-Oke**\nA handwoven fabric from Yorubaland, typically made from cotton or silk. Highly prized for special occasions due to its craftsmanship and cultural significance.\n\n**Jacquard**\nMachine-woven with intricate patterns. Offers a luxurious feel at a more accessible price point than handwoven alternatives.\n\n**Linen & Cotton Blends**\nIdeal for modern, minimalist African designs. Breathable and comfortable, perfect for warmer weather.\n\n**Pro Tip:** Always feel the fabric before buying. Quality fabric should feel substantial but not stiff, and the colors should be vibrant without any bleeding.`,
  },
  {
    id: 6,
    title: 'Dressing for Owambe: The Complete Guide',
    excerpt: 'Nigerian parties (Owambe) have a dress code all their own. Here\'s everything you need to know about dressing to impress at your next celebration.',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80',
    category: 'Style Guide',
    date: 'Jan 28, 2026',
    readTime: '5 min read',
    content: `Owambe parties are legendary for their extravagance, and the fashion is no exception. Here's how to make sure you stand out (for the right reasons):\n\n**Know the Aso-Ebi:**\nMany Nigerian parties have a specific fabric (Aso-Ebi) chosen by the host. If provided, use this fabric as your base and add your personal touch through tailoring and accessories.\n\n**Go Bold or Go Home:**\nOwambe is not the time for understated fashion. Rich fabrics, intricate embroidery, and statement accessories are expected. An Agbada with detailed stonework is always a winning choice.\n\n**Coordinate, Don't Match:**\nIf attending with a partner, coordinating outfits shows togetherness without being too literal. Use complementary colors or the same fabric styled differently.\n\n**Accessorize Right:**\nFor men: a quality fila (cap), elegant shoes, and maybe a statement watch. Less is more when your outfit already makes a statement.\n\n**Comfort Matters:**\nYou'll likely be dancing, so ensure your outfit allows movement. A well-tailored piece should look sharp AND feel comfortable.\n\nBrowse our Owambe-ready collection at FAX Collections — we've got you covered for every celebration.`,
  },
];

const categories = ['All', ...new Set(blogPosts.map(p => p.category))];

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedPost, setExpandedPost] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [expandedPost]);

  const filtered = selectedCategory === 'All'
    ? blogPosts
    : blogPosts.filter(p => p.category === selectedCategory);

  if (expandedPost) {
    const post = blogPosts.find(p => p.id === expandedPost);
    return (
      <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => setExpandedPost(null)}
            className="text-yellow-400 hover:text-yellow-300 text-sm font-medium mb-6 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to Blog
          </button>

          <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-yellow-400/10 text-yellow-400 text-xs font-semibold rounded-full border border-yellow-400/20">
                {post.category}
              </span>
              <span className="text-zinc-500 text-xs flex items-center gap-1"><FaCalendarAlt className="text-[10px]" /> {post.date}</span>
              <span className="text-zinc-500 text-xs flex items-center gap-1"><FaClock className="text-[10px]" /> {post.readTime}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight mb-6">{post.title}</h1>

            <div className="aspect-video rounded-2xl overflow-hidden mb-8">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
            </div>

            <div className="prose prose-invert max-w-none">
              {post.content.split('\n\n').map((paragraph, i) => (
                <p key={i} className="text-zinc-300 leading-relaxed mb-4 text-[15px]">
                  {paragraph.startsWith('**') ? (
                    <span>
                      <strong className="text-white">{paragraph.match(/\*\*(.*?)\*\*/)?.[1]}</strong>
                      {paragraph.replace(/\*\*.*?\*\*/, '')}
                    </span>
                  ) : paragraph.startsWith('- ') ? (
                    <span className="block pl-4 border-l-2 border-yellow-400/30 text-zinc-400">{paragraph}</span>
                  ) : paragraph}
                </p>
              ))}
            </div>
          </motion.article>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Our <span className="text-yellow-400">Blog</span>
          </h1>
          <p className="text-zinc-400 mt-3 max-w-xl mx-auto text-sm sm:text-base">
            Style guides, fashion insights, and everything African fashion
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-yellow-400 text-black'
                  : 'bg-zinc-800/60 text-zinc-400 hover:bg-zinc-700 hover:text-white border border-zinc-700/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Post */}
        {filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => setExpandedPost(filtered[0].id)}
            className="mb-10 bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden cursor-pointer group hover:border-zinc-700 transition-colors"
          >
            <div className="grid md:grid-cols-2 gap-0">
              <div className="aspect-video md:aspect-auto overflow-hidden">
                <img src={filtered[0].image} alt={filtered[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6 sm:p-8 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-yellow-400/10 text-yellow-400 text-xs font-semibold rounded-full">{filtered[0].category}</span>
                  <span className="text-zinc-500 text-xs">{filtered[0].date}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                  {filtered[0].title}
                </h2>
                <p className="text-zinc-400 text-sm leading-relaxed mb-4">{filtered[0].excerpt}</p>
                <span className="text-yellow-400 text-sm font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                  Read More <FaArrowRight className="text-xs" />
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Blog Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filtered.slice(1).map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              onClick={() => setExpandedPost(post.id)}
              className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden cursor-pointer group hover:border-zinc-700 transition-all hover:shadow-xl"
            >
              <div className="aspect-video overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-2.5 py-0.5 bg-yellow-400/10 text-yellow-400 text-[10px] font-semibold rounded-full">{post.category}</span>
                  <span className="text-zinc-500 text-[11px] flex items-center gap-1"><FaClock className="text-[9px]" /> {post.readTime}</span>
                </div>
                <h3 className="text-white font-bold text-base mb-2 group-hover:text-yellow-400 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2 mb-3">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 text-xs">{post.date}</span>
                  <span className="text-yellow-400 text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read <FaArrowRight className="text-[10px]" />
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
