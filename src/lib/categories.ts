import { Category } from './types';

export const categories: Category[] = [
  {
    id: 'cat-women',
    name: "Women's Fashion",
    slug: 'women',
    image: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=600',
    description: 'Latest trends in dresses, tops, ethnic wear, footwear & more.',
  },
  {
    id: 'cat-men',
    name: "Men's Fashion",
    slug: 'men',
    image: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=600',
    description: 'Shirts, t-shirts, jeans, formal wear & accessories.',
  },
  {
    id: 'cat-kids',
    name: 'Kids',
    slug: 'kids',
    image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600',
    description: 'Apparel, toys, and essentials for kids of all ages.',
  },
  {
    id: 'cat-beauty',
    name: 'Beauty',
    slug: 'beauty',
    image: 'https://images.unsplash.com/photo-1522335789203-aaa6e7a83a25?w=600',
    description: 'Makeup, skincare, fragrances & wellness essentials.',
  },
  {
    id: 'cat-home',
    name: 'Home & Living',
    slug: 'home',
    image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600',
    description: 'Decor, bedding, kitchenware and more for your home.',
  },
  {
    id: 'cat-footwear',
    name: 'Footwear',
    slug: 'footwear',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
    description: 'Sneakers, heels, casual & formal shoes.',
  },
  {
    id: 'cat-accessories',
    name: 'Accessories',
    slug: 'accessories',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
    description: 'Watches, bags, sunglasses, jewelry & more.',
  },
  {
    id: 'cat-sports',
    name: 'Sports & Fitness',
    slug: 'sports',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600',
    description: 'Activewear, gear and equipment for every sport.',
  },
];

export const getCategoryById = (id: string) =>
  categories.find((c) => c.id === id);

export const getCategoryBySlug = (slug: string) =>
  categories.find((c) => c.slug === slug);
