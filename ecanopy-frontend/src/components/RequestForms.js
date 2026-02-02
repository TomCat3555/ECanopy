import React, { useState } from 'react';
import { roleRequestAPI, ownershipAPI } from '../api';

const RequestForms = () => {
  const [activeForm, setActiveForm] = useState('role');
  const [roleForm, setRoleForm] = useState({
    requestedRole: 'RWA_Member',
    reason: ''
  });
  const [ownershipForm, setOwnershipForm] = useState({
    propertyDetails: '',
    documentsProvided: false,
    reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleRoleRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await roleRequestAPI.create(roleForm);
      setSuccess('role');
      setRoleForm({ requestedRole: 'RWA_Member', reason: '' });
    } catch (error) {
      alert('Error submitting role request');
    } finally {
      setLoading(false);
    }
  };

  const handleOwnershipRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await ownershipAPI.create(ownershipForm);
      setSuccess('ownership');
      setOwnershipForm({ propertyDetails: '', documentsProvided: false, reason: '' });
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
          <h3>Request Submitted!</h3>
          <p>Your {success} request has been sent for approval.</p>
        </div>
        <button
          onClick={() => setSuccess(null)}
          style={{ background: '#007bff', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Submit Requests</h2>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'center' }}>
        <button
          onClick={() => setActiveForm('role')}
          style={{
            padding: '0.5rem 1rem',
            background: activeForm === 'role' ? '#007bff' : 'transparent',
            color: activeForm === 'role' ? 'white' : '#007bff',
            border: '1px solid #007bff',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Role Request
        </button>
        <button
          onClick={() => setActiveForm('ownership')}
          style={{
            padding: '0.5rem 1rem',
            background: activeForm === 'ownership' ? '#007bff' : 'transparent',
            color: activeForm === 'ownership' ? 'white' : '#007bff',
            border: '1px solid #007bff',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Ownership Request
        </button>
      </div>

      {activeForm === 'role' && (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginBottom: '1rem' }}>Request Role Elevation</h3>
          <form onSubmit={handleRoleRequest}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Requested Role</label>
              <select
                value={roleForm.requestedRole}
                onChange={(e) => setRoleForm({...roleForm, requestedRole: e.target.value})}
                required
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem' }}
              >
                <option value="RWA_Member">RWA Member</option>
                <option value="RWA_Secretary">RWA Secretary</option>
                <option value="RWA_President">RWA President</option>
              </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Reason for Request</label>
              <textarea
                value={roleForm.reason}
                onChange={(e) => setRoleForm({...roleForm, reason: e.target.value})}
                placeholder="Please explain why you are requesting this role..."
                required
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem', minHeight: '120px' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                background: loading ? '#ccc' : '#007bff', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                fontSize: '1rem', 
                cursor: loading ? 'not-allowed' : 'pointer' 
              }}
            >
              {loading ? 'Submitting...' : 'Submit Role Request'}
            </button>
          </form>
        </div>
      )}

      {activeForm === 'ownership' && (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginBottom: '1rem' }}>Request Property Ownership</h3>
          <form onSubmit={handleOwnershipRequest}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Property Details</label>
              <input
                type="text"
                value={ownershipForm.propertyDetails}
                onChange={(e) => setOwnershipForm({...ownershipForm, propertyDetails: e.target.value})}
                placeholder="e.g., Building A, Flat 101"
                required
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={ownershipForm.documentsProvided}
                  onChange={(e) => setOwnershipForm({...ownershipForm, documentsProvided: e.target.checked})}
                />
                <span>I have provided all necessary ownership documents</span>
              </label>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Additional Information</label>
              <textarea
                value={ownershipForm.reason}
                onChange={(e) => setOwnershipForm({...ownershipForm, reason: e.target.value})}
                placeholder="Any additional information about your ownership claim..."
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
              {loading ? 'Submitting...' : 'Submit Ownership Request'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default RequestForms;