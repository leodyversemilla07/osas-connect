import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { GraduationCap, ChevronRight, UserPlus, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { type BreadcrumbItem } from '@/types';


const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Student Dashboard',
    href: '/student/dashboard',
  },
];

// Core Types
interface User {
  first_name: string;
  last_name: string;
  middle_name?: string;
  profile_photo_url?: string;
}

interface Auth {
  user: User;
}

// Academic Types
interface Student {
  student_id: string;
  course: string;
  year_level: string;
  scholarships: number;
  gwa?: number;
  units_enrolled?: number;
  academic_status?: 'regular' | 'irregular';
}

// Scholarship Types
interface ScholarshipCriteria {
  gwa_range?: {
    min?: number;
    max: number;
  };
  min_units?: number;
  requirements: string[];
  documents: string[];
}

interface Scholarship {
  id: number;
  name: string;
  type: 'Academic' | 'Student Assistantship' | 'Performing Arts' | 'Economic Assistance';
  deadline: string;
  eligibility: string;
  status: string;
  stipend_amount?: number;
  payment_schedule?: 'monthly' | 'semestral' | 'annual';
  criteria?: ScholarshipCriteria;
}

interface ScholarshipApplication {
  id: number;
  scholarship_name: string;
  type: string;
  status: ApplicationStatus;
  date_submitted: string;
  incomplete_documents?: string[];
  interview_schedule?: string;
  stipend_status?: StipendStatus;
  last_stipend_date?: string;
  amount_received: number;
  renewal_status?: RenewalStatus;
  evaluation_score?: number;
  verifier_comments?: string;
}

// Status Types
type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'under_verification'
  | 'incomplete'
  | 'verified'
  | 'under_evaluation'
  | 'approved'
  | 'rejected'
  | 'end';

type StipendStatus = 'pending' | 'processing' | 'released' | 'on_hold';
type RenewalStatus = 'eligible' | 'ineligible' | 'pending' | 'approved' | 'rejected';

// Theme Constants
const THEME = {
  colors: {
    primary: {
      DEFAULT: '#005a2d',
      dark: '#23b14d',
      light: '#008040'
    },
    secondary: '#febd12',
    success: '#16a34a',
    warning: '#fbbf24',
    error: '#dc2626',
    info: '#3b82f6',
    gradients: {
      primary: 'from-green-800 to-green-700',
      dark: 'from-gray-900 to-gray-800'
    }
  },
  opacity: {
    light: '5',
    dark: '10'
  }
};

// Status Styles
const STATUS_COLORS: Record<ApplicationStatus, string> = {
  draft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
  submitted: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
  under_verification: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
  incomplete: 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100',
  verified: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
  under_evaluation: 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100',
  approved: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100',
  end: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
};

// Course abbreviation mapping
const COURSE_ABBREVIATIONS: Record<string, string> = {
  'Bachelor of Science in Information Technology': 'BSIT',
  'Bachelor of Science in Computer Engineering': 'BSCpE',
  'Bachelor of Science in Tourism Management': 'BSTM',
  'Bachelor of Science in Hospitality Management': 'BSHM',
  'Bachelor of Science in Criminology': 'BSCrim',
  'Bachelor of Arts in Political Science': 'AB PolSci',
  'Bachelor of Secondary Education': 'BSEd',
  'Bachelor of Elementary Education': 'BEEd',
  'Bachelor of Science in Fisheries': 'BSF',
};

// Utility Components
const StatCard = ({ label, value, colorClass }: { label: string; value: string | number; colorClass: string }) => (
  <Card className={`bg-[${colorClass}]/${THEME.opacity.light} dark:bg-[${colorClass}]/${THEME.opacity.dark} border-none`}>
    <CardContent className="p-6">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <span className={`text-2xl font-bold text-[${colorClass}] dark:text-[${THEME.colors.primary.dark}]`}>
          {value}
        </span>
      </div>
    </CardContent>
  </Card>
);

