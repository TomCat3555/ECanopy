import React, { useState } from 'react';
import { residentAPI } from '../api';

const ResidentJoinRequest = () => {
  const [formData, setFormData] = useState({
    societyId: '',
    buildingId: '',
    flatId: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await residentAPI.joinRequest(formData);
      setSuccess(true);
      setFormData({ societyId: '', buildingId: '', flatId: '', reason: '' });
    } catch (error) {
      alert('Error submitting join request');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ background: '#d4edda', color: '#155724', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
          <h3>Join Request Submitted!</h3>
          <p>Your request has been sent to the society administrators for approval.</p>
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
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Join Society</h2>
      
      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Society</label>
          <select
            value={formData.societyId}
            onChange={(e) => setFormData({...formData, societyId: e.target.value})}
            required
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem' }}
          >
            <option value="">Select Society</option>
            <option value="1">Green Valley Society</option>
            <option value="2">Sunrise Apartments</option>
            <option value="3">Royal Gardens</option>
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Building</label>
          <select
            value={formData.buildingId}
            onChange={(e) => setFormData({...formData, buildingId: e.target.value})}
            required
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem' }}
          >
            <option value="">Select Building</option>
            <option value="1">Building A</option>
            <option value="2">Building B</option>
            <option value="3">Building C</option>
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Flat</label>
          <select
            value={formData.flatId}
            onChange={(e) => setFormData({...formData, flatId: e.target.value})}
            required
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem' }}
          >
            <option value="">Select Flat</option>
            <option value="1">A-101</option>
            <option value="2">A-102</option>
            <option value="3">A-201</option>
          </select>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Reason for Joining</label>
          <textarea
            value={formData.reason}
            onChange={(e) => setFormData({...formData, reason: e.target.value})}
            placeholder="Please provide a brief reason for joining this society..."
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem', minHeight: '100px' }}
          />
        </div>

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
          {loading ? 'Submitting...' : 'Submit Join Request'}
        </button>
      </form>
    </div>
  );
};

export default ResidentJoinRequest;