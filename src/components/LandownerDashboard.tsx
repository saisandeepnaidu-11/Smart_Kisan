import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { landsAPI, profileAPI, Land } from '../lib/mongodb';
import { MapPin, DollarSign, Droplet, Mountain, Plus, Trash2, Database, Pencil, CheckCircle, Loader2, ToggleLeft, ToggleRight } from 'lucide-react';

export const LandownerDashboard: React.FC = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [lands, setLands] = useState<Land[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLandId, setEditingLandId] = useState<string | null>(null);
  const [editingProfileData, setEditingProfileData] = useState({ email: '', phone: '', address: '' });
  const [editingProfile, setEditingProfile] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const [landForm, setLandForm] = useState({
    title: '', description: '', location: '',
    area: '', price_per_acre: '', soil_type: '', water_availability: '',
    owner_name: '', owner_phone: '', owner_email: '',
  });

  const [editForm, setEditForm] = useState({
    title: '', description: '', price_per_acre: '', soil_type: '', water_availability: '',
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchLands();
    }
  }, [user]);

  // Stats
  const totalLands = lands.length;
  const availableCount = lands.filter(l => l.status === 'available').length;
  const rentedCount = lands.filter(l => l.status === 'rented').length;

  const fetchProfile = async () => {
    if (!user) return;
    try {
      setApiError(null);
      const profileData = await profileAPI.getProfile(user._id);
      if (profileData) {
        setEditingProfileData({
          email: profileData.email || '',
          phone: profileData.phone || '',
          address: profileData.address || '',
        });
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      const msg = error?.message || String(error);
      if (msg.toLowerCase().includes('failed to fetch') || msg.toLowerCase().includes('networkerror')) {
        setApiError('Cannot connect to the backend server. Make sure it is running on port 8000.');
      }
    }
    setLoading(false);
  };

  const fetchLands = async () => {
    if (!user) return;
    try {
      setApiError(null);
      const userLands = await landsAPI.getUserLands(user._id);
      setLands(userLands);
    } catch (error: any) {
      console.error('Error fetching lands:', error);
      const msg = error?.message || String(error);
      if (msg.toLowerCase().includes('failed to fetch') || msg.toLowerCase().includes('networkerror')) {
        setApiError('Cannot connect to the backend server. Make sure it is running on port 8000.');
      } else {
        setApiError('Failed to load your land listings: ' + msg);
      }
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await profileAPI.updateProfile(user._id, {
        email: editingProfileData.email,
        phone: editingProfileData.phone,
        address: editingProfileData.address,
      });
      await refreshProfile();
      setEditingProfile(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddLand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      const landData = {
        owner_id: user._id,
        title: landForm.title,
        description: landForm.description,
        location: landForm.location,
        area: parseFloat(landForm.area),
        price_per_acre: landForm.price_per_acre ? parseFloat(landForm.price_per_acre) : null,
        soil_type: landForm.soil_type || null,
        water_availability: landForm.water_availability || null,
        status: 'available' as const,
      };
      await landsAPI.createLand(landData);
      setLandForm({ title: '', description: '', location: '', area: '', price_per_acre: '', soil_type: '', water_availability: '', owner_name: '', owner_phone: '', owner_email: '' });
      setShowAddForm(false);
      fetchLands();
    } catch (err) {
      console.error('Error adding land:', err);
      alert('Error adding land: ' + err);
    }
  };

  const handleDeleteLand = async (id: string) => {
    if (confirm('Are you sure you want to delete this land listing?')) {
      try {
        await landsAPI.deleteLand(id);
        fetchLands();
      } catch (error) {
        alert('Error deleting land: ' + (error instanceof Error ? error.message : 'Unknown error'));
      }
    }
  };

  const handleToggleStatus = async (land: Land) => {
    setTogglingId(land._id);
    try {
      const newStatus = land.status === 'available' ? 'rented' : 'available';
      await landsAPI.updateLand(land._id, { status: newStatus });
      fetchLands();
    } catch (error) {
      alert('Error updating status: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setTogglingId(null);
    }
  };

  const handleStartEdit = (land: Land) => {
    setEditingLandId(land._id);
    setEditForm({
      title: land.title,
      description: land.description || '',
      price_per_acre: land.price_per_acre?.toString() || '',
      soil_type: land.soil_type || '',
      water_availability: land.water_availability || '',
    });
  };

  const handleSaveEdit = async (landId: string) => {
    try {
      await landsAPI.updateLand(landId, {
        title: editForm.title,
        description: editForm.description,
        price_per_acre: editForm.price_per_acre ? parseFloat(editForm.price_per_acre) : null,
        soil_type: editForm.soil_type || null,
        water_availability: editForm.water_availability || null,
      });
      setEditingLandId(null);
      fetchLands();
    } catch (error) {
      alert('Error updating land: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleCreateSampleData = async () => {
    if (!user) return;
    if (confirm('This will create 3 sample land listings. Continue?')) {
      const sampleLands = [
        { owner_id: user._id, title: 'Prime Agricultural Land - 50 Acres', description: 'Beautiful fertile land perfect for farming. Located near water source.', location: 'Punjab, India', area: 50, price_per_acre: 50000, soil_type: 'Loamy', water_availability: 'Well and canal nearby', status: 'available' as const },
        { owner_id: user._id, title: 'Organic Farm Land - 25 Acres', description: 'Certified organic land suitable for organic farming. Chemical-free for 5 years.', location: 'Karnataka, India', area: 25, price_per_acre: 75000, soil_type: 'Clay loam', water_availability: 'Borewell and river access', status: 'available' as const },
        { owner_id: user._id, title: 'Commercial Farm Land - 100 Acres', description: 'Large commercial farming land with modern irrigation facilities.', location: 'Maharashtra, India', area: 100, price_per_acre: 30000, soil_type: 'Sandy loam', water_availability: 'Drip irrigation system', status: 'available' as const },
      ];
      try {
        for (const land of sampleLands) await landsAPI.createLand(land);
        fetchLands();
        alert('Sample lands created successfully!');
      } catch (error) {
        alert('Error creating sample lands: ' + (error instanceof Error ? error.message : 'Unknown error'));
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-green-600 animate-spin mr-3" />
        <span className="text-lg text-gray-600">Loading your dashboard...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Landowner Dashboard</h1>
        <p className="text-gray-600">Manage your profile and land listings</p>
      </div>

      {/* Backend Error Banner */}
      {apiError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start justify-between gap-4">
          <div>
            <p className="text-red-700 font-semibold">⚠️ Connection Error</p>
            <p className="text-red-600 text-sm mt-1">{apiError}</p>
            <p className="text-red-500 text-xs mt-1">Run: <code className="bg-red-100 px-1 rounded">python -m uvicorn main:app --reload --port 8000</code> inside the <strong>backend/</strong> folder.</p>
          </div>
          <button
            onClick={() => { fetchProfile(); fetchLands(); }}
            className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm whitespace-nowrap"
          >
            Retry
          </button>
        </div>
      )}

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-md p-5 text-center border-t-4 border-blue-500">
          <p className="text-3xl font-bold text-blue-700">{totalLands}</p>
          <p className="text-sm text-gray-500 mt-1">Total Listings</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-5 text-center border-t-4 border-green-500">
          <p className="text-3xl font-bold text-green-700">{availableCount}</p>
          <p className="text-sm text-gray-500 mt-1">Available</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-5 text-center border-t-4 border-orange-400">
          <p className="text-3xl font-bold text-orange-600">{rentedCount}</p>
          <p className="text-sm text-gray-500 mt-1">Rented</p>
        </div>
      </div>

      {/* Profile Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Your Profile</h2>
          <button
            onClick={() => editingProfile ? handleSaveProfile() : setEditingProfile(true)}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {editingProfile ? (saving ? 'Saving...' : 'Save Profile') : 'Edit Profile'}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={profile?.full_name || ''}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={editingProfileData.email}
              onChange={(e) => setEditingProfileData({ ...editingProfileData, email: e.target.value })}
              disabled={!editingProfile}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none disabled:bg-gray-50"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              value={editingProfileData.phone}
              onChange={(e) => setEditingProfileData({ ...editingProfileData, phone: e.target.value })}
              disabled={!editingProfile}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none disabled:bg-gray-50"
              placeholder="Your phone number"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <textarea
              value={editingProfileData.address}
              onChange={(e) => setEditingProfileData({ ...editingProfileData, address: e.target.value })}
              disabled={!editingProfile}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none disabled:bg-gray-50"
              placeholder="Your full address"
            />
          </div>
        </div>
      </div>

      {/* Land Listings */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Your Land Listings</h2>
          <div className="flex space-x-3">
            <button
              onClick={handleCreateSampleData}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Database className="w-5 h-5" />
              <span>Sample Data</span>
            </button>
            <button
              onClick={() => {
                setLandForm(prev => ({ ...prev, owner_name: profile?.full_name || '', owner_phone: profile?.phone || '', owner_email: profile?.email || '' }));
                setShowAddForm(!showAddForm);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Land</span>
            </button>
          </div>
        </div>

        {/* Add Land Form */}
        {showAddForm && (
          <form onSubmit={handleAddLand} className="mb-8 p-6 bg-gray-50 rounded-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Land Listing</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { label: 'Title *', field: 'title', type: 'text', placeholder: 'e.g., Prime Agricultural Land', required: true },
                { label: 'Location *', field: 'location', type: 'text', placeholder: 'e.g., Punjab, India', required: true },
                { label: 'Area (acres) *', field: 'area', type: 'number', placeholder: 'e.g., 100', required: true },
                { label: 'Price per Acre (₹)', field: 'price_per_acre', type: 'number', placeholder: 'e.g., 50000' },
                { label: 'Soil Type', field: 'soil_type', type: 'text', placeholder: 'e.g., Loamy, Clay' },
                { label: 'Water Availability', field: 'water_availability', type: 'text', placeholder: 'e.g., Well, River nearby' },
              ].map(({ label, field, type, placeholder, required }) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                  <input
                    type={type}
                    value={(landForm as any)[field]}
                    onChange={(e) => setLandForm({ ...landForm, [field]: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    placeholder={placeholder}
                    required={required}
                  />
                </div>
              ))}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={landForm.description}
                  onChange={(e) => setLandForm({ ...landForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  placeholder="Describe your land..."
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">Add Land</button>
            </div>
          </form>
        )}

        {lands.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Mountain className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium text-gray-500">No land listings yet.</p>
            <p className="text-sm mt-1">Click "Add New Land" to create your first listing!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lands.map((land) => (
              <div key={land._id} className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow flex flex-col">
                {editingLandId === land._id ? (
                  /* Inline Edit Mode */
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold focus:ring-2 focus:ring-green-500 outline-none"
                      placeholder="Title"
                    />
                    <textarea
                      value={editForm.description}
                      onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                      placeholder="Description"
                    />
                    <input
                      type="number"
                      value={editForm.price_per_acre}
                      onChange={e => setEditForm({ ...editForm, price_per_acre: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                      placeholder="Price per acre (₹)"
                    />
                    <input
                      type="text"
                      value={editForm.soil_type}
                      onChange={e => setEditForm({ ...editForm, soil_type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                      placeholder="Soil type"
                    />
                    <input
                      type="text"
                      value={editForm.water_availability}
                      onChange={e => setEditForm({ ...editForm, water_availability: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                      placeholder="Water availability"
                    />
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => handleSaveEdit(land._id)} className="flex-1 flex items-center justify-center gap-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                        <CheckCircle className="w-4 h-4" /> Save
                      </button>
                      <button onClick={() => setEditingLandId(null)} className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* View Mode */
                  <>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-bold text-gray-900 leading-tight">{land.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ml-2 flex-shrink-0 ${land.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {land.status}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{land.description}</p>

                    <div className="space-y-2 mb-4 flex-1">
                      <div className="flex items-center text-gray-700">
                        <MapPin className="w-4 h-4 mr-2 text-green-600" />
                        <span className="text-sm">{land.location}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Mountain className="w-4 h-4 mr-2 text-green-600" />
                        <span className="text-sm">{land.area} acres</span>
                      </div>
                      {land.price_per_acre && (
                        <div className="flex items-center text-gray-700">
                          <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                          <span className="text-sm">₹{land.price_per_acre.toLocaleString()}/acre</span>
                        </div>
                      )}
                      {land.soil_type && <div className="text-sm text-gray-600"><span className="font-medium">Soil:</span> {land.soil_type}</div>}
                      {land.water_availability && (
                        <div className="flex items-center text-gray-700">
                          <Droplet className="w-4 h-4 mr-2 text-green-600" />
                          <span className="text-sm">{land.water_availability}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-3 gap-2 mt-auto">
                      <button
                        onClick={() => handleStartEdit(land)}
                        className="flex items-center justify-center gap-1 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(land)}
                        disabled={togglingId === land._id}
                        className={`flex items-center justify-center gap-1 py-2 border rounded-lg transition-colors text-sm ${land.status === 'available' ? 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100' : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'} disabled:opacity-60`}
                      >
                        {togglingId === land._id
                          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          : land.status === 'available'
                            ? <ToggleLeft className="w-3.5 h-3.5" />
                            : <ToggleRight className="w-3.5 h-3.5" />
                        }
                        {land.status === 'available' ? 'Rent' : 'Free'}
                      </button>
                      <button
                        onClick={() => handleDeleteLand(land._id)}
                        className="flex items-center justify-center gap-1 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-sm"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Del
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
