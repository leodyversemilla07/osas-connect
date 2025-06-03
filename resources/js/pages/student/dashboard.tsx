import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
  Clock, Award, DollarSign, Calendar,
  Bell, FileText, Upload, Target,
  GraduationCap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  next_step?: string;
  interview_date?: string;
  documents_status?: string;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'application_status' | 'document_request' | 'interview_schedule' | 'stipend_release' | 'renewal_reminder';
  read_at?: string;
  created_at: string;
}

interface FinancialSummary {
  total_received: number;
  monthly_amount: number;
  next_stipend_date: string;
  payment_history: Array<{
    month: string;
    amount: number;
    status: string;
  }>;
}

interface DashboardProps {
  auth: Auth;
  student: Student;
  availableScholarships: Scholarship[];
  recentApplications: ScholarshipApplication[];
  totalApplications: number;
  approvedScholarships: number;
  notifications?: Notification[];
  financialSummary?: FinancialSummary;
  upcomingDeadlines?: Array<{
    scholarship: string;
    deadline: string;
    type: string;
  }>;
}

// Main Dashboard Component
export default function StudentDashboard({
  auth,
  student,
  availableScholarships = [],
  recentApplications = [],
  totalApplications = 0,
  approvedScholarships = 0,
  notifications = []
}: DashboardProps) {
  // Enhanced student profile for testing personalization
  const enhancedStudent: Student = {
    ...student,
    gwa: student.gwa || 1.3,
    units_enrolled: student.units_enrolled || 21,
    academic_status: student.academic_status || 'regular'
  };

  // Use actual data from props

  const getStatusColor = (status: string): string => {
    const colors: { [key: string]: string } = {
      'submitted': 'border-blue-200 text-blue-800',
      'under_verification': 'border-yellow-200 text-yellow-800',
      'verified': 'border-green-200 text-green-800',
      'under_evaluation': 'border-purple-200 text-purple-800',
      'approved': 'border-emerald-200 text-emerald-800',
      'rejected': 'border-red-200 text-red-800',
    };
    return colors[status] || 'border-gray-200 text-gray-800';
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
                Welcome, {auth.user.first_name}
              </h1>
              <p className="text-base text-gray-500 dark:text-gray-400">
                Student Dashboard
              </p>
            </div>
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 border-0 hover:bg-gray-50 dark:hover:bg-gray-800"
              asChild
            >
              <Link href={route('student.notifications.index')} className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
                {notifications.filter(n => !n.read_at).length > 0 && (
                  <span className="ml-1 inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900">
                    {notifications.filter(n => !n.read_at).length}
                  </span>
                )}
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-gray-200 dark:border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {totalApplications}
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 dark:border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Active Scholarships
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {approvedScholarships}
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 dark:border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Available Scholarships
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {availableScholarships.length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 dark:border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Current GWA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {enhancedStudent.gwa}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Available Scholarships */}
        <Card className="border-gray-200 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-gray-900 dark:text-gray-100">Available Scholarships</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                Scholarships currently open for applications
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 border-0 hover:bg-gray-50 dark:hover:bg-gray-800"
              asChild
            >
              <Link href={route('student.scholarships.index')}>View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {availableScholarships.slice(0, 3).map((scholarship) => (
                <div key={scholarship.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">{scholarship.name}</h4>
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded">
                        {scholarship.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {scholarship.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {scholarship.amount}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Due: {new Date(scholarship.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 border-0 hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => router.visit(route('student.scholarships.index'))}
                  >
                    View Details
                  </Button>
                </div>
              ))}

              {availableScholarships.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No scholarships available at the moment.</p>
                  <p className="text-sm">Check back later for new opportunities.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <Card className="border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">My Applications</CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Track the status of your scholarship applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentApplications.map((application) => (
                <div key={application.id} className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">{application.scholarship_name}</h4>
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium border rounded ${getStatusColor(application.status)}`}>
                      {getStatusLabel(application.status)}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>Progress</span>
                      <span>{application.progress}%</span>
                    </div>
                    <Progress value={application.progress} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">
                        Submitted: {new Date(application.submitted_at).toLocaleDateString()}
                      </span>
                      {application.next_step && (
                        <span className="text-gray-900 dark:text-gray-100 font-medium">
                          Next: {application.next_step}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 border-0 hover:bg-gray-50 dark:hover:bg-gray-800"
                      asChild
                    >
                      <Link href={route('student.scholarships.applications.show', application.id)}>View Details</Link>
                    </Button>
                  </div>
                </div>
              ))}

              {recentApplications.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No applications submitted yet.</p>
                  <p className="text-sm mb-4">Start by browsing available scholarships.</p>
                  <Button
                    variant="ghost"
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 border-0 hover:bg-gray-50 dark:hover:bg-gray-800"
                    asChild
                  >
                    <Link href={route('student.scholarships.index')}>Browse Scholarships</Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card className="border-gray-200 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-gray-900 dark:text-gray-100">Recent Notifications</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 border-0 hover:bg-gray-50 dark:hover:bg-gray-800"
              asChild
            >
              <Link href={route('student.notifications.index')}>View All</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.slice(0, 3).map((notification) => (
              <div key={notification.id} className="p-3 border border-gray-200 dark:border-gray-800 rounded-lg">
                <div className="flex items-start gap-2">
                  <div className={`w-2 h-2 rounded-full mt-2 ${notification.read_at ? 'bg-gray-300 dark:bg-gray-600' : 'bg-gray-900 dark:bg-gray-100'}`} />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">{notification.title}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {new Date(notification.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {notifications.length === 0 && (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No notifications yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <Button
              variant="ghost"
              className="justify-start text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 border-0 hover:bg-gray-50 dark:hover:bg-gray-800"
              asChild
            >
              <Link href={route('student.scholarships.index')} className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Browse Scholarships
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="justify-start text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 border-0 hover:bg-gray-50 dark:hover:bg-gray-800"
              asChild
            >
              <Link href={route('student.applications')} className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                My Applications
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="justify-start text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 border-0 hover:bg-gray-50 dark:hover:bg-gray-800"
              asChild
            >
              <Link href="/student/documents" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Documents
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="justify-start text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 border-0 hover:bg-gray-50 dark:hover:bg-gray-800"
              asChild
            >
              <Link href="/student/profile" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Update Profile
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
