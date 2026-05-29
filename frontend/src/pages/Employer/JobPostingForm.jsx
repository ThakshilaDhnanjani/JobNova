import {
  AlertCircle,
  Briefcase,
  DollarSign,
  Eye,
  MapPin,
  Send,
  Users
} from "lucide-react";
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import InputField from '../../components/Input/InputField';
import SelectField from '../../components/Input/SelectField';
import TextareaField from '../../components/Input/TextareaField';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';
import { CATEGORIES, JOB_TYPES } from '../../utils/data';
import JobPostingPreview from "../../components/Cards/JobPostingPreview";

function JobPostingForm() {

  const navigate = useNavigate();
  const location = useLocation();
  const jobId= location.state?.jobId || null;

  const [formData, setFormData] = useState({
    jobTitle: "",
    location: "",
    category: "",
    jobType: "",
    description: "",
    requirements: "",
    salaryMin: "",
    salaryMax: "",
  });
  const [error, setError] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ 
      ...prev,
      [field]: value 
    }));

    //clear error when user starts typing
    if (error[field]) {
      setError((prev) => ({ 
        ...prev, 
        [field]: "" ,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ValidationErrors = validateForm(formData);
    if (Object.keys(ValidationErrors).length > 0) {
      setError(ValidationErrors);
      return;
    }

    setIsSubmitting(true);

    const jobPlayload = {
      title: formData.jobTitle,
      description: formData.description,
      requirements: formData.requirements,
      location: formData.location,
      category: formData.category,
      jobType: formData.jobType,
      salaryMin: formData.salaryMin,
      salaryMax: formData.salaryMax,
    };

    try {
      const response = jobId
        ? await axiosInstance.put(API_PATHS.JOBS.UPDATE_JOB(jobId), jobPlayload)
        : await axiosInstance.post(API_PATHS.JOBS.POST_JOB, jobPlayload);

      if (response.status === 200 || response.status === 201) {
        toast.success(
          jobId ? 'Job updated successfully!' : 'Job posted successfully!'
        );
        setFormData({
          jobTitle: "",
          location: "",
          category: "",
          jobType: "",
          description: "",
          requirements: "",
          salaryMin: "",
          salaryMax: "",
        });
        navigate('/employer-dashboard');
        return;
      }
      console.error("Unexpected response:", response);
      toast.error("Something went wrong. Please try again.");
    }catch (error) {
      if (error.response?.data?.message) {
        console.error("API Error:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Unexpected Error:", error);
        toast.error("Failed to post job. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Form Validation
  const validateForm = (formData) => {
    const errors = {};

    if (!formData.jobTitle.trim()) {
      errors.jobTitle = "Job title is required";
    }
    if (!formData.category) {
      errors.category = "Category is required";
    }
    if (!formData.jobType) {
      errors.jobType = "Job type is required";
    }
    if (!formData.description.trim()) {
      errors.description = "Job description is required";
    }
    if (!formData.requirements.trim()) {
      errors.requirements = "Job requirements are required";
    }
    if (!formData.salaryMin || !formData.salaryMax) {
      errors.salary = "Both minimum and maximum salary must be provided";
    } else if (parseInt(formData.salaryMin) >= parseInt(formData.salaryMax)) {
      errors.salary = "Minimum salary must be less than maximum salary";
    }

    return errors;
  };

  const isFormValid = () => {
    const ValidationErrors = validateForm(formData);
    return Object.keys(ValidationErrors).length === 0;
  };

  useEffect(() =>{

    const fetchJobDetails = async () => {
      if (jobId) {
        try {
          const response =await axiosInstance.get(
            API_PATHS.JOBS.GET_JOB_BY_ID(jobId)
          );
          const jobData = response.data;
          if (jobData) {
            setFormData({
              jobTitle: jobData.title,
              location: jobData.location,
              category: jobData.category,
              jobType: jobData.jobType || jobData.type,
              description: jobData.description,
              requirements: jobData.requirements,
              salaryMin: jobData.salaryMin,
              salaryMax: jobData.salaryMax,
            });
          }
        }catch (error) {
          console.error("Error fetching job Details");
          if (error.response) {
            console.error("API Error: ", error.response.data.message)
          }
        } 
      }
    };

    fetchJobDetails();

    return () => {

    }
  },[])

  if (isPreview) {
    return (
      <DashboardLayout activeMenu='post-job'>
        <JobPostingPreview
          formData={formData}
          setIsPreview={setIsPreview}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu='post-job'>
      <div className='min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-purple-50/20 py-8 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-4xl mx-auto'>
          <div className='bg-white shadow-xl rounded-2xl p-6'>
            <div className='flex items-center justify-between mb-8'>
              <div>
                <h2 className='text-xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent'>
                  Post a New Job
                </h2>
                <p className='text-gray-600 text-sm mt-1'>
                  Fill out the form below to create your job posting
                </p>
              </div>
              <div className='flex items-center space-x-2'>
                <button
                  onClick={() => setIsPreview(true)}
                  disabled={!isFormValid()}
                  className='group flex items-center space-x-2 px-6 py-3 text-sm font-medium text-gray-600 hover:text-white bg-white/50 hover:bg-linear-to-r hover:from-blue-500 hover:to-blue-600 border border-gray-200 hover:border-transparent rounded-xl transition-all duration-300 shadow-lg shadow-gray-100 hover:shadow-xl transform hover:-translate-y-0.5'
                >
                  <Eye className='w-4 h-4 transition-transform group-hover:-translate-x-1' />
                  <span>Preview</span>
                </button>
              </div>
            </div>

            <div className='space-y-6'>
              {/* Job Title */}
              <InputField
                label='Job Title'
                id='jobTitle'
                placeholder='e.g. Software Engineer'
                value={formData.jobTitle}
                onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                error={error.jobTitle}
                required
                icon={Briefcase}
              />

              {/* Location & Remote */}

              <div className='space-y-4'>
                <div className='flex flex-col sm:flex-row sm:items-end sm:space-x-4 sm:space-y-0'>
                  <div className='flex-1'>
                    <InputField
                      label='Location'
                      id='location'
                      placeholder='e.g. New York, NY'
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      error={error.location}
                      icon={MapPin}
                    />
                  </div>
                </div>
              </div>
              {/* Category & Job Type */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                <SelectField
                  label='Category'
                  id='category'
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  options={CATEGORIES}
                  placeholder='Select a category'
                  error={error.category}
                  required
                  icon={Users}
                />

                <SelectField
                  label='Job Type'
                  id='jobType'
                  value={formData.jobType}
                  onChange={(e) => handleInputChange("jobType", e.target.value)}
                  options={JOB_TYPES}
                  placeholder='Select job type'
                  error={error.jobType}
                  required
                  icon={Briefcase}
                />
              </div>

              {/* Description */}
              <TextareaField
                label='Job Description'
                id='description'
                placeholder='Describe the Role and Responsibilities ...'
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                error={error.description}
                helperText='Include key responsibilities, day-to-day tasks and what makes this role exciting.'
                required
              />

              {/* Requirements */}
              <TextareaField
                label='Requirements'
                id='requirements'
                placeholder='List the Required Skills and Qualifications ...'
                value={formData.requirements}
                onChange={(e) => handleInputChange("requirements", e.target.value)}
                error={error.requirements}
                helperText='Include required skills, experience, education or certifications.'
                required
              />

              {/* Salary Range */}
              <div className='space-y-2'>
                <label className='block text-sm font-medium text-gray-700'>
                  Salary Range <span className='text-red-500'>*</span>
                </label>
                <div className='grid grid-cols-3 gap-3'>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10'>
                      <DollarSign className='h-5 w-5 text-gray-400' />
                    </div>
                    <input
                      type='number'
                      placeholder='Min Salary'
                      value={formData.salaryMin}
                      onChange={(e) => handleInputChange("salaryMin", e.target.value)}
                      className='w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 focus:border-blue-500 transition-colors duration-200 '/>
                  </div>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10'>
                      <DollarSign className='h-5 w-5 text-gray-400' />
                    </div>
                    <input
                      type='number'
                      placeholder='Max Salary'
                      value={formData.salaryMax}
                      onChange={(e) => handleInputChange("salaryMax", e.target.value)}
                      className='w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 focus:border-blue-500 transition-colors duration-200 '
                    />
                  </div>
                </div>
                {error.salary && (
                  <div className='flex items-center space-x-1 text-sm text-red-600'>
                    <AlertCircle className='w-4 h-4' />
                    <span>{error.salary}</span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className='pt-2'>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !isFormValid()}
                  className='w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed outline-none transition-colors duration-200 '
                >
                  {isSubmitting ? (
                    <>
                    <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2 ' />
                    Publishing Job...
                    </>
                    ) : (
                      <>
                      <Send className='w-5 h-5 mr-2 ' />
                      Publish Job
                      </>
                    )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default JobPostingForm
