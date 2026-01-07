import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BreadcrumbItem, type StudentProfile, type User } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    Award,
    BookOpen,
    Building2,
    ChevronRight,
    FileText,
    GraduationCap,
    Loader2,
    Mail,
    MapPin,
    Pencil as PencilIcon,
    Phone,
    School,
    TrashIcon,
    User2,
    Users,
    type LucideIcon,
} from 'lucide-react';
import { useState } from 'react';

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

interface UserWithProfile extends User {
    studentProfile?: StudentProfile;
    street?: string;
    barangay?: string;
    city?: string;
    civil_status?: string;
    sex?: string;
    major?: string;
    mobile_number?: string;
    year_level?: string;
    course?: string;
    scholarships?: string;
    student_id?: string;
    is_active?: boolean;
    avatar: string | null | undefined;
    first_name: string;
    last_name: string;
    middle_name: string | null;
    email: string;
    full_name?: string;
    academicInfo?: {
        student_id?: string;
        course?: string;
        major?: string;
        year_level?: string;
        scholarships?: string;
    };
    personalInfo?: {
        civil_status?: string;
        sex?: string;
        date_of_birth?: string;
        place_of_birth?: string;
        religion?: string;
        is_pwd?: boolean;
        disability_type?: string;
    };
    contactInfo?: {
        mobile_number?: string;
        telephone_number?: string;
        email?: string;
        residence_type?: string;
    };
    addressInfo?: {
        street?: string;
        barangay?: string;
        city?: string;
        province?: string;
    };
    familyInfo?: {
        status_of_parents?: string;
        total_siblings?: number;
        siblings?: Array<{
            name: string;
            age: number;
            occupation?: string;
            school?: string;
        }>;
        guardian_name?: string;
    };
    fatherInfo?: {
        father_name?: string;
        father_age?: number;
        father_address?: string;
        father_telephone?: string;
        father_mobile?: string;
        father_email?: string;
        father_occupation?: string;
        father_company?: string;
        father_monthly_income?: string | number;
        father_years_service?: number;
        father_education?: string;
        father_school?: string;
        father_unemployment_reason?: string;
    };
    motherInfo?: {
        mother_name?: string;
        mother_age?: number;
        mother_address?: string;
        mother_telephone?: string;
        mother_mobile?: string;
        mother_email?: string;
        mother_occupation?: string;
        mother_company?: string;
        mother_monthly_income?: string | number;
        mother_years_service?: number;
        mother_education?: string;
        mother_school?: string;
        mother_unemployment_reason?: string;
    };
    incomeInfo?: {
        combined_annual_pay_parents?: string | number;
        combined_annual_pay_siblings?: string | number;
        income_from_business?: string | number;
        income_from_land_rentals?: string | number;
        income_from_building_rentals?: string | number;
        retirement_benefits_pension?: string | number;
        commissions?: string | number;
        support_from_relatives?: string | number;
        bank_deposits?: string | number;
        other_income_description?: string;
        other_income_amount?: string | number;
        total_annual_income?: string | number;
    };
    appliancesInfo?: Record<string, boolean>;
    expensesInfo?: {
        house_rental?: string | number;
        food_grocery?: string | number;
        car_loan_details?: string;
        other_loan_details?: string;
        school_bus_payment?: string | number;
        transportation_expense?: string | number;
        education_plan_premiums?: string | number;
        insurance_policy_premiums?: string | number;
        health_insurance_premium?: string | number;
        sss_gsis_pagibig_loans?: string | number;
        clothing_expense?: string | number;
        utilities_expense?: string | number;
        communication_expense?: string | number;
        helper_details?: string;
        driver_details?: string;
        medicine_expense?: string | number;
        doctor_expense?: string | number;
        hospital_expense?: string | number;
        recreation_expense?: string | number;
        other_monthly_expense_details?: string;
        total_monthly_expenses?: string | number;
        annualized_monthly_expenses?: string | number;
        school_tuition_fee?: string | number;
        withholding_tax?: string | number;
        sss_gsis_pagibig_contribution?: string | number;
        other_annual_expense_details?: string;
        subtotal_annual_expenses?: string | number;
        total_annual_expenses?: string | number;
    };
}

