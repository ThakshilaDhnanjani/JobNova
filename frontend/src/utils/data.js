import {
    Search,
    Users,
    FileText,
    MessageSquare,
    BarChart3,
    Shield,
    Clock,
    Award,
    Briefcase,
    Building2,
    LayoutDashboard,
    Plus
} from 'lucide-react'

export const jobSeekersFeatures = [
    {
        icon: Search,
        title: 'Smart Job Matching',
        description: 'AI-powered algorithms to match you with jobs that fit your skills and preferences.'
    },
    {
        icon: FileText,
        title: 'Resume Builder',
        description: 'Create professional resumes in minutes with our easy-to-use resume builder.'
    },
    {
        icon: MessageSquare,
        title: 'Direct Communication',
        description: 'Communicate directly with hiring managers and recruiters through our secure messaging platform.'
    },
    {
        icon: Award,
        title: 'Skill Assessments',
        description: 'Showcase your skills with our industry-recognized assessments and certifications.'
    }
]

export const employersFeatures = [
    {
        icon: Users,
        title: 'Talent Pool Access',
        description: 'Access a vast pool of qualified candidates to find the perfect fit for your job openings.'
    },
    {
        icon: BarChart3,
        title: 'Analytics Dashboard',
        description: 'Track your hiring performance and gain insights into candidate engagement.'
    },
    {
        icon: Shield,
        title: 'Verified Candidates',
        description: "All candidates undergo background verification to ensure you're hiring qualified professionals.",
    },
    {
        icon: Clock,
        title: 'Quick Hiring',
        description: 'Streamline your hiring process with our intuitive job posting and applicant tracking system.'
    }
];

// Navigation items configurations
export const NAVIGATION_MENU = [
    { id: "employer-dashboard", name: "Dashboard", icon: LayoutDashboard },
    { id: "post-job", name: "Post a Job", icon: Plus },
    { id: "manage-jobs", name: "Manage Jobs", icon: Briefcase },
    { id: "applicants", name: "Applicants", icon: Users },
    { id: "company-profile", name: "Company Profile", icon: Building2 }
];

//Categories and Job Types
export const CATEGORIES = [
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Design', label: 'Design' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Sales', label: 'Sales' },
    { value: 'Customer Support', label: 'Customer Support' },
    { value: 'Human Resources', label: 'Human Resources' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Operations', label: 'Operations' },
    { value: 'IT', label: 'IT' },
    { value: 'Education', label: 'Education' },
    { value: 'Other', label: 'Other' },
];

export const JOB_TYPES = [
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' }
];

export const SALARY_RANGES = [
    "Less than $1000",
    "$1000 - $15,000",
    "More than $15,000",
];