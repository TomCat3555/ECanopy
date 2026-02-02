import React, { useState, useEffect } from 'react';
import { itemAPI } from '../api';

const InventoryManagement = () => {
  const [items, setItems] = useState([]);
  const [showAddItem, setShowAddItem] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemForm, setItemForm] = useState({
    name: '',
    description: '',
    category: '',
    quantity: '',
    location: '',
    condition: 'Good'
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const response = await itemAPI.getAll();
      setItems(response.data);
    } catch (error) {
      console.error('Error loading items:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await itemAPI.update(editingItem.id, itemForm);
        setEditingItem(null);
      } else {
        await itemAPI.create(itemForm);
      }
      setItemForm({ name: '', description: '', category: '', quantity: '', location: '', condition: 'Good' });
      setShowAddItem(false);
      loadItems();
      alert(`Item ${editingItem ? 'updated' : 'added'} successfully`);
    } catch (error) {
      alert(`Error ${editingItem ? 'updating' : 'adding'} item`);
    }
  };

  const handleEdit = (item) => {
    setItemForm(item);
    setEditingItem(item);
    setShowAddItem(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await itemAPI.delete(id);
        loadItems();
        alert('Item deleted successfully');
      } catch (error) {
        alert('Error deleting item');
      }
    }
  };

  const resetForm = () => {
    setItemForm({ name: '', description: '', category: '', quantity: '', location: '', condition: 'Good' });
    setEditingItem(null);
    setShowAddItem(false);
  };

  const categories = ['Furniture', 'Electronics', 'Maintenance', 'Sports', 'Safety', 'Other'];
  const conditions = ['Excellent', 'Good', 'Fair', 'Poor', 'Needs Repair'];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Inventory Management</h2>
        <button
          onClick={() => setShowAddItem(true)}
          style={{ background: '#007bff', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
        >
          Add Item
        </button>
      </div>

      {/* Add/Edit Item Modal */}
      {showAddItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginBottom: '1rem' }}>{editingItem ? 'Edit Item' : 'Add New Item'}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Item Name"
                value={itemForm.name}
                onChange={(e) => setItemForm({...itemForm, name: e.target.value})}
                required
                style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}
              />
              <textarea
                placeholder="Description"
                value={itemForm.description}
                onChange={(e) => setItemForm({...itemForm, description: e.target.value})}
                style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px', minHeight: '80px' }}
              />
              <select
                value={itemForm.category}
                onChange={(e) => setItemForm({...itemForm, category: e.target.value})}
                required
                style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Quantity"
                value={itemForm.quantity}
                onChange={(e) => setItemForm({...itemForm, quantity: e.target.value})}
                required
                style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}
              />
              <input
                type="text"
                placeholder="Location"
                value={itemForm.location}
                onChange={(e) => setItemForm({...itemForm, location: e.target.value})}
                style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}
              />
              <select
                value={itemForm.condition}
                onChange={(e) => setItemForm({...itemForm, condition: e.target.value})}
                style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                {conditions.map(condition => (
                  <option key={condition} value={condition}>{condition}</option>
                ))}
              </select>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={resetForm}
                  style={{ background: '#6c757d', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: editingItem ? '#ffc107' : '#007bff', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
                >
                  {editingItem ? 'Update' : 'Add'} Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Items Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {items.map(item => (
          <div key={item.id} style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <div style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{item.name}</h3>
                <span style={{ 
                  background: item.condition === 'Excellent' ? '#28a745' : 
                             item.condition === 'Good' ? '#007bff' : 
                             item.condition === 'Fair' ? '#ffc107' : '#dc3545',
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem'
                }}>
                  {item.condition}
                </span>
              </div>
              
              <div style={{ marginBottom: '0.5rem' }}>
                <span style={{ background: '#e9ecef', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', marginRight: '0.5rem' }}>
                  {item.category}
                </span>
                <span style={{ fontSize: '0.875rem', color: '#666' }}>Qty: {item.quantity}</span>
              </div>
              
              {item.description && (
                <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>{item.description}</p>
              )}
              
              {item.location && (
                <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '1rem' }}>📍 {item.location}</p>
              )}
              
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => handleEdit(item)}
                  style={{ background: '#ffc107', color: 'white', border: 'none', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  style={{ background: '#dc3545', color: 'white', border: 'none', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          <h3>No items found</h3>
          <p>Start by adding your first inventory item.</p>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;