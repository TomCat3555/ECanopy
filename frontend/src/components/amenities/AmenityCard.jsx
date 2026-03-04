import React from 'react';
import { Clock, Users, Trash2, ArrowRight, ShieldCheck, Info, Edit3 } from 'lucide-react';

const AmenityCard = ({ amenity, userRole, onBook, onEdit, onDelete }) => {
    // Helper to transform Unsplash page links to direct image links
    const fixImageUrl = (url) => {
        if (!url) return null;
        // Handle Unsplash page links: https://unsplash.com/photos/ID
        const unsplashMatch = url.match(/unsplash\.com\/photos\/([a-zA-Z0-9_-]+)/);
        if (unsplashMatch && unsplashMatch[1]) {
            const parts = unsplashMatch[1].split('-');
            const id = parts[parts.length - 1]; // Get the ID part
            return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=1080`;
        }
        return url;
    };

    // Dynamic Unsplash images based on common keywords
    const getUnsplashUrl = (name) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('gym') || lowerName.includes('fitness')) return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800';
        if (lowerName.includes('pool') || lowerName.includes('swim')) return 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800';
        if (lowerName.includes('club') || lowerName.includes('hall')) return 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=800';
        if (lowerName.includes('garden') || lowerName.includes('park')) return 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800';
        if (lowerName.includes('tennis') || lowerName.includes('court')) return 'https://images.unsplash.com/photo-1595435010996-857f0030030d?auto=format&fit=crop&q=80&w=800';
        return `https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800`; // Default Architecture
    };

    const imageUrl = fixImageUrl(amenity.imageUrl) || getUnsplashUrl(amenity.amenityName);
    const isManager = ['ROLE_ADMIN', 'ROLE_RWA_SECRETARY', 'ROLE_RWA_PRESIDENT'].includes(userRole);

    return (
        <div className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 hover:-translate-y-1 flex flex-col h-full relative">

            {/* Image/Header Section */}
            <div className="h-56 relative overflow-hidden bg-slate-900">
                <img
                    src={imageUrl}
                    alt={amenity.amenityName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80"
                    onError={(e) => {
                        // Fallback if the user-pasted URL is invalid
                        e.target.src = getUnsplashUrl(amenity.amenityName);
                    }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent flex flex-col justify-between p-6">
                    <div className="flex justify-between items-start">
                        <div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/5">
                            <ShieldCheck className="w-5 h-5 text-white" />
                        </div>
                        <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full backdrop-blur-md border border-white/10
                            ${amenity.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                            {amenity.isActive ? 'Ready' : 'Closed'}
                        </span>
                    </div>

                    <div>
                        <h3 className="text-white text-2xl font-black leading-tight tracking-tighter">
                            {amenity.amenityName}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Body Section */}
            <div className="p-7 flex-grow flex flex-col">
                <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2 font-medium italic">
                    {amenity.description || "Premium society facility maintained for our residents."}
                </p>

                <div className="flex items-center justify-between py-4 border-y border-slate-50 mb-6">
                    <div className="flex flex-col items-center flex-1">
                        <Users className="w-5 h-5 text-indigo-500 mb-1" />
                        <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Capacity</span>
                        <span className="text-xs font-bold text-slate-900">{amenity.capacity || 'Flexible'}</span>
                    </div>
                    <div className="w-[1px] h-8 bg-slate-100"></div>
                    <div className="flex flex-col items-center flex-1">
                        <Clock className="w-5 h-5 text-purple-500 mb-1" />
                        <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Timings</span>
                        <span className="text-xs font-bold text-slate-900">6 AM - 10 PM</span>
                    </div>
                </div>

                {/* Rules Link/Info */}
                <div className="flex items-center text-[10px] font-black tracking-widest text-indigo-600 uppercase mb-6 bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100/50">
                    <Info className="w-3.5 h-3.5 mr-2" />
                    Resident-only Access Policy
                </div>

                {/* Actions */}
                <div className="mt-auto">
                    {isManager ? (
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => onEdit(amenity)}
                                className="flex items-center justify-center p-4 text-xs font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white rounded-2xl transition-all duration-300 group/btn"
                            >
                                <Edit3 className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                                Edit
                            </button>
                            <button
                                onClick={() => onDelete(amenity.amenityId)}
                                className="flex items-center justify-center p-4 text-xs font-black uppercase tracking-widest text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded-2xl transition-all duration-300 group/btn"
                            >
                                <Trash2 className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                                Trash
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => onBook(amenity)}
                            disabled={!amenity.isActive}
                            className={`w-full group/btn flex items-center justify-center p-4 text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl transition-all duration-300 transform active:scale-95
                                ${amenity.isActive
                                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 animate-pulse-slow'
                                    : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'}`}
                        >
                            {amenity.isActive ? (
                                <>
                                    Reserve Slot
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                </>
                            ) : 'Maintenance in Progress'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AmenityCard;
