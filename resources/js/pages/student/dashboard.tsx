import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { GraduationCap, ChevronRight, UserPlus, Calendar, Clock, AlertTriangle, CheckCircle, Star, TrendingUp, Bell, Target, Lightbulb, Trophy, FileText, Users, Timer, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
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

// Utility functions for personalization
const getDaysUntilDeadline = (deadline: string): number => {
  const deadlineDate = new Date(deadline);
  const currentDate = new Date();
  const timeDiff = deadlineDate.getTime() - currentDate.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

const getDeadlineUrgency = (deadline: string): 'urgent' | 'warning' | 'normal' => {
  const days = getDaysUntilDeadline(deadline);
  if (days <= 3) return 'urgent';
  if (days <= 7) return 'warning';
  return 'normal';
};

const isScholarshipEligible = (scholarship: Scholarship, student: Student): boolean => {
  if (!scholarship.criteria) return true;
  
  const { gwa_range, min_units } = scholarship.criteria;
  
  // Check GWA requirements
  if (gwa_range && student.gwa) {
    if (gwa_range.min && student.gwa < gwa_range.min) return false;
    if (gwa_range.max && student.gwa > gwa_range.max) return false;
  }
  
  // Check unit requirements
  if (min_units && student.units_enrolled && student.units_enrolled < min_units) return false;
  
  return true;
};

const getApplicationProgress = (status: ApplicationStatus): number => {
  const statusProgress: Record<ApplicationStatus, number> = {
    draft: 10,
    submitted: 25,
    under_verification: 40,
    incomplete: 35,
    verified: 60,
    under_evaluation: 80,
    approved: 100,
    rejected: 100,
    end: 100
  };
  return statusProgress[status] || 0;
};

// Personalization utility functions
const getScholarshipScore = (scholarship: Scholarship, student: Student): number => {
  let score = 0;
  
  // Base eligibility score
  if (isScholarshipEligible(scholarship, student)) {
    score += 50;
  }
  
  // GWA match score
  if (scholarship.criteria?.gwa_range && student.gwa) {
    const range = scholarship.criteria.gwa_range;
    const gwa = student.gwa;
    if (range.min && range.max) {
      // Perfect match in middle of range
      const midpoint = (range.min + range.max) / 2;
      const distance = Math.abs(gwa - midpoint);
      const maxDistance = (range.max - range.min) / 2;
      score += Math.max(0, 30 - (distance / maxDistance) * 30);
    }
  }
  
  // Urgency score (more urgent = higher score)
  const urgency = getDeadlineUrgency(scholarship.deadline);
  if (urgency === 'urgent') score += 20;
  else if (urgency === 'warning') score += 10;
  
  return Math.round(score);
};

const getPersonalizedRecommendations = (scholarships: Scholarship[], student: Student, applications: ScholarshipApplication[]) => {
  const appliedScholarshipIds = applications.map(app => 
    scholarships.find(s => s.name === app.scholarship_name)?.id
  ).filter(Boolean);
  
  return scholarships
    .filter(scholarship => !appliedScholarshipIds.includes(scholarship.id))
    .map(scholarship => ({
      ...scholarship,
      score: getScholarshipScore(scholarship, student),
      isEligible: isScholarshipEligible(scholarship, student),
      urgency: getDeadlineUrgency(scholarship.deadline),
      daysLeft: getDaysUntilDeadline(scholarship.deadline)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
};

const getActionItems = (applications: ScholarshipApplication[]): Array<{
  id: string;
  title: string;
  description: string;
  urgency: 'high' | 'medium' | 'low';
  type: 'document' | 'interview' | 'renewal' | 'stipend';
  action?: string;
  dueDate?: string;
}> => {
  const items: Array<{
    id: string;
    title: string;
    description: string;
    urgency: 'high' | 'medium' | 'low';
    type: 'document' | 'interview' | 'renewal' | 'stipend';
    action?: string;
    dueDate?: string;
  }> = [];
  
  applications.forEach(app => {
    // Missing documents
    if (app.incomplete_documents && app.incomplete_documents.length > 0) {
      items.push({
        id: `docs-${app.id}`,
        title: 'Submit Missing Documents',
        description: `${app.scholarship_name}: ${app.incomplete_documents.join(', ')}`,
        urgency: 'high' as const,
        type: 'document' as const,
        action: `/scholarships/application/${app.id}/documents`
      });
    }
    
    // Upcoming interviews
    if (app.interview_schedule && new Date(app.interview_schedule) > new Date()) {
      const daysUntil = Math.ceil((new Date(app.interview_schedule).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      items.push({
        id: `interview-${app.id}`,
        title: 'Upcoming Interview',
        description: `${app.scholarship_name} interview in ${daysUntil} day(s)`,
        urgency: daysUntil <= 3 ? 'high' : 'medium' as const,
        type: 'interview' as const,
        action: `/scholarships/application/${app.id}`,
        dueDate: app.interview_schedule
      });
    }
    
    // Stipend issues
    if (app.stipend_status === 'on_hold') {
      items.push({
        id: `stipend-${app.id}`,
        title: 'Stipend On Hold',
        description: `${app.scholarship_name} stipend payment is on hold`,
        urgency: 'medium' as const,
        type: 'stipend' as const,
        action: `/scholarships/application/${app.id}`
      });
    }
  });
    return items.sort((a, b) => {
    const urgencyOrder: Record<'high' | 'medium' | 'low', number> = { high: 3, medium: 2, low: 1 };
    return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
  });
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

// Personalized Dashboard Components
const QuickActions = ({ applications, scholarships, student }: { 
  applications: ScholarshipApplication[]; 
  scholarships: Scholarship[];
  student: Student;
}) => {
  const actionItems = getActionItems(applications);
  const recommendations = getPersonalizedRecommendations(scholarships, student, applications);
  
  const getActionIcon = (type: string) => {
    switch (type) {
      case 'document': return FileText;
      case 'interview': return Users;
      case 'stipend': return Target;
      default: return Bell;
    }
  };

  const getUrgencyColor = (urgency: 'high' | 'medium' | 'low') => {
    switch (urgency) {
      case 'high': return 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200';
      case 'medium': return 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200';
      default: return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {actionItems.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p>All caught up! No pending actions.</p>
            </div>
          ) : (
            actionItems.map((item) => {
              const IconComponent = getActionIcon(item.type);
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-lg border ${getUrgencyColor(item.urgency)}`}
                >
                  <div className="flex items-start gap-3">
                    <IconComponent className="w-5 h-5 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium">{item.title}</h4>
                      <p className="text-sm opacity-90 line-clamp-2">{item.description}</p>
                      {item.dueDate && (
                        <p className="text-xs mt-1 font-medium">
                          Due: {new Date(item.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    {item.action && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={item.action}>Take Action</a>
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
          
          {recommendations.length > 0 && (
            <div className="pt-4 border-t">
              <h4 className="font-medium text-sm text-muted-foreground mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Recommended for You
              </h4>
              <div className="space-y-2">
                {recommendations.slice(0, 2).map((scholarship) => (
                  <div
                    key={scholarship.id}
                    className="p-3 rounded-lg bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-sm">{scholarship.name}</h5>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {scholarship.score}% match
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {scholarship.daysLeft} days left
                          </Badge>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <a href={`/scholarships/${scholarship.id}/apply`}>Apply</a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Personalized Insights Dashboard
const PersonalizedInsights = ({ student, applications, scholarships }: {
  student: Student;
  applications: ScholarshipApplication[];
  scholarships: Scholarship[];
}) => {
  const eligibleScholarships = scholarships.filter(s => isScholarshipEligible(s, student));  const pendingApplications = applications.filter(app => 
    ['draft', 'submitted', 'under_verification', 'incomplete', 'verified', 'under_evaluation'].includes(app.status)
  );
  
  const insights = [];
  
  // GWA insights
  if (student.gwa) {
    if (student.gwa <= 1.450) {
      insights.push({
        type: 'achievement',
        icon: Trophy,
        title: "President's Lister!",
        description: `Your GWA of ${student.gwa} qualifies you for the highest academic scholarships.`,
        color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
      });
    } else if (student.gwa <= 1.750) {
      insights.push({
        type: 'achievement',
        icon: Trophy,
        title: "Dean's Lister!",
        description: `Your GWA of ${student.gwa} qualifies you for academic scholarships.`,
        color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
      });
    }
  }
  
  // Application insights
  if (pendingApplications.length > 0) {
    insights.push({
      type: 'progress',
      icon: TrendingUp,
      title: 'Applications in Progress',
      description: `You have ${pendingApplications.length} application(s) being processed.`,
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
    });
  }
  
  // Opportunity insights
  if (eligibleScholarships.length > applications.length) {
    const missed = eligibleScholarships.length - applications.length;
    insights.push({
      type: 'opportunity',
      icon: Lightbulb,
      title: 'More Opportunities Available',
      description: `You're eligible for ${missed} more scholarship(s) that you haven't applied to yet.`,
      color: 'text-green-600 bg-green-50 dark:bg-green-900/20'
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Your Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {insights.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">
              Complete your profile to get personalized insights
            </p>
          ) : (
            insights.map((insight, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${insight.color}`}
              >
                <div className="flex items-start gap-3">
                  <insight.icon className="w-5 h-5 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">{insight.title}</h4>
                    <p className="text-sm opacity-90">{insight.description}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Main Components
const WelcomeCard = ({ auth, student, applications }: { auth: Auth; student: Student; applications: ScholarshipApplication[] }) => {
  const activeApplications = applications.filter(app => 
    ['submitted', 'under_verification', 'verified', 'under_evaluation'].includes(app.status)
  ).length;
  
  const approvedApplications = applications.filter(app => app.status === 'approved').length;
  
  const getTodayGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getPersonalizedMessage = () => {
    if (student.gwa && student.gwa <= 1.450) {
      return "🏆 President's Lister - You're eligible for premium scholarships!";
    }
    if (student.gwa && student.gwa <= 1.750) {
      return "🎓 Dean's Lister - Great academic performance!";
    }
    if (activeApplications > 0) {
      return `📋 You have ${activeApplications} application(s) in progress`;
    }
    return "Ready to explore scholarship opportunities?";
  };

  return (
    <Card className={`bg-gradient-to-r from-[${THEME.colors.primary.DEFAULT}]/${THEME.opacity.light} to-[${THEME.colors.primary.light}]/${THEME.opacity.light} dark:from-[${THEME.colors.primary.DEFAULT}]/${THEME.opacity.dark} dark:to-[${THEME.colors.primary.light}]/${THEME.opacity.dark} border-none shadow-lg`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <div>
              <h1 className={`text-2xl font-bold text-[${THEME.colors.primary.DEFAULT}] dark:text-[${THEME.colors.primary.dark}]`}>
                {getTodayGreeting()}, {auth.user.first_name}!
              </h1>
              <p className="text-muted-foreground">Student ID: {student.student_id} • {student.course}</p>
            </div>
            
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[${THEME.colors.primary.DEFAULT}]/10 text-[${THEME.colors.primary.DEFAULT}] dark:text-[${THEME.colors.primary.dark}] text-sm font-medium`}>
              <Sparkles className="w-4 h-4" />
              {getPersonalizedMessage()}
            </div>

            {(student.gwa || approvedApplications > 0) && (
              <div className="flex gap-4 text-sm">
                {student.gwa && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium">GWA: {student.gwa}</span>
                  </div>
                )}
                {approvedApplications > 0 && (
                  <div className="flex items-center gap-1">
                    <Trophy className="w-4 h-4 text-green-500" />
                    <span className="font-medium">{approvedApplications} Active Scholarship{approvedApplications > 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <Button
            variant="default"
            className="bg-green-700 hover:bg-green-800 text-white shadow-md"
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
};

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

const ScholarshipsList = ({ scholarships, student }: { scholarships: Scholarship[]; student: Student }) => {
  // Filter and sort scholarships based on eligibility and deadline urgency
  const personalizedScholarships = scholarships
    .map(scholarship => ({
      ...scholarship,
      isEligible: isScholarshipEligible(scholarship, student),
      urgency: getDeadlineUrgency(scholarship.deadline),
      daysLeft: getDaysUntilDeadline(scholarship.deadline)
    }))
    .sort((a, b) => {
      // Sort by eligibility first, then by urgency
      if (a.isEligible && !b.isEligible) return -1;
      if (!a.isEligible && b.isEligible) return 1;
      if (a.urgency === 'urgent' && b.urgency !== 'urgent') return -1;
      if (a.urgency !== 'urgent' && b.urgency === 'urgent') return 1;
      return a.daysLeft - b.daysLeft;
    });

  const getUrgencyBadgeColor = (urgency: 'urgent' | 'warning' | 'normal') => {
    switch (urgency) {
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      default:
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
    }
  };

  return (
    <div className="space-y-4">
      {personalizedScholarships.map((scholarship) => (
        <div 
          key={scholarship.id}
          className={`flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors ${
            scholarship.isEligible ? 'bg-card border-green-200 dark:border-green-800' : 'bg-muted/20 border-gray-200 dark:border-gray-800'
          }`}
        >
          <div className="space-y-2 flex-1">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{scholarship.name}</h4>
                  {scholarship.isEligible ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{scholarship.eligibility}</p>
                {scholarship.stipend_amount && (
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">
                    Monthly Stipend: ₱{scholarship.stipend_amount.toLocaleString()}
                  </p>
                )}
              </div>
            </div>
            
            {!scholarship.isEligible && (
              <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded text-sm text-orange-700 dark:text-orange-300">
                <p className="font-medium">Eligibility Requirements:</p>
                {scholarship.criteria?.gwa_range && student.gwa && (
                  <p>• GWA: {scholarship.criteria.gwa_range.min || 0} - {scholarship.criteria.gwa_range.max} (Your GWA: {student.gwa})</p>
                )}
                {scholarship.criteria?.min_units && (
                  <p>• Minimum Units: {scholarship.criteria.min_units} (Your Units: {student.units_enrolled || 'Not specified'})</p>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4 ml-4">
            <div className="flex flex-col items-end space-y-2">
              <Badge className={getUrgencyBadgeColor(scholarship.urgency)}>
                {scholarship.daysLeft > 0 ? (
                  <>
                    <Clock className="w-3 h-3 mr-1" />
                    {scholarship.daysLeft} days left
                  </>
                ) : (
                  'Deadline passed'
                )}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Due: {new Date(scholarship.deadline).toLocaleDateString()}
              </Badge>
            </div>
            <Button 
              size="sm" 
              disabled={!scholarship.isEligible || scholarship.daysLeft <= 0}
              asChild={scholarship.isEligible && scholarship.daysLeft > 0}
            >
              {scholarship.isEligible && scholarship.daysLeft > 0 ? (
                <a href={`/scholarships/${scholarship.id}/apply`}>Apply</a>
              ) : (
                <span>
                  {scholarship.daysLeft <= 0 ? 'Expired' : 'Not Eligible'}
                </span>
              )}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

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
              className="flex flex-col gap-3 p-4 rounded-lg border bg-card hover:bg-muted/50"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-semibold">{application.scholarship_name}</h4>
                  <div className="flex gap-2 items-center">
                    <Badge variant="secondary">
                      {application.type}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Submitted: {new Date(application.date_submitted).toLocaleDateString()}
                    </span>
                  </div>
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

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Application Progress</span>
                  <span className="text-xs font-medium">{getApplicationProgress(application.status)}%</span>
                </div>
                <Progress value={getApplicationProgress(application.status)} className="h-2" />
              </div>

              {/* Additional Information */}
              <div className="space-y-1">
                {application.incomplete_documents && (
                  <div className="flex items-center gap-2 p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    <p className="text-sm text-orange-600 dark:text-orange-400">
                      Missing documents: {application.incomplete_documents.join(', ')}
                    </p>
                  </div>
                )}
                {application.interview_schedule && (
                  <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      Interview scheduled: {new Date(application.interview_schedule).toLocaleString()}
                    </p>
                  </div>
                )}
                {application.verifier_comments && (
                  <div className="flex items-start gap-2 p-2 bg-gray-50 dark:bg-gray-900/20 rounded">
                    <Bell className="w-4 h-4 text-gray-600 mt-0.5" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Note:</span> {application.verifier_comments}
                    </p>
                  </div>
                )}
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
  // Sample data with enhanced student profile for testing personalization
  const enhancedStudent: Student = {
    ...student,
    gwa: student.gwa || 1.3, // Sample GWA for testing - President's Lister level
    units_enrolled: student.units_enrolled || 21,
    academic_status: student.academic_status || 'regular'
  };

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
  ];  // Group dashboard sections
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Student Dashboard" />
      
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Welcome Card */}
          <WelcomeCard auth={auth} student={enhancedStudent} applications={applications} />

          {/* Quick Stats */}
          <StatsOverview student={enhancedStudent} />

          {/* Action Items and Insights Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            <QuickActions applications={applications} scholarships={scholarships} student={enhancedStudent} />
            <PersonalizedInsights student={enhancedStudent} applications={applications} scholarships={scholarships} />
          </div>

          {/* Applications and Deadlines Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            <MyApplications applications={applications} />
            <div className="space-y-6">
              <UpcomingInterviews applications={applications} />
              <StipendTracker applications={applications} />
            </div>
          </div>

          {/* Available Scholarships */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Available Scholarships
                <Badge variant="secondary" className="ml-auto">
                  {scholarships.filter(s => isScholarshipEligible(s, enhancedStudent)).length} eligible
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScholarshipsList scholarships={scholarships} student={enhancedStudent} />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Student ID Card */}
          <StudentIDCard auth={auth} student={enhancedStudent} />
          
          {/* Deadline Tracker */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="h-5 w-5" />
                Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {scholarships
                  .filter(scholarship => {
                    const daysLeft = getDaysUntilDeadline(scholarship.deadline);
                    return daysLeft > 0 && daysLeft <= 30;
                  })
                  .sort((a, b) => getDaysUntilDeadline(a.deadline) - getDaysUntilDeadline(b.deadline))
                  .slice(0, 5)
                  .map((scholarship) => {
                    const daysLeft = getDaysUntilDeadline(scholarship.deadline);
                    const urgency = getDeadlineUrgency(scholarship.deadline);
                    const urgencyColor = urgency === 'urgent' 
                      ? 'text-red-600 bg-red-50 dark:bg-red-900/20'
                      : urgency === 'warning'
                      ? 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
                      : 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
                    
                    return (
                      <div
                        key={scholarship.id}
                        className={`p-3 rounded-lg ${urgencyColor}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{scholarship.name}</h4>
                            <p className="text-xs opacity-75">
                              {new Date(scholarship.deadline).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {daysLeft} days
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                {scholarships.filter(s => getDaysUntilDeadline(s.deadline) > 0 && getDaysUntilDeadline(s.deadline) <= 30).length === 0 && (
                  <p className="text-center py-4 text-muted-foreground text-sm">No upcoming deadlines</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Performance Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Your Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {enhancedStudent.gwa && (
                <div className="text-center p-4 rounded-lg bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {enhancedStudent.gwa}
                  </div>
                  <div className="text-sm text-muted-foreground">Current GWA</div>
                  {enhancedStudent.gwa <= 1.450 && (
                    <Badge className="mt-2 bg-yellow-100 text-yellow-800">President's Lister</Badge>
                  )}
                  {enhancedStudent.gwa > 1.450 && enhancedStudent.gwa <= 1.750 && (
                    <Badge className="mt-2 bg-blue-100 text-blue-800">Dean's Lister</Badge>
                  )}
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold text-blue-600">
                    {applications.filter(app => app.status === 'approved').length}
                  </div>
                  <div className="text-xs text-muted-foreground">Active</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-green-600">
                    {applications.filter(app => 
                      ['submitted', 'under_verification', 'verified', 'under_evaluation'].includes(app.status)
                    ).length}
                  </div>
                  <div className="text-xs text-muted-foreground">Pending</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}