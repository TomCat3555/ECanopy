import React, { useState } from 'react';

const OwnershipRequest = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/ownership/request', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        setSuccess(true);
      } else {
        alert('Error submitting ownership request');
      }
    } catch (error) {
      alert('Error submitting ownership request');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ background: '#d4edda', color: '#155724', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
          <h3>Ownership Request Submitted!</h3>
          <p>Your ownership request has been sent to the RWA for approval.</p>
        </div>
        <button
          onClick={() => setSuccess(false)}
          style={{ background: '#007bff', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '2rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Request Property Ownership</h2>
      
      <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <p style={{ marginBottom: '1.5rem', color: '#666' }}>
          Submit a request to claim ownership of your property. The RWA will review and approve your request.
        </p>
        
        <form onSubmit={handleSubmit}>
          <button
            type="submit"
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              background: loading ? '#ccc' : '#28a745', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              fontSize: '1rem', 
              cursor: loading ? 'not-allowed' : 'pointer' 
            }}
          >
            {loading ? 'Submitting...' : 'Submit Ownership Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OwnershipRequest;