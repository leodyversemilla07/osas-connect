import { router, Link, Head } from '@inertiajs/react';
import {
    TrashIcon, UserCircle, Building2, GraduationCap, Shield,
    Mail, Phone, MapPin, User2,
    BookOpen, School, Award,
    Pencil as PencilIcon,
    type LucideIcon,
    Users, FileText, Loader2, ChevronRight
} from 'lucide-react';
import { type User, type StudentProfile } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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

interface UserWithProfile extends User {
    studentProfile?: StudentProfile;
    osasStaffProfile?: {
        staff_id: string;
        mobile_number?: string;
    };
    // Old structure (for backward compatibility)
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
    // New structured data format
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
    staffInfo?: {
        staff_id?: string;
        mobile_number?: string;
    };
}

interface UserProfileProps {
    user: UserWithProfile;
}

function ProfileHeader({ user }: { user: UserWithProfile }) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false); const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const deleteRoute = user.role === 'student' ? 'admin.students.destroy' : 'admin.staff.destroy';
            router.delete(route(deleteRoute, user.id), {
                onFinish: () => {
                    setIsDeleting(false);
                    setIsDeleteDialogOpen(false);
                }
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

    // Determine the edit route based on user role
    const getEditRoute = () => {
        // Admin users cannot be edited
        if (user.role === 'admin') {
            return null;
        }

        // Use different routes for student and staff
        return user.role === 'student' ? 'admin.students.edit' : 'admin.staff.edit';
    };

    const editRoute = getEditRoute();

    return (
        <>
            <Head title={`${user.first_name} ${user.last_name} | ${user.role.charAt(0).toUpperCase() + user.role.slice(1)} Profile`} />
            <div className="border-b border-gray-100 dark:border-gray-800 pb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                            User Profile
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            View and manage user information
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {user.role === 'student' && (
                            <>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleGeneratePDF}
                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20"
                                >
                                    <FileText className="h-4 w-4 mr-2" />
                                    Generate Scholarship PDF
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleGenerateChedPDF}
                                    className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/20"
                                >
                                    <FileText className="h-4 w-4 mr-2" />
                                    Generate CHED PDF
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleGenerateAnnex1PDF}
                                    className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:text-purple-300 dark:hover:bg-purple-900/20"
                                >
                                    <FileText className="h-4 w-4 mr-2" />
                                    Generate Annex 1 PDF
                                </Button>
                            </>
                        )}
                        {editRoute && (
                            <Button
                                variant="ghost"
                                size="sm"
                                asChild
                                className="text-gray-600 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-900/20"
                            >
                                <Link href={route(editRoute, user.id)}>
                                    <PencilIcon className="h-4 w-4 mr-2" />
                                    Edit
                                </Link>
                            </Button>
                        )}
                        {user.role !== 'admin' && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsDeleteDialogOpen(true)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                            >
                                <TrashIcon className="h-4 w-4 mr-2" />
                                Delete
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader className="space-y-3">
                        <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Delete User
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-400">
                            Are you sure you want to delete {user.first_name} {user.last_name}? This action cannot be undone and will permanently remove all user data.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <div className="rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800/30 p-4">
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                                        <TrashIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
                                        {user.first_name} {user.last_name}
                                    </h4>
                                    <p className="text-sm text-red-700 dark:text-red-300">
                                        {user.email} • {user.role === 'student' ? 'Student' : 'Staff'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                            disabled={isDeleting}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="flex-1"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <TrashIcon className="h-4 w-4 mr-2" />
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
    const getRoleIcon = () => {
        switch (user.role) {
            case 'student':
                return <GraduationCap className="h-4 w-4" />;
            case 'osas_staff':
                return <Building2 className="h-4 w-4" />;
            case 'admin':
                return <Shield className="h-4 w-4" />;
            default:
                return <UserCircle className="h-4 w-4" />;
        }
    };

    const getRoleBadgeVariant = () => {
        switch (user.role) {
            case 'student':
                return 'secondary' as const;
            case 'osas_staff':
                return 'default' as const;
            case 'admin':
                return 'default' as const;
            default:
                return 'outline' as const;
        }
    };

    // Get staff ID from various possible sources
    const getStaffId = () => {
        return user.staffInfo?.staff_id ||
            user.osasStaffProfile?.staff_id ||
            user.studentProfile?.student_id;
    };

    const staffId = getStaffId();

    return (
        <div className="flex items-center gap-6 pb-6 border-b border-gray-100 dark:border-gray-800">
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
                <div className="flex items-center gap-2 mt-2">
                    <Badge variant={getRoleBadgeVariant()} className="flex items-center gap-1.5">
                        {getRoleIcon()}
                        {user.role === 'osas_staff' ? 'OSAS Staff' : user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                    {staffId && (
                        <Badge variant="outline" className="text-xs">
                            ID: {staffId}
                        </Badge>
                    )}
                </div>
            </div>
        </div>
    );
}

function InfoItem({ icon: Icon, label, value }: { icon: LucideIcon, label: string, value: React.ReactNode }) {
    return (
        <div className="py-3 first:pt-0 last:pb-0">
            <div className="flex items-start gap-3">
                <Icon className="h-4 w-4 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                        {label}
                    </div>
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                        {value}
                    </div>
                </div>
            </div>
        </div>
    );
}

function SectionHeader({ icon: Icon, title }: { icon: LucideIcon, title: string }) {
    return (
        <div className="pb-4 mb-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Icon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                {title}
            </h2>
        </div>
    );
}

function InfoCard({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={cn("bg-white dark:bg-gray-800/30 rounded-lg p-6 shadow-sm", className)}>
            {children}
        </div>
    );
}

function PersonalInfoCard({ user }: { user: UserWithProfile }) {
    // Check both structured data and direct access for compatibility
    const personalInfo = user.personalInfo || {};
    const studentProfile = user.studentProfile;

    return (
        <InfoCard>
            <SectionHeader icon={User2} title="Personal Information" />
            <UserAvatar user={user} />

            <div className="mt-6 space-y-4">
                <InfoItem icon={Mail} label="Email" value={user.email} />

                {/* Personal Details */}
                {user.role === 'student' && (
                    <>
                        <InfoItem
                            icon={User2}
                            label="Civil Status"
                            value={personalInfo.civil_status || user.civil_status || studentProfile?.civil_status || 'Not provided'}
                        />
                        <InfoItem
                            icon={User2}
                            label="Sex"
                            value={personalInfo.sex || user.sex || studentProfile?.sex || 'Not provided'}
                        />
                    </>
                )}

                {/* Birth Information */}
                {(personalInfo.date_of_birth || studentProfile?.date_of_birth) && (
                    <InfoItem
                        icon={User2}
                        label="Date of Birth"
                        value={new Date(personalInfo.date_of_birth || studentProfile?.date_of_birth || '').toLocaleDateString()}
                    />
                )}
                {(personalInfo.place_of_birth || studentProfile?.place_of_birth) && (
                    <InfoItem
                        icon={MapPin}
                        label="Place of Birth"
                        value={personalInfo.place_of_birth || studentProfile?.place_of_birth || ''}
                    />
                )}

                {/* Religion */}
                {(personalInfo.religion || studentProfile?.religion) && (
                    <InfoItem
                        icon={User2}
                        label="Religion"
                        value={personalInfo.religion || studentProfile?.religion || ''}
                    />
                )}

                {/* PWD Status */}
                {(personalInfo.is_pwd || (studentProfile && studentProfile.is_pwd)) && (
                    <InfoItem
                        icon={User2}
                        label="PWD Status"
                        value={
                            <div className="space-y-1">
                                <p className="text-blue-600 dark:text-blue-400 font-medium">Person with Disability</p>
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

                <InfoItem
                    icon={Mail}
                    label="Email"
                    value={user.email}
                />

                {(user.contactInfo?.residence_type || user.studentProfile?.residence_type) && (
                    <InfoItem
                        icon={MapPin}
                        label="Residence Type"
                        value={user.contactInfo?.residence_type || user.studentProfile?.residence_type}
                    />
                )}

            </div>
        </InfoCard>
    );
}

function AddressInfoCard({ user }: { user: UserWithProfile }) {
    // Check both the structured address info and the direct props for backward compatibility
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
                <InfoItem
                    icon={MapPin}
                    label="Complete Address"
                    value={addressParts.join(', ')}
                />
                {street && (
                    <InfoItem
                        icon={MapPin}
                        label="Street"
                        value={street}
                    />
                )}
                {barangay && (
                    <InfoItem
                        icon={MapPin}
                        label="Barangay"
                        value={barangay}
                    />
                )}
                {city && (
                    <InfoItem
                        icon={MapPin}
                        label="City"
                        value={city}
                    />
                )}
                {province && (
                    <InfoItem
                        icon={MapPin}
                        label="Province"
                        value={province}
                    />
                )}
            </div>
        </InfoCard>
    );
}

function FamilyBackgroundCard({ user }: { user: UserWithProfile }) {
    // Check both the structured family info and the direct props for backward compatibility
    const familyInfo = user.familyInfo || {};
    const studentProfile = user.studentProfile;

    if (!studentProfile && !familyInfo) return null;

    // Type for sibling data
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
                    <InfoItem
                        icon={User2}
                        label="Guardian Name"
                        value={familyInfo.guardian_name || studentProfile?.guardian_name || ''}
                    />
                )}

                {/* Siblings list if available */}
                {(familyInfo.siblings || studentProfile?.siblings) && (
                    <div className="mt-4">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Siblings</h3>
                        <div className="space-y-2">
                            {((familyInfo.siblings || studentProfile?.siblings || []) as Sibling[]).map((sibling, index) => (
                                <div key={index} className="text-sm bg-gray-50 dark:bg-gray-800/50 p-2 rounded">
                                    <p className="font-medium">{sibling.name}</p>
                                    <div className="grid grid-cols-2 gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
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
    // Check both structured data and direct access for compatibility
    const fatherInfo = user.fatherInfo || {};
    const studentProfile = user.studentProfile;

    if ((!studentProfile || !studentProfile.father_name) && !fatherInfo.father_name) return null;

    return (
        <InfoCard>
            <SectionHeader icon={User2} title="Father's Information" />

            <div className="space-y-4">
                <InfoItem
                    icon={User2}
                    label="Full Name"
                    value={fatherInfo.father_name || studentProfile?.father_name || ''}
                />
                {(fatherInfo.father_age || (studentProfile && studentProfile.father_age)) && (
                    <InfoItem
                        icon={User2}
                        label="Age"
                        value={(fatherInfo.father_age || (studentProfile && studentProfile.father_age) || '').toString()}
                    />
                )}
                {(fatherInfo.father_mobile || studentProfile?.father_mobile) && (
                    <InfoItem
                        icon={Phone}
                        label="Mobile Number"
                        value={fatherInfo.father_mobile || studentProfile?.father_mobile || ''}
                    />
                )}
                {(fatherInfo.father_email || studentProfile?.father_email) && (
                    <InfoItem
                        icon={Mail}
                        label="Email"
                        value={fatherInfo.father_email || studentProfile?.father_email || ''}
                    />
                )}
                {(fatherInfo.father_occupation || studentProfile?.father_occupation) && (
                    <InfoItem
                        icon={Building2}
                        label="Occupation"
                        value={fatherInfo.father_occupation || studentProfile?.father_occupation || ''}
                    />
                )}
                {(fatherInfo.father_company || studentProfile?.father_company) && (
                    <InfoItem
                        icon={Building2}
                        label="Company"
                        value={fatherInfo.father_company || studentProfile?.father_company || ''}
                    />
                )}
                {(fatherInfo.father_monthly_income || (studentProfile && studentProfile.father_monthly_income)) && (
                    <InfoItem
                        icon={Building2}
                        label="Monthly Income"
                        value={`₱${(fatherInfo.father_monthly_income || (studentProfile && studentProfile.father_monthly_income) || 0).toString()}`}
                    />
                )}
                {(fatherInfo.father_education || studentProfile?.father_education) && (
                    <InfoItem
                        icon={School}
                        label="Education"
                        value={fatherInfo.father_education || studentProfile?.father_education || ''}
                    />
                )}
                {(fatherInfo.father_school || studentProfile?.father_school) && (
                    <InfoItem
                        icon={School}
                        label="School"
                        value={fatherInfo.father_school || studentProfile?.father_school || ''}
                    />
                )}
            </div>
        </InfoCard>
    );
}

function MotherInfoCard({ user }: { user: UserWithProfile }) {
    // Check both structured data and direct access for compatibility
    const motherInfo = user.motherInfo || {};
    const studentProfile = user.studentProfile;

    if ((!studentProfile || !studentProfile.mother_name) && !motherInfo.mother_name) return null;

    return (
        <InfoCard>
            <SectionHeader icon={User2} title="Mother's Information" />

            <div className="space-y-4">
                <InfoItem
                    icon={User2}
                    label="Full Name"
                    value={motherInfo.mother_name || studentProfile?.mother_name || ''}
                />
                {(motherInfo.mother_age || (studentProfile && studentProfile.mother_age)) && (
                    <InfoItem
                        icon={User2}
                        label="Age"
                        value={(motherInfo.mother_age || (studentProfile && studentProfile.mother_age) || '').toString()}
                    />
                )}
                {(motherInfo.mother_mobile || studentProfile?.mother_mobile) && (
                    <InfoItem
                        icon={Phone}
                        label="Mobile Number"
                        value={motherInfo.mother_mobile || studentProfile?.mother_mobile || ''}
                    />
                )}
                {(motherInfo.mother_email || studentProfile?.mother_email) && (
                    <InfoItem
                        icon={Mail}
                        label="Email"
                        value={motherInfo.mother_email || studentProfile?.mother_email || ''}
                    />
                )}
                {(motherInfo.mother_occupation || studentProfile?.mother_occupation) && (
                    <InfoItem
                        icon={Building2}
                        label="Occupation"
                        value={motherInfo.mother_occupation || studentProfile?.mother_occupation || ''}
                    />
                )}
                {(motherInfo.mother_company || studentProfile?.mother_company) && (
                    <InfoItem
                        icon={Building2}
                        label="Company"
                        value={motherInfo.mother_company || studentProfile?.mother_company || ''}
                    />
                )}
                {(motherInfo.mother_monthly_income || (studentProfile && studentProfile.mother_monthly_income)) && (
                    <InfoItem
                        icon={Building2}
                        label="Monthly Income"
                        value={`₱${(motherInfo.mother_monthly_income || (studentProfile && studentProfile.mother_monthly_income) || 0).toString()}`}
                    />
                )}
                {(motherInfo.mother_education || studentProfile?.mother_education) && (
                    <InfoItem
                        icon={School}
                        label="Education"
                        value={motherInfo.mother_education || studentProfile?.mother_education || ''}
                    />
                )}
                {(motherInfo.mother_school || studentProfile?.mother_school) && (
                    <InfoItem
                        icon={School}
                        label="School"
                        value={motherInfo.mother_school || studentProfile?.mother_school || ''}
                    />
                )}
            </div>
        </InfoCard>
    );
}

function AcademicInfoCard({ user }: { user: UserWithProfile }) {
    // Check both structured data and direct access for compatibility
    const academicInfo = user.academicInfo || {};
    const studentProfile = user.studentProfile;

    if (!studentProfile && !academicInfo) return null;

    // Get values with fallbacks
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
                                {major && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Major in {major}
                                    </p>
                                )}
                            </div>
                        }
                    />
                )}
                {yearLevel && (
                    <InfoItem
                        icon={GraduationCap}
                        label="Year Level"
                        value={<span className="font-medium">{yearLevel}</span>}
                    />
                )}
                {scholarships && (
                    <InfoItem
                        icon={Award}
                        label="Scholarships"
                        value={<span className="font-medium">{scholarships}</span>}
                    />
                )}
            </div>
        </InfoCard>
    );
}

const StudentIDCard = ({ student }: { student: UserWithProfile }) => {
    // Get course from various sources with fallbacks
    const course = student.academicInfo?.course || student.course || student.studentProfile?.course || '';

    // Try to get abbreviation from full course name, or use the course as is
    const courseAbbr = COURSE_ABBREVIATIONS[course] || course;

    // Get student ID from various sources
    const studentId = student.academicInfo?.student_id || student.student_id || student.studentProfile?.student_id || '';

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
                    <div className="w-20 h-20 mr-4 flex-shrink-0">
                        <div className="w-full h-full flex items-center justify-center overflow-hidden">
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
                                    {student.avatar ? (
                                        <AvatarImage src={student.avatar} alt={`${student.first_name}'s photo`} />
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
                        <p className="text-xs font-bold tracking-wider">{studentId}</p>
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

export default function UserProfile({ user }: UserProfileProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/admin/dashboard',
        },
        {
            title: user.role === 'student' ? 'Students' : 'Staff',
            href: user.role === 'student' ? '/admin/students' : '/admin/staff',
        },
        {
            title: 'User Profile',
            href: `${user.role === 'student' ? '/admin/students' : '/admin/staff'}/${user.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="w-full py-12 px-4">
                <div className="max-w-none mx-auto space-y-8">
                    <ProfileHeader user={user} />
                    {/* Main content */}
                    <div className="grid gap-8 grid-cols-1 lg:grid-cols-2 xl:grid-cols-4">
                        <div className="space-y-8 xl:col-span-1">
                            <PersonalInfoCard user={user} />
                            {user.role === 'student' && <FamilyBackgroundCard user={user} />}
                        </div>

                        <div className="space-y-8 xl:col-span-1">
                            <ContactInfoCard user={user} />
                            <AddressInfoCard user={user} />
                            {user.role === 'student' && <AcademicInfoCard user={user} />}
                        </div>

                        {user.role === 'student' && (
                            <div className="space-y-8 xl:col-span-1">
                                {user.studentProfile?.father_name && <FatherInfoCard user={user} />}
                                {user.studentProfile?.mother_name && <MotherInfoCard user={user} />}
                            </div>
                        )}

                        {user.role === 'student' && (
                            <div className="space-y-8 xl:col-span-1">
                                <InfoCard>
                                    <SectionHeader icon={GraduationCap} title="Student ID Card" />
                                    <div className="flex justify-center">
                                        <StudentIDCard student={user} />
                                    </div>
                                </InfoCard>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}