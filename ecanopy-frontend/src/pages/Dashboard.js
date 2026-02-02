import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { complaintAPI, societyAPI, noticeAPI } from '../api';
import AdminPanel from '../components/AdminPanel';
import PropertyManagement from '../components/PropertyManagement';
import PaymentManagement from '../components/PaymentManagement';
import RWAManagement from '../components/RWAManagement';
import RequestForms from '../components/RequestForms';
import ResidentBills from '../components/ResidentBills';
import MyPayments from '../components/MyPayments';
import MyRoleRequests from '../components/MyRoleRequests';
import OwnershipRequest from '../components/OwnershipRequest';
import OwnershipManagement from '../components/OwnershipManagement';
import SocietyLookup from '../components/SocietyLookup';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('complaints');
  const [societies, setSocieties] = useState([]);
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [societiesRes, noticesRes] = await Promise.all([
        societyAPI.getAll(),
        noticeAPI.getAll()
      ]);
      setSocieties(societiesRes.data);
      setNotices(noticesRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const isAdmin = user?.roles?.includes('Admin');

  const menuItems = [
    // Admin only
    { key: 'admin-requests', label: 'Role Requests', roles: ['Admin'] },
    
    // RWA President/Secretary
    { key: 'resident-requests', label: 'Join Requests', roles: ['RWA_President', 'RWA_Secretary'] },
    { key: 'notices-manage', label: 'Manage Notices', roles: ['RWA_President', 'RWA_Secretary'] },
    { key: 'societies', label: 'Societies', roles: ['RWA_President', 'RWA_Secretary'] },
    { key: 'buildings', label: 'Buildings', roles: ['RWA_President', 'RWA_Secretary'] },
    { key: 'flats', label: 'Flats', roles: ['RWA_President', 'RWA_Secretary'] },
    { key: 'ownership-requests', label: 'Ownership Requests', roles: ['RWA_President', 'RWA_Secretary'] },
    
    // RWA Treasurer
    { key: 'bills-create', label: 'Create Bills', roles: ['RWA_President', 'RWA_Secretary', 'RWA_Treasurer'] },
    { key: 'payments-all', label: 'All Payments', roles: ['RWA_Treasurer'] },
    { key: 'bills-all', label: 'All Bills', roles: ['RWA_President', 'RWA_Treasurer'] },
    
    // Residents only
    { key: 'complaints', label: 'Complaints', roles: ['Resident'] },
    { key: 'notices', label: 'Notices', roles: ['Resident', 'RWA_President', 'RWA_Secretary', 'RWA_Treasurer'] },
    { key: 'join-request', label: 'Join Society', roles: ['Resident'] },
    { key: 'role-request', label: 'Request Role', roles: ['Resident'] },
    { key: 'ownership-request', label: 'Request Ownership', roles: ['Resident'] },
    { key: 'my-bills', label: 'My Bills', roles: ['Resident'] },
    { key: 'my-payments', label: 'My Payments', roles: ['Resident'] },
    { key: 'my-role-requests', label: 'My Role Requests', roles: ['Resident'] },
    
    // Public lookup (no auth required)
    { key: 'lookup', label: 'Society Lookup' }
  ];

  const hasAccess = (item) => {
    if (!item.roles) return true;
    return item.roles.some(role => user?.roles?.includes(role));
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <nav style={{ background: '#007bff', color: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>ECanopy Dashboard</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>Welcome, {user?.fullName}</span>
          <span style={{ fontSize: '0.875rem', background: 'rgba(255,255,255,0.2)', padding: '0.25rem 0.5rem', borderRadius: '12px' }}>
            {user?.roles?.join(', ')}
          </span>
          <button onClick={logout} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </nav>

      <div style={{ display: 'flex' }}>
        <aside style={{ width: '250px', background: 'white', minHeight: 'calc(100vh - 70px)', padding: '1rem', borderRight: '1px solid #dee2e6' }}>
          <nav>
            {menuItems.filter(hasAccess).map(item => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  marginBottom: '0.5rem', 
                  background: activeTab === item.key ? '#007bff' : 'transparent',
                  color: activeTab === item.key ? 'white' : '#333',
                  border: '1px solid #dee2e6',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <main style={{ flex: 1, padding: '2rem' }}>
          {activeTab === 'complaints' && <ComplaintsTab isAdmin={isAdmin} />}
          {activeTab === 'notices' && <NoticesTab notices={notices} isAdmin={isAdmin} />}
          {activeTab === 'notices-manage' && <NoticesTab notices={notices} isAdmin={true} />}
          {activeTab === 'societies' && <SocietiesTab societies={societies} isAdmin={isAdmin} user={user} />}
          {activeTab === 'buildings' && <PropertyManagement />}
          {activeTab === 'flats' && <PropertyManagement />}
          {activeTab === 'join-request' && <RequestForms />}
          {activeTab === 'role-request' && <RequestForms />}
          {activeTab === 'ownership-request' && <OwnershipRequest />}
          {activeTab === 'ownership-requests' && <OwnershipManagement />}
          {activeTab === 'my-role-requests' && <MyRoleRequests />}
          {activeTab === 'my-bills' && <ResidentBills />}
          {activeTab === 'my-payments' && <MyPayments />}
          {activeTab === 'bills-create' && <PaymentManagement />}
          {activeTab === 'payments-all' && <PaymentManagement />}
          {activeTab === 'bills-all' && <PaymentManagement />}
          {activeTab === 'resident-requests' && <RWAManagement />}
          {activeTab === 'admin-requests' && <AdminPanel />}
          {activeTab === 'lookup' && <SocietyLookup />}
        </main>
      </div>
    </div>
  );
};

const ComplaintsTab = ({ isAdmin }) => {
  const [formData, setFormData] = useState({ category: '', description: '', priority: 'Medium', contactName: '', contactPhone: '', contactEmail: '' });
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackedComplaint, setTrackedComplaint] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await complaintAPI.create(formData);
      alert(`Complaint created! Ticket: ${response.data.ticketNumber}`);
      setFormData({ category: '', description: '', priority: 'Medium', contactName: '', contactPhone: '', contactEmail: '' });
    } catch (error) {
      alert('Error creating complaint');
    }
  };

  const handleTrack = async () => {
    try {
      const response = await complaintAPI.track(trackingNumber);
      setTrackedComplaint(response.data);
    } catch (error) {
      alert('Complaint not found');
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>Complaint Management</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginBottom: '1rem' }}>File New Complaint</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Category"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              required
              style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
              style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px', minHeight: '100px' }}
            />
            <select
              value={formData.priority}
              onChange={(e) => setFormData({...formData, priority: e.target.value})}
              style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <input
              type="text"
              placeholder="Contact Name"
              value={formData.contactName}
              onChange={(e) => setFormData({...formData, contactName: e.target.value})}
              style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <input
              type="email"
              placeholder="Contact Email"
              value={formData.contactEmail}
              onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
              style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <button type="submit" style={{ background: '#28a745', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '4px', cursor: 'pointer' }}>
              Submit Complaint
            </button>
          </form>
        </div>

        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginBottom: '1rem' }}>Track Complaint</h3>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Enter ticket number"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              style={{ flex: 1, padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <button onClick={handleTrack} style={{ background: '#007bff', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>
              Track
            </button>
          </div>
          
          {trackedComplaint && (
            <div style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '1rem' }}>
              <h4>Ticket: {trackedComplaint.ticketNumber}</h4>
              <p><strong>Status:</strong> {trackedComplaint.status}</p>
              <p><strong>Category:</strong> {trackedComplaint.category}</p>
              <p><strong>Priority:</strong> {trackedComplaint.priority}</p>
              <p><strong>Description:</strong> {trackedComplaint.description}</p>
              <p><strong>Created:</strong> {new Date(trackedComplaint.createdOn).toLocaleDateString()}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SocietiesTab = ({ societies, isAdmin, user }) => {
  const [showAddSociety, setShowAddSociety] = useState(false);
  const [societyForm, setSocietyForm] = useState({ name: '', address: '', description: '' });

  const handleAddSociety = async (e) => {
    e.preventDefault();
    try {
      await societyAPI.create(societyForm);
      setSocietyForm({ name: '', address: '', description: '' });
      setShowAddSociety(false);
      alert('Society created successfully');
      window.location.reload();
    } catch (error) {
      alert('Error creating society');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Societies</h2>
        {(isAdmin || user?.roles?.some(role => role.includes('RWA'))) && (
          <button
            onClick={() => setShowAddSociety(true)}
            style={{ background: '#007bff', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
          >
            Add Society
          </button>
        )}
      </div>

      {showAddSociety && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', width: '100%', maxWidth: '500px' }}>
            <h3 style={{ marginBottom: '1rem' }}>Add New Society</h3>
            <form onSubmit={handleAddSociety}>
              <input
                type="text"
                placeholder="Society Name"
                value={societyForm.name}
                onChange={(e) => setSocietyForm({...societyForm, name: e.target.value})}
                required
                style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}
              />
              <input
                type="text"
                placeholder="Address"
                value={societyForm.address}
                onChange={(e) => setSocietyForm({...societyForm, address: e.target.value})}
                required
                style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}
              />
              <textarea
                placeholder="Description"
                value={societyForm.description}
                onChange={(e) => setSocietyForm({...societyForm, description: e.target.value})}
                style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px', minHeight: '80px' }}
              />
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowAddSociety(false)}
                  style={{ background: '#6c757d', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: '#007bff', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Add Society
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {societies.map(society => (
          <div key={society.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>{society.name}</h3>
            <p style={{ color: '#666', marginBottom: '0.5rem' }}>{society.address}</p>
            {society.description && <p style={{ fontSize: '0.875rem' }}>{society.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

const NoticesTab = ({ notices, isAdmin }) => {
  const [showAddNotice, setShowAddNotice] = useState(false);
  const [noticeForm, setNoticeForm] = useState({ title: '', content: '' });

  const handleAddNotice = async (e) => {
    e.preventDefault();
    try {
      await noticeAPI.create(noticeForm);
      setNoticeForm({ title: '', content: '' });
      setShowAddNotice(false);
      alert('Notice created successfully');
      window.location.reload();
    } catch (error) {
      alert('Error creating notice');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Notices</h2>
        {isAdmin && (
          <button
            onClick={() => setShowAddNotice(true)}
            style={{ background: '#007bff', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
          >
            Add Notice
          </button>
        )}
      </div>

      {showAddNotice && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', width: '100%', maxWidth: '500px' }}>
            <h3 style={{ marginBottom: '1rem' }}>Add New Notice</h3>
            <form onSubmit={handleAddNotice}>
              <input
                type="text"
                placeholder="Notice Title"
                value={noticeForm.title}
                onChange={(e) => setNoticeForm({...noticeForm, title: e.target.value})}
                required
                style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}
              />
              <textarea
                placeholder="Notice Content"
                value={noticeForm.content}
                onChange={(e) => setNoticeForm({...noticeForm, content: e.target.value})}
                required
                style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px', minHeight: '120px' }}
              />
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowAddNotice(false)}
                  style={{ background: '#6c757d', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: '#007bff', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Add Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {notices.map(notice => (
          <div key={notice.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <h3 style={{ margin: 0 }}>{notice.title}</h3>
              {isAdmin && (
                <button
                  onClick={() => noticeAPI.delete(notice.id)}
                  style={{ background: '#dc3545', color: 'white', border: 'none', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}
                >
                  Delete
                </button>
              )}
            </div>
            <p style={{ marginBottom: '0.5rem' }}>{notice.content}</p>
            <small style={{ color: '#666' }}>Posted: {new Date(notice.createdOn).toLocaleDateString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;