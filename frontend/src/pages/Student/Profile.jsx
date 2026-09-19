import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentAPI } from '../../services/api';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile]       = useState(null);
  const [status, setStatus]         = useState('loading'); // 'loading' | 'no-profile' | 'loaded' | 'error'
  const [editing, setEditing]       = useState(false);
  const [saving, setSaving]         = useState(false);
  const [saveMsg, setSaveMsg]       = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    photo: null
  });

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    setStatus('loading');
    try {
      const res = await studentAPI.profile.get();
      setProfile(res.data);
      setFormData({
        firstName: res.data.firstName || '',
        lastName:  res.data.lastName  || '',
        phone:     res.data.phone     || '',
        address:   res.data.address   || '',
        photo:     res.data.photo     || null
      });
      setPhotoPreview(res.data.photo || null);
      setStatus('loaded');
    } catch (err) {
      const reason = err.response?.data?.reason;
      if (err.response?.status === 404 && reason === 'NO_PROFILE') {
        setStatus('no-profile');
      } else {
        setStatus('error');
      }
    }
  };

  // Convert selected image file → base64 string
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Limit to 2MB
    if (file.size > 2 * 1024 * 1024) {
      alert('Photo must be smaller than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
      setFormData((prev) => ({ ...prev, photo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg('');
    try {
      const res = await studentAPI.profile.update(formData);
      setProfile(res.data);
      setPhotoPreview(res.data.photo || null);
      setEditing(false);
      setSaveMsg('Profile updated successfully!');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (err) {
      setSaveMsg(err.response?.data?.message || 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setFormData({
      firstName: profile.firstName || '',
      lastName:  profile.lastName  || '',
      phone:     profile.phone     || '',
      address:   profile.address   || '',
      photo:     profile.photo     || null
    });
    setPhotoPreview(profile.photo || null);
  };

  const formatDate = (d) => {
    if (!d) return '—';
    const dt = new Date(d);
    return isNaN(dt) ? '—' : dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // ── No profile linked ──────────────────────────────────────────────────────
  if (status === 'no-profile') {
    return (
      <div className="p-6 flex justify-center">
        <div className="bg-white rounded-2xl shadow-md p-10 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎓</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Profile Not Set Up</h2>
          <p className="text-gray-500 mb-4 text-sm leading-relaxed">
            Your student profile hasn't been created yet. Please ask your
            <span className="font-semibold text-blue-600"> administrator </span>
            to create a student profile using your email address:
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-6">
            <p className="text-blue-700 font-medium text-sm">{user?.email}</p>
          </div>
          <button
            onClick={fetchProfile}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (status === 'loading') {
    return (
      <div className="p-6 flex justify-center items-center min-h-64">
        <div className="text-center text-gray-400">
          <div className="text-4xl mb-2 animate-pulse">👤</div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (status === 'error') {
    return (
      <div className="p-6 flex justify-center">
        <div className="bg-white rounded-2xl shadow-md p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">Failed to load profile</h2>
          <p className="text-gray-500 text-sm mb-4">Something went wrong. Please try again.</p>
          <button onClick={fetchProfile} className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 text-sm">
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ── Avatar helper ──────────────────────────────────────────────────────────
  const initials = `${profile.firstName?.[0] ?? ''}${profile.lastName?.[0] ?? ''}`.toUpperCase();

  // ── Profile loaded ─────────────────────────────────────────────────────────
  return (
    <div className="p-6 max-w-4xl mx-auto">

      {/* Save banner */}
      {saveMsg && (
        <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${
          saveMsg.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {saveMsg}
        </div>
      )}

      {/* ── Profile card ── */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">

        {/* Header banner */}
        <div className="h-24 bg-gradient-to-r from-purple-500 to-blue-500" />

        {/* Avatar + name row */}
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-12 mb-6">

            {/* Avatar */}
            <div className="relative w-24 h-24 flex-shrink-0">
              {editing ? (
                <>
                  <div
                    onClick={() => fileInputRef.current.click()}
                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg cursor-pointer overflow-hidden bg-gray-100 flex items-center justify-center hover:opacity-80 transition"
                    title="Click to change photo"
                  >
                    {photoPreview ? (
                      <img src={photoPreview} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl font-bold text-gray-400">{initials}</span>
                    )}
                    <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition">
                      <span className="text-white text-xs font-semibold">📷 Change</span>
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                </>
              ) : (
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center">
                  {profile.photo ? (
                    <img src={profile.photo} alt="profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-bold text-white">{initials}</span>
                  )}
                </div>
              )}
            </div>

            {/* Name + email + badge */}
            <div className="mt-3 sm:mt-0 sm:ml-4 flex-1">
              <h2 className="text-2xl font-bold text-gray-800">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-gray-500 text-sm">{user?.email}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                  Student
                </span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  profile.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {profile.isActive ? 'Active' : 'Inactive'}
                </span>
                {profile.classId?.name && (
                  <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {profile.classId.name}
                  </span>
                )}
              </div>
            </div>

            {/* Edit / Save button */}
            <div className="mt-4 sm:mt-0">
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="bg-purple-500 text-white px-5 py-2 rounded-lg hover:bg-purple-600 text-sm font-medium"
                >
                  ✏️ Edit Profile
                </button>
              ) : null}
            </div>
          </div>

          {/* ── View mode ─────────────────────────────────────────────── */}
          {!editing ? (
            <div>
              {/* Identity */}
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <InfoRow label="Full Name"       value={`${profile.firstName} ${profile.lastName}`} />
                <InfoRow label="Email"           value={user?.email} />
                <InfoRow label="Roll Number"     value={profile.rollNumber} />
                <InfoRow label="Gender"          value={profile.gender} capitalize />
                <InfoRow label="Date of Birth"   value={formatDate(profile.dateOfBirth)} />
                <InfoRow label="Phone"           value={profile.phone} />
                <InfoRow label="Address"         value={profile.address} full />
              </div>

              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Academic Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <InfoRow label="Class"           value={profile.classId?.name || 'Not Assigned'} />
                <InfoRow label="Enrollment Date" value={formatDate(profile.enrollmentDate)} />
              </div>

              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Parent / Guardian
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoRow label="Parent Name"  value={profile.parentName} />
                <InfoRow label="Parent Phone" value={profile.parentPhone} />
              </div>
            </div>

          ) : (
            /* ── Edit mode ──────────────────────────────────────────── */
            <form onSubmit={handleUpdate}>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Edit Profile
              </h3>
              <p className="text-xs text-gray-400 mb-4">
                📷 Click the photo above to upload a new photo (JPG / PNG, max 2MB)
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email (login email — read only)</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 disabled:bg-purple-300 disabled:cursor-not-allowed font-medium text-sm"
                >
                  {saving ? 'Saving...' : '💾 Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 font-medium text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// Reusable info row component
const InfoRow = ({ label, value, capitalize, full }) => (
  <div className={full ? 'sm:col-span-2' : ''}>
    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">{label}</p>
    <p className={`text-gray-800 font-medium ${capitalize ? 'capitalize' : ''}`}>
      {value || <span className="text-gray-300">—</span>}
    </p>
  </div>
);

export default Profile;
