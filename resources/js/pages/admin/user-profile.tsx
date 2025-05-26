import { router, Link, Head } from '@inertiajs/react';
import {
    TrashIcon, UserCircle, Building2, GraduationCap, Shield,
    Mail, Phone, MapPin, User2,
    BookOpen, School, Award,
    Pencil as PencilIcon,
    type LucideIcon,
    Users, FileText, Loader2
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
                    <div className="flex items-center gap-3">                        {user.role === 'student' && (
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

function UserAvatar({ user }: { user: User }) {
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
                <InfoItem
                    icon={Phone}
                    label="Mobile Number"
                    value={user.contactInfo?.mobile_number || user.mobile_number || user.studentProfile?.mobile_number || user.osasStaffProfile?.mobile_number || 'Not provided'}
                />
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
    const studentId = academicInfo.student_id || user.student_id || studentProfile?.student_id;
    const course = academicInfo.course || user.course || studentProfile?.course;
    const major = academicInfo.major || user.major || studentProfile?.major;
    const yearLevel = academicInfo.year_level || user.year_level || studentProfile?.year_level;
    const scholarships = academicInfo.scholarships || user.scholarships || studentProfile?.existing_scholarships;

    return (
        <InfoCard>
            <SectionHeader icon={BookOpen} title="Academic Information" />

            <div className="space-y-4">
                {studentId && (
                    <InfoItem
                        icon={School}
                        label="Student ID"
                        value={<span className="font-medium">{studentId}</span>}
                    />
                )}
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
                    <div className="grid gap-8 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
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
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}