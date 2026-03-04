import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

export const confirmAction = async ({ title, text, icon = 'warning', confirmText = 'Yes, proceed', color = '#4f46e5' }) => {
    return await Swal.fire({
        title,
        text,
        icon,
        showCancelButton: true,
        confirmButtonColor: color,
        cancelButtonColor: '#64748b',
        confirmButtonText: confirmText,
        customClass: {
            popup: 'rounded-[2.5rem] p-10',
            confirmButton: 'rounded-2xl px-8 py-4 font-bold text-sm uppercase tracking-widest',
            cancelButton: 'rounded-2xl px-8 py-4 font-bold text-sm uppercase tracking-widest'
        }
    });
};

export const notify = {
    success: (msg) => toast.success(msg),
    error: (msg) => toast.error(msg),
    info: (msg) => toast(msg, { icon: 'ℹ️' }),
    warn: (msg) => toast(msg, { icon: '⚠️' })
};
