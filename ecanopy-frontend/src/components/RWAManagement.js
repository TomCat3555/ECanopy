import React, { useState, useEffect, useCallback } from 'react';
import { rwaAPI, roleRequestAPI, ownershipAPI } from '../api';

const RWAManagement = () => {
  const [activeSection, setActiveSection] = useState('members');
  const [members, setMembers] = useState([]);
  const [roleRequests, setRoleRequests] = useState([]);
  const [ownershipRequests, setOwnershipRequests] = useState([]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberForm, setMemberForm] = useState({ userEmail: '', role: 'RWA_Member' });

  const loadData = useCallback(async () => {
    try {
      if (activeSection === 'members') {
        const res = await rwaAPI.getMembers();
        setMembers(res.data);
      } else if (activeSection === 'role-requests') {
        const res = await roleRequestAPI.getPending();
        setRoleRequests(res.data);
      } else if (activeSection === 'ownership') {
        const res = await ownershipAPI.getPending();
        setOwnershipRequests(res.data);
      }
    } catch (error) {
      console.error('Error loading RWA data:', error);
    }
  }, [activeSection]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const addMember = async (e) => {
    e.preventDefault();
    try {
      await rwaAPI.addMember(memberForm);
      setMemberForm({ userEmail: '', role: 'RWA_Member' });
      setShowAddMember(false);
      loadData();
      alert('Member added successfully');
    } catch (error) {
      alert('Error adding member');
    }
  };

  const processRoleRequest = async (id, approved) => {
    try {
      await roleRequestAPI.process({ id, approved });
      loadData();
      alert(`Request ${approved ? 'approved' : 'rejected'}`);
    } catch (error) {
      alert('Error processing request');
    }
  };

  const processOwnershipRequest = async (id, approved) => {
    try {
      await ownershipAPI.process(id, { approved });
      loadData();
      alert(`Ownership request ${approved ? 'approved' : 'rejected'}`);
    } catch (error) {
      alert('Error processing ownership request');
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>RWA Management</h2>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #dee2e6', paddingBottom: '1rem' }}>
        {['members', 'role-requests', 'ownership'].map(section => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            style={{
              padding: '0.5rem 1rem',
              background: activeSection === section ? '#007bff' : 'transparent',
              color: activeSection === section ? 'white' : '#007bff',
              border: '1px solid #007bff',
              borderRadius: '4px',
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {section.replace('-', ' ')}
          </button>
        ))}
      </div>

      {activeSection === 'members' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3>RWA Members</h3>
            <button
              onClick={() => setShowAddMember(true)}
              style={{ background: '#28a745', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
            >
              Add Member
            </button>
          </div>

          {showAddMember && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
              <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', width: '100%', maxWidth: '400px' }}>
                <h3 style={{ marginBottom: '1rem' }}>Add RWA Member</h3>
                <form onSubmit={addMember}>
                  <input
                    type="email"
                    placeholder="User Email"
                    value={memberForm.userEmail}
                    onChange={(e) => setMemberForm({...memberForm, userEmail: e.target.value})}
                    required
                    style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                  <select
                    value={memberForm.role}
                    onChange={(e) => setMemberForm({...memberForm, role: e.target.value})}
                    style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  >
                    <option value="RWA_Member">RWA Member</option>
                    <option value="RWA_Secretary">RWA Secretary</option>
                    <option value="RWA_President">RWA President</option>
                  </select>
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button type="button" onClick={() => setShowAddMember(false)} style={{ background: '#6c757d', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                    <button type="submit" style={{ background: '#28a745', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>Add</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f8f9fa' }}>
                <tr>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Email</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Role</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map(member => (
                  <tr key={member.id}>
                    <td style={{ padding: '1rem', borderBottom: '1px solid #dee2e6' }}>{member.userEmail}</td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid #dee2e6' }}>{member.role}</td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid #dee2e6' }}>
                      <button
                        onClick={() => rwaAPI.removeMember(member.id)}
                        style={{ background: '#dc3545', color: 'white', border: 'none', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.875rem' }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSection === 'role-requests' && (
        <div>
          <h3 style={{ marginBottom: '1rem' }}>Pending Role Requests</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {roleRequests.map(request => (
              <div key={request.id} style={{ background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4>{request.userEmail}</h4>
                  <p>Requested Role: <strong>{request.requestedRole}</strong></p>
                  <p>Reason: {request.reason}</p>
                  <small>Requested: {new Date(request.requestedOn).toLocaleDateString()}</small>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => processRoleRequest(request.id, true)}
                    style={{ background: '#28a745', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => processRoleRequest(request.id, false)}
                    style={{ background: '#dc3545', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'ownership' && (
        <div>
          <h3 style={{ marginBottom: '1rem' }}>Ownership Requests</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {ownershipRequests.map(request => (
              <div key={request.id} style={{ background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4>{request.userEmail}</h4>
                  <p>Property: {request.propertyDetails}</p>
                  <p>Documents: {request.documentsProvided ? 'Yes' : 'No'}</p>
                  <small>Requested: {new Date(request.requestedOn).toLocaleDateString()}</small>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => processOwnershipRequest(request.id, true)}
                    style={{ background: '#28a745', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => processOwnershipRequest(request.id, false)}
                    style={{ background: '#dc3545', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RWAManagement;