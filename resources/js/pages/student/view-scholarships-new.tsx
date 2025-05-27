// filepath: c:\xampp\htdocs\osas-connect\resources\js\pages\student\view-scholarships.tsx
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { DataTable } from '@/components/scholarship-management/data-table';
import { columns } from '@/components/scholarship-management/columns';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Student Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Scholarships',
    href: '/scholarships',
  },
];

type ScholarshipType = 'Academic' | 'Student Assistantship' | 'Performing Arts' | 'Economic Assistance';

interface Scholarship {
  id: number;
  name: string;
  type: ScholarshipType;
  amount: string;
  stipendSchedule: 'monthly' | 'semestral';
  deadline: string;
  description: string;
  status: 'open' | 'closed';
}

interface ScholarshipsPageProps {
  scholarships?: Scholarship[];
}

// Sample scholarships data
const scholarships: Scholarship[] = [
  {
    id: 1,
    name: 'Academic Scholarship (Full)',
    type: 'Academic',
    amount: '₱500',
    stipendSchedule: 'monthly',
    deadline: '2025-06-30',
    description: 'Full academic scholarship for students with exceptional academic performance.',
    status: 'open'
  },
  {
    id: 2,
    name: 'Academic Scholarship (Partial)',
    type: 'Academic',
    amount: '₱300',
    stipendSchedule: 'monthly',
    deadline: '2025-06-30',
    description: 'Partial academic scholarship for students with outstanding academic standing.',
    status: 'open'
  },
  {
    id: 3,
    name: 'Student Assistantship Program',
    type: 'Student Assistantship',
    amount: 'Based on work hours',
    stipendSchedule: 'monthly',
    deadline: '2025-06-15',
    description: 'Work opportunity program allowing students to work part-time in university offices while studying.',
    status: 'open'
  },
  {
    id: 4,
    name: 'MinSU Performing Arts (Full)',
    type: 'Performing Arts',
    amount: '₱500',
    stipendSchedule: 'monthly',
    deadline: '2025-05-30',
    description: 'Full scholarship for active members of MinSU performing arts groups with exceptional contribution.',
    status: 'open'
  },
  {
    id: 5,
    name: 'MinSU Performing Arts (Partial)',
    type: 'Performing Arts',
    amount: '₱300',
    stipendSchedule: 'monthly',
    deadline: '2025-05-30',
    description: 'Partial scholarship for members of MinSU performing arts groups.',
    status: 'open'
  },
  {
    id: 6,
    name: 'Economic Assistance Program',
    type: 'Economic Assistance',
    amount: '₱400',
    stipendSchedule: 'monthly',
    deadline: '2025-05-30',
    description: 'Financial assistance for economically disadvantaged but deserving students.',
    status: 'open'
  }
];

export default function ViewScholarships({ scholarships: propScholarships }: ScholarshipsPageProps) {
  const scholarshipData = propScholarships || scholarships;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head>
        <title>View Scholarships</title>
        <meta name="description" content="Browse available OSAS Connect scholarships" />
      </Head>
      <div className="flex h-full flex-1 flex-col space-y-6 p-6">
        {/* Header Section */}
        <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">Scholarships</h1>
          <p className="text-base text-gray-500 dark:text-gray-400">Browse available scholarship opportunities</p>
        </div>

        <DataTable columns={columns} data={scholarshipData} />
      </div>
    </AppLayout>
  );
}