interface UserProfileProps {
    user: UserWithProfile;
}

function ProfileHeader({ user }: { user: UserWithProfile }) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            router.delete(route('admin.students.destroy', user.id), {
                onFinish: () => {
                    setIsDeleting(false);
                    setIsDeleteDialogOpen(false);
                },
            });
        } catch {
            setIsDeleting(false);
        }
    };

    const handleGeneratePDF = () => {
        window.open(route('generate.scholarship.pdf', user.id), '_blank');
    };

    const handleGenerateChedPDF = () => {
        window.open(route('generate.ched.scholarship.pdf', user.id), '_blank');
    };

    const handleGenerateAnnex1PDF = () => {
        window.open(route('generate.annex1.tpdf.pdf', user.id), '_blank');
    };

    return (
        <>
            <Head title={`${user.first_name} ${user.last_name} | Student Profile`} />
            <div className="border-b border-gray-100 pb-6 dark:border-gray-800">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Student Profile</h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">View and manage student information</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleGeneratePDF}
                            className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20 dark:hover:text-blue-300"
                        >
                            <FileText className="mr-2 h-4 w-4" />
                            Generate Scholarship PDF
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleGenerateChedPDF}
                            className="text-green-600 hover:bg-green-50 hover:text-green-700 dark:text-green-400 dark:hover:bg-green-900/20 dark:hover:text-green-300"
                        >
                            <FileText className="mr-2 h-4 w-4" />
                            Generate CHED PDF
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleGenerateAnnex1PDF}
                            className="text-purple-600 hover:bg-purple-50 hover:text-purple-700 dark:text-purple-400 dark:hover:bg-purple-900/20 dark:hover:text-purple-300"
                        >
                            <FileText className="mr-2 h-4 w-4" />
                            Generate Annex 1 PDF
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="text-gray-600 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-900/20 dark:hover:text-gray-300"
                        >
                            <Link href={route('osas.students.edit', user.id)}>
                                <PencilIcon className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsDeleteDialogOpen(true)}
                            className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
                        >
                            <TrashIcon className="mr-2 h-4 w-4" />
                            Delete
                        </Button>
                    </div>
                </div>
            </div>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader className="space-y-3">
                        <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">Delete User</DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-400">
                            Are you sure you want to delete {user.first_name} {user.last_name}? This action cannot be undone and will permanently
                            remove all student data.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800/30 dark:bg-red-900/20">
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
                                        <TrashIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
                                        {user.first_name} {user.last_name}
                                    </h4>
                                    <p className="text-sm text-red-700 dark:text-red-300">{user.email} • Student</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting} className="flex-1">
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting} className="flex-1">
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <TrashIcon className="mr-2 h-4 w-4" />
                                    Delete User
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

function UserAvatar({ user }: { user: UserWithProfile }) {
    const studentId = user.academicInfo?.student_id || user.student_id || user.studentProfile?.student_id;

    return (
        <div className="flex items-center gap-6 border-b border-gray-100 pb-6 dark:border-gray-800">
            <div className="relative">
                <Avatar className="h-24 w-24">
                    <AvatarImage src={user.avatar?.toString() || ''} alt={`${user.first_name} ${user.last_name}`} />
                    <AvatarFallback className="text-xl">
                        {user.first_name[0]}
                        {user.last_name[0]}
                    </AvatarFallback>
                </Avatar>
            </div>
            <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    {user.first_name} {user.middle_name} {user.last_name}
                </h2>
                <div className="mt-2 flex items-center gap-2">
                    <Badge variant="secondary" className="flex items-center gap-1.5">
                        <GraduationCap className="h-4 w-4" />
                        Student
                    </Badge>
                    {studentId && (
                        <Badge variant="outline" className="text-xs">
                            ID: {studentId}
                        </Badge>
                    )}
                </div>
            </div>
        </div>
    );
}

