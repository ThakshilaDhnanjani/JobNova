import {
    Building2,
    Clock,
    DollarSign,
    MapPin,
    Users,
} from 'lucide-react';
import moment from 'moment';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Layout/Navbar';
import StatusBadge from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';

function JobDetails() {
  const { user } = useAuth();
  const { jobId } = useParams();
  const [JobDetails, setJobDetails] = useState(null);

  const getJobDetailsById = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.JOBS.GET_JOB_BY_ID(jobId),
        {
          params: { userId: user?._id || null },
        }
      );
      setJobDetails(response.data);
    } catch (error) {
      toast.error('Failed to fetch job details',error);
    }
  };

  const applyToJob = async () => {
    try {
      if (jobId) {
        await axiosInstance.post(API_PATHS.APPLICATIONS.APPLY_TO_JOB(jobId));
        toast.success('Application submitted successfully');
      }
      getJobDetailsById(); 
    } catch (error) {
      console.error('Error applying to job:', error);
      const errorMessage = error?.response?.data?.message;
      toast.error(errorMessage || "Something went wrong while applying to the job. Try again later.");
    }
  };

  useEffect(() => {
    if (jobId && user) {
      getJobDetailsById();
    }
  }, [jobId, user]);

  return (
    <div className='bg-gradient-to-br from-blue-50 via-white to-purple-50 '>
      <Navbar />
      
      <div className='container mx-auto pt-24'>
        {/*Main content*/}
        {JobDetails && (
          <div className='bg-white rounded-lg p-6'>
            {/*Hero section*/}
            <div className='relative px-0 pb-8 border-b border-gray-100'>
              <div className='relative z-10'>
                <div className='flex items-center gap-3 mb-6'>
                  {JobDetails?.company?.companyLogo && !JobDetails.company.companyLogo.startsWith('blob:') ? (
                    <img
                      src={JobDetails?.company?.companyLogo}
                      alt="Logo"
                      className='h-20 w-20 rounded-2xl object-cover border-4 border-white/20 shadow-lg'
                    />
                  ) : (
                    <div className='h-20 w-20 rounded-2xl bg-gray-50 flex items-center justify-center border-2 border-gray-200'>
                      <Building2 className='w-8 h-8 text-gray-400' />
                    </div>
                  )}
                  <div className='flex-1'>
                    <h1 className='text-lg font-semibold text-gray-900 lg:text-xl leading-tight mb-2'>{JobDetails.title}</h1>
                    <div className='flex items-center space-x-4 text-gray-600'>
                      <div className='flex items-center space-x-2'>
                        <MapPin className='w-4 h-4' />
                        <span className='text-sm font-medium'>{JobDetails.location}</span>
                      </div>
                    </div>
                  </div>

                  {JobDetails?.applicationStatus ? (
                    <StatusBadge status={JobDetails.applicationStatus} />
                  ) : (
                    <button
                      className='bg-gradient-to-r from-blue-50 to-blue-50 text-sm text-blue-700 hover:text-white px-6 py-2.5 rounded-xl hover:from-blue-500 hover:to-blue-500 transition-all duration-200 font-semibold transform hover:-translate-y-0.5'
                      onClick={applyToJob}
                    >
                      Apply Now
                    </button>
                  )}
                </div>

                {/*Tags*/}
                <div className='flex flex-wrap gap-3'>
                  <span className='px-4 py-2 bg-blue-50 text-sm text-blue-700 rounded-full font-semibold border border-blue-200'>
                    {JobDetails.category || 'Other'}
                  </span>
                  <span className='px-4 py-2 bg-purple-50 text-sm text-purple-700 rounded-full font-semibold border border-purple-200'>
                    {JobDetails.type}
                  </span>
                  <div className='flex items-center space-x-1 px-4 py-2 bg-gray-50 text-sm text-gray-700 rounded-full font-semibold border border-gray-200'>
                    <Clock className='w-4 h-4' />
                    <span>
                      {JobDetails.createdAt 
                        ? moment(JobDetails.createdAt).format('Do MMM YYYY')
                        : 'N/A'}
                    </span>
                </div>
              </div>
            </div>
          </div>

          {/* content section */}
          <div className='px-0 pb-8 space-y-8'>
            {/*Salary section*/}
            <div className='relative overflow-hidden bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-6'>
              <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-full -translate-y-16 translate-x-16'></div>
              <div className='relative z-10'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-3'>
                    <div className='p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl'>
                      <DollarSign className='w-6 h-6 text-white' />
                    </div>
                    <div>
                      <h3 className='text-sm font-semibold text-gray-900 mb-1'>Compensation</h3>
                      <div className='text-lg text-gray-900 font-bold'>
                        {JobDetails.salaryMin} - {JobDetails.salaryMax}
                        <span className='text-lg text-gray-600 font-normal ml-1'> per year</span>
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center space-x-2 text-sm text-emerald-700  bg-emerald-100 px-3 py-1 rounded-full '>
                    <Users className='w-4 h-4' />
                    <span>Competitive</span>
                  </div>
                </div>
              </div>
            </div>

            {/*Description section*/}
            <div className='space-y-4'>
              <h3 className='text-2xl font-bold text-gray-900 flex items-center space-x-3'>
                <div className='w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full'></div>
                <span className='text-lg '>About This Role</span>
              </h3>
              <div className='bg-gray-50 border border-gray-100 rounded-xl p-6'>
                <div className='text-sm text-gray-700 leading-relaxed whitespace-pre-wrap'>
                  {JobDetails.description}
                </div>
              </div>
            </div>
            {/*Requirements section*/}
            <div className='space-y-4'>
              <h3 className='text-2xl font-bold text-gray-900 flex items-center space-x-3'>
                <div className='w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full'></div>
                <span className='text-lg '>What We Are Looking For</span>
              </h3>
              <div className='bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-6'>
                <div className='text-sm text-gray-700 leading-relaxed whitespace-pre-wrap'>
                  {JobDetails.requirements}
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  )
}

export default JobDetails;
