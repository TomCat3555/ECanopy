import React, { useState } from 'react';
import { complaintAPI } from '../api';

const ComplaintTracker = () => {
  const [ticketNumber, setTicketNumber] = useState('');
  const [complaint, setComplaint] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrack = async () => {
    if (!ticketNumber.trim()) return;
    
    setLoading(true);
    try {
      const response = await complaintAPI.track(ticketNumber);
      setComplaint(response.data);
    } catch (error) {
      alert('Complaint not found');
      setComplaint(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await complaintAPI.addComment(ticketNumber, newComment);
      setNewComment('');
      handleTrack();
    } catch (error) {
      alert('Error adding comment');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Track Your Complaint</h2>
      
      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Enter your ticket number (e.g., TKT-12345)"
            value={ticketNumber}
            onChange={(e) => setTicketNumber(e.target.value.toUpperCase())}
            style={{ flex: 1, padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem' }}
          />
          <button
            onClick={handleTrack}
            disabled={loading || !ticketNumber.trim()}
            style={{ 
              padding: '0.75rem 1.5rem', 
              background: loading ? '#ccc' : '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1rem'
            }}
          >
            {loading ? 'Searching...' : 'Track'}
          </button>
        </div>
      </div>

      {complaint && (
        <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <div style={{ background: '#f8f9fa', padding: '1.5rem', borderBottom: '1px solid #dee2e6' }}>
            <h3>Ticket: {complaint.ticketNumber}</h3>
            <p><strong>Status:</strong> {complaint.status}</p>
            <p><strong>Category:</strong> {complaint.category}</p>
            <p><strong>Description:</strong> {complaint.description}</p>
          </div>

          <div style={{ padding: '1.5rem' }}>
            <h4>Add Comment</h4>
            <form onSubmit={handleAddComment}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', minHeight: '80px' }}
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                style={{ 
                  background: newComment.trim() ? '#007bff' : '#ccc', 
                  color: 'white', 
                  border: 'none', 
                  padding: '0.5rem 1rem', 
                  borderRadius: '4px', 
                  cursor: newComment.trim() ? 'pointer' : 'not-allowed',
                  marginTop: '1rem'
                }}
              >
                Add Comment
              </button>
            </form>
          </div>
        </div>
      )}

      {!complaint && ticketNumber && !loading && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          <h3>No complaint found</h3>
          <p>Please check your ticket number and try again.</p>
        </div>
      )}
    </div>
  );
};

export default ComplaintTracker;