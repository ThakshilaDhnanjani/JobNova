import {
  Briefcase,
  Building2,
  Plus,
  TrendingUp,
  Users
} from "lucide-react";
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import JobDashboardCard from '../../components/Cards/JobDashboardCard';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from "../../utils/axiosInstance";

const Card = ({ title, subtitle, headerActions, className, children}) => {
  return (
    <div className={`bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}>
      {(title || headerActions) && (
        <div className='flex items-center justify-between p-6 pb-4'>
          <div>
          {title && (
            <h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
          )}
          {subtitle && (
            <p className='text-sm text-gray-500 mt-1'>{subtitle}</p>
          )}
        </div>
        {headerActions}
        </div>
      )}
      <div className={title ? 'px-6 pb-6' : 'p-6'}>{children}</div>
    </div>
  );
}

const StatCard = ({ title, value, icon : Icon, trend, trendValue, color }) => {
  const colorClasses = {
    blue: "from blue-500 to-blue-600",
    green: "from-emerald-500 to-emerald-600",
    purple: "from-violet-500 to-violet-600",
    orange: "from-orange-500 to-orange-600",
  };
  return (
    <Card 
    className={`bg-linear-to-br ${colorClasses[color]} text-white boarder-0`}>
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-sm font-medium text-white/80'>{title}</p>
          <p className='text-3xl font-bold mt-1'>{value}</p>
          {trend && (
            <div className='flex items-center text-sm mt-2'>
              <TrendingUp className='w-4 h-4  mr-1' />
              <span className='font-medium'>{trendValue}</span>
            </div>
          )}
        </div>
        <div className='p-3 bg-white/10 rounded-xl'>
          <Icon className='w-6 h-6 ' />
        </div>
      </div>
    </Card>
  );
};

const EmployerDashboard = () => {

  const navigate =useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading ] = useState(false);

  const getDashboardOverview = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(API_PATHS.DASHBOARD.OVERVIEW);
      if (response.status === 200) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.log("error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDashboardOverview();
    return () => {};
  },[])

  return (
    <DashboardLayout activeMenue= 'employer-dashboard'>
      {isLoading ?  (
        <LoadingSpinner /> 
      ) : (
        <div className='max-w-7xl mx-auto space-y-8 mb-96'>
          {/* Dashboard Status*/}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 '>
            <StatCard
              title = 'Active Jobs'
              value = {dashboardData?.counts?.totalActiveJobs || 0}
              icon ={Briefcase}
              trend={true}
              trendValue={`${dashboardData?.counts?.trends?.activeJobs || 0}%`}
              color = 'blue'
            />
            <StatCard
              title = 'Total Applicants'
              value = {dashboardData?.counts?.totalApplicants || 0}
              icon ={Users}
              trend={true}
              trendValue={`${dashboardData?.counts?.trends?.applicants || 0}%`}
              color = 'green'
            />
            <StatCard
              title = 'Hired'
              value = {dashboardData?.counts?.totalHired || 0}
              icon ={Building2}
              trend={true}
              trendValue={`${dashboardData?.counts?.trends?.hired || 0}%`}
              color = 'purple'
            />
          </div>
        
        {/* Recent Activities */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <Card 
            title='Recent Job Posts' 
            subtitle='Your latest job postings'
            headerActions={
              <button 
                className='text-sm text-blue-600 hover:text-blue-700 font-medium'
                onClick={() => navigate('/manage-jobs') }
              >
                View All
              </button>
            }
          >
            <div className='space-y-3'>
              {dashboardData?.data?.recentJobs
                ?.slice(0,3)
                .map((job, index) => (
                  <JobDashboardCard key={index} job={job} />
                ))}
            </div>
          </Card> 

          <Card 
            title='Recent Applications' 
            subtitle='Latest candidateapplications'
            headerActions={
              <button 
                className='text-sm text-blue-600 hover:text-blue-700 font-medium'
                onClick={() => navigate('/manage-applications') }
              >
                View All
              </button>
            }
          >
            <div className='space-y-3'>
              {dashboardData?.data?.recentApplications
                ?.slice(0,3)
                .map((data, index) => (
                  <ApplicationDashboardCard 
                  key={index} 
                  application={data?.applicant || ""}
                  position={data?.job?.title || ""}
                  time={moment(data?.updatedAt).fromNow()}
                  />
                ))}
            </div>
            </Card>
        </div>

        {/* Quick Actions */}
        <Card
          title='Quick Actions'
          subtitle='Common task to get you started'
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: " Post New Job",
                  icon: Plus,
                  color: "bg-blue-50 text-blue700",
                  path: "/post-job"
                },
                {
                  title: "Review Applications",
                  icon: Users,
                  color: "bg-green-50 text-green-700",
                  path: "/manage-jobs"
                },
                {
                  title: "Company Settings",
                  icon: Building2,
                  color: "bg-orange-50 text-orange-700",
                  path: "/company-profile"
                }
              ].map((action, index) => (
                <button 
                  key={index}
                  className="flex items-center space-x-3 p-4 rounded-xl bg-gray-100  hover:border-gray-200 hover:shadow-sm transition-all duration-200 text-left"
                  onClick={() => navigate(action.path)}
                >
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-gray-900">{action.title}</span>
                </button>
              ))}
            </div>
          </Card>
      </div>
      )}
    </DashboardLayout>
  )
}

export default EmployerDashboard
