import React, { useState, useEffect } from 'react';
import { maintainanceAPI, paymentAPI } from '../api';

const ResidentBills = () => {
  const [bills, setBills] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [billsRes, paymentsRes] = await Promise.all([
        maintainanceAPI.getAll(),
        paymentAPI.getAll()
      ]);
      setBills(billsRes.data);
      setPayments(paymentsRes.data);
    } catch (error) {
      console.error('Error loading bills:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPaymentStatus = (bill) => {
    const payment = payments.find(p => p.billId === bill.id);
    return payment ? 'Paid' : 'Pending';
  };

  const getStatusColor = (status) => {
    return status === 'Paid' ? '#28a745' : '#dc3545';
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading bills...</div>;
  }

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>My Bills</h2>
      
      {bills.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          <h3>No bills found</h3>
          <p>You don't have any maintenance bills yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {bills.map(bill => {
            const status = getPaymentStatus(bill);
            const isOverdue = new Date(bill.dueDate) < new Date() && status === 'Pending';
            
            return (
              <div 
                key={bill.id} 
                style={{ 
                  background: 'white', 
                  padding: '1.5rem', 
                  borderRadius: '8px', 
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  border: isOverdue ? '2px solid #dc3545' : '1px solid #dee2e6'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>{bill.title}</h3>
                    <p style={{ margin: 0, color: '#666', fontSize: '0.875rem' }}>{bill.description}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                      ₹{bill.amount.toLocaleString()}
                    </div>
                    <span style={{ 
                      background: getStatusColor(status), 
                      color: 'white', 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '12px', 
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      {status}
                    </span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', color: '#666' }}>
                  <div>
                    <strong>Due Date:</strong> {new Date(bill.dueDate).toLocaleDateString()}
                    {isOverdue && (
                      <span style={{ color: '#dc3545', marginLeft: '0.5rem', fontWeight: 'bold' }}>
                        (OVERDUE)
                      </span>
                    )}
                  </div>
                  <div>
                    <strong>Created:</strong> {new Date(bill.createdOn).toLocaleDateString()}
                  </div>
                </div>
                
                {status === 'Pending' && (
                  <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#666' }}>
                      💡 <strong>Payment Instructions:</strong> Please contact the society office or use the designated payment methods to settle this bill.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ResidentBills;