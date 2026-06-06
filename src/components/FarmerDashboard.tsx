import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { landsAPI, profileAPI } from '../lib/mongodb';
import { MapPin, DollarSign, Droplet, Mountain, Phone, Mail, Search, RefreshCw, Loader2 } from 'lucide-react';

export const FarmerDashboard: React.FC = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [availableLands, setAvailableLands] = useState<any[]>([]);
  const [filteredLands, setFilteredLands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedLand, setSelectedLand] = useState<any>(null);
  const [loadingContact, setLoadingContact] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSoil, setFilterSoil] = useState('');
  const [filterMaxPrice, setFilterMaxPrice] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience_years: '',
    address: '',
  });

  useEffect(() => {
    if (user) {
      fetchFarmerProfile();
      fetchAvailableLands();
    }
  }, [user]);

  // Apply filters whenever lands or filter values change
  useEffect(() => {
    let lands = availableLands;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      lands = lands.filter(l =>
        l.title?.toLowerCase().includes(q) ||
        l.location?.toLowerCase().includes(q) ||
        l.description?.toLowerCase().includes(q)
      );
    }
    if (filterSoil.trim()) {
      lands = lands.filter(l => l.soil_type?.toLowerCase().includes(filterSoil.toLowerCase()));
    }
    if (filterMaxPrice.trim()) {
      const max = parseFloat(filterMaxPrice);
      if (!isNaN(max)) {
        lands = lands.filter(l => !l.price_per_acre || l.price_per_acre <= max);
      }
    }
    setFilteredLands(lands);
  }, [availableLands, searchQuery, filterSoil, filterMaxPrice]);

  const fetchFarmerProfile = async () => {
    if (!user) return;
    try {
      const profileData = await profileAPI.getProfile(user._id);
      if (profileData) {
        setFormData({
          name: profileData.full_name || '',
          email: profileData.email || '',
          phone: profileData.phone || '',
          experience_years: '',
          address: profileData.address || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
    setLoading(false);
  };

  const fetchAvailableLands = async () => {
    try {
      setApiError(null);
      const lands = await landsAPI.getLands();
      const available = lands.filter(land => land.status === 'available');
      setAvailableLands(available);
    } catch (err: any) {
      console.error('Error fetching lands:', err);
      const msg = err?.message || String(err);
      if (msg.toLowerCase().includes('failed to fetch') || msg.toLowerCase().includes('networkerror')) {
        setApiError('Cannot connect to the backend server. Please make sure it is running on port 8000.');
      } else {
        setApiError('Failed to load lands: ' + msg);
      }
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await profileAPI.updateProfile(user._id, {
        full_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      });
      await refreshProfile();
      await fetchFarmerProfile();
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleContactLandowner = async (land: any) => {
    setLoadingContact(true);
    setShowContactModal(true);
    try {
      const ownerProfile = await profileAPI.getProfile(land.owner_id);
      if (!ownerProfile) throw new Error('Could not find landowner details');
      setSelectedLand({ ...land, profiles: ownerProfile });
    } catch (error) {
      console.error('Error fetching landowner details:', error);
      alert('Failed to fetch landowner contact details. Please try again later.');
      setShowContactModal(false);
    } finally {
      setLoadingContact(false);
    }
  };

  const handleCallLandowner = () => {
    if (selectedLand?.profiles?.phone) window.open(`tel:${selectedLand.profiles.phone}`);
  };

  const handleEmailLandowner = () => {
    if (selectedLand?.profiles?.email) {
      const landowner = selectedLand.profiles;
      const subject = `Interest in Land: ${selectedLand.title}`;
      const body = `Hello ${landowner.full_name},\n\nI am interested in your land listing:\n\n- Title: ${selectedLand.title}\n- Location: ${selectedLand.location}\n- Area: ${selectedLand.area} acres\n${selectedLand.price_per_acre ? `- Price: ₹${selectedLand.price_per_acre.toLocaleString()}/acre\n` : ''}${selectedLand.soil_type ? `- Soil Type: ${selectedLand.soil_type}\n` : ''}\nPlease contact me at your earliest convenience.\n\nBest regards,\n${profile?.full_name || formData.name}\nPhone: ${profile?.phone || formData.phone || 'Will provide'}\nEmail: ${profile?.email || formData.email}`;
      window.open(`mailto:${landowner.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    }
  };

  const handleCopyContactInfo = () => {
    const landowner = selectedLand?.profiles;
    const text = `Land: ${selectedLand.title}\nLocation: ${selectedLand.location}\nArea: ${selectedLand.area} acres\nOwner: ${landowner?.full_name || 'N/A'}\nPhone: ${landowner?.phone || 'N/A'}\nEmail: ${landowner?.email || 'N/A'}`;
    navigator.clipboard.writeText(text).then(() => alert('Contact info copied!')).catch(() => alert('Failed to copy.'));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilterSoil('');
    setFilterMaxPrice('');
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Farmer Dashboard</h1>
        <p className="text-gray-600">Manage your profile and explore available lands</p>
      </div>

      {/* Backend Error Banner */}
      {apiError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start justify-between gap-4">
          <div>
            <p className="text-red-700 font-semibold">⚠️ Connection Error</p>
            <p className="text-red-600 text-sm mt-1">{apiError}</p>
            <p className="text-red-500 text-xs mt-1">Run: <code className="bg-red-100 px-1 rounded">python -m uvicorn main:app --reload --port 8000</code> in the backend folder.</p>
          </div>
          <button onClick={fetchAvailableLands} className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm whitespace-nowrap">Retry</button>
        </div>
      )}

      {/* Profile Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Your Profile</h2>
          <button
            onClick={() => editing ? handleSaveProfile() : setEditing(true)}
            disabled={saving}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60 flex items-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {editing ? (saving ? 'Saving...' : 'Save Profile') : 'Edit Profile'}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={!editing}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none disabled:bg-gray-50"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!editing}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none disabled:bg-gray-50"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={!editing}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none disabled:bg-gray-50"
              placeholder="Your phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Experience (years)</label>
            <input
              type="number"
              value={formData.experience_years}
              onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
              disabled={!editing}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none disabled:bg-gray-50"
              placeholder="e.g., 10"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              disabled={!editing}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none disabled:bg-gray-50"
              placeholder="Your full address"
            />
          </div>
        </div>
      </div>

      {/* Available Lands */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Available Lands</h2>
          <button
            onClick={fetchAvailableLands}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 p-4 bg-gray-50 rounded-xl">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by location or title..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm"
            />
          </div>
          <input
            type="text"
            value={filterSoil}
            onChange={e => setFilterSoil(e.target.value)}
            placeholder="Filter by soil type..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm"
          />
          <div className="flex gap-2">
            <input
              type="number"
              value={filterMaxPrice}
              onChange={e => setFilterMaxPrice(e.target.value)}
              placeholder="Max price/acre (₹)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm"
            />
            {(searchQuery || filterSoil || filterMaxPrice) && (
              <button onClick={clearFilters} className="px-3 py-2 text-xs bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors whitespace-nowrap">
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-4">
          Showing {filteredLands.length} of {availableLands.length} available land{availableLands.length !== 1 ? 's' : ''}
        </p>

        {filteredLands.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Mountain className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium text-gray-500">
              {availableLands.length === 0 ? 'No available lands yet.' : 'No lands match your filters.'}
            </p>
            <p className="text-sm mt-1">
              {availableLands.length === 0
                ? 'Check back later for new listings from landowners!'
                : 'Try adjusting your search or filter criteria.'}
            </p>
            {availableLands.length > 0 && (
              <button onClick={clearFilters} className="mt-3 text-green-600 text-sm underline hover:text-green-700">
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLands.map((land) => (
              <div key={land._id || land.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{land.title}</h3>
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Available</span>
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
                      <span className="text-sm">
                        ₹{land.price_per_acre.toLocaleString()}/acre
                        <span className="text-gray-400 ml-1">(Total: ₹{(land.price_per_acre * land.area).toLocaleString()})</span>
                      </span>
                    </div>
                  )}

                  {land.soil_type && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Soil:</span> {land.soil_type}
                    </div>
                  )}

                  {land.water_availability && (
                    <div className="flex items-center text-gray-700">
                      <Droplet className="w-4 h-4 mr-2 text-green-600" />
                      <span className="text-sm">{land.water_availability}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleContactLandowner(land)}
                  className="w-full flex items-center justify-center space-x-2 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mt-auto"
                >
                  <Phone className="w-4 h-4" />
                  <span>Contact Owner</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contact Modal */}
      {showContactModal && selectedLand && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Contact Landowner</h3>
              <button onClick={() => setShowContactModal(false)} className="text-gray-500 hover:text-gray-700 text-xl font-bold">✕</button>
            </div>

            {loadingContact ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 text-green-600 animate-spin mx-auto mb-3" />
                <p className="text-gray-600">Loading contact details...</p>
              </div>
            ) : (
              <>
                <div className="mb-6 space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-3">Land Details</h4>
                    <div className="space-y-1.5 text-sm text-gray-700">
                      <p><span className="font-medium">Title:</span> {selectedLand.title}</p>
                      <p><span className="font-medium">Location:</span> {selectedLand.location}</p>
                      <p><span className="font-medium">Area:</span> {selectedLand.area} acres</p>
                      {selectedLand.price_per_acre && <p><span className="font-medium">Price:</span> ₹{selectedLand.price_per_acre.toLocaleString()}/acre</p>}
                      {selectedLand.soil_type && <p><span className="font-medium">Soil:</span> {selectedLand.soil_type}</p>}
                      {selectedLand.water_availability && <p><span className="font-medium">Water:</span> {selectedLand.water_availability}</p>}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-3">Landowner Details</h4>
                    <div className="space-y-1.5 text-sm text-gray-700">
                      <p><span className="font-medium">Name:</span> {selectedLand.profiles?.full_name || 'Not provided'}</p>
                      <p><span className="font-medium">Phone:</span> {selectedLand.profiles?.phone || 'Not provided'}</p>
                      <p><span className="font-medium">Email:</span> {selectedLand.profiles?.email || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {selectedLand.profiles?.phone && (
                    <button onClick={handleCallLandowner} className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                      <Phone className="w-4 h-4" />
                      Call
                    </button>
                  )}
                  {selectedLand.profiles?.email && (
                    <button onClick={handleEmailLandowner} className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      <Mail className="w-4 h-4" />
                      Email
                    </button>
                  )}
                  <button onClick={handleCopyContactInfo} className="flex-1 flex items-center justify-center py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
                    Copy Details
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
