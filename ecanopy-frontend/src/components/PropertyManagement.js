import React, { useState, useEffect } from 'react';
import { buildingAPI, flatAPI, societyAPI } from '../api';

const PropertyManagement = () => {
  const [buildings, setBuildings] = useState([]);
  const [flats, setFlats] = useState([]);
  const [societies, setSocieties] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [showAddBuilding, setShowAddBuilding] = useState(false);
  const [showAddFlat, setShowAddFlat] = useState(false);

  const [buildingForm, setBuildingForm] = useState({
    name: '',
    address: '',
    totalFloors: '',
    societyId: ''
  });

  const [flatForm, setFlatForm] = useState({
    flatNumber: '',
    floor: '',
    type: '',
    buildingId: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [buildingsRes, flatsRes, societiesRes] = await Promise.all([
        buildingAPI.getAll(),
        flatAPI.getAll(),
        societyAPI.getAll()
      ]);
      setBuildings(buildingsRes.data);
      setFlats(flatsRes.data);
      setSocieties(societiesRes.data);
    } catch (error) {
      console.error('Error loading property data:', error);
    }
  };

  const handleAddBuilding = async (e) => {
    e.preventDefault();
    try {
      await buildingAPI.create(buildingForm);
      setBuildingForm({ name: '', address: '', totalFloors: '', societyId: '' });
      setShowAddBuilding(false);
      loadData();
      alert('Building added successfully');
    } catch (error) {
      alert('Error adding building');
    }
  };

  const handleAddFlat = async (e) => {
    e.preventDefault();
    try {
      await flatAPI.create(flatForm);
      setFlatForm({ flatNumber: '', floor: '', type: '', buildingId: '' });
      setShowAddFlat(false);
      loadData();
      alert('Flat added successfully');
    } catch (error) {
      alert('Error adding flat');
    }
  };

  const getBuildingFlats = (buildingId) => {
    return flats.filter(flat => flat.buildingId === buildingId);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Property Management</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => setShowAddBuilding(true)}
            style={{ background: '#007bff', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
          >
            Add Building
          </button>
          <button
            onClick={() => setShowAddFlat(true)}
            style={{ background: '#28a745', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
          >
            Add Flat
          </button>
        </div>
      </div>

      {/* Add Building Modal */}
      {showAddBuilding && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', width: '100%', maxWidth: '500px' }}>
            <h3 style={{ marginBottom: '1rem' }}>Add New Building</h3>
            <form onSubmit={handleAddBuilding}>
              <input
                type="text"
                placeholder="Building Name"
                value={buildingForm.name}
                onChange={(e) => setBuildingForm({...buildingForm, name: e.target.value})}
                required
                style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}
              />
              <input
                type="text"
                placeholder="Address"
                value={buildingForm.address}
                onChange={(e) => setBuildingForm({...buildingForm, address: e.target.value})}
                required
                style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}
              />
              <input
                type="number"
                placeholder="Total Floors"
                value={buildingForm.totalFloors}
                onChange={(e) => setBuildingForm({...buildingForm, totalFloors: e.target.value})}
                required
                style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}
              />
              <select
                value={buildingForm.societyId}
                onChange={(e) => setBuildingForm({...buildingForm, societyId: e.target.value})}
                required
                style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                <option value="">Select Society</option>
                {societies.map(society => (
                  <option key={society.id} value={society.id}>{society.name}</option>
                ))}
              </select>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowAddBuilding(false)}
                  style={{ background: '#6c757d', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: '#007bff', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Add Building
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Flat Modal */}
      {showAddFlat && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', width: '100%', maxWidth: '500px' }}>
            <h3 style={{ marginBottom: '1rem' }}>Add New Flat</h3>
            <form onSubmit={handleAddFlat}>
              <input
                type="text"
                placeholder="Flat Number"
                value={flatForm.flatNumber}
                onChange={(e) => setFlatForm({...flatForm, flatNumber: e.target.value})}
                required
                style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}
              />
              <input
                type="number"
                placeholder="Floor"
                value={flatForm.floor}
                onChange={(e) => setFlatForm({...flatForm, floor: e.target.value})}
                required
                style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}
              />
              <select
                value={flatForm.type}
                onChange={(e) => setFlatForm({...flatForm, type: e.target.value})}
                required
                style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                <option value="">Select Type</option>
                <option value="1BHK">1BHK</option>
                <option value="2BHK">2BHK</option>
                <option value="3BHK">3BHK</option>
                <option value="4BHK">4BHK</option>
              </select>
              <select
                value={flatForm.buildingId}
                onChange={(e) => setFlatForm({...flatForm, buildingId: e.target.value})}
                required
                style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                <option value="">Select Building</option>
                {buildings.map(building => (
                  <option key={building.id} value={building.id}>{building.name}</option>
                ))}
              </select>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowAddFlat(false)}
                  style={{ background: '#6c757d', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: '#28a745', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Add Flat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Buildings Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1rem' }}>
        {buildings.map(building => (
          <div key={building.id} style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid #dee2e6' }}>
              <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>{building.name}</h3>
              <p style={{ margin: 0, color: '#666', fontSize: '0.875rem' }}>{building.address}</p>
              <p style={{ margin: 0, color: '#666', fontSize: '0.875rem' }}>Floors: {building.totalFloors}</p>
            </div>
            <div style={{ padding: '1rem' }}>
              <h4 style={{ marginBottom: '0.5rem' }}>Flats ({getBuildingFlats(building.id).length})</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '0.5rem', maxHeight: '150px', overflowY: 'auto' }}>
                {getBuildingFlats(building.id).map(flat => (
                  <div
                    key={flat.id}
                    style={{
                      background: '#f8f9fa',
                      padding: '0.5rem',
                      borderRadius: '4px',
                      textAlign: 'center',
                      fontSize: '0.75rem',
                      border: '1px solid #dee2e6'
                    }}
                  >
                    {flat.flatNumber}
                    <br />
                    <span style={{ color: '#666' }}>{flat.type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyManagement;