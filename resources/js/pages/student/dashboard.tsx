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
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      'submitted': 'secondary',
      'under_verification': 'outline',
      'verified': 'default',
      'under_evaluation': 'secondary',
      'approved': 'default',
      'rejected': 'destructive',
    };
    return variants[status] || 'outline';
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

      <div className="flex h-full flex-1 flex-col space-y-6 p-4 sm:space-y-8 sm:p-6 lg:space-y-10 lg:p-8">
        {/* Header Section */}
        <div className="pb-6 lg:pb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 lg:h-14 lg:w-14 ring-2 ring-gray-100 dark:ring-gray-800">
                <AvatarImage src={auth.user.avatar} alt={auth.user.first_name} />
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                  {auth.user.first_name.charAt(0)}{auth.user.last_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
                  Welcome, {auth.user.first_name}
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 sm:text-base font-medium">
                  {enhancedStudent.course} • {enhancedStudent.year_level} • ID: {enhancedStudent.student_id}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <Button variant="outline" size="sm" asChild className="min-h-[44px] px-4 font-medium">
                <Link href={route('student.notifications.index')} className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span className="hidden sm:inline">Notifications</span>
                  {notifications.filter(n => !n.read_at).length > 0 && (
                    <Badge variant="destructive" className="px-1.5 py-0.5 text-xs font-bold">
                      {notifications.filter(n => !n.read_at).length}
                    </Badge>
                  )}
                </Link>
              </Button>
            </div>
          </div>
          <Separator className="mt-6 lg:mt-8" />
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-gray-200 dark:border-gray-800 hover:shadow-sm transition-shadow">
            <CardHeader className="pb-3 lg:pb-4 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Applications
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100 lg:text-3xl">
                {totalApplications}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {totalApplications === 0 ? 'Start your journey' : 'Keep applying!'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 dark:border-gray-800 hover:shadow-sm transition-shadow">
            <CardHeader className="pb-3 lg:pb-4 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Active Scholarships
              </CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100 lg:text-3xl">
                {approvedScholarships}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {approvedScholarships > 0 ? 'Congratulations!' : 'Apply for more'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 dark:border-gray-800 hover:shadow-sm transition-shadow">
            <CardHeader className="pb-3 lg:pb-4 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Available Scholarships
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100 lg:text-3xl">
                {availableScholarships.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {availableScholarships.length > 0 ? 'Opportunities await' : 'Check back soon'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 dark:border-gray-800 hover:shadow-sm transition-shadow">
            <CardHeader className="pb-3 lg:pb-4 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Current GWA
              </CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100 lg:text-3xl">
                {enhancedStudent.gwa}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {(enhancedStudent.gwa && enhancedStudent.gwa <= 1.5) ? 'Excellent!' :
                  (enhancedStudent.gwa && enhancedStudent.gwa <= 2.0) ? 'Very good!' : 'Keep improving!'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Important Alerts */}
        {notifications.filter(n => !n.read_at && n.type === 'renewal_reminder').length > 0 && (
          <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
            <Bell className="h-4 w-4" />
            <AlertDescription>
              You have scholarship renewal reminders. Check your notifications for important deadlines.
            </AlertDescription>
          </Alert>
        )}

        {enhancedStudent.gwa && enhancedStudent.gwa > 2.5 && (
          <Alert className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
            <Award className="h-4 w-4" />
            <AlertDescription>
              Your current GWA may affect scholarship eligibility. Consider improving your grades for better opportunities.
            </AlertDescription>
          </Alert>
        )}

        {/* Available Scholarships */}
        <div className="space-y-4 lg:space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 lg:text-2xl">Available Scholarships</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Scholarships currently open for applications
              </p>
            </div>
            <Button variant="outline" size="sm" asChild className="min-h-[44px] px-4">
              <Link href={route('student.scholarships.index')}>View All</Link>
            </Button>
          </div>

          <div className="space-y-4 lg:space-y-6">
            {availableScholarships.slice(0, 3).map((scholarship) => (
              <Card key={scholarship.id} className="border-gray-200 dark:border-gray-800 hover:border-primary/20 transition-colors">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">{scholarship.name}</h4>
                        <Badge variant={scholarship.status === 'open' ? 'default' : 'secondary'}>
                          {scholarship.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {scholarship.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1.5">
                          <DollarSign className="h-3 w-3" />
                          {scholarship.amount}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3 w-3" />
                          Due: {new Date(scholarship.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="min-h-[44px] px-4 sm:mt-0"
                      onClick={() => router.visit(route('student.scholarships.index'))}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {availableScholarships.length === 0 && (
              <Card className="border-gray-200 dark:border-gray-800">
                <CardContent className="text-center py-12 lg:py-16 text-gray-500 dark:text-gray-400">
                  <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="mb-2 text-base font-medium">No scholarships available at the moment.</p>
                  <p className="text-sm">Check back later for new opportunities.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="space-y-4 lg:space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 lg:text-2xl">My Applications</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Track the status of your scholarship applications
              </p>
            </div>
            <Button variant="outline" size="sm" asChild className="min-h-[44px] px-4">
              <Link href={route('student.applications')}>View All</Link>
            </Button>
          </div>

          <div className="space-y-4 lg:space-y-6">
            {recentApplications.map((application) => (
              <Card key={application.id} className="border-gray-200 dark:border-gray-800">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">{application.scholarship_name}</h4>
                        <Badge variant={getStatusVariant(application.status)}>
                          {getStatusLabel(application.status)}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                          <span>Progress</span>
                          <span>{application.progress}%</span>
                        </div>
                        <Progress value={application.progress} className="h-2" />
                        <div className="flex flex-col gap-2 text-sm sm:flex-row sm:justify-between">
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
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" asChild className="min-h-[44px] px-4">
                      <Link href={route('student.scholarships.applications.show', application.id)}>View Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {recentApplications.length === 0 && (
              <Card className="border-gray-200 dark:border-gray-800">
                <CardContent className="text-center py-12 lg:py-16 text-gray-500 dark:text-gray-400">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="mb-2 text-base font-medium">No applications submitted yet.</p>
                  <p className="text-sm mb-6">Start by browsing available scholarships.</p>
                  <Button variant="outline" asChild className="min-h-[44px] px-6">
                    <Link href={route('student.scholarships.index')}>Browse Scholarships</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Recent Notifications */}
        <Card className="border-gray-200 dark:border-gray-800">
          <CardHeader className="flex flex-col gap-2 space-y-0 pb-4 sm:flex-row sm:items-center sm:justify-between lg:pb-6">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 lg:text-xl">Recent Notifications</CardTitle>
            <Button variant="outline" size="sm" asChild className="min-h-[44px] px-4">
              <Link href={route('student.notifications.index')}>View All</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 pt-0 lg:space-y-6">
            {notifications.slice(0, 3).map((notification, index) => (
              <div key={notification.id}>
                <div className="flex items-start gap-3 p-4 rounded-lg border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${notification.read_at ? 'bg-gray-300 dark:bg-gray-600' : 'bg-blue-500 dark:bg-blue-400'}`} />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">{notification.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{notification.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(notification.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {index < notifications.slice(0, 3).length - 1 && (
                  <Separator className="my-4" />
                )}
              </div>
            ))}
            {notifications.length === 0 && (
              <div className="text-center py-8 lg:py-12 text-gray-500 dark:text-gray-400">
                <Bell className="h-8 w-8 mx-auto mb-3 opacity-50" />
                <p className="text-sm font-medium">No notifications yet</p>
                <p className="text-xs mt-1">You'll see important updates here</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-gray-200 dark:border-gray-800">
          <CardHeader className="pb-4 lg:pb-6">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 lg:text-xl">Quick Actions</CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 pt-0 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            <Card className="border-gray-200 dark:border-gray-800 hover:border-primary/20 transition-colors">
              <CardContent className="p-4 lg:p-6">
                <Button variant="ghost" className="w-full h-auto p-0 min-h-[88px]" asChild>
                  <Link href={route('student.scholarships.index')} className="flex flex-col items-center gap-3 text-center">
                    <Target className="h-6 w-6 text-primary lg:h-7 lg:w-7" />
                    <div>
                      <div className="font-medium text-sm lg:text-base">Browse Scholarships</div>
                      <div className="text-xs text-muted-foreground mt-1">Find new opportunities</div>
                    </div>
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-gray-200 dark:border-gray-800 hover:border-primary/20 transition-colors">
              <CardContent className="p-4 lg:p-6">
                <Button variant="ghost" className="w-full h-auto p-0 min-h-[88px]" asChild>
                  <Link href={route('student.applications')} className="flex flex-col items-center gap-3 text-center">
                    <FileText className="h-6 w-6 text-primary lg:h-7 lg:w-7" />
                    <div>
                      <div className="font-medium text-sm lg:text-base">My Applications</div>
                      <div className="text-xs text-muted-foreground mt-1">Track progress</div>
                    </div>
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-gray-200 dark:border-gray-800 hover:border-primary/20 transition-colors">
              <CardContent className="p-4 lg:p-6">
                <Button variant="ghost" className="w-full h-auto p-0 min-h-[88px]" asChild>
                  <Link href="/student/documents" className="flex flex-col items-center gap-3 text-center">
                    <Upload className="h-6 w-6 text-primary lg:h-7 lg:w-7" />
                    <div>
                      <div className="font-medium text-sm lg:text-base">Upload Documents</div>
                      <div className="text-xs text-muted-foreground mt-1">Submit requirements</div>
                    </div>
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-gray-200 dark:border-gray-800 hover:border-primary/20 transition-colors">
              <CardContent className="p-4 lg:p-6">
                <Button variant="ghost" className="w-full h-auto p-0 min-h-[88px]" asChild>
                  <Link href="/student/profile" className="flex flex-col items-center gap-3 text-center">
                    <GraduationCap className="h-6 w-6 text-primary lg:h-7 lg:w-7" />
                    <div>
                      <div className="font-medium text-sm lg:text-base">Update Profile</div>
                      <div className="text-xs text-muted-foreground mt-1">Keep info current</div>
                    </div>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
