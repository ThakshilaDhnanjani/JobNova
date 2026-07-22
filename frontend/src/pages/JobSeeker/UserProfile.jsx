import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showExpForm, setShowExpForm] = useState(false);
  const [showEduForm, setShowEduForm] = useState(false);

  const [expForm, setExpForm] = useState({
    jobTitle: '', companyName: '', location: '', startDate: '', endDate: '', current: false, description: '',
  });
  const [eduForm, setEduForm] = useState({
    schoolName: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', current: false, description: '',
  });

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

  const handleAddExperience = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post(API_PATHS.AUTH.ADD_EXPERIENCE, expForm);
      setUser((prev) => ({ ...prev, experience: res.data.data }));
      setExpForm({ jobTitle: '', companyName: '', location: '', startDate: '', endDate: '', current: false, description: '' });
      setShowExpForm(false);
    } catch (err) {
      console.error('Failed to add experience:', err.response?.data?.message || err.message);
    }
  };

  const handleDeleteExperience = async (id) => {
    try {
      const res = await axiosInstance.delete(API_PATHS.AUTH.DELETE_EXPERIENCE(id));
      setUser((prev) => ({ ...prev, experience: res.data.data }));
    } catch (err) {
      console.error('Failed to delete experience:', err.response?.data?.message || err.message);
    }
  };

  const handleAddEducation = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post(API_PATHS.AUTH.ADD_EDUCATION, eduForm);
      setUser((prev) => ({ ...prev, education: res.data.data }));
      setEduForm({ schoolName: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', current: false, description: '' });
      setShowEduForm(false);
    } catch (err) {
      console.error('Failed to add education:', err.response?.data?.message || err.message);
    }
  };

  const handleDeleteEducation = async (id) => {
    try {
      const res = await axiosInstance.delete(API_PATHS.AUTH.DELETE_EDUCATION(id));
      setUser((prev) => ({ ...prev, education: res.data.data }));
    } catch (err) {
      console.error('Failed to delete education:', err.response?.data?.message || err.message);
    }
  };

  const fmt = (d) => (d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present');

  if (loading) return <h2 className="p-6">Loading...</h2>;
  if (!user) return <h2 className="p-6">Profile not found</h2>;

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

      {/* Experience section */}
      <div className="bg-white rounded-xl shadow p-6 mt-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold">Experience</h2>
          <button
            className="text-sm text-blue-600 font-medium"
            onClick={() => setShowExpForm((v) => !v)}
          >
            {showExpForm ? 'Cancel' : '+ Add'}
          </button>
        </div>

        {user.experience?.length ? (
          <ul className="space-y-4">
            {user.experience.map((exp) => (
              <li key={exp._id} className="border-b pb-3 last:border-0">
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold">{exp.jobTitle} · {exp.companyName}</p>
                    <p className="text-sm text-gray-500">
                      {exp.location} · {fmt(exp.startDate)} – {exp.current ? 'Present' : fmt(exp.endDate)}
                    </p>
                    {exp.description && <p className="text-sm mt-1">{exp.description}</p>}
                  </div>
                  <button
                    className="text-xs text-red-500 h-fit"
                    onClick={() => handleDeleteExperience(exp._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No experience added yet.</p>
        )}

        {showExpForm && (
          <form onSubmit={handleAddExperience} className="mt-4 space-y-2">
            <input placeholder="Job Title" required className="border rounded p-2 w-full"
              value={expForm.jobTitle} onChange={(e) => setExpForm({ ...expForm, jobTitle: e.target.value })} />
            <input placeholder="Company" required className="border rounded p-2 w-full"
              value={expForm.companyName} onChange={(e) => setExpForm({ ...expForm, companyName: e.target.value })} />
            <input placeholder="Location" className="border rounded p-2 w-full"
              value={expForm.location} onChange={(e) => setExpForm({ ...expForm, location: e.target.value })} />
            <div className="flex gap-2">
              <input type="date" required className="border rounded p-2 w-full"
                value={expForm.startDate} onChange={(e) => setExpForm({ ...expForm, startDate: e.target.value })} />
              <input type="date" disabled={expForm.current} className="border rounded p-2 w-full"
                value={expForm.endDate} onChange={(e) => setExpForm({ ...expForm, endDate: e.target.value })} />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={expForm.current}
                onChange={(e) => setExpForm({ ...expForm, current: e.target.checked, endDate: '' })} />
              I currently work here
            </label>
            <textarea placeholder="Description" className="border rounded p-2 w-full"
              value={expForm.description} onChange={(e) => setExpForm({ ...expForm, description: e.target.value })} />
            <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2 text-sm">
              Save
            </button>
          </form>
        )}
      </div>

      {/* Education section */}
      <div className="bg-white rounded-xl shadow p-6 mt-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold">Education</h2>
          <button
            className="text-sm text-blue-600 font-medium"
            onClick={() => setShowEduForm((v) => !v)}
          >
            {showEduForm ? 'Cancel' : '+ Add'}
          </button>
        </div>

        {user.education?.length ? (
          <ul className="space-y-4">
            {user.education.map((edu) => (
              <li key={edu._id} className="border-b pb-3 last:border-0">
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold">{edu.degree} · {edu.schoolName}</p>
                    <p className="text-sm text-gray-500">
                      {edu.fieldOfStudy} · {fmt(edu.startDate)} – {edu.current ? 'Present' : fmt(edu.endDate)}
                    </p>
                    {edu.description && <p className="text-sm mt-1">{edu.description}</p>}
                  </div>
                  <button
                    className="text-xs text-red-500 h-fit"
                    onClick={() => handleDeleteEducation(edu._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No education added yet.</p>
        )}

        {showEduForm && (
          <form onSubmit={handleAddEducation} className="mt-4 space-y-2">
            <input placeholder="School" required className="border rounded p-2 w-full"
              value={eduForm.schoolName} onChange={(e) => setEduForm({ ...eduForm, schoolName: e.target.value })} />
            <input placeholder="Degree" required className="border rounded p-2 w-full"
              value={eduForm.degree} onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })} />
            <input placeholder="Field of Study" className="border rounded p-2 w-full"
              value={eduForm.fieldOfStudy} onChange={(e) => setEduForm({ ...eduForm, fieldOfStudy: e.target.value })} />
            <div className="flex gap-2">
              <input type="date" required className="border rounded p-2 w-full"
                value={eduForm.startDate} onChange={(e) => setEduForm({ ...eduForm, startDate: e.target.value })} />
              <input type="date" disabled={eduForm.current} className="border rounded p-2 w-full"
                value={eduForm.endDate} onChange={(e) => setEduForm({ ...eduForm, endDate: e.target.value })} />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={eduForm.current}
                onChange={(e) => setEduForm({ ...eduForm, current: e.target.checked, endDate: '' })} />
              Currently studying here
            </label>
            <textarea placeholder="Description" className="border rounded p-2 w-full"
              value={eduForm.description} onChange={(e) => setEduForm({ ...eduForm, description: e.target.value })} />
            <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2 text-sm">
              Save
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default UserProfile;