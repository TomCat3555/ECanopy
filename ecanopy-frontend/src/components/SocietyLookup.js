import React, { useState, useEffect } from 'react';

const SocietyLookup = () => {
  const [societies, setSocieties] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [flats, setFlats] = useState([]);
  const [selectedSociety, setSelectedSociety] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSocieties();
  }, []);

  const loadSocieties = async () => {
    try {
      const response = await fetch('/api/lookup/societies');
      const data = await response.json();
      setSocieties(data);
    } catch (error) {
      console.error('Error loading societies:', error);
    }
  };

  const loadBuildings = async (societyName) => {
    if (!societyName) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/lookup/societies/${encodeURIComponent(societyName)}/buildings`);
      const data = await response.json();
      setBuildings(data);
      setFlats([]);
      setSelectedBuilding('');
    } catch (error) {
      console.error('Error loading buildings:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFlats = async (societyName, buildingName) => {
    if (!societyName || !buildingName) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/lookup/societies/${encodeURIComponent(societyName)}/buildings/${encodeURIComponent(buildingName)}/flats`);
      const data = await response.json();
      setFlats(data);
    } catch (error) {
      console.error('Error loading flats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSocietyChange = (societyName) => {
    setSelectedSociety(societyName);
    setSelectedBuilding('');
    setBuildings([]);
    setFlats([]);
    if (societyName) {
      loadBuildings(societyName);
    }
  };

  const handleBuildingChange = (buildingName) => {
    setSelectedBuilding(buildingName);
    setFlats([]);
    if (buildingName && selectedSociety) {
      loadFlats(selectedSociety, buildingName);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Society Lookup</h2>
      
      <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Society</label>
            <select
              value={selectedSociety}
              onChange={(e) => handleSocietyChange(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              <option value="">Select Society</option>
              {societies.map((society, index) => (
                <option key={index} value={society.name || society}>{society.name || society}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Building</label>
            <select
              value={selectedBuilding}
              onChange={(e) => handleBuildingChange(e.target.value)}
              disabled={!selectedSociety || loading}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              <option value="">Select Building</option>
              {buildings.map((building, index) => (
                <option key={index} value={building.name || building}>{building.name || building}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Flats Display */}
      {flats.length > 0 && (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginBottom: '1rem' }}>Available Flats in {selectedBuilding}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '1rem' }}>
            {flats.map((flat, index) => (
              <div
                key={index}
                style={{
                  background: '#f8f9fa',
                  padding: '1rem',
                  borderRadius: '8px',
                  textAlign: 'center',
                  border: '1px solid #dee2e6'
                }}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                  {flat.flatNumber || flat}
                </div>
                {flat.type && (
                  <div style={{ fontSize: '0.875rem', color: '#666' }}>
                    {flat.type}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          Loading...
        </div>
      )}
    </div>
  );
};

export default SocietyLookup;