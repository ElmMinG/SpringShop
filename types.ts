export interface Category {
    categoryId: number;
    categoryName: string;
    icon?: string;
}

export interface Product {
    productId: number;
    productName: string;
    price: number;
    quantity: number;
    sold: number; // For "Top Selling" requirement
    createDate: string; // ISO Date string for "New Arrivals" requirement
    image: string;
    description: string;
    categoryId: number;
}

export interface ProductFilter {
    keyword?: string;
    minPrice?: number;
    maxPrice?: number;
    daysAgo?: number; // 7, 30, etc.
    categoryId?: number; // Optional, if we want to filter within a category
}

// API Response wrapper (matching the structure seen in the Spring Boot PDF)
export interface ApiResponse<T> {
    status: boolean;
    message: string;
    body: T;
}

export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}