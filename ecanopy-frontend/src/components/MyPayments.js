import React, { useState, useEffect } from 'react';
import { paymentAPI } from '../api';

const MyPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const response = await paymentAPI.getByResident();
      setPayments(response.data);
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading payments...</div>;
  }

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>My Payments</h2>
      
      {payments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          <h3>No payments found</h3>
          <p>You haven't made any payments yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {payments.map(payment => (
            <div key={payment.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div>
                  <h3 style={{ margin: 0, marginBottom: '0.25rem' }}>{payment.description || 'Payment'}</h3>
                  <p style={{ margin: 0, color: '#666', fontSize: '0.875rem' }}>Method: {payment.paymentMethod}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#28a745' }}>
                    ₹{payment.amount.toLocaleString()}
                  </div>
                  <span style={{ 
                    background: '#28a745', 
                    color: 'white', 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '12px', 
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    Paid
                  </span>
                </div>
              </div>
              
              <div style={{ fontSize: '0.875rem', color: '#666' }}>
                <strong>Paid On:</strong> {new Date(payment.paidOn).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPayments;