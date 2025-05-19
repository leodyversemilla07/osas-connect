import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { User } from '@/types';
import { BreadcrumbItem } from '@/types';
import {
  User2,
  GraduationCap,
  UserCircle,
  Phone,
  PenSquare,
  Printer,
  ChevronRight,
} from 'lucide-react';

interface Props {
  student: User & {
    student_id: string;
    course: string;
    major: string;
    year_level: string;
    scholarships: string | null;
    civil_status: string;
    sex: string;
    date_of_birth: string;
    place_of_birth: string;
    religion: string;
    is_pwd: string;
    disability_type: string | null;
    street: string;
    barangay: string;
    city: string;
    province: string;
    mobile_number: string;
    telephone_number: string | null;
    residence_type: string;
    guardian_name: string | null;
    profile_photo_url: string | null;
  };
}

// Course abbreviation mapping based on register.tsx
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

const StudentIDCard = ({ student }: { student: Props['student'] }) => {
  // Try to get abbreviation from full course name, or use the course as is
  const courseAbbr = COURSE_ABBREVIATIONS[student.course] || student.course;

  return (
    <div className="w-full max-w-[350px] rounded-xl overflow-hidden shadow-2xl bg-white">
      {/* Top section - Enhanced header with gradient */}
      <div className="bg-gradient-to-r from-green-800 to-green-700 text-white p-5 relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          {/* Subtle pattern overlay */}
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fillOpacity='1' fillRule='evenodd'/%3E%3C/svg%3E\")",
              backgroundSize: "100px 100px",
            }}
          ></div>
        </div>

        <div className="flex items-start relative z-10">
          {/* Enhanced logo */}
          <div className="w-20 h-20 rounded-full bg-white shadow-lg p-1 mr-4 flex-shrink-0">
            <div className="w-full h-full rounded-full flex items-center justify-center bg-white overflow-hidden">
              <img
                src="https://www.minsu.edu.ph/template/images/logo.png"
                alt="Mindoro State University Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-wider">MINDORO</h1>
            <h1 className="text-2xl font-bold tracking-wider">STATE UNIVERSITY</h1>
            <p className="text-sm mt-1 opacity-90 font-light">ORIENTAL MINDORO, PHILIPPINES 5211</p>
          </div>
        </div>

        {/* Centered STUDENT IDENTIFICATION CARD text */}
        <div className="mt-4 text-center">
          <div className="bg-green-900 bg-opacity-30 py-1 px-4 rounded-md inline-block mx-auto">
            <p className="text-sm font-medium tracking-wide">STUDENT IDENTIFICATION CARD</p>
          </div>
        </div>
      </div>

      {/* Middle section - Student info with improved layout */}
      <div className="bg-white">
        <div className="flex">
          {/* Enhanced photo section */}
          <div className="w-1/3 p-4 relative">
            <div className="border-2 border-yellow-400 rounded-md shadow-md overflow-hidden">
              <div className="aspect-square relative bg-gradient-to-b from-gray-100 to-gray-200">
                <Avatar className="w-full h-full rounded-none">
                  {student.profile_photo_url ? (
                    <AvatarImage src={student.profile_photo_url} alt={`${student.first_name}'s photo`} />
                  ) : (
                    <AvatarFallback className="text-lg">
                      {student.first_name[0]}{student.last_name[0]}
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
            </div>
          </div>

          {/* Enhanced student details */}
          <div className="w-2/3 bg-gradient-to-br from-green-800 to-green-700 text-white p-4">
            <div className="border-l-2 border-yellow-400 pl-3">
              <h2 className="text-3xl font-bold">{student.last_name}</h2>
              <p className="text-lg font-medium">{student.first_name} {student.middle_name?.[0] || ''}</p>
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

      {/* ID Number and Issue Date - Enhanced dark section */}
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

      {/* Enhanced signature section */}
      <div className="bg-white p-5 text-center">
        <div className="h-8 mb-2 flex items-center justify-center">
          <div className="w-40 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
        </div>
        <p className="font-bold text-sm text-gray-800">DR. ENYA MARIE D. APOSTOL</p>
        <p className="text-xs text-gray-600">University President</p>
      </div>

      {/* Enhanced footer */}
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
};

export default function StudentDetails({ student }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('osas.dashboard') },
    { title: 'Student Records', href: route('osas.students') },
    { title: student.first_name + ' ' + student.last_name, href: route('osas.students.details', { id: student.id }) },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Student Details - ${student.first_name} ${student.last_name}`} />

      <div className="flex h-full flex-1 gap-6 p-6">
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
            <div className="flex items-start gap-6">
              <Avatar className="h-20 w-20 border">
                {student.profile_photo_url ? (
                  <AvatarImage src={student.profile_photo_url} alt={`${student.first_name}'s photo`} />
                ) : (
                  <AvatarFallback className="text-lg">
                    {student.first_name[0]}{student.last_name[0]}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                    Student Details
                  </h1>
                  <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                    Active
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Viewing detailed information for {student.first_name} {student.last_name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-2 sm:mt-0">
              <Button variant="outline" size="sm">
                <Printer className="w-4 h-4 mr-2" />
                Print Details
              </Button>
              <Button size="sm">
                <PenSquare className="w-4 h-4 mr-2" />
                Edit Details
              </Button>
            </div>
          </div>

          <Separator className="my-2" />

          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <User2 className="w-5 h-5 text-primary" />
                  <CardTitle>Basic Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <dl className="grid gap-4 text-sm">
                  {[
                    ['Student ID', student.student_id],
                    ['Full Name', `${student.first_name} ${student.middle_name || ''} ${student.last_name}`],
                    ['Email', student.email],
                  ].map(([label, value]) => (
                    <div key={label} className="grid grid-cols-2 items-center py-2 border-b last:border-0">
                      <dt className="font-medium text-muted-foreground">{label}</dt>
                      <dd className="text-right">{value}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  <CardTitle>Academic Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <dl className="grid gap-4 text-sm">
                  {[
                    ['Course', student.course],
                    ['Major', student.major === 'None' ? 'Not Applicable' : student.major],
                    ['Year Level', student.year_level],
                    ['Scholarships', student.scholarships || 'None'],
                  ].map(([label, value]) => (
                    <div key={label} className="grid grid-cols-2 items-center py-2 border-b last:border-0">
                      <dt className="font-medium text-muted-foreground">{label}</dt>
                      <dd className="text-right">{value}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <UserCircle className="w-5 h-5 text-primary" />
                  <CardTitle>Personal Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <dl className="grid gap-4 text-sm">
                  {[
                    ['Civil Status', student.civil_status],
                    ['Sex', student.sex],
                    ['Date of Birth', new Date(student.date_of_birth).toLocaleDateString()],
                    ['Place of Birth', student.place_of_birth],
                    ['Religion', student.religion],
                    ['PWD Status', `${student.is_pwd} ${student.disability_type ? `(${student.disability_type})` : ''}`],
                  ].map(([label, value]) => (
                    <div key={label} className="grid grid-cols-2 items-center py-2 border-b last:border-0">
                      <dt className="font-medium text-muted-foreground">{label}</dt>
                      <dd className="text-right">{value}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <CardTitle>Contact Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <dl className="grid gap-4 text-sm">
                  {[
                    ['Address', `${student.street}, ${student.barangay}, ${student.city}, ${student.province}`],
                    ['Mobile Number', student.mobile_number],
                    ...(student.telephone_number ? [['Telephone', student.telephone_number]] : []),
                    ['Residence Type', student.residence_type],
                    ...(student.residence_type === 'With Guardian' ? [['Guardian Name', student.guardian_name]] : []),
                  ].map(([label, value]) => (
                    <div key={label} className="grid grid-cols-2 items-center py-2 border-b last:border-0">
                      <dt className="font-medium text-muted-foreground">{label}</dt>
                      <dd className="text-right">{value}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="hidden lg:block">
          <StudentIDCard student={student} />
        </div>
      </div>
    </AppLayout>
  );
}