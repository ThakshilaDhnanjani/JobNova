import { motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Loader,
  Lock,
  Mail
} from 'lucide-react';
import { useState } from 'react';
import { validateEmail } from '../../utils/helper';
import {useAuth } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const Login = () => {
  const { login } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [formState, setFormState] = useState({
    loading: false,
    errors: {},
    showPassword: false,
    success: false
  });

  const validtePassword = (password) => {
    if (!password) {
      return "Password is required";
      return '';
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
  };

  //handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, [name]: value 
    }));

    // clear error when user start typing
    if (formState.errors[name]) {
      setFormState(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          [name]: ''
        }
      }));
    }
  };

  const validateForm = () => {
    const errors = {
      email: validateEmail(formData.email),
      password: validtePassword(formData.password)
    };

    //Remove empty Errors
    Object.keys(errors).forEach(key => {
      if (!errors[key]) {
        delete errors[key];
      }
    });

    setFormState(prev => ({ ...prev,errors}));
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!validateForm()) return;
    
    setFormState(prev => ({
      ...prev,
      loading: true
    }));

    try {
      //Login API integration
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe
      });
      setFormState(prev => ({
        ...prev,
        loading: false,
        success: true,
        errors: {}
      }));

      const { token, role } = response.data;

      if (token) {
        login(response.data, token);

        setTimeout(() => {
          window.location.href =
            role === "employer"
            ? "/employer-dashboard"
            : "/find-jobs"
        },2000)
      }

      //Redirectbased on user Role
      setTimeout (() => {
        const redirectPath = user.role === 'employer'
        ? '/employer-dashboard'
        : '/find-jobs';
        window.location.href = redirectPath;
      },1500)

    } catch (error) {
      setFormState(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          submit: error.response?.data?.message || 'Login failed. Please try again.'
        },
        loading: false
      }));
    } 
  };

  if (formState.success) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className='max-w-md p-8 bg-white rounded-xl shadow-lg w-full text-center'
        >
          <CheckCircle className='w-16 h-16 text-green-500 mx-auto mb-4' />
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>Welcome Back!</h2>
          <p className='  text-gray-600 mb-4'>
            You have successfully logged in.
          </p>
          <div className='animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto' />
          <p className=' text-gray-500 text-sm mt-2'> Redirecting to Your Dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='max-w-md p-8 bg-white rounded-lg shadow-lg w-full'
        >
          <div className='text-center mb-8'>
            <h2 className='text-2xl font-bold text-gray-900 mb-2'>Welcome Back</h2>
            <p className=' text-gray-600'>Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Email Field */}
            <div>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-2'>
                Email Address
              </label>
              <div className='relative'>
                <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${formState.errors.email ? 'border-red-500' : 'border-gray-300'} focus:boder-transparent focus:ring-2 focus:ring-blue-500 transition-colors`}
                  placeholder='Enter Your Email'
                  />
              </div>
              {formState.errors.email && (
                <p className='text-red-500 text-sm mt-1 flex items-center'>
                  <AlertCircle className='w-4 h-4 mr-1' />
                    {formState.errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-2'>
                Password
              </label>
              <div className='relative'>
                <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                <input
                  type={formState.showPassword ? 'text' : 'password'}
                  name='password'
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 rounded-lg border ${formState.errors.password ? 'border-red-500' : 'border-gray-300'} focus:boder-transparent focus:ring-2 focus:ring-blue-500 transition-colors`}
                  placeholder='Enter Your Password'
                  />
                <button
                  type='button'
                  onClick={() => setFormState(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
                  >
                    {formState.showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
                </button>
              </div>
              {formState.errors.password && (
                <p className='text-red-500 text-sm mt-1 flex items-center'>
                  <AlertCircle className='inline w-4 h-4 text-red-500 mr-1' />
                    {formState.errors.password}</p>
              )}
            </div>

            {/* Submit Error */}
            {formState.errors.submit && (
              <div className=' bg-red-50 p-3 rounded-lg border border-red-200'>
                <p className='text-red-700 text-sm flex items-center'>
                  <AlertCircle className='w-4 h-4mr-1' />
                    {formState.errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type='submit'
              disabled={formState.loading}
              className='w-full bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center space-x-2'
              >
                {formState.loading ? (
                  <>
                  <Loader className='w-5 h-5 animate-spin' />
                  <span>Signing In...</span>
                  </>
                ) : (
                  <span> Sign In</span>
                )
                  }
            </button>

            {/* SignUP link*/}
            <div className='text-center'>
              <p className=' text-gray-600'>
                Don't have an account?{' '}
                <a href='/signup' className='text-blue-600 hover:text-blue-800 font-medium'>
                  Create one here.
                </a>
              </p>
            </div> 
          </form>
        </motion.div>
    </div>
  )
}

export default Login;
