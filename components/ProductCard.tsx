import React from 'react';
import { Product } from '../types';
import { ShoppingCart, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  tag?: string; // Optional tag like "New" or "Top"
  tagColor?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, tag, tagColor }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group border border-gray-100">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.productName} 
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {tag && (
          <span className={`absolute top-2 left-2 ${tagColor || 'bg-blue-600'} text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm`}>
            {tag}
          </span>
        )}
        <div className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
            <Star size={16} className="text-yellow-500 fill-yellow-500" />
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-gray-800 line-clamp-1 text-lg">{product.productName}</h3>
        </div>
        <p className="text-gray-500 text-sm line-clamp-2 mb-3 h-10">{product.description}</p>
        
        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-xl font-bold text-blue-600">${product.price}</span>
            <div className="text-xs text-gray-400 mt-0.5">{product.sold} sold</div>
          </div>
          
          <button className="bg-gray-900 hover:bg-gray-700 text-white p-2 rounded-lg transition-colors">
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;