function InfoItem({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: React.ReactNode }) {
    return (
        <div className="py-3 first:pt-0 last:pb-0">
            <div className="flex items-start gap-3">
                <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500" />
                <div className="flex-1">
                    <div className="mb-1 text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">{label}</div>
                    <div className="text-sm text-gray-900 dark:text-gray-100">{value}</div>
                </div>
            </div>
        </div>
    );
}

function SectionHeader({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
    return (
        <div className="mb-4 border-b border-gray-100 pb-4 dark:border-gray-800">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                <Icon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                {title}
            </h2>
        </div>
    );
}

function InfoCard({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn('rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800/30', className)}>{children}</div>;
}

function PersonalInfoCard({ user }: { user: UserWithProfile }) {
    const personalInfo = user.personalInfo || {};
    const studentProfile = user.studentProfile;

    return (
        <InfoCard>
            <SectionHeader icon={User2} title="Personal Information" />
            <UserAvatar user={user} />

            <div className="mt-6 space-y-4">
                {user.role === 'student' && (
                    <>
                        <InfoItem
                            icon={User2}
                            label="Civil Status"
                            value={personalInfo.civil_status || user.civil_status || studentProfile?.civil_status || 'Not provided'}
                        />
                        <InfoItem icon={User2} label="Sex" value={personalInfo.sex || user.sex || studentProfile?.sex || 'Not provided'} />
                    </>
                )}

                {(personalInfo.date_of_birth || studentProfile?.date_of_birth) && (
                    <InfoItem
                        icon={User2}
                        label="Date of Birth"
                        value={new Date(personalInfo.date_of_birth || studentProfile?.date_of_birth || '').toLocaleDateString()}
                    />
                )}
                {(personalInfo.place_of_birth || studentProfile?.place_of_birth) && (
                    <InfoItem icon={MapPin} label="Place of Birth" value={personalInfo.place_of_birth || studentProfile?.place_of_birth || ''} />
                )}

                {(personalInfo.religion || studentProfile?.religion) && (
                    <InfoItem icon={User2} label="Religion" value={personalInfo.religion || studentProfile?.religion || ''} />
                )}

                {(personalInfo.is_pwd || (studentProfile && studentProfile.is_pwd)) && (
                    <InfoItem
                        icon={User2}
                        label="PWD Status"
                        value={
                            <div className="space-y-1">
                                <p className="font-medium text-blue-600 dark:text-blue-400">Person with Disability</p>
                                {(personalInfo.disability_type || studentProfile?.disability_type) && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Type: {personalInfo.disability_type || studentProfile?.disability_type}
                                    </p>
                                )}
                            </div>
                        }
                    />
                )}
            </div>
        </InfoCard>
    );
}

function ContactInfoCard({ user }: { user: UserWithProfile }) {
    return (
        <InfoCard>
            <SectionHeader icon={Phone} title="Contact Information" />

            <div className="space-y-4">
                {user.role === 'student' && (
                    <InfoItem
                        icon={Phone}
                        label="Mobile Number"
                        value={user.contactInfo?.mobile_number || user.mobile_number || user.studentProfile?.mobile_number || 'Not provided'}
                    />
                )}

                {(user.contactInfo?.telephone_number || user.studentProfile?.telephone_number) && (
                    <InfoItem
                        icon={Phone}
                        label="Telephone Number"
                        value={user.contactInfo?.telephone_number || user.studentProfile?.telephone_number}
                    />
                )}

                <InfoItem icon={Mail} label="Email" value={user.email} />

                {(user.contactInfo?.residence_type || user.studentProfile?.residence_type) && (
                    <InfoItem icon={MapPin} label="Residence Type" value={user.contactInfo?.residence_type || user.studentProfile?.residence_type} />
                )}
            </div>
        </InfoCard>
    );
}

