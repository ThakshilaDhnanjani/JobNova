import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.AUTH.VIEW_PROFILE);
      const profileData = res.data?.user || res.data?.data || res.data;
      setUser(profileData);
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2 className="p-6">Loading...</h2>;
  }

  if (!user) {
    return <h2 className="p-6">Profile not found</h2>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>

      <div className="bg-white rounded-xl shadow p-6 space-y-3">
        <img
          src={user.avatar || 'https://via.placeholder.com/150'}
          alt="Profile"
          className="w-36 h-36 object-cover rounded-full border"
        />

        <h3 className="text-xl font-semibold">{user.name || user.fullName || 'User'}</h3>
        <p>Email: {user.email}</p>
        <p>Role: {user.role}</p>

        {user.role === 'employer' && (
          <>
            <p>Company: {user.companyName}</p>
            <p>Description: {user.companyDescription}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default UserProfile;