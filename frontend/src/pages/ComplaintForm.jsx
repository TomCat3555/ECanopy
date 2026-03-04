import { useState } from 'react';
import { complaintService } from '../services/complaintService';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { notify } from '../utils/alerts';

export default function ComplaintForm({ onSuccess, onCancel }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'PLUMBING', // Default
        priority: 'MEDIUM'
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await complaintService.createComplaint(formData);
            notify.success('Complaint filed successfully');
            onSuccess();
        } catch (err) {
            console.error("Complaint creation failed:", err.response?.data || err.message);
            notify.error(`Failed to submit: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white p-8 shadow rounded-[2rem] border border-slate-100 fade-up">
            <h2 className="text-2xl font-black text-slate-900 mb-6">File a Complaint</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="Title"
                    placeholder="Briefly describe the issue"
                    className="rounded-xl"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    required
                />

                <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Detailed Description</label>
                    <textarea
                        className="block w-full rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition-all resize-none"
                        rows="4"
                        placeholder="Provide more background info..."
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Category</label>
                        <select
                            className="block w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none transition-all appearance-none border"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option value="PLUMBING">Plumbing</option>
                            <option value="ELECTRICAL">Electrical</option>
                            <option value="SECURITY">Security</option>
                            <option value="CLEANING">Cleaning</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Priority</label>
                        <select
                            className="block w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none transition-all appearance-none border"
                            value={formData.priority}
                            onChange={e => setFormData({ ...formData, priority: e.target.value })}
                        >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                            <option value="CRITICAL">Critical</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end space-x-3 pt-6">
                    <Button type="button" variant="ghost" onClick={onCancel} className="font-bold">Cancel</Button>
                    <Button type="submit" disabled={loading} className="px-8 bg-indigo-600 font-black tracking-widest">
                        {loading ? 'SUBMITTING...' : 'SUBMIT ISSUE'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
