import { useState, useEffect } from 'react';
import { billingService } from '../services/billingService';
import { paymentService } from '../services/paymentService';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import { confirmAction, notify } from '../utils/alerts';

export default function MaintenanceBills() {
    const { user } = useAuth();
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [ratePerSqFt, setRatePerSqFt] = useState('2.5'); // Default rate

    const isManager = user?.roles?.some(r => ['ROLE_ADMIN', 'ROLE_RWA_SECRETARY', 'ROLE_RWA_PRESIDENT'].includes(r));

    const fetchBills = async () => {
        if (!user) return;
        try {
            setLoading(true);
            const data = isManager ? await billingService.getAllBills() : await billingService.getMyBills();
            setBills(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchBills();
    }, [user, isManager]);

    const handleGenerate = async () => {
        const result = await confirmAction({
            title: 'Generate Bills?',
            text: `Generate monthly bills for all flats at ₹${ratePerSqFt}/sqft?`,
            confirmText: 'Generate Now'
        });

        if (result.isConfirmed) {
            try {
                setGenerating(true);
                await billingService.generateBills(Number(ratePerSqFt));
                notify.success('Bills generated successfully');
                fetchBills();
            } catch (err) {
                notify.error('Failed to generate bills');
            } finally {
                setGenerating(false);
            }
        }
    };

    const handleMarkPaid = async (billId) => {
        const result = await confirmAction({
            title: 'Confirm Payment?',
            text: 'Mark this bill as PAID manually?',
            confirmText: 'Yes, Mark Paid',
            color: '#10b981'
        });

        if (result.isConfirmed) {
            try {
                await billingService.markAsPaid(billId);
                notify.success('Payment recorded');
                fetchBills();
            } catch (err) {
                notify.error('Failed to update status');
            }
        }
    };

    const [selectedReceipt, setSelectedReceipt] = useState(null);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Maintenance Bills</h2>
                {isManager && (
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                            <label className="text-sm text-gray-600">Rate (₹/sqft):</label>
                            <input
                                type="number"
                                className="w-20 px-2 py-1 border rounded text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                value={ratePerSqFt}
                                onChange={(e) => setRatePerSqFt(e.target.value)}
                                step="0.1"
                            />
                        </div>
                        <Button onClick={handleGenerate} disabled={generating}>
                            {generating ? 'Generating...' : 'Generate Monthly Bills'}
                        </Button>
                    </div>
                )}
            </div>

            {loading ? <div>Loading...</div> : (
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {bills.length === 0 && <li className="px-4 py-4 text-gray-500">No bills found.</li>}
                        {bills.map((bill) => (
                            <li key={bill.billId}>
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-indigo-600 truncate">
                                                Flat {bill.flatNumber}
                                            </p>
                                            {bill.residentName && (
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {bill.residentName}
                                                </p>
                                            )}
                                        </div>
                                        <div className="ml-2 flex flex-col items-end gap-2">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${bill.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {bill.status}
                                            </span>
                                            {bill.status === 'PAID' && (
                                                <button
                                                    onClick={() => setSelectedReceipt(bill)}
                                                    className="text-xs text-indigo-600 hover:text-indigo-900 underline"
                                                >
                                                    View Receipt
                                                </button>
                                            )}
                                            {isManager && bill.status === 'PENDING' && (
                                                <button
                                                    onClick={() => handleMarkPaid(bill.billId)}
                                                    className="text-xs text-indigo-600 hover:text-indigo-900 border border-indigo-200 px-2 py-1 rounded bg-indigo-50"
                                                >
                                                    Mark Paid
                                                </button>
                                            )}
                                            {!isManager && bill.status === 'PENDING' && (
                                                <button
                                                    onClick={async () => {
                                                        const result = await confirmAction({
                                                            title: 'Pay Online?',
                                                            text: `Proceed to pay bill for Flat ${bill.flatNumber}?`,
                                                            confirmText: 'Pay Now'
                                                        });

                                                        if (result.isConfirmed) {
                                                            try {
                                                                const orderData = await paymentService.createOrder(bill.billId, user.id);
                                                                const options = {
                                                                    key: orderData.key,
                                                                    amount: orderData.amount,
                                                                    currency: orderData.currency,
                                                                    name: orderData.companyName,
                                                                    description: `Maintenance for Flat ${bill.flatNumber}`,
                                                                    order_id: orderData.orderId,
                                                                    handler: async (response) => {
                                                                        try {
                                                                            await paymentService.verifyPayment({
                                                                                razorpayOrderId: response.razorpay_order_id,
                                                                                razorpayPaymentId: response.razorpay_payment_id,
                                                                                razorpaySignature: response.razorpay_signature
                                                                            });
                                                                            notify.success('Payment Verified & Credited!');
                                                                            fetchBills();
                                                                        } catch (err) {
                                                                            notify.error('Payment verification failed');
                                                                        }
                                                                    },
                                                                    prefill: { name: user.fullName, email: user.email },
                                                                    theme: { color: '#4f46e5' }
                                                                };
                                                                const rzp = new window.Razorpay(options);
                                                                rzp.open();
                                                            } catch (err) {
                                                                notify.error('Could not initiate payment');
                                                            }
                                                        }
                                                    }}
                                                    className="text-xs text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded shadow-sm"
                                                >
                                                    Pay Now
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:flex sm:justify-between">
                                        <div className="sm:flex">
                                            <p className="flex items-center text-sm text-gray-500">
                                                Amount: ₹{bill.totalAmount}
                                            </p>
                                        </div>
                                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                            <p>
                                                Due: {new Date(bill.dueDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {selectedReceipt && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
                    <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Payment Receipt</h3>
                            <div className="mt-4 text-left space-y-2 text-sm">
                                <div className="border-b pb-2 mb-2">
                                    <p className="font-bold text-lg">{selectedReceipt.societyName}</p>
                                    <p className="text-gray-500">{selectedReceipt.societyAddress}</p>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold">Receipt No:</span>
                                    <span>#{selectedReceipt.billId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold">Date:</span>
                                    <span>{new Date(selectedReceipt.paidDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold">Flat No:</span>
                                    <span>{selectedReceipt.flatNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold">Resident:</span>
                                    <span>{selectedReceipt.residentName}</span>
                                </div>
                                <div className="border-t pt-2 mt-2">
                                    <p className="font-semibold mb-1">Charges Breakdown:</p>
                                    <div className="pl-2 space-y-1 text-gray-600">
                                        <div className="flex justify-between">
                                            <span>Maintenance Charges</span>
                                            <span>₹{selectedReceipt.totalAmount}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-t pt-2 mt-2 flex justify-between items-center text-base font-bold">
                                    <span>Total Paid:</span>
                                    <span className="text-green-600">₹{selectedReceipt.totalAmount}</span>
                                </div>
                            </div>
                            <div className="items-center px-4 py-3">
                                <button
                                    onClick={() => window.print()}
                                    className="px-4 py-2 bg-indigo-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 mb-2"
                                >
                                    Print Receipt
                                </button>
                                <button
                                    onClick={() => setSelectedReceipt(null)}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
