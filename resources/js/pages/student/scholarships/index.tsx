import { Head, Link } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, FileText, Clock, CheckCircle, AlertTriangle, Users, BookOpen } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Browse Scholarships',
    href: '/scholarships',
  },
];

interface Scholarship {
  id: number;
  name: string;
  type: string;
  typeLabel?: string;
  description: string;
  benefits?: string[];
  requirements?: string[];
  requiredDocuments?: Record<string, string> | string[];
  eligibilityCriteria?: string[];
  gwaRequirement?: { min?: number; max?: number } | null;
  stipendAmount?: number;
  applicationDeadline?: string;
  deadline: string;
  availableSlots?: number;
  canApply?: boolean;
  // Legacy fields for backward compatibility
  amount?: number;
  stipend_amount?: number;
  slots?: number;
  slots_available?: number;
  beneficiaries?: string;
  funding_source?: string;
  criteria?: string[];
  required_documents?: string[];
  eligibility_criteria?: string[];
  status?: string;
  has_applied: boolean;
  // Additional fields for more detailed display
  stipend_schedule?: string;
  renewal_criteria?: string[];
  admin_remarks?: string;
}

interface ScholarshipsIndexProps {
  scholarships: Scholarship[];
}

export default function ScholarshipsIndex({ scholarships }: ScholarshipsIndexProps) {
  const formatDeadline = (deadline: string) => {
    try {
      const date = new Date(deadline);
      if (isNaN(date.getTime())) {
        return 'TBD';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'TBD';
    }
  };

  const formatAmount = (scholarship: Scholarship) => {
    // Special handling for student assistantship
    if (scholarship.type === 'student_assistantship') {
      return 'Varies by hours worked';
    }

    // Check stipend_amount first, then amount
    const displayAmount = scholarship.stipend_amount || scholarship.amount;

    if (!displayAmount || displayAmount === 0) {
      // Return type-specific default amounts based on MinSU standards
      const typeAmounts: Record<string, string> = {
        'academic_full': '₱500/month',
        'academic_partial': '₱300/month',
        'performing_arts_full': '₱500/month',
        'performing_arts_partial': '₱300/month',
        'economic_assistance': '₱400/month',
        'student_assistantship': 'Varies by hours worked'
      };
      return typeAmounts[scholarship.type] || 'Amount varies';
    }

    return `₱${displayAmount.toLocaleString()}/month`;
  }; const formatSlotsInfo = (scholarship: Scholarship) => {
    // Prioritize availableSlots from backend calculation
    const available = scholarship.availableSlots ?? scholarship.slots_available ?? 0;
    const total = scholarship.slots ?? 0;

    if (total > 0) {
      return `${available} of ${total}`;
    } else if (available > 0) {
      return available.toString();
    }

    return 'Unlimited';
  };

  const shouldShowBeneficiaries = (scholarship: Scholarship) => {
    const count = scholarship.beneficiaries;
    return count !== undefined &&
      count !== null &&
      count !== '' &&
      !isNaN(Number(count)) &&
      Number(count) > 0;
  };

  const getScholarshipTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'academic_full': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
      'academic_partial': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
      'student_assistantship': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
      'performing_arts_full': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
      'performing_arts_partial': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
      'economic_assistance': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
      'others': 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300',
    };

    return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300';
  };

  const getScholarshipTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'academic_full': 'Academic Scholarship (Full)',
      'academic_partial': 'Academic Scholarship (Partial)',
      'student_assistantship': 'Student Assistantship',
      'performing_arts_full': 'Performing Arts (Full)',
      'performing_arts_partial': 'Performing Arts (Partial)',
      'economic_assistance': 'Economic Assistance',
      'others': 'Other Scholarship',
    };

    return labels[type] || type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getDeadlineStatus = (deadline: string) => {
    try {
      const deadlineDate = new Date(deadline);
      const today = new Date();

      if (isNaN(deadlineDate.getTime())) {
        return { status: 'unknown', color: 'text-gray-600', icon: Clock, message: 'TBD' };
      }

      const daysUntilDeadline = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      if (daysUntilDeadline < 0) {
        return { status: 'expired', color: 'text-red-600', icon: AlertTriangle, message: 'Expired' };
      } else if (daysUntilDeadline <= 7) {
        return { status: 'urgent', color: 'text-orange-600', icon: Clock, message: `${daysUntilDeadline} day(s) left` };
      } else if (daysUntilDeadline <= 30) {
        return { status: 'soon', color: 'text-yellow-600', icon: Clock, message: `${daysUntilDeadline} day(s) left` };
      } else {
        return { status: 'normal', color: 'text-green-600', icon: CheckCircle, message: `${daysUntilDeadline} day(s) left` };
      }
    } catch {
      return { status: 'unknown', color: 'text-gray-600', icon: Clock, message: 'TBD' };
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head>
        <title>Browse Scholarships</title>
        <meta name="description" content="Browse available OSAS Connect scholarships" />
      </Head>

      <div className="flex h-full flex-1 flex-col space-y-4 p-4 sm:space-y-6 sm:p-6 lg:space-y-8 lg:p-8">
        {/* Header Section */}
        <div className="border-b border-gray-100 dark:border-gray-800 pb-6 lg:pb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 sm:text-3xl lg:text-4xl">
              Browse Scholarships
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 sm:text-base lg:text-lg">
              Discover scholarship opportunities available to you
            </p>
          </div>
        </div>

        {/* Scholarships Grid */}
        {scholarships.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 lg:py-24">
            <FileText className="h-12 w-12 text-gray-400 mb-4 lg:h-16 lg:w-16 lg:mb-6" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3 lg:text-xl lg:mb-4">
              No scholarships available
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md lg:text-lg">
              There are currently no active scholarships accepting applications. Check back later for new opportunities.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-1 lg:gap-6 xl:grid-cols-2 xl:gap-8 2xl:grid-cols-3">
            {scholarships.map((scholarship) => {
              const deadlineStatus = getDeadlineStatus(scholarship.deadline);
              const DeadlineIcon = deadlineStatus.icon;

              return (
                <Card key={scholarship.id} className="flex flex-col h-full border-gray-200 dark:border-gray-800">
                  <CardHeader className="pb-4 lg:pb-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg leading-tight mb-3 lg:text-xl lg:mb-4">
                          {scholarship.name}
                        </CardTitle>
                        <div className="flex flex-wrap gap-2">
                          <Badge className={getScholarshipTypeColor(scholarship.type)}>
                            {getScholarshipTypeLabel(scholarship.type)}
                          </Badge>
                          {deadlineStatus.status === 'urgent' && (
                            <Badge variant="destructive" className="text-xs lg:text-sm">
                              Urgent
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col justify-between space-y-4 pt-0 lg:space-y-6">
                    {/* Description */}
                    <div>
                      <CardDescription className="text-sm leading-relaxed lg:text-base">
                        {scholarship.description}
                      </CardDescription>
                    </div>

                    {/* Key Information */}
                    <div className="space-y-3 lg:space-y-4">
                      <div className="flex items-center gap-3 text-sm lg:text-base">
                        <DollarSign className="h-4 w-4 text-green-600 flex-shrink-0 lg:h-5 lg:w-5" />
                        <span className="font-medium">{formatAmount(scholarship)}</span>
                      </div>

                      <div className="flex items-center gap-3 text-sm lg:text-base">
                        <DeadlineIcon className={`h-4 w-4 flex-shrink-0 lg:h-5 lg:w-5 ${deadlineStatus.color}`} />
                        <span className="min-w-0">
                          <span className="font-medium">Deadline:</span> {formatDeadline(scholarship.deadline)}
                          <span className={`ml-2 text-xs lg:text-sm ${deadlineStatus.color}`}>
                            ({deadlineStatus.message})
                          </span>
                        </span>
                      </div>

                      {(scholarship.slots_available || scholarship.availableSlots || scholarship.slots) && (
                        <div className="flex items-center gap-3 text-sm lg:text-base">
                          <Users className="h-4 w-4 text-blue-600 flex-shrink-0 lg:h-5 lg:w-5" />
                          <span>
                            <span className="font-medium">Available Slots:</span> {formatSlotsInfo(scholarship)}
                          </span>
                        </div>
                      )}

                      {shouldShowBeneficiaries(scholarship) && (
                        <div className="flex items-center gap-3 text-sm lg:text-base">
                          <Users className="h-4 w-4 text-purple-600 flex-shrink-0 lg:h-5 lg:w-5" />
                          <span>
                            <span className="font-medium">Current Beneficiaries:</span> {scholarship.beneficiaries}
                          </span>
                        </div>
                      )}

                      {scholarship.funding_source && (
                        <div className="flex items-center gap-3 text-sm lg:text-base">
                          <DollarSign className="h-4 w-4 text-green-600 flex-shrink-0 lg:h-5 lg:w-5" />
                          <span>
                            <span className="font-medium">Funding Source:</span> {scholarship.funding_source}
                          </span>
                        </div>
                      )}

                      {scholarship.gwaRequirement && (
                        <div className="flex items-center gap-3 text-sm lg:text-base">
                          <BookOpen className="h-4 w-4 text-indigo-600 flex-shrink-0 lg:h-5 lg:w-5" />
                          <span>
                            <span className="font-medium">GWA Requirement:</span>
                            {scholarship.gwaRequirement.min && scholarship.gwaRequirement.max
                              ? ` ${scholarship.gwaRequirement.min} - ${scholarship.gwaRequirement.max}`
                              : scholarship.gwaRequirement.max
                                ? ` ≤ ${scholarship.gwaRequirement.max}`
                                : scholarship.gwaRequirement.min
                                  ? ` ≥ ${scholarship.gwaRequirement.min}`
                                  : ' TBD'
                            }
                          </span>
                        </div>
                      )}

                      {scholarship.stipend_schedule && (
                        <div className="flex items-center gap-3 text-sm lg:text-base">
                          <Clock className="h-4 w-4 text-yellow-600 flex-shrink-0 lg:h-5 lg:w-5" />
                          <span>
                            <span className="font-medium">Payment Schedule:</span> {scholarship.stipend_schedule}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Requirements Section */}
                    {((scholarship.requirements && scholarship.requirements.length > 0) ||
                      (scholarship.criteria && scholarship.criteria.length > 0)) && (
                        <div className="space-y-3 lg:space-y-4">
                          <div className="flex items-center gap-3">
                            <BookOpen className="h-4 w-4 text-blue-600 lg:h-5 lg:w-5" />
                            <span className="text-sm font-medium lg:text-base">Requirements:</span>
                          </div>
                          <div className="ml-7 space-y-2 lg:ml-8">
                            {(scholarship.requirements || scholarship.criteria || []).map((requirement, index) => (
                              <div key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2 lg:text-sm">
                                <span className="text-blue-600 font-bold mt-0.5 lg:mt-1">•</span>
                                <span className="flex-1 leading-relaxed">{requirement}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Eligibility Criteria */}
                    {((scholarship.eligibilityCriteria && scholarship.eligibilityCriteria.length > 0) ||
                      (scholarship.eligibility_criteria && scholarship.eligibility_criteria.length > 0)) && (
                        <div className="space-y-3 lg:space-y-4">
                          <div className="flex items-center gap-3">
                            <Users className="h-4 w-4 text-purple-600 lg:h-5 lg:w-5" />
                            <span className="text-sm font-medium lg:text-base">Eligibility:</span>
                          </div>
                          <div className="ml-7 space-y-2 lg:ml-8">
                            {(scholarship.eligibilityCriteria || scholarship.eligibility_criteria || []).map((criteria: string, index: number) => (
                              <div key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2 lg:text-sm">
                                <span className="text-purple-600 font-bold mt-0.5 lg:mt-1">•</span>
                                <span className="flex-1 leading-relaxed">{criteria}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Required Documents */}
                    {((scholarship.requiredDocuments && Object.keys(scholarship.requiredDocuments).length > 0) ||
                      (scholarship.required_documents && scholarship.required_documents.length > 0)) && (
                        <div className="space-y-3 lg:space-y-4">
                          <div className="flex items-center gap-3">
                            <FileText className="h-4 w-4 text-orange-600 lg:h-5 lg:w-5" />
                            <span className="text-sm font-medium lg:text-base">Required Documents:</span>
                          </div>
                          <div className="ml-7 space-y-2 lg:ml-8">
                            {(() => {
                              const documents = scholarship.requiredDocuments
                                ? (Array.isArray(scholarship.requiredDocuments)
                                  ? scholarship.requiredDocuments
                                  : Object.values(scholarship.requiredDocuments))
                                : scholarship.required_documents || [];

                              return documents.map((document, index) => (
                                <div key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2 lg:text-sm">
                                  <span className="text-orange-600 font-bold mt-0.5 lg:mt-1">•</span>
                                  <span className="flex-1 leading-relaxed">{document}</span>
                                </div>
                              ));
                            })()}
                          </div>
                        </div>
                      )}

                    {/* Action Button */}
                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800 lg:mt-8 lg:pt-6">
                      {scholarship.has_applied ? (
                        <Button variant="outline" className="w-full min-h-[44px] px-4 lg:min-h-[48px] lg:px-6" disabled>
                          <CheckCircle className="h-4 w-4 mr-2 lg:h-5 lg:w-5" />
                          Already Applied
                        </Button>
                      ) : deadlineStatus.status === 'expired' ? (
                        <Button variant="outline" className="w-full min-h-[44px] px-4 lg:min-h-[48px] lg:px-6" disabled>
                          <AlertTriangle className="h-4 w-4 mr-2 lg:h-5 lg:w-5" />
                          Application Closed
                        </Button>
                      ) : (
                        <Button asChild className="w-full min-h-[44px] px-4 lg:min-h-[48px] lg:px-6">
                          <Link href={`/student/scholarships/${scholarship.id}/apply`}>
                            Apply Now
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
