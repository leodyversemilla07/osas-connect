import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { ChevronRight, BookOpen, Clock, CheckCircle, AlertCircle, Award, DollarSign, Users, Calendar } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { type BreadcrumbItem } from '@/types';


const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/student/dashboard',
  },
];

// Core Types
interface User {
  first_name: string;
  last_name: string;
  middle_name?: string;
  avatar?: string;
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
interface Scholarship {
  id: number;
  name: string;
  type: string;
  amount: string;
  deadline: string;
  status: 'open' | 'closed';
  description: string;
}

interface ScholarshipApplication {
  id: number;
  scholarship_name: string;
  status: string;
  submitted_at: string;
  progress: number;
}

interface DashboardProps {
  auth: Auth;
  student: Student;
  availableScholarships: Scholarship[];
  recentApplications: ScholarshipApplication[];
  totalApplications: number;
  approvedScholarships: number;
}

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
          <div className="border-2 border-yellow-400 rounded-md shadow-md overflow-hidden">            <div className="aspect-square relative bg-gradient-to-b from-gray-100 to-gray-200">
              <Avatar className="w-full h-full rounded-none">
                {auth.user.avatar ? (
                  <AvatarImage
                    src={auth.user.avatar}
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
export default function StudentDashboard({ 
  auth, 
  student, 
  availableScholarships = [], 
  recentApplications = [], 
  totalApplications = 0, 
  approvedScholarships = 0 
}: DashboardProps) {
  // Sample data with enhanced student profile for testing personalization
  const enhancedStudent: Student = {
    ...student,
    gwa: student.gwa || 1.3, // Sample GWA for testing - President's Lister level
    units_enrolled: student.units_enrolled || 21,
    academic_status: student.academic_status || 'regular'
  };

  // Sample scholarship data for demonstration
  const sampleScholarships: Scholarship[] = availableScholarships.length > 0 ? availableScholarships : [
    {
      id: 1,
      name: 'Academic Scholarship (Full)',
      type: 'Academic',
      amount: '₱500/month',
      deadline: '2025-06-30',
      status: 'open',
      description: 'Full academic scholarship for students with exceptional performance'
    },
    {
      id: 2,
      name: 'Economic Assistance Program',
      type: 'Economic Assistance',
      amount: '₱400/month',
      deadline: '2025-05-30',
      status: 'open',
      description: 'Financial assistance for economically disadvantaged students'
    }
  ];

  const sampleApplications: ScholarshipApplication[] = recentApplications.length > 0 ? recentApplications : [
    {
      id: 1,
      scholarship_name: 'Academic Scholarship (Partial)',
      status: 'under_evaluation',
      submitted_at: '2025-05-15',
      progress: 80
    }
  ];

  const getStatusColor = (status: string): string => {
    const colors: { [key: string]: string } = {
      'submitted': 'bg-blue-100 text-blue-800',
      'under_verification': 'bg-yellow-100 text-yellow-800',
      'verified': 'bg-green-100 text-green-800',
      'under_evaluation': 'bg-purple-100 text-purple-800',
      'approved': 'bg-emerald-100 text-emerald-800',
      'rejected': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string): string => {
    const labels: { [key: string]: string } = {
      'submitted': 'Submitted',
      'under_verification': 'Under Verification',
      'verified': 'Verified',
      'under_evaluation': 'Under Evaluation',
      'approved': 'Approved',
      'rejected': 'Rejected',
    };
    return labels[status] || status;
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Student Dashboard" />

      <div className="flex h-full flex-1 flex-col space-y-6 p-6">
        {/* Header Section */}
        <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">Dashboard</h1>
          <p className="text-base text-gray-500 dark:text-gray-400">Welcome to your student dashboard</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalApplications || sampleApplications.length}</div>
              <p className="text-xs text-muted-foreground">Scholarship applications submitted</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved Scholarships</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedScholarships}</div>
              <p className="text-xs text-muted-foreground">Currently receiving</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Scholarships</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sampleScholarships.length}</div>
              <p className="text-xs text-muted-foreground">Open for applications</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current GWA</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enhancedStudent.gwa}</div>
              <p className="text-xs text-muted-foreground">Academic performance</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Available Scholarships */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Available Scholarships</CardTitle>
                  <CardDescription>Scholarships currently open for applications</CardDescription>
                </div>
                <Button asChild variant="outline">
                  <Link href="/student/scholarships">View All</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sampleScholarships.slice(0, 3).map((scholarship) => (
                    <div key={scholarship.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{scholarship.name}</h4>
                          <Badge className="bg-green-100 text-green-800">
                            {scholarship.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {scholarship.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {scholarship.amount}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Button asChild>
                        <Link href={`/scholarships/${scholarship.id}/apply`}>Apply Now</Link>
                      </Button>
                    </div>
                  ))}
                  
                  {sampleScholarships.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No scholarships available at the moment.</p>
                      <p className="text-sm">Check back later for new opportunities.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Applications */}
            <Card>
              <CardHeader>
                <CardTitle>My Applications</CardTitle>
                <CardDescription>Track the status of your scholarship applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sampleApplications.map((application) => (
                    <div key={application.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{application.scholarship_name}</h4>
                        <Badge className={getStatusColor(application.status)}>
                          {getStatusLabel(application.status)}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Progress</span>
                          <span>{application.progress}%</span>
                        </div>
                        <Progress value={application.progress} className="h-2" />
                        <p className="text-sm text-gray-500">
                          Submitted: {new Date(application.submitted_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/scholarships/applications/${application.id}`}>View Details</Link>
                        </Button>
                        {application.status === 'incomplete' && (
                          <Button size="sm" asChild>
                            <Link href={`/scholarships/applications/${application.id}/edit`}>Complete Application</Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {sampleApplications.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No applications submitted yet.</p>
                      <p className="text-sm mb-4">Start by browsing available scholarships.</p>
                      <Button asChild>
                        <Link href="/student/scholarships">Browse Scholarships</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <StudentIDCard auth={auth} student={enhancedStudent} />
            
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" asChild>
                  <Link href="/student/scholarships">Browse Scholarships</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/student/applications">My Applications</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/student/profile">Update Profile</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Eligibility Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Scholarship Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                    Academic Excellence
                  </p>
                  <p className="text-blue-700 dark:text-blue-300">
                    Maintain a GWA of 1.75 or higher to qualify for academic scholarships.
                  </p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="font-medium text-green-800 dark:text-green-200 mb-1">
                    Complete Documentation
                  </p>
                  <p className="text-green-700 dark:text-green-300">
                    Submit all required documents before the deadline to avoid delays.
                  </p>
                </div>
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                    Apply Early
                  </p>
                  <p className="text-yellow-700 dark:text-yellow-300">
                    Applications are processed on a first-come, first-served basis.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
