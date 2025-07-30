import { Head, Link } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter, CardAction } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, FileText, Clock, CheckCircle, AlertTriangle, Users, BookOpen, Eye } from 'lucide-react';

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
      'academic_full': 'bg-primary/10 text-primary border-primary/20',
      'academic_partial': 'bg-primary/10 text-primary border-primary/20',
      'student_assistantship': 'bg-chart-2/10 text-chart-2 border-chart-2/20',
      'performing_arts_full': 'bg-chart-4/10 text-chart-4 border-chart-4/20',
      'performing_arts_partial': 'bg-chart-4/10 text-chart-4 border-chart-4/20',
      'economic_assistance': 'bg-chart-1/10 text-chart-1 border-chart-1/20',
      'others': 'bg-muted text-muted-foreground border-border',
    };

    return colors[type] || 'bg-muted text-muted-foreground border-border';
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
        return { status: 'unknown', color: 'text-muted-foreground', icon: Clock, message: 'TBD' };
      }

      const daysUntilDeadline = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      if (daysUntilDeadline < 0) {
        return { status: 'expired', color: 'text-destructive', icon: AlertTriangle, message: 'Expired' };
      } else if (daysUntilDeadline <= 7) {
        return { status: 'urgent', color: 'text-chart-1', icon: Clock, message: `${daysUntilDeadline} day(s) left` };
      } else if (daysUntilDeadline <= 30) {
        return { status: 'soon', color: 'text-chart-4', icon: Clock, message: `${daysUntilDeadline} day(s) left` };
      } else {
        return { status: 'normal', color: 'text-chart-2', icon: CheckCircle, message: `${daysUntilDeadline} day(s) left` };
      }
    } catch {
      return { status: 'unknown', color: 'text-muted-foreground', icon: Clock, message: 'TBD' };
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
        <div className="border-b pb-6 lg:pb-8">
          <div>
            <h1 className="text-2xl font-semibold text-foreground sm:text-3xl lg:text-4xl">
              Browse Scholarships
            </h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base lg:text-lg">
              Discover scholarship opportunities available to you
            </p>
          </div>
        </div>

        {/* Scholarships Grid */}
        {scholarships.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 lg:py-24">
            <FileText className="h-12 w-12 text-muted-foreground mb-4 lg:h-16 lg:w-16 lg:mb-6" />
            <h3 className="text-lg font-medium text-foreground mb-3 lg:text-xl lg:mb-4">
              No scholarships available
            </h3>
            <p className="text-muted-foreground text-center max-w-md lg:text-lg">
              There are currently no active scholarships accepting applications. Check back later for new opportunities.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {scholarships.map((scholarship) => {
              const deadlineStatus = getDeadlineStatus(scholarship.deadline);
              const DeadlineIcon = deadlineStatus.icon;

              return (
                <Card key={scholarship.id} className="flex flex-col h-full">
                  <CardHeader>
                    <CardTitle className="text-lg leading-tight lg:text-xl">
                      {scholarship.name}
                    </CardTitle>
                    <CardDescription>
                      <span className="flex flex-wrap gap-2 mt-2">
                        <Badge className={getScholarshipTypeColor(scholarship.type)}>
                          {getScholarshipTypeLabel(scholarship.type)}
                        </Badge>
                        {deadlineStatus.status === 'urgent' && (
                          <Badge variant="destructive" className="text-xs lg:text-sm">
                            Urgent
                          </Badge>
                        )}
                      </span>
                    </CardDescription>
                    <CardAction>
                      <Link href={`/student/scholarships/${scholarship.id}`}
                        className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                        aria-label="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </Link>
                    </CardAction>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col justify-between space-y-4 pt-0 lg:space-y-6">
                    {/* Description */}
                    <CardDescription className="text-sm leading-relaxed lg:text-base mb-2">
                      {scholarship.description}
                    </CardDescription>

                    {/* Key Information */}
                    <div className="space-y-3 lg:space-y-4">
                      <div className="flex items-center gap-3 text-sm lg:text-base">
                        <DollarSign className="h-4 w-4 text-chart-2 flex-shrink-0 lg:h-5 lg:w-5" />
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
                          <Users className="h-4 w-4 text-chart-3 flex-shrink-0 lg:h-5 lg:w-5" />
                          <span>
                            <span className="font-medium">Available Slots:</span> {formatSlotsInfo(scholarship)}
                          </span>
                        </div>
                      )}

                      {shouldShowBeneficiaries(scholarship) && (
                        <div className="flex items-center gap-3 text-sm lg:text-base">
                          <Users className="h-4 w-4 text-chart-4 flex-shrink-0 lg:h-5 lg:w-5" />
                          <span>
                            <span className="font-medium">Current Beneficiaries:</span> {scholarship.beneficiaries}
                          </span>
                        </div>
                      )}

                      {scholarship.funding_source && (
                        <div className="flex items-center gap-3 text-sm lg:text-base">
                          <DollarSign className="h-4 w-4 text-chart-2 flex-shrink-0 lg:h-5 lg:w-5" />
                          <span>
                            <span className="font-medium">Funding Source:</span> {scholarship.funding_source}
                          </span>
                        </div>
                      )}

                      {scholarship.gwaRequirement && (
                        <div className="flex items-center gap-3 text-sm lg:text-base">
                          <BookOpen className="h-4 w-4 text-primary flex-shrink-0 lg:h-5 lg:w-5" />
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
                          <Clock className="h-4 w-4 text-chart-5 flex-shrink-0 lg:h-5 lg:w-5" />
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
                            <BookOpen className="h-4 w-4 text-primary lg:h-5 lg:w-5" />
                            <span className="text-sm font-medium lg:text-base">Requirements:</span>
                          </div>
                          <div className="ml-7 space-y-2 lg:ml-8">
                            {(scholarship.requirements || scholarship.criteria || []).map((requirement, index) => (
                              <div key={index} className="text-xs text-muted-foreground flex items-start gap-2 lg:text-sm">
                                <span className="text-primary font-bold mt-0.5 lg:mt-1">•</span>
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
                            <Users className="h-4 w-4 text-chart-4 lg:h-5 lg:w-5" />
                            <span className="text-sm font-medium lg:text-base">Eligibility:</span>
                          </div>
                          <div className="ml-7 space-y-2 lg:ml-8">
                            {(scholarship.eligibilityCriteria || scholarship.eligibility_criteria || []).map((criteria: string, index: number) => (
                              <div key={index} className="text-xs text-muted-foreground flex items-start gap-2 lg:text-sm">
                                <span className="text-chart-4 font-bold mt-0.5 lg:mt-1">•</span>
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
                            <FileText className="h-4 w-4 text-chart-1 lg:h-5 lg:w-5" />
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
                                <div key={index} className="text-xs text-muted-foreground flex items-start gap-2 lg:text-sm">
                                  <span className="text-chart-1 font-bold mt-0.5 lg:mt-1">•</span>
                                  <span className="flex-1 leading-relaxed">{document}</span>
                                </div>
                              ));
                            })()}
                          </div>
                        </div>
                      )}

                    <CardFooter>
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
                    </CardFooter>
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
