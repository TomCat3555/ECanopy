import React, { useState } from 'react';
import { X, Calendar, Clock, User } from 'lucide-react';
import { notify } from '../../utils/alerts';

const BookingModal = ({ isOpen, onClose, amenity, onSubmit, loading }) => {
    if (!isOpen || !amenity) return null;

    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Basic validation
        if (!date || !startTime || !endTime) {
            notify.error("Please fill all fields");
            return;
        }

        // Combine to ISO string for backend
        const startISO = `${date}T${startTime}:00`;
        const endISO = `${date}T${endTime}:00`;

        onSubmit(amenity.amenityId, { startTime: startISO, endTime: endISO });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-white/20">
                {/* Header */}
                <div className="bg-indigo-600 px-8 py-6 flex justify-between items-center text-white">
                    <h3 className="text-xl font-black tracking-tight tracking-tight">Reserve {amenity.amenityName}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">

                    {/* Date Selection */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Reservation Date</label>
                        <div className="relative group">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
                            <input
                                type="date"
                                required
                                min={new Date().toISOString().split('T')[0]} // Disable past dates
                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Time Selection */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">From</label>
                            <div className="relative group">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                <input
                                    type="time"
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Until</label>
                            <div className="relative group">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                <input
                                    type="time"
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Summary/Note */}
                    <div className="bg-indigo-50/50 text-indigo-600 text-[10px] font-black uppercase tracking-widest p-4 rounded-2xl flex items-start space-x-3 border border-indigo-100/50">
                        <User size={16} className="mt-0.5 flex-shrink-0" />
                        <p className="leading-relaxed">Booking is subject to RWA verification. Please adhere to facility rules.</p>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 flex space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-4 bg-slate-50 text-slate-500 font-black rounded-2xl hover:bg-slate-100 transition-colors uppercase tracking-widest text-xs"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-xs"
                        >
                            {loading ? 'Processing...' : 'Reserve Now'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;
