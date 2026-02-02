import React, { useState, useEffect } from 'react';
import { adminAPI, residentAPI, complaintAPI } from '../api';

const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    loadData();
  }, [activeSection]);

  const loadData = async () => {
    try {
      if (activeSection === 'dashboard') {
        const [dashRes, analyticsRes] = await Promise.all([
          adminAPI.getDashboard(),
          complaintAPI.getAnalytics()
        ]);
        setDashboardData(dashRes.data);
        setAnalytics(analyticsRes.data);
      } else if (activeSection === 'users') {
        const usersRes = await adminAPI.getUsers();
        setUsers(usersRes.data);
      } else if (activeSection === 'requests') {
        const requestsRes = await residentAPI.getPending();
        setPendingRequests(requestsRes.data);
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
    }
  };

  const processJoinRequest = async (userEmail, approve) => {
    try {
      await residentAPI.process({ userEmail, approved: approve });
      loadData();
      alert(`Request ${approve ? 'approved' : 'rejected'}`);
    } catch (error) {
      alert('Error processing request');
    }
  };

  const updateComplaintStatus = async (ticketNumber, status) => {
    try {
      await complaintAPI.updateStatus(ticketNumber, status);
      alert('Status updated');
    } catch (error) {
      alert('Error updating status');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #dee2e6', paddingBottom: '1rem' }}>
        {['dashboard', 'users', 'requests', 'complaints'].map(section => (
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
            {section}
          </button>
        ))}
      </div>

      {activeSection === 'dashboard' && (
        <div>
          <h3 style={{ marginBottom: '1rem' }}>Admin Dashboard</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {analytics && (
              <>
                <div style={{ background: '#e3f2fd', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                  <h4>Total Complaints</h4>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1976d2' }}>{analytics.totalComplaints}</div>
                </div>
                <div style={{ background: '#f3e5f5', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                  <h4>Pending</h4>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#7b1fa2' }}>{analytics.pendingComplaints}</div>
                </div>
                <div style={{ background: '#e8f5e8', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                  <h4>Resolved</h4>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#388e3c' }}>{analytics.resolvedComplaints}</div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {activeSection === 'users' && (
        <div>
          <h3 style={{ marginBottom: '1rem' }}>User Management</h3>
          <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f8f9fa' }}>
                <tr>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Email</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Name</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Roles</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td style={{ padding: '1rem', borderBottom: '1px solid #dee2e6' }}>{user.email}</td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid #dee2e6' }}>{user.fullName}</td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid #dee2e6' }}>{user.roles?.join(', ')}</td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid #dee2e6' }}>
                      <button style={{ background: '#28a745', color: 'white', border: 'none', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.875rem' }}>
                        Edit Roles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSection === 'requests' && (
        <div>
          <h3 style={{ marginBottom: '1rem' }}>Pending Join Requests</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {pendingRequests.map(request => (
              <div key={request.id} style={{ background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4>{request.userEmail}</h4>
                  <p>Requested: {new Date(request.requestedOn).toLocaleDateString()}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => processJoinRequest(request.userEmail, true)}
                    style={{ background: '#28a745', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => processJoinRequest(request.userEmail, false)}
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

      {activeSection === 'complaints' && (
        <ComplaintManagement updateStatus={updateComplaintStatus} />
      )}
    </div>
  );
};

const ComplaintManagement = ({ updateStatus }) => {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    // In a real app, you'd have an endpoint to get all complaints for admin
    // For now, this is a placeholder
  }, []);

  return (
    <div>
      <h3 style={{ marginBottom: '1rem' }}>Complaint Management</h3>
      <p style={{ color: '#666', fontStyle: 'italic' }}>
        Use the complaint tracking feature in the main dashboard to manage individual complaints.
      </p>
    </div>
  );
};

export default AdminPanel;