import { useState, useEffect } from 'react';
import { marketplaceService } from '../services/marketplaceService';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import AddItemModal from '../components/modals/AddItemModal';
import { ShoppingBag, Search, Filter, Tag, DollarSign, Clock, User as UserIcon, Trash2, Video, Play, Store } from 'lucide-react';
import { notify, confirmAction } from '../utils/alerts';

export default function Marketplace() {
    const { user } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');

    const fetchItems = async () => {
        try {
            setLoading(true);
            const data = await marketplaceService.getAllItems();
            setItems(data);
        } catch (err) {
            console.error(err);
            notify.error('Failed to load marketplace');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleDelete = async (itemId) => {
        const result = await confirmAction({
            title: 'Delete Listing?',
            text: 'This action cannot be undone.',
            confirmText: 'Yes, Delete'
        });

        if (result.isConfirmed) {
            try {
                await marketplaceService.deleteItem(itemId);
                notify.success('Listing removed');
                fetchItems();
            } catch (err) {
                notify.error('Failed to remove listing');
            }
        }
    };

    const categories = ['All', 'Electronics', 'Furniture', 'Books', 'Clothing', 'General'];

    const filteredItems = items.filter(item => {
        const matchesSearch = item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-10">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center">
                        <Store className="w-10 h-10 text-indigo-600 mr-4" />
                        Society Marketplace
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium italic">"Intelligent commerce within your community."</p>
                </div>
                <Button
                    onClick={() => setIsModalOpen(true)}
                    className="rounded-3xl bg-indigo-600 px-8 py-6 h-auto font-black tracking-widest shadow-2xl shadow-indigo-200 uppercase text-xs"
                >
                    <ShoppingBag className="w-4 h-4 mr-2" /> List New Item
                </Button>
            </header>

            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 group-focus-within:text-indigo-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search items for sale..."
                        className="w-full h-16 pl-16 pr-6 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-slate-700 placeholder:text-slate-300 transition-all"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-8 h-16 rounded-3xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap border shadow-xl ${selectedCategory === cat
                                ? 'bg-slate-900 text-white border-slate-900 shadow-slate-900/20'
                                : 'bg-white text-slate-400 border-slate-100 shadow-slate-200/40 hover:bg-slate-50'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="py-40 flex flex-col items-center justify-center opacity-40">
                    <div className="rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
                    <p className="font-black text-[10px] uppercase tracking-[0.3em]">Loading Marketplace...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredItems.map(item => (
                        <ItemCard key={item.itemId} item={item} currentUser={user} onDelete={() => handleDelete(item.itemId)} />
                    ))}
                    {filteredItems.length === 0 && (
                        <div className="col-span-full py-40 text-center opacity-30">
                            <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-slate-300" />
                            <p className="font-black uppercase tracking-widest">No listings found</p>
                        </div>
                    )}
                </div>
            )}

            <AddItemModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchItems}
            />
        </div>
    );
}

function ItemCard({ item, currentUser, onDelete }) {
    const isOwner = currentUser.id === item.seller?.id;
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);

    return (
        <article className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden relative">
            <div className="relative h-64 overflow-hidden bg-slate-100">
                {item.videoUrl && isVideoPlaying ? (
                    <video
                        src={`http://localhost:8080${item.videoUrl}`}
                        autoPlay
                        controls
                        className="w-full h-full object-cover"
                        onEnded={() => setIsVideoPlaying(false)}
                    />
                ) : (
                    <img
                        src={`http://localhost:8080${item.imageUrl}`}
                        alt={item.itemName}
                        className="w-full h-full object-cover"
                    />
                )}

                <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-xl text-[8px] font-black uppercase tracking-widest text-indigo-600 shadow-sm">
                        {item.category}
                    </span>
                    {item.negotiable && (
                        <span className="px-4 py-1.5 bg-emerald-500 text-white rounded-xl text-[8px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                            Negotiable
                        </span>
                    )}
                </div>

                {item.videoUrl && !isVideoPlaying && (
                    <button
                        onClick={() => setIsVideoPlaying(true)}
                        className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors group"
                    >
                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-2xl">
                            <Play className="w-6 h-6 text-indigo-600 fill-indigo-600 ml-1" />
                        </div>
                    </button>
                )}

                {isOwner && (
                    <button
                        onClick={onDelete}
                        className="absolute top-4 right-4 p-3 bg-rose-500 text-white rounded-2xl shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-rose-600"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>

            <div className="p-8 space-y-6">
                <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight truncate uppercase">{item.itemName}</h3>
                    <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
                        <UserIcon className="w-3 h-3 mr-1.5 text-indigo-500" />
                        By {item.seller?.fullName}
                        <span className="mx-2 opacity-30">•</span>
                        <Clock className="w-3 h-3 mr-1.5" />
                        {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                </div>

                <p className="text-slate-500 text-sm font-medium line-clamp-2 leading-relaxed italic opacity-80">
                    "{item.description}"
                </p>

                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div>
                        <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Asking Price</p>
                        <div className="flex items-baseline">
                            <span className="text-2xl font-black text-slate-900 tracking-tighter">₹{item.minPrice}</span>
                            {item.maxPrice && (
                                <span className="ml-2 text-xs font-bold text-slate-400 line-through opacity-50">₹{item.maxPrice}</span>
                            )}
                        </div>
                    </div>
                    <button className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100/20">
                        <ShoppingBag className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </article>
    );
}
