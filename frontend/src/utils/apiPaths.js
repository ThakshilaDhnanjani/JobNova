export const BASE_URL = "http://localhost:8000";

export const API_PATHS = {
    AUTH:{
        REGISTER: "/api/auth/register", //signup
        LOGIN: "/api/auth/login", //Authenticate user
        GET_PROFILE: "/api/auth/profile", //get logged in user details
        UPDATE_PROFILE: "/api/user/profile", // update user details
        DELETE_RESUME: "/api/user/resume",// delete resume details
        VIEW_PROFILE: "/api/user/viewProfile", // view authenticated user's profile
        ADD_EXPERIENCE: "/api/user/add-experience", // add experience
        DELETE_EXPERIENCE: (expId) => `/api/user/delete-experience/${expId}`, // delete experience
        ADD_EDUCATION: "/api/user/add-education", // add education
        DELETE_EDUCATION: (eduId) => `/api/user/delete-education/${eduId}`, // delete education
    },

    DASHBOARD: {
        OVERVIEW: `/api/analytics/overview`
    },

    JOBS: {
        GET_ALL_JOBS: '/api/jobs',
        // GET_JOB_By_ID: (id) => `/api/jobs/${id}`,
        POST_JOB: "/api/jobs",
        GET_JOBS_EMPLOYER: "/api/jobs/get-jobs-employer",
        GET_JOB_BY_ID: (id) => `/api/jobs/${id}`,
        UPDATE_JOB: (id) => `/api/jobs/${id}`,
        TOGGLE_CLOSE: (id) => `/api/jobs/${id}/toggle-close`,
        DELETE_JOB: (id) => `/api/jobs/${id}`,
        // DELETE_JOB: (id) => `/api/jobs/${id}`,

        SAVE_JOB: (id) => `/api/saved-jobs/${id}`,
        UNSAVE_JOB: (id) => `/api/saved-jobs/${id}`,
        GET_SAVED_JOBS: '/api/saved-jobs/my',
    },

    APPLICATIONS: {
        APPLY_TO_JOB: (id) => `/api/applications/${id}`,
        GET_ALL_APPLICATIONS: (id) => `/api/applications/job/${id}`,
        GET_EMPLOYER_APPLICATIONS: "/api/applications/employer",
        UPDATE_STATUS: (id) => `/api/applications/${id}/status`,
    },

    IMAGE: {
        UPLOAD_IMAGE: "/api/auth/upload-image"
    }
}








