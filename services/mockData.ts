import { Category, Product } from '../types';

export const MOCK_CATEGORIES: Category[] = [
  { categoryId: 1, categoryName: "Electronics", icon: "💻" },
  { categoryId: 2, categoryName: "Fashion", icon: "👕" },
  { categoryId: 3, categoryName: "Home & Garden", icon: "🏡" },
  { categoryId: 4, categoryName: "Books", icon: "📚" },
];

// Helper to get a date X days ago
const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

export const MOCK_PRODUCTS: Product[] = [
  // Electronics (Cat 1)
  { productId: 1, productName: "Smartphone X", price: 999, quantity: 50, sold: 1200, createDate: daysAgo(10), image: "https://picsum.photos/300/300?random=1", description: "Latest smartphone", categoryId: 1 },
  { productId: 2, productName: "Laptop Pro", price: 1499, quantity: 20, sold: 500, createDate: daysAgo(2), image: "https://picsum.photos/300/300?random=2", description: "High performance laptop", categoryId: 1 },
  { productId: 3, productName: "Wireless Earbuds", price: 199, quantity: 100, sold: 3000, createDate: daysAgo(60), image: "https://picsum.photos/300/300?random=3", description: "Noise cancelling", categoryId: 1 },
  
  // Fashion (Cat 2)
  { productId: 4, productName: "Classic T-Shirt", price: 29, quantity: 200, sold: 5000, createDate: daysAgo(5), image: "https://picsum.photos/300/300?random=4", description: "100% Cotton", categoryId: 2 },
  { productId: 5, productName: "Denim Jeans", price: 59, quantity: 150, sold: 800, createDate: daysAgo(20), image: "https://picsum.photos/300/300?random=5", description: "Slim fit", categoryId: 2 },
  { productId: 6, productName: "Running Shoes", price: 89, quantity: 80, sold: 1500, createDate: daysAgo(1), image: "https://picsum.photos/300/300?random=6", description: "For marathon runners", categoryId: 2 },

  // Home (Cat 3)
  { productId: 7, productName: "Coffee Maker", price: 49, quantity: 30, sold: 200, createDate: daysAgo(3), image: "https://picsum.photos/300/300?random=7", description: "Brew the best coffee", categoryId: 3 },
  { productId: 8, productName: "Desk Lamp", price: 25, quantity: 60, sold: 150, createDate: daysAgo(100), image: "https://picsum.photos/300/300?random=8", description: "LED Lamp", categoryId: 3 },

  // Books (Cat 4)
  { productId: 9, productName: "Spring Boot in Action", price: 45, quantity: 40, sold: 600, createDate: daysAgo(4), image: "https://picsum.photos/300/300?random=9", description: "Master Spring Boot", categoryId: 4 },
  { productId: 10, productName: "React for Beginners", price: 35, quantity: 55, sold: 900, createDate: daysAgo(3), image: "https://picsum.photos/300/300?random=10", description: "Learn React fast", categoryId: 4 },
  
  // Extra for sorting logic
  { productId: 11, productName: "Old Phone", price: 100, quantity: 10, sold: 10, createDate: daysAgo(365), image: "https://picsum.photos/300/300?random=11", description: "Vintage", categoryId: 1 },
  { productId: 12, productName: "Trendy Hat", price: 20, quantity: 500, sold: 2000, createDate: daysAgo(0), image: "https://picsum.photos/300/300?random=12", description: "Create 0 days ago", categoryId: 2 },
];