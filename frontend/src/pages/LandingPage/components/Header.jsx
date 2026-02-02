import React from 'react'
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

function Header() {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
  return (
    <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className='fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100'
    >
        <div className='container mx-auto px-4 '>
            <div className='flex items-center justify-between h-16'>
                {/* Logo */}
                <div className='flex items-center space-x-3 '>
                    <div className='w-8 h-8 bg-linear-to-r from-blue-600 to to-purple-600 flex items-center justify-center rounded-sm'>
                        <Briefcase className='w-5 h-5 text-white'/>
                    </div>
                    <span className='text-xl font-bold text-gray-900'> JOBNOVA </span>
                </div>

                {/* Navigation Links*/}
                <nav className='hidden md:flex items-center space-x-8'>
                    <a
                    onClick={() => navigate("/find-jobs")}
                    className='text-gray-600 hover:text-gray-900 transition-colors font-medium'
                    >
                        Find Jobs
                    </a>
                    <a
                    onClick={() => {
                        navigate(
                            isAuthenticated && user?.role === "employer"
                                ? "/employer-dashboard"
                                :"/login"
                        );
                    }
                    }
                    className='text-gray-600 hover:text-gray-900 transition-colors font-medium'
                    >
                        For Employers
                    </a>
                </nav>
                {/** Auth Buttons */}
                <div className='flex items-center space-x-3'>
                    {isAuthenticated ? (
                        <div className='flex items-center space-x-3'>
                            <span className=''>Welcome {user?.fullName}</span>
                            <a href={
                                user?.role === "employer"
                                ? "/employer-dashboard"
                                : "/find-jobs"
                            }
                            className='bg-linear-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-sm hover:shadow-md'
                            >Dashboard</a>
                </div>
                    ):
                    <>
                    <a href='/login' className='text-gray-600 hover:text-gray-900 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-gray-50'>Log In</a>
                    <a href='/signup' className=''>Sign Up</a>
                    </>
                    }
                </div>
            </div>
        </div>
    </motion.header>
  )
}

export default Header
