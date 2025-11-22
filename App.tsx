import React, { useState, useEffect } from 'react';
import { ProductService } from './services/productService';
import { Category, Product, ProductFilter } from './types';
import ProductCard from './components/ProductCard';
import Chatbot from './components/Chatbot';
import { ShoppingBag, Menu, X, Loader2, TrendingUp, Clock, Grid, Search, Filter, SlidersHorizontal } from 'lucide-react';

// Define the views available in the simple router
type ViewState = 'dashboard' | 'category' | 'search';

const App: React.FC = () => {
    // -- State Management --
    const [view, setView] = useState<ViewState>('dashboard');
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Data States
    const [categories, setCategories] = useState<Category[]>([]);
    const [topSelling, setTopSelling] = useState<Product[]>([]);
    const [newArrivals, setNewArrivals] = useState<Product[]>([]);
    const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
    const [searchResults, setSearchResults] = useState<Product[]>([]);

    // Global Product List for Chatbot context
    const [allProducts, setAllProducts] = useState<Product[]>([]);

    // Filter States
    const [filterKeyword, setFilterKeyword] = useState('');
    const [filterMinPrice, setFilterMinPrice] = useState('');
    const [filterMaxPrice, setFilterMaxPrice] = useState('');
    const [filterDaysAgo, setFilterDaysAgo] = useState<number | undefined>(undefined);

    // Loading States
    const [loading, setLoading] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(false);

    // -- Initial Data Load --
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Run APIs in parallel
                const [catsRes, topRes, newRes] = await Promise.all([
                    ProductService.getAllCategories(),
                    ProductService.getTopSellingProducts(),
                    ProductService.getNewArrivals()
                ]);

                setCategories(catsRes.body);
                setTopSelling(topRes.body);
                setNewArrivals(newRes.body);

                // Fetch all products once for the chatbot context (simulating getting the catalog)
                // We can perform an empty search to get all items from our mock service
                const allRes = await ProductService.searchProducts({});
                setAllProducts(allRes.body);

            } catch (error) {
                console.error("Failed to fetch initial data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // -- Event Handlers --

    const handleCategoryClick = async (category: Category) => {
        setView('category');
        setSelectedCategory(category);
        setIsSidebarOpen(false); // Close sidebar on mobile
        setLoadingProducts(true);

        // Reset filters when changing category directly
        setFilterKeyword('');
        setFilterMinPrice('');
        setFilterMaxPrice('');
        setFilterDaysAgo(undefined);

        try {
            const res = await ProductService.getProductsByCategory(category.categoryId);
            setCategoryProducts(res.body);
        } catch (error) {
            console.error("Failed to fetch category products", error);
        } finally {
            setLoadingProducts(false);
        }
    };

    const handleApplyFilters = async () => {
        setView('search');
        setIsSidebarOpen(false);
        setLoadingProducts(true);

        const filter: ProductFilter = {
            keyword: filterKeyword || undefined,
            minPrice: filterMinPrice ? Number(filterMinPrice) : undefined,
            maxPrice: filterMaxPrice ? Number(filterMaxPrice) : undefined,
            daysAgo: filterDaysAgo,
            // If we are in category view or explicitly want to filter by selected category, we could pass it.
            // For this demo, let's assume filters apply globally unless a category was already selected
            categoryId: selectedCategory?.categoryId
        };

        try {
            const res = await ProductService.searchProducts(filter);
            setSearchResults(res.body);
        } catch (error) {
            console.error("Failed to filter products", error);
        } finally {
            setLoadingProducts(false);
        }
    };

    const handleGoHome = () => {
        setView('dashboard');
        setSelectedCategory(null);
        setIsSidebarOpen(false);
        // Clear filters
        setFilterKeyword('');
        setFilterMinPrice('');
        setFilterMaxPrice('');
        setFilterDaysAgo(undefined);
    };

    // -- Render Helpers --

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 size={48} className="animate-spin text-blue-600" />
                    <p className="text-gray-500 font-medium">Loading Spring Boot Demo...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            {/* --- Header --- */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
                        >
                            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>

                        <div
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={handleGoHome}
                        >
                            <div className="bg-blue-600 p-2 rounded-lg text-white">
                                <ShoppingBag size={20} />
                            </div>
                            <span className="font-bold text-xl text-gray-900 hidden sm:block">SpringShop</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500 hidden sm:block">API Demo Project</span>
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold border border-gray-300">
                            U
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 max-w-7xl mx-auto w-full">

                {/* --- Sidebar (Categories + Filters) --- */}
                <aside className={`
          fixed inset-y-0 left-0 z-20 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-auto lg:min-h-[calc(100vh-4rem)] overflow-y-auto
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
                    <div className="p-6 space-y-8">

                        {/* Navigation */}
                        <div>
                            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Browse</h2>
                            <nav className="space-y-1">
                                <button
                                    onClick={handleGoHome}
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                                >
                                    <Grid size={18} />
                                    Dashboard
                                </button>

                                {categories.map(cat => (
                                    <button
                                        key={cat.categoryId}
                                        onClick={() => handleCategoryClick(cat)}
                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory?.categoryId === cat.categoryId && view === 'category' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                                    >
                                        <span>{cat.icon}</span>
                                        {cat.categoryName}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Filters */}
                        <div>
                            <div className="flex items-center gap-2 mb-4 text-gray-900">
                                <SlidersHorizontal size={18} />
                                <h2 className="font-semibold">Filter Products</h2>
                            </div>

                            <div className="space-y-4">
                                {/* Keyword */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Keyword</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={filterKeyword}
                                            onChange={(e) => setFilterKeyword(e.target.value)}
                                            placeholder="Search..."
                                            className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
                                    </div>
                                </div>

                                {/* Price Range */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Price Range ($)</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={filterMinPrice}
                                            onChange={(e) => setFilterMinPrice(e.target.value)}
                                            placeholder="Min"
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <span className="text-gray-400">-</span>
                                        <input
                                            type="number"
                                            value={filterMaxPrice}
                                            onChange={(e) => setFilterMaxPrice(e.target.value)}
                                            placeholder="Max"
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Date Created */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Date Created</label>
                                    <select
                                        value={filterDaysAgo === undefined ? 'all' : filterDaysAgo}
                                        onChange={(e) => setFilterDaysAgo(e.target.value === 'all' ? undefined : Number(e.target.value))}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                    >
                                        <option value="all">All Time</option>
                                        <option value="7">Last 7 Days</option>
                                        <option value="30">Last 30 Days</option>
                                    </select>
                                </div>

                                <button
                                    onClick={handleApplyFilters}
                                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors mt-2"
                                >
                                    <Filter size={16} />
                                    Apply Filters
                                </button>
                            </div>
                        </div>

                    </div>
                </aside>

                {/* --- Main Content --- */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">

                    {/* Overlay for mobile sidebar */}
                    {isSidebarOpen && (
                        <div
                            className="fixed inset-0 bg-black/20 z-10 lg:hidden"
                            onClick={() => setIsSidebarOpen(false)}
                        />
                    )}

                    {view === 'dashboard' && (
                        <div className="space-y-12">
                            {/* Section: Top Selling (Req 3) */}
                            <section>
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                                        <TrendingUp size={24} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">Best Selling Products</h2>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {topSelling.map(p => (
                                        <ProductCard
                                            key={p.productId}
                                            product={p}
                                            tag={`#${topSelling.indexOf(p) + 1} Best Seller`}
                                            tagColor="bg-orange-500"
                                        />
                                    ))}
                                </div>
                            </section>

                            {/* Section: New Arrivals (Req 4) */}
                            <section>
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                                        <Clock size={24} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">New Arrivals (Last 7 Days)</h2>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {newArrivals.length > 0 ? (
                                        newArrivals.map(p => (
                                            <ProductCard
                                                key={p.productId}
                                                product={p}
                                                tag="New"
                                                tagColor="bg-green-500"
                                            />
                                        ))
                                    ) : (
                                        <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                                            <p className="text-gray-500">No products added in the last 7 days.</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>
                    )}

                    {view === 'category' && (
                        /* Section: Products by Category (Req 2) */
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <span className="text-4xl">{selectedCategory?.icon}</span>
                                    <div>
                                        <h2 className="text-3xl font-bold text-gray-900">{selectedCategory?.categoryName}</h2>
                                        <p className="text-gray-500">Browse all products in this category</p>
                                    </div>
                                </div>
                            </div>

                            {loadingProducts ? (
                                <div className="flex justify-center py-20">
                                    <Loader2 size={32} className="animate-spin text-blue-600" />
                                </div>
                            ) : categoryProducts.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {categoryProducts.map(p => (
                                        <ProductCard key={p.productId} product={p} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
                                    <p className="text-gray-500 text-lg">No products found in this category.</p>
                                    <button
                                        onClick={handleGoHome}
                                        className="mt-4 text-blue-600 font-medium hover:underline"
                                    >
                                        Return to Dashboard
                                    </button>
                                </div>
                            )}
                        </section>
                    )}

                    {view === 'search' && (
                        /* Section: Search Results (Req: Filter Products) */
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                        <Search size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">Search Results</h2>
                                        <p className="text-gray-500">
                                            {loadingProducts ? 'Searching...' : `Found ${searchResults.length} products matching your filters`}
                                        </p>
                                    </div>
                                </div>

                                {selectedCategory && (
                                    <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                                        <span>Category:</span>
                                        <span className="font-medium">{selectedCategory.categoryName}</span>
                                        <button
                                            onClick={() => {
                                                setSelectedCategory(null);
                                                // Re-trigger search without category would require state update + effect or direct call
                                                // For simplicity, simple UI indication here
                                            }}
                                            className="hover:text-red-500"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {loadingProducts ? (
                                <div className="flex justify-center py-20">
                                    <Loader2 size={32} className="animate-spin text-blue-600" />
                                </div>
                            ) : searchResults.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {searchResults.map(p => (
                                        <ProductCard key={p.productId} product={p} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
                                    <div className="inline-flex p-4 bg-gray-50 rounded-full mb-4 text-gray-400">
                                        <Filter size={32} />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900">No matches found</h3>
                                    <p className="text-gray-500 mt-2">Try adjusting your filters or search keyword.</p>
                                    <button
                                        onClick={() => {
                                            setFilterKeyword('');
                                            setFilterMinPrice('');
                                            setFilterMaxPrice('');
                                            setFilterDaysAgo(undefined);
                                            handleGoHome();
                                        }}
                                        className="mt-6 text-blue-600 font-medium hover:underline"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            )}
                        </section>
                    )}
                </main>
            </div>

            {/* Smart AI Chatbot */}
            <Chatbot products={allProducts} />
        </div>
    );
};

export default App;