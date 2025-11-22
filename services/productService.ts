import { Category, Product, ApiResponse, ProductFilter } from '../types';
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from './mockData';

// SIMULATING API CALLS
// In a real scenario, these would be fetch() or axios calls to your Spring Boot backend.

export const ProductService = {
  // Requirement 1: Display all categories
  getAllCategories: async (): Promise<ApiResponse<Category[]>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: true,
          message: "Success",
          body: MOCK_CATEGORIES
        });
      }, 500);
    });
  },

  // Requirement 2: Display products by category
  getProductsByCategory: async (categoryId: number): Promise<ApiResponse<Product[]>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = MOCK_PRODUCTS.filter(p => p.categoryId === categoryId);
        resolve({
          status: true,
          message: "Success",
          body: filtered
        });
      }, 500);
    });
  },

  // Requirement 3: Display 10 best-selling products
  getTopSellingProducts: async (): Promise<ApiResponse<Product[]>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Sort by sold count descending
        const sorted = [...MOCK_PRODUCTS].sort((a, b) => b.sold - a.sold);
        const top10 = sorted.slice(0, 10);
        resolve({
          status: true,
          message: "Success",
          body: top10
        });
      }, 500);
    });
  },

  // Requirement 4: Display 10 newest products (<= 7 days)
  getNewArrivals: async (): Promise<ApiResponse<Product[]>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recent = MOCK_PRODUCTS.filter(p => {
          const pDate = new Date(p.createDate);
          return pDate >= sevenDaysAgo;
        });

        // Sort by date descending (newest first)
        recent.sort((a, b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime());
        
        resolve({
          status: true,
          message: "Success",
          body: recent.slice(0, 10)
        });
      }, 500);
    });
  },

  // Requirement: Filter/Search products
  searchProducts: async (filter: ProductFilter): Promise<ApiResponse<Product[]>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let results = [...MOCK_PRODUCTS];

        // Filter by Category
        if (filter.categoryId) {
          results = results.filter(p => p.categoryId === filter.categoryId);
        }

        // Filter by Keyword (Name or Description)
        if (filter.keyword) {
          const lowerKeyword = filter.keyword.toLowerCase();
          results = results.filter(p => 
            p.productName.toLowerCase().includes(lowerKeyword) || 
            p.description.toLowerCase().includes(lowerKeyword)
          );
        }

        // Filter by Price
        if (filter.minPrice !== undefined && !isNaN(filter.minPrice)) {
          results = results.filter(p => p.price >= filter.minPrice!);
        }
        if (filter.maxPrice !== undefined && !isNaN(filter.maxPrice)) {
          results = results.filter(p => p.price <= filter.maxPrice!);
        }

        // Filter by Date (Created within X days)
        if (filter.daysAgo !== undefined) {
          const cutoffDate = new Date();
          cutoffDate.setDate(cutoffDate.getDate() - filter.daysAgo);
          // Reset time part for accurate day comparison
          cutoffDate.setHours(0, 0, 0, 0);
          
          results = results.filter(p => {
            const pDate = new Date(p.createDate);
            return pDate >= cutoffDate;
          });
        }

        resolve({
          status: true,
          message: "Success",
          body: results
        });
      }, 500);
    });
  }
};