// Main Components
const WelcomeCard = ({ auth, student }: { auth: Auth; student: Student }) => (
  <Card className={`bg-gradient-to-r from-[${THEME.colors.primary.DEFAULT}]/${THEME.opacity.light} to-[${THEME.colors.primary.light}]/${THEME.opacity.light} dark:from-[${THEME.colors.primary.DEFAULT}]/${THEME.opacity.dark} dark:to-[${THEME.colors.primary.light}]/${THEME.opacity.dark}`}>
    <CardContent className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className={`text-2xl font-bold text-[${THEME.colors.primary.DEFAULT}] dark:text-[${THEME.colors.primary.dark}]`}>
            Welcome, {auth.user.first_name} {auth.user.last_name}!
          </h1>
          <p className="text-muted-foreground">Student ID: {student.student_id}</p>
        </div>
        <Button
          variant="default"
          className="bg-green-700 hover:bg-green-800 text-white"
          asChild
        >
          <a href="/settings/profile">
            <UserPlus className="w-4 h-4 mr-2" />
            Complete Profile
          </a>
        </Button>
      </div>
    </CardContent>
  </Card>
);

const StatsOverview = ({ student }: { student: Student }) => (
  <div className="grid gap-4 md:grid-cols-3">
    <StatCard
      label="Course"
      value={student.course}
      colorClass={THEME.colors.primary.DEFAULT}
    />
    <StatCard
      label="Year Level"
      value={student.year_level}
      colorClass={THEME.colors.secondary}
    />
    <StatCard
      label="Active Scholarships"
      value={student.scholarships || '0'}
      colorClass={THEME.colors.primary.light}
    />
  </div>
);

const ScholarshipsList = ({ scholarships }: { scholarships: Scholarship[] }) => (
  <div className="space-y-4">
    {scholarships.map((scholarship) => (
      <div key={scholarship.id}
        className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50">
        <div className="space-y-1">
          <h4 className="font-semibold">{scholarship.name}</h4>
          <p className="text-sm text-muted-foreground">{scholarship.eligibility}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <Badge variant="secondary">
              Deadline: {scholarship.deadline}
            </Badge>
          </div>
          <Button size="sm" asChild>
            <a href={`/scholarships/${scholarship.id}/apply`}>Apply</a>
          </Button>
        </div>
      </div>
    ))}
  </div>
);

