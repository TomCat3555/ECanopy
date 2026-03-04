import { useState, useEffect } from 'react';
import { societyService } from '../services/societyService';
import { superAdminService } from '../services/superAdminService';
import { indianLocations } from '../data/indianLocations';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Building, Plus, Home, Users } from 'lucide-react';
import { confirmAction, notify } from '../utils/alerts';

export default function SocietySetup() {
    const [societies, setSocieties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSociety, setSelectedSociety] = useState(null);
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const [buildings, setBuildings] = useState([]);
    const [flats, setFlats] = useState([]);
    const [residents, setResidents] = useState([]); // State for residents
    const [showResidents, setShowResidents] = useState(false); // Toggle for residents interaction


    // Forms
    const [showSocietyForm, setShowSocietyForm] = useState(false);
    const [showBuildingForm, setShowBuildingForm] = useState(false);
    const [showFlatForm, setShowFlatForm] = useState(false);

    const [newSociety, setNewSociety] = useState({ societyName: '', address: '', city: '', state: '', postalCode: '' });
    const [newBuilding, setNewBuilding] = useState({ buildingName: '', totalFloors: '' });
    const [newFlat, setNewFlat] = useState({ flatNumber: '', floorNumber: '', flatType: '2BHK' });
    const [newSecretary, setNewSecretary] = useState({ fullName: '', email: '', password: '', phoneNumber: '' });
    const [showSecretaryForm, setShowSecretaryForm] = useState(false);
    const [formBuildingId, setFormBuildingId] = useState('');

    useEffect(() => {
        fetchSocieties();
    }, []);

    const fetchSocieties = async () => {
        try {
            const data = await societyService.getAllSocieties();
            setSocieties(data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch societies', error);
            setLoading(false);
        }
    };

    const fetchBuildings = async (societyId) => {
        try {
            const data = await societyService.getBuildings(societyId);
            setBuildings(data);
            setSelectedBuilding(null);
            setFlats([]);
        } catch (error) {
            console.error('Failed to fetch buildings', error);
        }
    };

    const fetchFlats = async (buildingId) => {
        try {
            const data = await societyService.getFlats(buildingId);
            setFlats(data);
        } catch (error) {
            console.error('Failed to fetch flats', error);
        }
    };

    const fetchResidents = async (societyId) => {
        try {
            const data = await superAdminService.getResidents(societyId);
            setResidents(data);
        } catch (error) {
            console.error('Failed to fetch residents', error);
        }
    };



    const handlePromoteSecretary = async (userId) => {
        const result = await confirmAction({
            title: 'Promote to Secretary?',
            text: 'Are you sure you want to grant secretary privileges to this user?',
            confirmText: 'Yes, Promote'
        });

        if (result.isConfirmed) {
            try {
                await superAdminService.promoteToSecretary(userId);
                notify.success('User promoted to Secretary!');
                fetchResidents(selectedSociety.societyId); // Refresh list
            } catch (error) {
                console.error('Promotion failed', error);
                notify.error('Failed to promote user');
            }
        }
    };

    const handleCreateSociety = async (e) => {
        e.preventDefault();
        try {
            await societyService.createSociety(newSociety);
            setShowSocietyForm(false);
            notify.success('Society created successfully');
            fetchSocieties();
            setNewSociety({ societyName: '', address: '', city: '', state: '', postalCode: '' });
        } catch (error) {
            notify.error('Failed to create society');
        }
    };

    const handleAddBuilding = async (e) => {
        e.preventDefault();
        try {
            await societyService.addBuilding(selectedSociety.societyId, newBuilding);
            setShowBuildingForm(false);
            notify.success('Building added');
            fetchBuildings(selectedSociety.societyId);
            setNewBuilding({ buildingName: '', totalFloors: '' });
        } catch (error) {
            notify.error('Failed to add building');
        }
    };

    const handleAddFlat = async (e) => {
        e.preventDefault();
        try {
            const targetId = formBuildingId || selectedBuilding.buildingId;
            await societyService.addFlat(targetId, newFlat);
            setShowFlatForm(false);
            notify.success('Flat added');
            // If we added to the currently viewed building, refresh flats
            if (selectedBuilding && targetId === selectedBuilding.buildingId) {
                fetchFlats(selectedBuilding.buildingId);
            }
            setNewFlat({ flatNumber: '', floorNumber: '', flatType: '2BHK' });
        } catch (error) {
            notify.error('Failed to add flat');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Manage Societies</h2>
                {!showSocietyForm && (
                    <Button onClick={() => setShowSocietyForm(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        New Society
                    </Button>
                )}
            </div>

            {/* Create Society Form */}
            {showSocietyForm && (
                <div className="bg-white p-6 rounded-lg shadow space-y-4">
                    <h3 className="text-lg font-medium">Create New Society</h3>
                    <form onSubmit={handleCreateSociety} className="space-y-4">
                        <Input label="Name" value={newSociety.societyName} onChange={e => setNewSociety({ ...newSociety, societyName: e.target.value })} required />
                        <Input label="Address" value={newSociety.address} onChange={e => setNewSociety({ ...newSociety, address: e.target.value })} required />
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                <select
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                    value={newSociety.state}
                                    onChange={e => {
                                        setNewSociety({ ...newSociety, state: e.target.value, city: '' });
                                    }}
                                    required
                                >
                                    <option value="">Select State</option>
                                    {Object.keys(indianLocations).map(state => (
                                        <option key={state} value={state}>{state}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                <select
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                    value={newSociety.city}
                                    onChange={e => setNewSociety({ ...newSociety, city: e.target.value })}
                                    required
                                    disabled={!newSociety.state}
                                >
                                    <option value="">Select City</option>
                                    {newSociety.state && indianLocations[newSociety.state]?.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>
                            <Input label="Zip Code" value={newSociety.postalCode} onChange={e => setNewSociety({ ...newSociety, postalCode: e.target.value })} required />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button type="button" variant="ghost" onClick={() => setShowSocietyForm(false)}>Cancel</Button>
                            <Button type="submit">Create</Button>
                        </div>
                    </form>
                </div>
            )}

            {/* Two Pane Layout: Societies List | Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Left Pane: Societies List */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 border-b">
                        <h3 className="text-sm font-medium text-gray-700">Societies</h3>
                    </div>
                    <ul className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                        {societies.map(society => (
                            <li
                                key={society.societyId}
                                className={`px-4 py-4 cursor-pointer hover:bg-gray-50 ${selectedSociety?.societyId === society.societyId ? 'bg-indigo-50' : ''}`}
                                onClick={() => {
                                    setSelectedSociety(society);
                                    fetchBuildings(society.societyId);
                                    fetchResidents(society.societyId);
                                    setShowResidents(true); // Auto-open the section
                                }}
                            >
                                <div className="font-medium text-gray-900">{society.societyName}</div>
                                <div className="text-xs text-gray-500">{society.city}</div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right Pane: Structure (Buildings -> Flats) */}
                <div className="md:col-span-2 space-y-6">
                    {selectedSociety ? (
                        <>
                            {/* Buildings Section */}
                            <div className="bg-white shadow rounded-lg p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                        <Building className="h-5 w-5 mr-2 text-indigo-500" />
                                        Buildings in {selectedSociety.societyName}
                                    </h3>
                                    <Button size="sm" variant="outline" onClick={() => setShowBuildingForm(true)}>
                                        Add Building
                                    </Button>
                                </div>

                                {showBuildingForm && (
                                    <form onSubmit={handleAddBuilding} className="mb-6 p-4 bg-gray-50 rounded border space-y-3">
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input label="Name (e.g. Block A)" value={newBuilding.buildingName} onChange={e => setNewBuilding({ ...newBuilding, buildingName: e.target.value })} required />
                                            <Input label="Total Floors" type="number" value={newBuilding.totalFloors} onChange={e => setNewBuilding({ ...newBuilding, totalFloors: e.target.value })} required />
                                        </div>
                                        <div className="flex justify-end space-x-2">
                                            <Button type="button" size="sm" variant="ghost" onClick={() => setShowBuildingForm(false)}>Cancel</Button>
                                            <Button type="submit" size="sm">Save</Button>
                                        </div>
                                    </form>
                                )}

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {buildings.map(building => (
                                        <div
                                            key={building.buildingId}
                                            className={`p-4 border rounded-lg cursor-pointer hover:shadow-md transition-shadow ${selectedBuilding?.buildingId === building.buildingId ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-200'}`}
                                            onClick={() => {
                                                setSelectedBuilding(building);
                                                fetchFlats(building.buildingId);
                                            }}
                                        >
                                            <div className="font-semibold text-gray-800">{building.buildingName}</div>
                                            <div className="text-xs text-gray-500">{building.totalFloors} Floors</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Flats Section */}
                            {selectedBuilding && (
                                <div className="bg-white shadow rounded-lg p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                            <Home className="h-5 w-5 mr-2 text-green-500" />
                                            Flats in {selectedBuilding.buildingName}
                                        </h3>
                                        <Button size="sm" variant="outline" onClick={() => {
                                            setFormBuildingId(selectedBuilding.buildingId);
                                            setShowFlatForm(true);
                                        }}>
                                            Add Flat
                                        </Button>
                                    </div>

                                    {showFlatForm && (
                                        <form onSubmit={handleAddFlat} className="mb-6 p-4 bg-gray-50 rounded border space-y-3">
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {/* Block Dropdown */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Block</label>
                                                    <select
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                                        value={formBuildingId}
                                                        onChange={e => {
                                                            setFormBuildingId(Number(e.target.value));
                                                            setNewFlat(prev => ({ ...prev, floorNumber: '' }));
                                                        }}
                                                        required
                                                    >
                                                        {buildings.map(b => (
                                                            <option key={b.buildingId} value={b.buildingId}>{b.buildingName}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <Input label="Flat Number" value={newFlat.flatNumber} onChange={e => setNewFlat({ ...newFlat, flatNumber: e.target.value })} required />

                                                {/* Floor Dropdown */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Floor</label>
                                                    <select
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                                        value={newFlat.floorNumber}
                                                        onChange={e => setNewFlat({ ...newFlat, floorNumber: e.target.value })}
                                                        required
                                                    >
                                                        <option value="">Select Floor</option>
                                                        {(() => {
                                                            const targetBuilding = buildings.find(b => b.buildingId === Number(formBuildingId));
                                                            const totalFloors = targetBuilding?.totalFloors || 0;
                                                            return Array.from({ length: totalFloors }, (_, i) => i + 1).map(floor => (
                                                                <option key={floor} value={floor}>{floor}</option>
                                                            ));
                                                        })()}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                                    <select
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                                        value={newFlat.flatType}
                                                        onChange={e => setNewFlat({ ...newFlat, flatType: e.target.value })}
                                                    >
                                                        <option value="1BHK">1BHK</option>
                                                        <option value="2BHK">2BHK</option>
                                                        <option value="3BHK">3BHK</option>
                                                        <option value="4BHK">4BHK</option>
                                                        <option value="Penthouse">Penthouse</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="flex justify-end space-x-2">
                                                <Button type="button" size="sm" variant="ghost" onClick={() => setShowFlatForm(false)}>Cancel</Button>
                                                <Button type="submit" size="sm">Save</Button>
                                            </div>
                                        </form>
                                    )}

                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                        {flats.map(flat => (
                                            <div key={flat.flatId} className="p-2 border rounded bg-gray-50 text-center">
                                                <div className="font-bold text-gray-900">{flat.flatNumber}</div>
                                                <div className="text-xs text-gray-500">{flat.flatType}</div>
                                            </div>
                                        ))}
                                    </div>
                                    {flats.length === 0 && <p className="text-gray-500 text-sm">No flats added yet.</p>}
                                </div>
                            )}

                            {/* Residents & Secretary Management Section */}
                            <div className="bg-white shadow rounded-lg p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                        <Users className="h-5 w-5 mr-2 text-purple-500" />
                                        Residents & Secretary
                                    </h3>
                                    <Button size="sm" variant="outline" onClick={() => {
                                        if (!showResidents) fetchResidents(selectedSociety.societyId);
                                        setShowResidents(!showResidents);
                                    }}>
                                        {showResidents ? 'Hide Residents' : 'Manage Secretary'}
                                    </Button>
                                </div>

                                {showResidents && (
                                    <div className="space-y-4">
                                        <div className="flex justify-end">
                                            <Button size="sm" onClick={() => setShowSecretaryForm(!showSecretaryForm)}>
                                                {showSecretaryForm ? 'Cancel Creation' : 'Create New Secretary'}
                                            </Button>
                                        </div>

                                        {showSecretaryForm && (
                                            <div className="p-4 bg-purple-50 rounded border border-purple-200">
                                                <h4 className="font-medium text-purple-900 mb-2">Create Secretary Account</h4>
                                                <form onSubmit={async (e) => {
                                                    e.preventDefault();
                                                    try {
                                                        await superAdminService.createSecretary({ ...newSecretary, societyId: selectedSociety.societyId });
                                                        notify.success("Secretary created successfully!");
                                                        setShowSecretaryForm(false);
                                                        setNewSecretary({ fullName: '', email: '', password: '', phoneNumber: '' });
                                                        fetchResidents(selectedSociety.societyId);
                                                    } catch (err) {
                                                        notify.error(err.response?.data?.message || "Failed to create secretary");
                                                    }
                                                }} className="grid grid-cols-2 gap-3">
                                                    <Input label="Full Name" value={newSecretary.fullName} onChange={e => setNewSecretary({ ...newSecretary, fullName: e.target.value })} required />
                                                    <Input label="Email" type="email" value={newSecretary.email} onChange={e => setNewSecretary({ ...newSecretary, email: e.target.value })} required />
                                                    <Input label="Password" type="password" value={newSecretary.password} onChange={e => setNewSecretary({ ...newSecretary, password: e.target.value })} required />
                                                    <Input label="Phone" value={newSecretary.phoneNumber} onChange={e => setNewSecretary({ ...newSecretary, phoneNumber: e.target.value })} required />
                                                    <div className="col-span-2 pt-2">
                                                        <Button type="submit" className="w-full">Create Secretary</Button>
                                                    </div>
                                                </form>
                                            </div>
                                        )}

                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Building</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flat</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {residents.map((resident) => {
                                                        const isSecretary = resident.roles.includes('ROLE_RWA_SECRETARY');
                                                        return (
                                                            <tr key={resident.id}>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{resident.fullName}</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{resident.email}</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{resident.buildingName || '-'}</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{resident.flatNumber || '-'}</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {resident.roles.map(r => r.replace('ROLE_', '')).join(', ')}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                    {isSecretary ? (
                                                                        <span className="text-green-600 font-bold">Current Secretary</span>
                                                                    ) : (
                                                                        <button
                                                                            onClick={() => handlePromoteSecretary(resident.id)}
                                                                            className="text-indigo-600 hover:text-indigo-900"
                                                                        >
                                                                            Promote
                                                                        </button>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                    {residents.length === 0 && (
                                                        <tr>
                                                            <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">No residents found in this society.</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Pending Requests Section */}

                        </>
                    ) : (
                        <div className="flex h-64 items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                            <span className="text-gray-500">Select a society to view details</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
