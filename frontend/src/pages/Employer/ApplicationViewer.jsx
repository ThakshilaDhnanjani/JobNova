import {
  ArrowLeft,
  Briefcase,
  Calculator,
  Download,
  MapPin,
  Users
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';
import { JOB_TYPES } from '../../utils/data';
import ApplicantProfilePreview from '../../components/Cards/ApplicantProfilePreview';
import StatusBadge from '../../components/StatusBadge';


function ApplicationViewer() {

  const location = useLocation();
  const jobId = location.state?.jobId || null;

  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectApplicant, setSelectApplicant] = useState(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        API_PATHS.APPLICATIONS.GET_ALL_APPLICATIONS(jobId)
      );
      setApplications(response.data);
    }catch (err) {
      console.log("Failed to fetch appications")
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobId) fetchApplications();
    else navigate("/manage-jobs");
  }, []);

  //Group applications by job
  const groupedApplications = useMemo(() => {
    const filtered = applications.filter((app) => app.job.title.toLowerCase());

    return filtered.reduce((acc, app) => {
      const jobId = app.job._id;
      if (!acc[jobId]) {
        acc[jobId] = {
        job: app.job,
        applications: [],
      };
    }
    acc[jobId].applications.push(app);
    return acc;
  }, {});
  }, [applications]);

  const handleDownloadResume = (resumeURL) => {
    window.open(resumeURL, "_blank")
  }

  return (
    <DashboardLayout activeMenu='applicants'> 
      {loading && (
        <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
          <div className='text-center'>
            <div className='animation-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'>
              <p className='mt-4 text-gray-600'>Loading applications...</p>
            </div>
          </div>
        </div>
      )}

      <div className='min-h-screen bg-gray-50'>
        {/*Header*/}
        <div className='mb-8'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex items-center gap-4 mb-4 sm:mb-0'>
              <button
                onClick={() => navigate("/manage-jobs")}
                className='group flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-white bg-white/50 hover:bg-linear-to-r hover:from-blue-500 hover:to-blue-600 border border-gray-200 hover:border-transparent rounded-xl transition-all duration-300 shadow-lg shadow-gray-100 hover:shadow-xl'
              >
                <ArrowLeft className='h-4 w-4 transition-transform group-hover:-translate-x-1' />
                <span>Back</span>
              </button>

              <h1 className='text-xl md:text-2xl font-semibold text-gray-900'>
                Applications Overview
              </h1>
            </div>
          </div>
        </div>
        {/*main Content*/}
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 pb-8'>
          {Object.keys(groupedApplications).length === 0? (
            // Empty state
            <div className='text-center py-16'>
              <Users className='mx-auto h-24 w-24 text-gray-300 ' />
              <h3 className='mt-4 text-lg font-medium text-gray-900'>
                No Applications available
              </h3>
              <p className='mt-2 text-gray-500'>
                No Applications founded at the moment
              </p>
            </div>
          ) : (
            //application by job
            <div className='space-y-8'>
           {Object.values(groupedApplications).map(({job, applications}) => (
           <div key={JOB._id}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          
          {/* JOB HEADER */}
          <div className="bg-linear-to-r from-blue-500 to-blue-600 px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
            <h2 className="text-lg font-semibold text-white">
              {job.title}
              </h2>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-blue-100">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{job.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Briefcase className="h-4 w-4" />
              <span className="text-sm">{job.JOB_TYPE}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm">{job.category}</span>
                </div>
                </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                  <span className="text-sm text-white font-medium">
                    {applications.length} application
                    {applications.length !== 1 ? "s" : ""}
                  </span>
                  </div>
                  </div>
                  </div>
            
          {/* APPLICATIONS LIST*/}
          <div className="p-6">
            <div className="space-y-4">
              {applications.map((applicant) => (
                <div
                  key={applicant._id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-colors"
                >
                  <div className='flex items-center gap-4'>
                    {/*Avatar*/}
                    <div className="shrink-0">
                      {applicant.applicant.avatar ? (
                        <img
                          src={applicant.applicant.avatar}
                          alt={applicant.applicant.name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="font-semibold text-blue-600">
                            {getInitials(applicant.applicant.name)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/*Applicant Info*/}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {applicant.applicant.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {applicant.applicant.email}
                      </p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                        <Calculator className='h-3 w-3' />
                        <span>
                          Applied{" "}
                          {moment(applicant.CreatedAt)?.format(
                            "DD MMM YYYY"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/*Actions*/}
                  <div className='flex items-center gap-3 mt-4 md:mt-0'>
                    <StatusBadge status={applicant.status} />
                    <button
                      onClick={() => handleDownloadResume(applicant.applicant.resume)}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors ">
                        <Download className='h-4 w-4 ' />
                        Resume
                      </button>

                      <button
                      onClick={() => setSelectApplicant(applicant)}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors ">
                        <Eye className='h-4 w-4 ' />
                        View Profile
                      </button>
                  </div>
                </div>
              ))}
            </div>
           </div>   

          </div>
          )
          )}
        </div>
        )}
        </div>
        {/*Profile Modal*/}
        {selectedApplicant && (
          <ApplicantProfilePreview
            selectedApplicant={selectedApplicant}
            setSelectedApplicant={setSelectedApplicant}
            handleDownloadResume={handleDownloadResume}
            handleClose={() => {
              setSelectedApplicant(null);
              fetchApplications();
            }}
          />
        )}
      </div>
    </DashboardLayout>
  )
}

export default ApplicationViewer
