import React, { useState, useEffect } from 'react';
import { paymentAPI, maintainanceAPI, residentAPI } from '../api';

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [bills, setBills] = useState([]);
  const [residents, setResidents] = useState([]);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showAddBill, setShowAddBill] = useState(false);

  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    paymentMethod: 'Online',
    description: '',
    residentId: ''
  });

  const [billForm, setBillForm] = useState({
    title: '',
    description: '',
    amount: '',
    dueDate: '',
    buildingId: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [paymentsRes, billsRes, residentsRes] = await Promise.all([
        paymentAPI.getAll(),
        maintainanceAPI.getAll(),
        residentAPI.getAll()
      ]);
      setPayments(paymentsRes.data);
      setBills(billsRes.data);
      setResidents(residentsRes.data);
    } catch (error) {
      console.error('Error loading payment data:', error);
    }
  };

  const handleAddPayment = async (e) => {
    e.preventDefault();
    try {
      await paymentAPI.create(paymentForm);
      setPaymentForm({ amount: '', paymentMethod: 'Online', description: '', residentId: '' });
      setShowAddPayment(false);
      loadData();
      alert('Payment recorded successfully');
    } catch (error) {
      alert('Error recording payment');
    }
  };

  const handleAddBill = async (e) => {
    e.preventDefault();
    try {
      await maintainanceAPI.create(billForm);
      setBillForm({ title: '', description: '', amount: '', dueDate: '', buildingId: '' });
      setShowAddBill(false);
      loadData();
      alert('Bill created successfully');
    } catch (error) {
      alert('Error creating bill');
    }
  };

  const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalBills = bills.reduce((sum, bill) => sum + bill.amount, 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Payment Management</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => setShowAddPayment(true)}
            style={{ background: '#28a745', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
          >
            Record Payment
          </button>
          <button
            onClick={() => setShowAddBill(true)}
            style={{ background: '#007bff', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
          >
            Create Bill
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: '#e8f5e8', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
          <h4>Total Payments</h4>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#388e3c' }}>₹{totalPayments.toLocaleString()}</div>
        </div>
        <div style={{ background: '#fff3e0', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
          <h4>Total Bills</h4>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f57c00' }}>₹{totalBills.toLocaleString()}</div>
        </div>
        <div style={{ background: '#e3f2fd', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
          <h4>Outstanding</h4>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1976d2' }}>₹{(totalBills - totalPayments).toLocaleString()}</div>
        </div>
      </div>

      {/* Add Payment Modal */}
      {showAddPayment && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', width: '100%', maxWidth: '500px' }}>
            <h3 style={{ marginBottom: '1rem' }}>Record Payment</h3>
            <form onSubmit={handleAddPayment}>
              <input
                type="number"
                placeholder="Amount"
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})}
                required
                style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}
              />
              <select
                value={paymentForm.paymentMethod}
                onChange={(e) => setPaymentForm({...paymentForm, paymentMethod: e.target.value})}
                style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                <option value="Online">Online</option>
                <option value="Cash">Cash</option>
                <option value="Cheque">Cheque</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
              <input
                type="text"
                placeholder="Description"
                value={paymentForm.description}
                onChange={(e) => setPaymentForm({...paymentForm, description: e.target.value})}
                style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}
              />
              <select
                value={paymentForm.residentId}
                onChange={(e) => setPaymentForm({...paymentForm, residentId: e.target.value})}
                required
                style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                <option value="">Select Resident</option>
                {residents.map(resident => (
                  <option key={resident.id} value={resident.id}>{resident.name} - {resident.flatNumber}</option>
                ))}
              </select>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowAddPayment(false)}
                  style={{ background: '#6c757d', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: '#28a745', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Bill Modal */}
      {showAddBill && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', width: '100%', maxWidth: '500px' }}>
            <h3 style={{ marginBottom: '1rem' }}>Create Maintenance Bill</h3>
            <form onSubmit={handleAddBill}>
              <input
                type="text"
                placeholder="Bill Title"
                value={billForm.title}
                onChange={(e) => setBillForm({...billForm, title: e.target.value})}
                required
                style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}
              />
              <textarea
                placeholder="Description"
                value={billForm.description}
                onChange={(e) => setBillForm({...billForm, description: e.target.value})}
                style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px', minHeight: '80px' }}
              />
              <input
                type="number"
                placeholder="Amount"
                value={billForm.amount}
                onChange={(e) => setBillForm({...billForm, amount: e.target.value})}
                required
                style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}
              />
              <input
                type="date"
                placeholder="Due Date"
                value={billForm.dueDate}
                onChange={(e) => setBillForm({...billForm, dueDate: e.target.value})}
                required
                style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}
              />
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowAddBill(false)}
                  style={{ background: '#6c757d', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: '#007bff', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Create Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Recent Payments and Bills */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid #dee2e6', background: '#f8f9fa' }}>
            <h3 style={{ margin: 0 }}>Recent Payments</h3>
          </div>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {payments.slice(0, 10).map(payment => (
              <div key={payment.id} style={{ padding: '1rem', borderBottom: '1px solid #dee2e6', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: '500' }}>{payment.description}</div>
                  <div style={{ fontSize: '0.875rem', color: '#666' }}>{payment.paymentMethod}</div>
                  <div style={{ fontSize: '0.875rem', color: '#666' }}>{new Date(payment.paidOn).toLocaleDateString()}</div>
                </div>
                <div style={{ fontWeight: 'bold', color: '#28a745' }}>₹{payment.amount.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid #dee2e6', background: '#f8f9fa' }}>
            <h3 style={{ margin: 0 }}>Recent Bills</h3>
          </div>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {bills.slice(0, 10).map(bill => (
              <div key={bill.id} style={{ padding: '1rem', borderBottom: '1px solid #dee2e6', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: '500' }}>{bill.title}</div>
                  <div style={{ fontSize: '0.875rem', color: '#666' }}>{bill.description}</div>
                  <div style={{ fontSize: '0.875rem', color: '#666' }}>Due: {new Date(bill.dueDate).toLocaleDateString()}</div>
                </div>
                <div style={{ fontWeight: 'bold', color: '#f57c00' }}>₹{bill.amount.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentManagement;