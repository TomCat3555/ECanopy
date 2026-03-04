import { useState } from 'react';
import { marketplaceService } from '../../services/marketplaceService';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { notify } from '../../utils/alerts';
import { X, Upload, ShoppingBag, DollarSign, Tag, Video, Image as ImageIcon } from 'lucide-react';

export default function AddItemModal({ isOpen, onClose, onSuccess }) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        itemName: '',
        description: '',
        minPrice: '',
        maxPrice: '',
        negotiable: false,
        category: 'General',
        image: null,
        video: null
    });

    const [previews, setPreviews] = useState({
        image: null,
        video: null
    });

    if (!isOpen) return null;

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, [type]: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews(prev => ({ ...prev, [type]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append('itemName', formData.itemName);
        data.append('description', formData.description);
        data.append('minPrice', formData.minPrice);
        data.append('maxPrice', formData.maxPrice);
        data.append('negotiable', formData.negotiable);
        data.append('category', formData.category);
        data.append('sellerId', user.id);
        data.append('image', formData.image);
        if (formData.video) {
            data.append('video', formData.video);
        }

        try {
            await marketplaceService.uploadItem(data);
            notify.success('Item listed successfully!');
            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            notify.error('Failed to list item');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden">
                <header className="px-10 py-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100">
                            <ShoppingBag className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">List New Item</h3>
                            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Resident-to-Resident Marketplace</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors text-slate-400">
                        <X className="w-6 h-6" />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="p-10 space-y-8 overflow-y-auto max-h-[70vh] scrollbar-hide">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Input
                            label="Product Title *"
                            placeholder="e.g. Wooden Dining Table"
                            value={formData.itemName}
                            onChange={e => setFormData({ ...formData, itemName: e.target.value })}
                            required
                        />
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block pl-1">Product Category</label>
                            <select
                                className="w-full h-14 bg-slate-50 rounded-2xl ring-1 ring-slate-100 focus:ring-2 focus:ring-indigo-600 font-bold px-4 outline-none transition-all"
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option>Electronics</option>
                                <option>Furniture</option>
                                <option>Books</option>
                                <option>Clothing</option>
                                <option>General</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Description *</label>
                        <textarea
                            className="w-full p-4 bg-slate-50 rounded-3xl ring-1 ring-slate-100 focus:ring-2 focus:ring-indigo-600 font-medium text-slate-700 outline-none transition-all h-32 resize-none"
                            placeholder="Describe the condition and details of the item..."
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Input
                            label="Minimum Price (₹) *"
                            type="number"
                            placeholder="0.00"
                            value={formData.minPrice}
                            onChange={e => setFormData({ ...formData, minPrice: e.target.value })}
                            required
                        />
                        <Input
                            label="Maximum Price (₹)"
                            type="number"
                            placeholder="0.00"
                            value={formData.maxPrice}
                            onChange={e => setFormData({ ...formData, maxPrice: e.target.value })}
                        />
                    </div>

                    <div className="flex items-center space-x-6 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        <div className="flex-1">
                            <h4 className="font-black text-slate-900 text-sm">Negotiable Pricing</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Allow residents to haggle</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, negotiable: !formData.negotiable })}
                            className={`w-14 h-8 rounded-full relative transition-colors duration-500 ${formData.negotiable ? 'bg-indigo-600' : 'bg-slate-300'}`}
                        >
                            <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all duration-500 shadow-lg ${formData.negotiable ? 'left-7' : 'left-1'}`}></div>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Display Image *</label>
                            <div className="relative h-48 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden group">
                                {previews.image ? (
                                    <img src={previews.image} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <>
                                        <ImageIcon className="w-10 h-10 text-slate-300 mb-2" />
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Visual</span>
                                    </>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={e => handleFileChange(e, 'image')}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    required={!previews.image}
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Demo Video (Optional)</label>
                            <div className="relative h-48 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden group">
                                {previews.video ? (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-950">
                                        <Video className="w-10 h-10 text-white animate-pulse" />
                                    </div>
                                ) : (
                                    <>
                                        <Video className="w-10 h-10 text-slate-300 mb-2" />
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Footage</span>
                                    </>
                                )}
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={e => handleFileChange(e, 'video')}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>
                </form>

                <footer className="px-10 py-8 bg-slate-50 border-t border-slate-100 flex justify-end space-x-4">
                    <Button variant="ghost" onClick={onClose} className="font-bold text-slate-400">Cancel Listing</Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading || !formData.itemName || !formData.image}
                        className="px-10 rounded-[1.5rem] bg-indigo-600 font-black tracking-widest shadow-xl shadow-indigo-100"
                    >
                        {loading ? 'PUBLISHING...' : 'PUBLISH LISTING'}
                    </Button>
                </footer>
            </div>
        </div>
    );
}
