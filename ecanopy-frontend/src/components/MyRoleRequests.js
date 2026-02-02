import React, { useState, useEffect } from 'react';
import { roleRequestAPI } from '../api';

const MyRoleRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const response = await roleRequestAPI.getAll(); // This should be getMy() based on controller
      setRequests(response.data);
    } catch (error) {
      console.error('Error loading role requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return '#28a745';
      case 'rejected': return '#dc3545';
      case 'pending': return '#ffc107';
      default: return '#6c757d';
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading requests...</div>;
  }

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>My Role Requests</h2>
      
      {requests.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          <h3>No role requests found</h3>
          <p>You haven't submitted any role requests yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {requests.map(request => (
            <div key={request.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>Role Request</h3>
                  <p style={{ margin: 0, color: '#666', fontSize: '0.875rem' }}>
                    Requested Role: <strong>{request.requestedRole}</strong>
                  </p>
                </div>
                <span style={{ 
                  background: getStatusColor(request.status), 
                  color: 'white', 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '12px', 
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}>
                  {request.status}
                </span>
              </div>
              
              {request.reason && (
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Reason:</strong>
                  <p style={{ margin: '0.25rem 0 0 0', color: '#666' }}>{request.reason}</p>
                </div>
              )}
              
              <div style={{ fontSize: '0.875rem', color: '#666' }}>
                <strong>Submitted:</strong> {new Date(request.requestedOn).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRoleRequests;