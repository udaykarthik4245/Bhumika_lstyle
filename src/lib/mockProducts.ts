import { Product } from './types';
import { categories } from './categories';

// Deterministic pseudo-random so the catalog is stable across renders
// without relying on Math.random (which we want to avoid for SSR/hydration safety).
function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
}

const productTemplates: Record<string, { name: string; brand: string }[]> = {
  'cat-women': [
    { name: 'Floral Print A-Line Dress', brand: 'Allen Solly' },
    { name: 'Embroidered Kurta Set', brand: 'Biba' },
    { name: 'Solid Slim Fit Top', brand: 'Forever New' },
    { name: 'High-Rise Skinny Jeans', brand: 'Levis' },
    { name: 'Banarasi Silk Saree', brand: 'Manyavar' },
    { name: 'Ruffled Maxi Dress', brand: 'Vero Moda' },
    { name: 'Cotton Casual Shirt', brand: 'Marks & Spencer' },
    { name: 'Anarkali Suit Set', brand: 'Global Desi' },
    { name: 'Pleated Midi Skirt', brand: 'Mango' },
    { name: 'Knitted Sweater', brand: 'H&M' },
  ],
  'cat-men': [
    { name: 'Classic Fit Oxford Shirt', brand: 'Louis Philippe' },
    { name: 'Slim Fit Chinos', brand: 'Allen Solly' },
    { name: 'Printed Cotton T-Shirt', brand: 'Jack & Jones' },
    { name: 'Formal Blazer', brand: 'Van Heusen' },
    { name: 'Stretchable Denim Jeans', brand: 'Pepe Jeans' },
    { name: 'Henley Neck T-Shirt', brand: 'Roadster' },
    { name: 'Linen Casual Shirt', brand: 'Indian Terrain' },
    { name: 'Polo Neck T-Shirt', brand: 'US Polo Assn' },
    { name: 'Bomber Jacket', brand: 'Tommy Hilfiger' },
    { name: 'Cargo Joggers', brand: 'Puma' },
  ],
  'cat-kids': [
    { name: 'Cartoon Print T-Shirt', brand: 'Mothercare' },
    { name: 'Denim Dungaree', brand: 'H&M Kids' },
    { name: 'Frock with Bow', brand: 'Babyhug' },
    { name: 'Boys Track Pants', brand: 'Carter\'s' },
    { name: 'Plush Teddy Bear', brand: 'Hamleys' },
    { name: 'Building Blocks Set', brand: 'Lego' },
    { name: 'Sneakers for Kids', brand: 'Skechers' },
    { name: 'School Backpack', brand: 'American Tourister' },
  ],
  'cat-beauty': [
    { name: 'Matte Lipstick', brand: 'Maybelline' },
    { name: 'Hydrating Face Cream', brand: 'Olay' },
    { name: 'Vitamin C Serum', brand: 'The Ordinary' },
    { name: 'Eau de Parfum', brand: 'Calvin Klein' },
    { name: 'Eyeshadow Palette', brand: 'MAC' },
    { name: 'Foundation Stick', brand: 'L\'Oreal' },
    { name: 'Sunscreen SPF 50', brand: 'Neutrogena' },
    { name: 'Hair Repair Mask', brand: 'TRESemmé' },
    { name: 'Charcoal Face Wash', brand: 'Garnier' },
    { name: 'Body Lotion', brand: 'Nivea' },
  ],
  'cat-home': [
    { name: 'Cotton Bed Sheet Set', brand: 'Bombay Dyeing' },
    { name: 'Decorative Throw Pillow', brand: 'D\'Decor' },
    { name: 'Ceramic Dinner Set', brand: 'Corelle' },
    { name: 'Wall Art Print', brand: 'Chumbak' },
    { name: 'Aromatic Candle', brand: 'Yankee Candle' },
    { name: 'Storage Basket', brand: 'IKEA' },
    { name: 'LED Table Lamp', brand: 'Philips' },
    { name: 'Microfiber Curtains', brand: 'Home Centre' },
  ],
  'cat-footwear': [
    { name: 'Running Sneakers', brand: 'Nike' },
    { name: 'Leather Formal Shoes', brand: 'Clarks' },
    { name: 'Block Heel Sandals', brand: 'Catwalk' },
    { name: 'Casual Loafers', brand: 'Hush Puppies' },
    { name: 'Sports Trainers', brand: 'Adidas' },
    { name: 'Chelsea Boots', brand: 'Bata' },
    { name: 'Flip Flops', brand: 'Crocs' },
    { name: 'Ballerina Flats', brand: 'Mochi' },
  ],
  'cat-accessories': [
    { name: 'Analog Wrist Watch', brand: 'Titan' },
    { name: 'Leather Handbag', brand: 'Caprese' },
    { name: 'Aviator Sunglasses', brand: 'Ray-Ban' },
    { name: 'Beaded Necklace', brand: 'Accessorize' },
    { name: 'Silk Scarf', brand: 'Forever 21' },
    { name: 'Leather Belt', brand: 'Hidesign' },
    { name: 'Travel Wallet', brand: 'Wildcraft' },
    { name: 'Fashion Earrings', brand: 'Ayesha' },
  ],
  'cat-sports': [
    { name: 'Performance Track Pants', brand: 'Adidas' },
    { name: 'Yoga Mat', brand: 'Reebok' },
    { name: 'Compression Tee', brand: 'Under Armour' },
    { name: 'Adjustable Dumbbells', brand: 'Decathlon' },
    { name: 'Cricket Bat', brand: 'SG' },
    { name: 'Football', brand: 'Nivia' },
    { name: 'Cycling Helmet', brand: 'Btwin' },
    { name: 'Sports Water Bottle', brand: 'Milton' },
  ],
};