// Application components
const MyApplications = ({ applications }: { applications: ScholarshipApplication[] }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <GraduationCap className="h-5 w-5" />
        My Applications
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {applications.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>You haven't applied to any scholarships yet.</p>
            <Button className="mt-4" asChild>
              <a href="/scholarships">View Available Scholarships</a>
            </Button>
          </div>
        ) : (
          applications.map((application) => (
            <div
              key={application.id}
              className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50"
            >
              <div className="space-y-1">
                <h4 className="font-semibold">{application.scholarship_name}</h4>
                <div className="flex gap-2 items-center">
                  <Badge variant="secondary">
                    {application.type}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Submitted: {new Date(application.date_submitted).toLocaleDateString()
                    }</span>
                </div>
                {application.incomplete_documents && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    Missing documents: {application.incomplete_documents.join(', ')}
                  </p>
                )}
                {application.interview_schedule && (
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">
                    Interview scheduled: {new Date(application.interview_schedule).toLocaleString()}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <Badge className={STATUS_COLORS[application.status]}>
                    {application.status.split('_').map(word =>
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </Badge>
                </div>
                <Button size="sm" asChild>
                  <a href={`/scholarships/application/${application.id}`}>View Details</a>
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </CardContent>
  </Card>
);

// Stipend components
// Utility functions
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const StipendTracker = ({ applications }: { applications: ScholarshipApplication[] }) => {
  const approvedApplications = applications.filter(app => app.status === 'approved');
  const totalReceived = approvedApplications.reduce((sum, app) => sum + app.amount_received, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Stipend Tracker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {approvedApplications.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">No active stipends</p>
          ) : (
            <>
              <div className="flex justify-between items-center pb-4 border-b">
                <span className="text-sm font-medium">Total Received</span>
                <span className="text-2xl font-bold">{formatCurrency(totalReceived)}</span>
              </div>
              <div className="space-y-4">
                {approvedApplications.map((application) => (
                  <div key={application.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{application.scholarship_name}</p>
                      <p className="text-sm text-muted-foreground">
                        Last disbursement: {application.last_stipend_date ?
                          formatDate(application.last_stipend_date) :
                          'N/A'
                        }
                      </p>
                    </div>
                    <Badge
                      variant={application.stipend_status === 'released' ? 'default' : 'secondary'}
                      className={application.stipend_status === 'on_hold' ? 'bg-red-100 text-red-800' : ''}
                    >
                      {application.stipend_status || 'pending'}
                    </Badge>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Interview components
const UpcomingInterviews = ({ applications }: { applications: ScholarshipApplication[] }) => {
  const upcomingInterviews = applications.filter(app => app.interview_schedule && new Date(app.interview_schedule) > new Date());

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Upcoming Interviews
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingInterviews.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">No upcoming interviews</p>
          ) : (
            upcomingInterviews.map((application) => (
              <div key={application.id} className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <h4 className="font-medium">{application.scholarship_name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(application.interview_schedule!).toLocaleString()}
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href={`/scholarships/application/${application.id}`}>View Details</a>
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// ID Card Components
const IDCardHeader = () => (
  <div className="bg-gradient-to-r from-green-800 to-green-700 text-white p-5 relative">
    <div className="absolute top-0 left-0 w-full h-full opacity-10">
      <div
        className="w-full h-full"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4-4 1.79-4 4-4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fillOpacity='1' fillRule='evenodd'/%3E%3C/svg%3E\")",
          backgroundSize: "100px 100px",
        }}
      ></div>
    </div>

    <div className="flex items-start relative z-10">            <div className="w-20 h-20 rounded-full bg-white shadow-lg p-1 mr-4 flex-shrink-0">
      <div className="w-full h-full rounded-full flex items-center justify-center bg-white overflow-hidden">
        <img
          src="https://www.minsu.edu.ph/template/images/logo.png"
          alt="Mindoro State University Logo"
          className="w-16 h-16 object-contain"
        />
      </div>
    </div>

      <div className="flex-1">
        <h1 className="text-2xl font-bold tracking-wider">MINDORO</h1>
        <h1 className="text-2xl font-bold tracking-wider">STATE UNIVERSITY</h1>
        <p className="text-sm mt-1 opacity-90 font-light">ORIENTAL MINDORO, PHILIPPINES 5211</p>
      </div>
    </div>

    <div className="mt-4 text-center">
      <div className="bg-green-900 bg-opacity-30 py-1 px-4 rounded-md inline-block mx-auto">
        <p className="text-sm font-medium tracking-wide">STUDENT IDENTIFICATION CARD</p>
      </div>
    </div>
  </div>
);

const IDCardStudentInfo = ({ auth, student }: { auth: Auth; student: Student }) => {
  const courseAbbr = COURSE_ABBREVIATIONS[student.course] || student.course;

  return (
    <div className="bg-white">
      <div className="flex">
        <div className="w-1/3 p-4 relative">
          <div className="border-2 border-yellow-400 rounded-md shadow-md overflow-hidden">
            <div className="aspect-square relative bg-gradient-to-b from-gray-100 to-gray-200">
              <Avatar className="w-full h-full rounded-none">
                {auth.user.profile_photo_url ? (
                  <AvatarImage
                    src={auth.user.profile_photo_url}
                    alt={`${auth.user.first_name}'s photo`}
                  />
                ) : (
                  <AvatarFallback className="text-lg">
                    {auth.user.first_name[0]}{auth.user.last_name[0]}
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
          </div>
        </div>

        <div className="w-2/3 bg-gradient-to-br from-green-800 to-green-700 text-white p-4">
          <div className="border-l-2 border-yellow-400 pl-3">
            <h2 className="text-3xl font-bold">{auth.user.last_name}</h2>
            <p className="text-lg font-medium">
              {auth.user.first_name} {auth.user.middle_name?.[0] || ''}
            </p>
          </div>

          <div className="mt-6 mb-2">
            <div className="flex items-center">
              <ChevronRight className="h-4 w-4 text-yellow-400" />
              <h3 className="text-3xl font-bold ml-1">{courseAbbr}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const IDCardDetails = ({ student }: { student: Student }) => (
  <div>
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-3 px-4">
      <div className="grid grid-cols-2 gap-x-2 gap-y-1">
        <div className="flex items-center">
          <div className="w-1 h-3 bg-yellow-400 mr-2"></div>
          <p className="text-xs font-medium uppercase tracking-wide">Student ID Number</p>
        </div>
        <div>
          <p className="text-xs font-bold tracking-wider">{student.student_id}</p>
        </div>
        <div className="flex items-center">
          <div className="w-1 h-3 bg-yellow-400 mr-2"></div>
          <p className="text-xs font-medium uppercase tracking-wide">Issued</p>
        </div>
        <div>
          <p className="text-xs font-bold tracking-wider">AY {new Date().getFullYear()}-{new Date().getFullYear() + 1}</p>
        </div>
      </div>
    </div>

    <div className="bg-white p-5 text-center">
      <div className="h-8 mb-2 flex items-center justify-center">
        <div className="w-40 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
      </div>
      <p className="font-bold text-sm text-gray-800">DR. ENYA MARIE D. APOSTOL</p>
      <p className="text-xs text-gray-600">University President</p>
    </div>

    <div className="bg-gradient-to-r from-green-800 to-green-700 border-t-2 border-yellow-400 p-3">
      <p className="text-[10px] text-center text-white leading-tight font-light">
        <span className="font-medium">MAIN CAMPUS</span>, Alcate, Victoria
        <span className="mx-2">•</span>
        <span className="font-medium">BONGABONG CAMPUS</span>, Labasan, Bongabong
        <span className="mx-2">•</span>
        <span className="font-medium">CALAPAN CAMPUS</span>, Masipit, Calapan City
      </p>
    </div>
  </div>
);

const StudentIDCard = ({ auth, student }: { auth: Auth; student: Student }) => (
  <div className="w-full max-w-[350px] rounded-xl overflow-hidden shadow-2xl bg-white">
    <IDCardHeader />
    <IDCardStudentInfo auth={auth} student={student} />
    <IDCardDetails student={student} />
  </div>
);

// Main Dashboard Component
export default function StudentDashboard({ auth, student }: { auth: Auth; student: Student }) {
  const scholarships: Scholarship[] = [
    {
      id: 1,
      name: 'Academic Scholarship (Full)',
      type: 'Academic',
      deadline: '2025-05-30',
      eligibility: 'GWA: 1.000 - 1.450 (President\'s Lister)\n• Monthly stipend: ₱500\n• No grade below 1.75\n• Must carry at least 18 units\n• No Drops/Deferred/Failed marks',
      status: 'open',
      stipend_amount: 500,
      payment_schedule: 'monthly',
      criteria: {
        gwa_range: {
          min: 1.000,
          max: 1.450
        },
        min_units: 18,
        requirements: [
          'No grade below 1.75',
          'No Drops/Deferred/Failed marks'
        ],
        documents: [
          'Certified True Copy of Grades',
          'Certificate of Registration',
          'Good Moral Character',
          "Dean's Endorsement"
        ]
      }
    },
    {
      id: 2,
      name: 'Academic Scholarship (Partial)',
      type: 'Academic',
      deadline: '2025-05-30',
      eligibility: 'GWA: 1.460 - 1.750 (Dean\'s Lister)\n• Monthly stipend: ₱300\n• No grade below 2.00\n• Must carry at least 18 units\n• No Drops/Deferred/Failed marks',
      status: 'open',
      stipend_amount: 300,
      payment_schedule: 'monthly',
      criteria: {
        gwa_range: {
          min: 1.460,
          max: 1.750
        },
        min_units: 18,
        requirements: [
          'No grade below 2.00',
          'No Drops/Deferred/Failed marks'
        ],
        documents: [
          'Certified True Copy of Grades',
          'Certificate of Registration',
          'Good Moral Character'
        ]
      }
    },
    {
      id: 3,
      name: 'Student Assistantship Program',
      type: 'Student Assistantship',
      deadline: '2025-05-30',
      eligibility: '• Maximum load of 21 units\n• No failing grades\n• Available for office work (3-4 hrs/day)\n• Must submit parent\'s consent\n• Physical and medical fitness required',
      status: 'open',
      stipend_amount: 0, // Based on work hours
      payment_schedule: 'monthly',
      criteria: {
        min_units: 21, // Maximum units
        requirements: [
          'No failing grades',
          'Available for office work',
          'Medical fitness'
        ],
        documents: [
          'Application Form with 2x2 Picture',
          'Class Schedule',
          "Parent's Consent",
          'Medical Certificate',
          'Interview Assessment Form'
        ]
      }
    },
    {
      id: 4,
      name: 'MinSU Performing Arts (Full)',
      type: 'Performing Arts',
      deadline: '2025-05-30',
      eligibility: '• Active member for 1+ year\n• Regular participation in performances\n• Must maintain good academic standing\n• Monthly stipend: ₱500\n• Certificate from coach/adviser required',
      status: 'open',
      stipend_amount: 500,
      payment_schedule: 'monthly',
      criteria: {
        requirements: [
          'Active membership (1+ year)',
          'Regular performance participation',
          'Good academic standing'
        ],
        documents: [
          'Certification from Group Adviser',
          'Performance Portfolio',
          'Certificate of Registration',
          'Good Moral Character'
        ]
      }
    },
    {
      id: 5,
      name: 'Economic Assistance Program',
      type: 'Economic Assistance',
      deadline: '2025-05-30',
      eligibility: '• GWA not lower than 2.25\n• Must be from low-income family\n• Monthly stipend: ₱400\n• MSWDO Indigency Certificate required\n• Regular load required',
      status: 'open',
      stipend_amount: 400,
      payment_schedule: 'monthly',
      criteria: {
        gwa_range: {
          max: 2.25
        },
        requirements: [
          'From low-income family',
          'Regular load student',
          'No other scholarships'
        ],
        documents: [
          'Application Form with 2x2 Picture',
          'Latest Income Tax Return',
          'MSWDO Indigency Certificate',
          'Barangay Certificate',
          'Good Moral Character',
          'Grades Certification',
          'Certificate of Registration'
        ]
      }
    }
  ];

  const applications: ScholarshipApplication[] = [
    {
      id: 1,
      scholarship_name: 'Academic Excellence Scholarship',
      type: 'Academic',
      status: 'under_verification',
      date_submitted: '2025-05-15',
      amount_received: 0,
      incomplete_documents: ['Recommendation Letter'],
      evaluation_score: 85,
      verifier_comments: 'Pending faculty recommendation'
    },
    {
      id: 2,
      scholarship_name: 'Student Assistantship Program',
      type: 'Work-Study',
      status: 'approved',
      date_submitted: '2025-04-01',
      interview_schedule: '2025-05-25T14:00:00',
      stipend_status: 'pending',
      amount_received: 2500,
      evaluation_score: 92,
      verifier_comments: 'Excellent work ethic shown in interview'
    }
  ];

  // Group dashboard sections
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Student Dashboard" />
      <div className="flex h-full flex-1 gap-6 p-6">
        <div className="flex-1 flex flex-col gap-6">
          {/* Profile Section */}
          <WelcomeCard auth={auth} student={student} />

          {/* Academic & Financial Overview */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  <CardTitle>Academic Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <StatsOverview student={student} />
              </CardContent>
            </Card>
            <StipendTracker applications={applications} />
          </div>

          {/* Applications & Interviews */}
          <div className="grid gap-6 md:grid-cols-2">
            <MyApplications applications={applications} />
            <UpcomingInterviews applications={applications} />
          </div>

          {/* Available Scholarships */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Available Scholarships
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScholarshipsList scholarships={scholarships} />
            </CardContent>
          </Card>
        </div>

        {/* Student ID Card */}
        <div className="hidden lg:block">
          <StudentIDCard auth={auth} student={student} />
        </div>
      </div>
    </AppLayout>
  );
}