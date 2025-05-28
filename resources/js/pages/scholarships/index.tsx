import { Head, Link } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, FileText } from 'lucide-react';

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
  description: string;
  stipend_amount?: number;
  requirements?: string[];
  eligibility_criteria?: string[];
  deadline: string;
  has_applied: boolean;
  required_documents?: string[];
}

interface ScholarshipsIndexProps {
  scholarships: Scholarship[];
}

export default function ScholarshipsIndex({ scholarships }: ScholarshipsIndexProps) {
  const formatDeadline = (deadline: string) => {
    return new Date(deadline).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatAmount = (amount?: number) => {
    if (!amount) return 'Amount varies';
    return `₱${amount.toLocaleString()}/month`;
  };

  const getScholarshipTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'Academic': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
      'Student Assistantship': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
      'Performing Arts': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
      'Economic Assistance': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
    };

    return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300';
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head>
        <title>Browse Scholarships</title>
        <meta name="description" content="Browse available OSAS Connect scholarships" />
      </Head>

      <div className="flex h-full flex-1 flex-col space-y-6 p-6">
        {/* Header Section */}
        <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
            Browse Scholarships
          </h1>
          <p className="text-base text-gray-500 dark:text-gray-400">
            Discover scholarship opportunities available to you
          </p>
        </div>

        {/* Scholarships Grid */}
        {scholarships.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No scholarships available
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
              There are currently no active scholarships accepting applications. Check back later for new opportunities.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {scholarships.map((scholarship) => (
              <Card key={scholarship.id} className="flex flex-col h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg leading-tight mb-2">
                        {scholarship.name}
                      </CardTitle>
                      <Badge className={getScholarshipTypeColor(scholarship.type)}>
                        {scholarship.type}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <CardDescription className="text-sm leading-relaxed">
                      {scholarship.description}
                    </CardDescription>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span>{formatAmount(scholarship.stipend_amount)}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-red-600" />
                        <span>Deadline: {formatDeadline(scholarship.deadline)}</span>
                      </div>

                      {scholarship.required_documents && scholarship.required_documents.length > 0 && (
                        <div className="flex items-center gap-2 text-sm">
                          <FileText className="h-4 w-4 text-blue-600" />
                          <span>{scholarship.required_documents.length} document(s) required</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    {scholarship.has_applied ? (
                      <Button variant="outline" className="w-full" disabled>
                        Already Applied
                      </Button>
                    ) : (
                      <Button asChild className="w-full">
                        <Link href={`/scholarships/${scholarship.id}/apply`}>
                          Apply Now
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