const sampleReviews = [
  {
    user: 'Aarav S.',
    title: 'Excellent quality',
    comment: 'Loved the fabric and the fit. True to size and great value for money.',
  },
  {
    user: 'Priya K.',
    title: 'Worth every rupee',
    comment: 'Color is exactly as shown. Delivery was quick. Highly recommended!',
  },
  {
    user: 'Rohit M.',
    title: 'Decent product',
    comment: 'Quality is good but stitching could be better. Overall satisfied.',
  },
  {
    user: 'Neha P.',
    title: 'Looks beautiful',
    comment: 'Got compliments at the party. Would buy again!',
  },
];

const productImagePool: Record<string, string[]> = {
  'cat-women': [
    'https://images.unsplash.com/photo-1495121605193-b116b5b9c5fe?w=600',
    'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600',
    'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600',
  ],
  'cat-men': [
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600',
    'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=600',
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600',
  ],
  'cat-kids': [
    'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600',
    'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600',
  ],
  'cat-beauty': [
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600',
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600',
  ],
  'cat-home': [
    'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600',
  ],
  'cat-footwear': [
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600',
  ],
  'cat-accessories': [
    'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600',
    'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600',
  ],
  'cat-sports': [
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600',
    'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600',
  ],
};

function generateProducts(): Product[] {
  const products: Product[] = [];
  const random = seededRandom(42);

  let idCounter = 1;
  for (const cat of categories) {
    const templates = productTemplates[cat.id] || [];
    const imagePool = productImagePool[cat.id] || ['https://placehold.co/600x600'];
    // Generate ~60 products per category to land near 500 total.
    const totalForCat = Math.min(60, Math.max(40, Math.floor(500 / categories.length)));

    for (let i = 0; i < totalForCat; i++) {
      const template = templates[i % templates.length];
      const variant = Math.floor(i / templates.length) + 1;
      const mrp = Math.floor(random() * 4000) + 500;
      const discount = Math.floor(random() * 50) + 10; // 10–60%
      const price = Math.floor(mrp * (1 - discount / 100));
      const rating = +(3.5 + random() * 1.5).toFixed(1);
      const ratingCount = Math.floor(random() * 2000) + 50;
      const stock = Math.floor(random() * 100);

      const reviews = sampleReviews.map((r, idx) => ({
        id: `rev-${idCounter}-${idx}`,
        user: r.user,
        rating: +(3 + random() * 2).toFixed(1),
        title: r.title,
        comment: r.comment,
        date: `2026-0${(idx % 5) + 1}-15`,
      }));

      const images = [
        imagePool[i % imagePool.length],
        imagePool[(i + 1) % imagePool.length],
        imagePool[(i + 2) % imagePool.length],
      ];

      const id = `prd-${idCounter++}`;
      products.push({
        id,
        name: variant > 1 ? `${template.name} (${variant})` : template.name,
        slug: id,
        brand: template.brand,
        categoryId: cat.id,
        price,
        mrp,
        rating,
        ratingCount,
        stock,
        images,
        description: `${template.name} from ${template.brand}. Crafted with premium materials, designed for everyday comfort and lasting style. A perfect addition to your wardrobe.`,
        specifications: {
          Brand: template.brand,
          Material: 'Premium quality',
          Color: ['Black', 'Navy', 'Maroon', 'Beige', 'Olive'][i % 5],
          'Care Instructions': 'Machine wash cold, tumble dry low',
          Origin: 'Made in India',
          Warranty: '30-day return policy',
        },
        reviews,
        tags: [cat.slug, template.brand.toLowerCase().replace(/\s+/g, '-')],
        createdAt: '2026-01-15',
      });
    }
  }

  return products;
}

export const products: Product[] = generateProducts();

export const getProductById = (id: string) =>
  products.find((p) => p.id === id);

export const getProductsByCategory = (categoryId: string) =>
  products.filter((p) => p.categoryId === categoryId);

export const searchProducts = (query: string): Product[] => {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return products
    .filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q))
    )
    .slice(0, 50);
};