function AddressInfoCard({ user }: { user: UserWithProfile }) {
    const addressInfo = user.addressInfo || {};
    const street = addressInfo.street || user.street || user.studentProfile?.street;
    const barangay = addressInfo.barangay || user.barangay || user.studentProfile?.barangay;
    const city = addressInfo.city || user.city || user.studentProfile?.city;
    const province = addressInfo.province || user.studentProfile?.province;

    const addressParts = [street, barangay, city, province].filter(Boolean);
    if (addressParts.length === 0) return null;

    return (
        <InfoCard>
            <SectionHeader icon={MapPin} title="Address Information" />

            <div className="space-y-4">
                <InfoItem icon={MapPin} label="Complete Address" value={addressParts.join(', ')} />
                {street && <InfoItem icon={MapPin} label="Street" value={street} />}
                {barangay && <InfoItem icon={MapPin} label="Barangay" value={barangay} />}
                {city && <InfoItem icon={MapPin} label="City" value={city} />}
                {province && <InfoItem icon={MapPin} label="Province" value={province} />}
            </div>
        </InfoCard>
    );
}

function FamilyBackgroundCard({ user }: { user: UserWithProfile }) {
    const familyInfo = user.familyInfo || {};
    const studentProfile = user.studentProfile;

    if (!studentProfile && !familyInfo) return null;

    type Sibling = {
        name: string;
        age: number;
        occupation?: string;
        school?: string;
    };

    return (
        <InfoCard>
            <SectionHeader icon={Users} title="Family Background" />

            <div className="space-y-4">
                {(familyInfo.status_of_parents || studentProfile?.status_of_parents) && (
                    <InfoItem
                        icon={User2}
                        label="Status of Parents"
                        value={familyInfo.status_of_parents || studentProfile?.status_of_parents || ''}
                    />
                )}
                {(familyInfo.total_siblings !== undefined || studentProfile?.total_siblings !== undefined) && (
                    <InfoItem
                        icon={Users}
                        label="Total Siblings"
                        value={(familyInfo.total_siblings || studentProfile?.total_siblings || 0).toString()}
                    />
                )}
                {(familyInfo.guardian_name || studentProfile?.guardian_name) && (
                    <InfoItem icon={User2} label="Guardian Name" value={familyInfo.guardian_name || studentProfile?.guardian_name || ''} />
                )}

                {(familyInfo.siblings || studentProfile?.siblings) && (
                    <div className="mt-4">
                        <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Siblings</h3>
                        <div className="space-y-2">
                            {((familyInfo.siblings || studentProfile?.siblings || []) as Sibling[]).map((sibling, index) => (
                                <div key={index} className="rounded bg-gray-50 p-2 text-sm dark:bg-gray-800/50">
                                    <p className="font-medium">{sibling.name}</p>
                                    <div className="mt-1 grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400">
                                        <p>Age: {sibling.age}</p>
                                        {sibling.occupation && <p>Occupation: {sibling.occupation}</p>}
                                        {sibling.school && <p>School: {sibling.school}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </InfoCard>
    );
}

function FatherInfoCard({ user }: { user: UserWithProfile }) {
    const fatherInfo = user.fatherInfo || {};
    const studentProfile = user.studentProfile;

    if ((!studentProfile || !studentProfile.father_name) && !fatherInfo.father_name) return null;

    return (
        <InfoCard>
            <SectionHeader icon={User2} title="Father's Information" />

            <div className="space-y-4">
                <InfoItem icon={User2} label="Full Name" value={fatherInfo.father_name || studentProfile?.father_name || ''} />
                {(fatherInfo.father_age || (studentProfile && studentProfile.father_age)) && (
                    <InfoItem
                        icon={User2}
                        label="Age"
                        value={(fatherInfo.father_age || (studentProfile && studentProfile.father_age) || '').toString()}
                    />
                )}
                {(fatherInfo.father_mobile || studentProfile?.father_mobile) && (
                    <InfoItem icon={Phone} label="Mobile Number" value={fatherInfo.father_mobile || studentProfile?.father_mobile || ''} />
                )}
                {(fatherInfo.father_email || studentProfile?.father_email) && (
                    <InfoItem icon={Mail} label="Email" value={fatherInfo.father_email || studentProfile?.father_email || ''} />
                )}
                {(fatherInfo.father_occupation || studentProfile?.father_occupation) && (
                    <InfoItem icon={Building2} label="Occupation" value={fatherInfo.father_occupation || studentProfile?.father_occupation || ''} />
                )}
                {(fatherInfo.father_company || studentProfile?.father_company) && (
                    <InfoItem icon={Building2} label="Company" value={fatherInfo.father_company || studentProfile?.father_company || ''} />
                )}
                {(fatherInfo.father_monthly_income || (studentProfile && studentProfile.father_monthly_income)) && (
                    <InfoItem
                        icon={Building2}
                        label="Monthly Income"
                        value={`₱${(fatherInfo.father_monthly_income || (studentProfile && studentProfile.father_monthly_income) || 0).toString()}`}
                    />
                )}
                {(fatherInfo.father_education || studentProfile?.father_education) && (
                    <InfoItem icon={School} label="Education" value={fatherInfo.father_education || studentProfile?.father_education || ''} />
                )}
                {(fatherInfo.father_school || studentProfile?.father_school) && (
                    <InfoItem icon={School} label="School" value={fatherInfo.father_school || studentProfile?.father_school || ''} />
                )}
            </div>
        </InfoCard>
    );
}

function MotherInfoCard({ user }: { user: UserWithProfile }) {
    const motherInfo = user.motherInfo || {};
    const studentProfile = user.studentProfile;

    if ((!studentProfile || !studentProfile.mother_name) && !motherInfo.mother_name) return null;

    return (
        <InfoCard>
            <SectionHeader icon={User2} title="Mother's Information" />

            <div className="space-y-4">
                <InfoItem icon={User2} label="Full Name" value={motherInfo.mother_name || studentProfile?.mother_name || ''} />
                {(motherInfo.mother_age || (studentProfile && studentProfile.mother_age)) && (
                    <InfoItem
                        icon={User2}
                        label="Age"
                        value={(motherInfo.mother_age || (studentProfile && studentProfile.mother_age) || '').toString()}
                    />
                )}
                {(motherInfo.mother_mobile || studentProfile?.mother_mobile) && (
                    <InfoItem icon={Phone} label="Mobile Number" value={motherInfo.mother_mobile || studentProfile?.mother_mobile || ''} />
                )}
                {(motherInfo.mother_email || studentProfile?.mother_email) && (
                    <InfoItem icon={Mail} label="Email" value={motherInfo.mother_email || studentProfile?.mother_email || ''} />
                )}
                {(motherInfo.mother_occupation || studentProfile?.mother_occupation) && (
                    <InfoItem icon={Building2} label="Occupation" value={motherInfo.mother_occupation || studentProfile?.mother_occupation || ''} />
                )}
                {(motherInfo.mother_company || studentProfile?.mother_company) && (
                    <InfoItem icon={Building2} label="Company" value={motherInfo.mother_company || studentProfile?.mother_company || ''} />
                )}
                {(motherInfo.mother_monthly_income || (studentProfile && studentProfile.mother_monthly_income)) && (
                    <InfoItem
                        icon={Building2}
                        label="Monthly Income"
                        value={`₱${(motherInfo.mother_monthly_income || (studentProfile && studentProfile.mother_monthly_income) || 0).toString()}`}
                    />
                )}
                {(motherInfo.mother_education || studentProfile?.mother_education) && (
                    <InfoItem icon={School} label="Education" value={motherInfo.mother_education || studentProfile?.mother_education || ''} />
                )}
                {(motherInfo.mother_school || studentProfile?.mother_school) && (
                    <InfoItem icon={School} label="School" value={motherInfo.mother_school || studentProfile?.mother_school || ''} />
                )}
            </div>
        </InfoCard>
    );
}

function AcademicInfoCard({ user }: { user: UserWithProfile }) {
    const academicInfo = user.academicInfo || {};
    const studentProfile = user.studentProfile;

    if (!studentProfile && !academicInfo) return null;

    const course = academicInfo.course || user.course || studentProfile?.course;
    const major = academicInfo.major || user.major || studentProfile?.major;
    const yearLevel = academicInfo.year_level || user.year_level || studentProfile?.year_level;
    const scholarships = academicInfo.scholarships || user.scholarships || studentProfile?.existing_scholarships;

    return (
        <InfoCard>
            <SectionHeader icon={BookOpen} title="Academic Information" />

            <div className="space-y-4">
                {course && (
                    <InfoItem
                        icon={BookOpen}
                        label="Course"
                        value={
                            <div className="space-y-1">
                                <p className="font-medium">{course}</p>
                                {major && <p className="text-xs text-gray-500 dark:text-gray-400">Major in {major}</p>}
                            </div>
                        }
                    />
                )}
                {yearLevel && <InfoItem icon={GraduationCap} label="Year Level" value={<span className="font-medium">{yearLevel}</span>} />}
                {scholarships && <InfoItem icon={Award} label="Scholarships" value={<span className="font-medium">{scholarships}</span>} />}
            </div>
        </InfoCard>
    );
}

const StudentIDCard = ({ student }: { student: UserWithProfile }) => {
    const course = student.academicInfo?.course || student.course || student.studentProfile?.course || '';

    const courseAbbr = COURSE_ABBREVIATIONS[course] || course;

    const studentId = student.academicInfo?.student_id || student.student_id || student.studentProfile?.student_id || '';

    return (
        <div className="w-full max-w-[350px] overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="relative bg-gradient-to-r from-green-800 to-green-700 p-5 text-white">
                <div className="absolute top-0 left-0 h-full w-full opacity-10">
                    <div
                        className="h-full w-full"
                        style={{
                            backgroundImage:
                                "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fillOpacity='1' fillRule='evenodd'/%3E%3C/svg%3E\")",
                            backgroundSize: '100px 100px',
                        }}
                    ></div>
                </div>

                <div className="relative z-10 flex items-start">
                    <div className="mr-4 h-20 w-20 flex-shrink-0">
                        <div className="flex h-full w-full items-center justify-center overflow-hidden">
                            <img
                                src="/images/logo.png"
                                alt="Mindoro State University Logo"
                                className="h-full w-full object-contain"
                            />
                        </div>
                    </div>

                    <div className="flex-1">
                        <h1 className="text-2xl font-bold tracking-wider">MINDORO</h1>
                        <h1 className="text-2xl font-bold tracking-wider">STATE UNIVERSITY</h1>
                        <p className="mt-1 text-sm font-light opacity-90">ORIENTAL MINDORO, PHILIPPINES 5211</p>
                    </div>
                </div>

                <div className="mt-4 text-center">
                    <div className="bg-opacity-30 mx-auto inline-block rounded-md bg-green-900 px-4 py-1">
                        <p className="text-sm font-medium tracking-wide">STUDENT IDENTIFICATION CARD</p>
                    </div>
                </div>
            </div>

            {/* Middle section - Student info with improved layout */}
            <div className="bg-white">
                <div className="flex">
                    {/* Enhanced photo section */}
                    <div className="relative w-1/3 p-4">
                        <div className="overflow-hidden rounded-md border-2 border-yellow-400 shadow-md">
                            <div className="relative aspect-square bg-gradient-to-b from-gray-100 to-gray-200">
                                <Avatar className="h-full w-full rounded-none">
                                    {student.avatar ? (
                                        <AvatarImage src={student.avatar} alt={`${student.first_name}'s photo`} />
                                    ) : (
                                        <AvatarFallback className="text-lg">
                                            {student.first_name[0]}
                                            {student.last_name[0]}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced student details */}
                    <div className="w-2/3 bg-gradient-to-br from-green-800 to-green-700 p-4 text-white">
                        <div className="border-l-2 border-yellow-400 pl-3">
                            <h2 className="text-3xl font-bold">{student.last_name}</h2>
                            <p className="text-lg font-medium">
                                {student.first_name} {student.middle_name?.[0] || ''}
                            </p>
                        </div>

                        <div className="mt-6 mb-2">
                            <div className="flex items-center">
                                <ChevronRight className="h-4 w-4 text-yellow-400" />
                                <h3 className="ml-1 text-3xl font-bold">{courseAbbr}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ID Number and Issue Date - Enhanced dark section */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-4 py-3 text-white">
                <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                    <div className="flex items-center">
                        <div className="mr-2 h-3 w-1 bg-yellow-400"></div>
                        <p className="text-xs font-medium tracking-wide uppercase">Student ID Number</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold tracking-wider">{studentId}</p>
                    </div>
                    <div className="flex items-center">
                        <div className="mr-2 h-3 w-1 bg-yellow-400"></div>
                        <p className="text-xs font-medium tracking-wide uppercase">Issued</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold tracking-wider">
                            AY {new Date().getFullYear()}-{new Date().getFullYear() + 1}
                        </p>
                    </div>
                </div>
            </div>

            {/* Enhanced signature section */}
            <div className="bg-white p-5 text-center">
                <div className="mb-2 flex h-8 items-center justify-center">
                    <div className="h-px w-40 bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
                </div>
                <p className="text-sm font-bold text-gray-800">DR. ENYA MARIE D. APOSTOL</p>
                <p className="text-xs text-gray-600">University President</p>
            </div>

            {/* Enhanced footer */}
            <div className="border-t-2 border-yellow-400 bg-gradient-to-r from-green-800 to-green-700 p-3">
                <p className="text-center text-[10px] leading-tight font-light text-white">
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

export default function StudentDetails({ user }: UserProfileProps) {
    if (!user) {
        return (
            <AppLayout breadcrumbs={[]}>
                <div className="w-full px-4 py-12">
                    <div className="mx-auto max-w-none space-y-8">
                        <div className="text-center">
                            <p className="text-gray-500">Loading user data...</p>
                        </div>
                    </div>
                </div>
            </AppLayout>
        );
    }

    if (user.role !== 'student') {
        return (
            <AppLayout breadcrumbs={[]}>
                <div className="w-full px-4 py-12">
                    <div className="mx-auto max-w-none space-y-8">
                        <div className="text-center">
                            <p className="text-gray-500">Access denied. This page is only for student profiles.</p>
                        </div>
                    </div>
                </div>
            </AppLayout>
        );
    }

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: route('osas.dashboard'),
        },
        {
            title: 'Students Records',
            href: route('osas.students'),
        },
        {
            title: 'Student Profile',
            href: route('osas.students.details', user.id),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="w-full px-4 py-12">
                <div className="mx-auto max-w-none space-y-8">
                    <ProfileHeader user={user} />
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-4">
                        <div className="space-y-8 xl:col-span-1">
                            <PersonalInfoCard user={user} />
                            <FamilyBackgroundCard user={user} />
                        </div>

                        <div className="space-y-8 xl:col-span-1">
                            <ContactInfoCard user={user} />
                            <AddressInfoCard user={user} />
                            <AcademicInfoCard user={user} />
                        </div>

                        <div className="space-y-8 xl:col-span-1">
                            {user.studentProfile?.father_name && <FatherInfoCard user={user} />}
                            {user.studentProfile?.mother_name && <MotherInfoCard user={user} />}
                        </div>

                        <div className="space-y-8 xl:col-span-1">
                            <InfoCard>
                                <SectionHeader icon={GraduationCap} title="Student ID Card" />
                                <div className="flex justify-center">
                                    <StudentIDCard student={user} />
                                </div>
                            </InfoCard>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
