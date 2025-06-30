import { Head, Link, useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { type User as UserType, type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { InputWithLabel } from '@/components/input-with-label';
import Address from '@/components/address';
import { SelectorWithLabel } from '@/components/selector-with-label';
import { DatePicker } from "@/components/date-picker";
import PlaceOfBirth from "@/components/place-of-birth";
import ReligionSelector from "@/components/religion-selector";
import { Button } from "@/components/ui/button";
import CourseSelector from "@/components/course-selector";

interface UserWithProfile extends UserType {
    studentProfile?: {
        student_id: string;
        course: string;
        major?: string;
        year_level: string;
        existing_scholarships?: string;
        civil_status: string;
        sex: string;
        date_of_birth?: string;
        place_of_birth?: string;
        mobile_number?: string;
        telephone_number?: string;
        is_pwd?: boolean;
        disability_type?: string;
        religion?: string;
        residence_type?: string;
        guardian_name?: string;
        street?: string;
        barangay?: string;
        city?: string;
        province?: string;
        zip_code?: string;
        status_of_parents?: string;
        father_name?: string;
        father_age?: number;
        father_address?: string;
        father_telephone?: string;
        father_mobile?: string;
        father_email?: string;
        father_occupation?: string;
        father_company?: string;
        father_monthly_income?: number;
        father_education?: string;
        father_school?: string;
        mother_name?: string;
        mother_age?: number;
        mother_address?: string;
        mother_telephone?: string;
        mother_mobile?: string;
        mother_email?: string;
        mother_occupation?: string;
        mother_company?: string;
        mother_monthly_income?: number;
        mother_education?: string;
        mother_school?: string;
        total_siblings?: number;
    };
    osasStaffProfile?: {
        staff_id: string;
        mobile_number?: string;
    };
}

interface EditUserProfileProps {
    user: UserWithProfile;
}

export default function EditUserProfile({ user }: EditUserProfileProps) {
    const { data, setData, put, processing, errors, wasSuccessful } = useForm({
        first_name: user.first_name || '',
        middle_name: user.middle_name || '',
        last_name: user.last_name || '',
        email: user.email || '',

        // Student-specific fields
        ...(user.role === 'student' && {
            student_id: user.studentProfile?.student_id || '',
            course: user.studentProfile?.course || '',
            major: user.studentProfile?.major || '',
            year_level: user.studentProfile?.year_level || '',
            existing_scholarships: user.studentProfile?.existing_scholarships || '',
            civil_status: user.studentProfile?.civil_status || '',
            sex: user.studentProfile?.sex || '',
            date_of_birth: user.studentProfile?.date_of_birth ?
                (typeof user.studentProfile.date_of_birth === 'string'
                    ? user.studentProfile.date_of_birth.split('T')[0]
                    : new Date(user.studentProfile.date_of_birth).toISOString().split('T')[0]
                ) : '',
            place_of_birth: user.studentProfile?.place_of_birth || '',
            mobile_number: user.studentProfile?.mobile_number || '',
            telephone_number: user.studentProfile?.telephone_number || '',
            is_pwd: user.studentProfile?.is_pwd || false,
            disability_type: user.studentProfile?.disability_type || '',
            religion: user.studentProfile?.religion || '',
            residence_type: user.studentProfile?.residence_type || '',
            guardian_name: user.studentProfile?.guardian_name || '',
            street: user.studentProfile?.street || '',
            barangay: user.studentProfile?.barangay || '',
            city: user.studentProfile?.city || '',
            province: user.studentProfile?.province || '',
            zip_code: user.studentProfile?.zip_code || '',
            status_of_parents: user.studentProfile?.status_of_parents || '',
            father_name: user.studentProfile?.father_name || '',
            father_age: user.studentProfile?.father_age || '',
            father_address: user.studentProfile?.father_address || '',
            father_telephone: user.studentProfile?.father_telephone || '',
            father_mobile: user.studentProfile?.father_mobile || '',
            father_email: user.studentProfile?.father_email || '',
            father_occupation: user.studentProfile?.father_occupation || '',
            father_company: user.studentProfile?.father_company || '',
            father_monthly_income: user.studentProfile?.father_monthly_income || '',
            father_education: user.studentProfile?.father_education || '',
            father_school: user.studentProfile?.father_school || '',
            mother_name: user.studentProfile?.mother_name || '',
            mother_age: user.studentProfile?.mother_age || '',
            mother_address: user.studentProfile?.mother_address || '',
            mother_telephone: user.studentProfile?.mother_telephone || '',
            mother_mobile: user.studentProfile?.mother_mobile || '',
            mother_email: user.studentProfile?.mother_email || '',
            mother_occupation: user.studentProfile?.mother_occupation || '',
            mother_company: user.studentProfile?.mother_company || '',
            mother_monthly_income: user.studentProfile?.mother_monthly_income || '',
            mother_education: user.studentProfile?.mother_education || '',
            mother_school: user.studentProfile?.mother_school || '',
            total_siblings: user.studentProfile?.total_siblings || 0,
        }),

        // Staff-specific fields
        ...(user.role === 'osas_staff' && {
            staff_id: user.osasStaffProfile?.staff_id || '',
            mobile_number: user.osasStaffProfile?.mobile_number || '',
        }),
    });

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
            title: 'Edit Profile',
            href: `${user.role === 'student' ? '/admin/students' : '/admin/staff'}/${user.id}/edit`,
        },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updateRoute = user.role === 'student' ? 'admin.students.update' : 'admin.staff.update';
        put(route(updateRoute, user.id));
    };

    const backRoute = user.role === 'student' ? 'admin.students.show' : 'admin.staff.show';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${user.role === 'student' ? 'Student' : 'Staff'} Profile`} />

            <div className="flex h-full flex-1 flex-col space-y-6 p-6">
                {/* Header */}
                <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
                    <div className="flex items-center gap-4 mb-2">
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                            Edit {user.role === 'student' ? 'Student' : 'Staff'}
                        </h1>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user.first_name} {user.last_name}
                    </p>
                </div>

                {/* Success Message */}
                {wasSuccessful && (
                    <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                        <AlertDescription className="text-green-800 dark:text-green-200 text-sm">
                            Profile updated successfully!
                        </AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <div className="border-b border-gray-100 dark:border-gray-800 pb-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Basic Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <InputWithLabel
                                id="first_name"
                                label="First Name"
                                value={data.first_name}
                                onChange={(value) => setData('first_name', value)}
                                error={errors.first_name}
                                required
                                className=""
                            />
                            <InputWithLabel
                                id="middle_name"
                                label="Middle Name"
                                value={data.middle_name}
                                onChange={(value) => setData('middle_name', value)}
                                error={errors.middle_name}
                                className=""
                            />
                            <InputWithLabel
                                id="last_name"
                                label="Last Name"
                                value={data.last_name}
                                onChange={(value) => setData('last_name', value)}
                                error={errors.last_name}
                                required
                                className=""
                            />
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="border-b border-gray-100 dark:border-gray-800 pb-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Contact Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputWithLabel
                                id="email"
                                label="Email Address"
                                type="email"
                                value={data.email}
                                onChange={(value) => setData('email', value)}
                                error={errors.email}
                                required
                                className=""
                            />
                        </div>
                    </div>

                    {/* Student-specific sections */}
                    {user.role === 'student' && (
                        <>
                            {/* Academic Information */}
                            <div className="border-b border-gray-100 dark:border-gray-800 pb-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Academic Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <InputWithLabel
                                        id="student_id"
                                        label="Student ID"
                                        value={data.student_id ?? ''}
                                        onChange={(value) => setData('student_id', value)}
                                        error={errors.student_id}
                                        required
                                        placeholder="e.g. MBC2023-1234"
                                    />
                                    <CourseSelector
                                        value={data.course ?? ''}
                                        onChange={(value) => {
                                            setData('course', value);
                                            // Reset major if course changes
                                            if (!(value in {"Bachelor of Secondary Education":1,"Bachelor of Science in Entrepreneurship":1})) setData('major', '');
                                        }}
                                        error={errors.course}
                                        required
                                        majorValue={data.major ?? ''}
                                        onMajorChange={(value) => setData('major', value)}
                                        majorError={errors.major}
                                        className=""
                                    />
                                    <SelectorWithLabel
                                        id="year_level"
                                        label="Year Level"
                                        value={data.year_level ?? ''}
                                        onChange={(value) => setData('year_level', value)}
                                        options={[
                                            { value: '1st Year', label: '1st Year' },
                                            { value: '2nd Year', label: '2nd Year' },
                                            { value: '3rd Year', label: '3rd Year' },
                                            { value: '4th Year', label: '4th Year' },
                                        ]}
                                        placeholder="Select year level"
                                        error={errors.year_level}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                    <InputWithLabel
                                        id="existing_scholarships"
                                        label="Existing Scholarships"
                                        value={data.existing_scholarships ?? ''}
                                        onChange={(value) => setData('existing_scholarships', value)}
                                        error={errors.existing_scholarships}
                                        placeholder="List any current scholarships..."
                                        className="min-h-[40px]"
                                    />
                                </div>
                            </div>

                            {/* Personal Information */}
                            <div className="border-b border-gray-100 dark:border-gray-800 pb-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Personal Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <SelectorWithLabel
                                        id="civil_status"
                                        label="Civil Status"
                                        value={data.civil_status ?? ''}
                                        onChange={(value) => setData('civil_status', value)}
                                        options={[
                                            { value: 'Single', label: 'Single' },
                                            { value: 'Married', label: 'Married' },
                                            { value: 'Widowed', label: 'Widowed' },
                                            { value: 'Separated', label: 'Separated' },
                                            { value: 'Annulled', label: 'Annulled' },
                                        ]}
                                        placeholder="Select civil status"
                                        error={errors.civil_status}
                                        required
                                    />
                                    <SelectorWithLabel
                                        id="sex"
                                        label="Sex"
                                        value={data.sex ?? ''}
                                        onChange={(value) => setData('sex', value)}
                                        options={[
                                            { value: 'Male', label: 'Male' },
                                            { value: 'Female', label: 'Female' },
                                        ]}
                                        placeholder="Select sex"
                                        error={errors.sex}
                                        required
                                    />
                                    <DatePicker
                                        id="date_of_birth"
                                        label="Date of Birth"
                                        value={data.date_of_birth ? new Date(data.date_of_birth) : undefined}
                                        onChange={(date) => setData('date_of_birth', date ? date.toISOString().slice(0, 10) : '')}
                                        error={errors.date_of_birth}
                                        required
                                        placeholder="Select date of birth"
                                        maxDate={new Date()}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                                    <PlaceOfBirth
                                        data={{ place_of_birth: data.place_of_birth ?? '' }}
                                        setData={setData}
                                        errors={errors}
                                        processing={processing}
                                    />

                                    <ReligionSelector
                                        value={data.religion ?? ''}
                                        onChange={(value) => setData('religion', value)}
                                        error={errors.religion}
                                        required
                                    />

                                    <SelectorWithLabel
                                        id="residence_type"
                                        label="Residence Type"
                                        value={data.residence_type ?? ''}
                                        onChange={(value) => setData('residence_type', value)}
                                        options={[
                                            { value: "Parent's House", label: "Parent's House" },
                                            { value: 'Boarding House', label: 'Boarding House' },
                                            { value: 'With Guardian', label: 'With Guardian' },
                                        ]}
                                        placeholder="Select residence type"
                                        error={errors.residence_type}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                                    <InputWithLabel
                                        id="mobile_number"
                                        label="Mobile Number"
                                        value={data.mobile_number ?? ''}
                                        onChange={(value) => setData('mobile_number', value)}
                                        error={errors.mobile_number}
                                        placeholder="+639123456789"
                                    />
                                    <InputWithLabel
                                        id="telephone_number"
                                        label="Telephone Number"
                                        value={data.telephone_number ?? ''}
                                        onChange={(value) => setData('telephone_number', value)}
                                        error={errors.telephone_number}
                                        placeholder="Landline number"
                                    />
                                    <InputWithLabel
                                        id="guardian_name"
                                        label="Guardian Name"
                                        value={data.guardian_name ?? ''}
                                        onChange={(value) => setData('guardian_name', value)}
                                        error={errors.guardian_name}
                                        placeholder="Full name of guardian"
                                    />
                                </div>

                                <div className="mt-6">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="is_pwd"
                                            checked={data.is_pwd}
                                            onCheckedChange={(checked) => setData('is_pwd', checked as boolean)}
                                        />
                                        <Label htmlFor="is_pwd" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Person with Disability (PWD)
                                        </Label>
                                    </div>

                                    {data.is_pwd && (
                                        <div className="mt-4 max-w-md">
                                            <InputWithLabel
                                                id="disability_type"
                                                label="Disability Type"
                                                value={data.disability_type ?? ''}
                                                onChange={(value) => setData('disability_type', value)}
                                                error={errors.disability_type}
                                                placeholder="Specify disability type"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Address Information */}
                            <div className="border-b border-gray-100 dark:border-gray-800 pb-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Address Information</h2>
                                <Address
                                    data={{
                                        street: data.street ?? '',
                                        barangay: data.barangay ?? '',
                                        city: data.city ?? '',
                                        province: data.province ?? '',
                                        zip_code: data.zip_code ?? ''
                                    }}
                                    setData={(field, value) => setData(field, value)}
                                    errors={errors}
                                    processing={processing}
                                />
                            </div>

                            {/* Family Background */}
                            <div className="border-b border-gray-100 dark:border-gray-800 pb-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Family Background</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <SelectorWithLabel
                                        id="status_of_parents"
                                        label="Status of Parents"
                                        value={data.status_of_parents ?? ''}
                                        onChange={(value) => setData('status_of_parents', value)}
                                        options={[
                                            { value: 'Living Together', label: 'Living Together' },
                                            { value: 'Separated', label: 'Separated' },
                                            { value: 'Father Deceased', label: 'Father Deceased' },
                                            { value: 'Mother Deceased', label: 'Mother Deceased' },
                                            { value: 'Both Deceased', label: 'Both Deceased' },
                                        ]}
                                        placeholder="Select status"
                                        error={errors.status_of_parents}
                                        required
                                    />
                                    <InputWithLabel
                                        id="total_siblings"
                                        label="Total Number of Siblings"
                                        type="number"
                                        value={data.total_siblings?.toString() || ''}
                                        onChange={(value) => setData('total_siblings', parseInt(value) || 0)}
                                        error={errors.total_siblings}
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            {/* Father's Information */}
                            <div className="border-b border-gray-100 dark:border-gray-800 pb-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Father's Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <InputWithLabel
                                        id="father_name"
                                        label="Full Name"
                                        value={data.father_name ?? ''}
                                        onChange={(value) => setData('father_name', value)}
                                        error={errors.father_name}
                                        placeholder="Father's full name"
                                    />
                                    <InputWithLabel
                                        id="father_age"
                                        label="Age"
                                        type="number"
                                        value={data.father_age?.toString() || ''}
                                        onChange={(value) => setData('father_age', parseInt(value) || '')}
                                        error={errors.father_age}
                                        placeholder="Age"
                                    />
                                    <InputWithLabel
                                        id="father_mobile"
                                        label="Mobile Number"
                                        value={data.father_mobile ?? ''}
                                        onChange={(value) => setData('father_mobile', value)}
                                        error={errors.father_mobile}
                                        placeholder="+639123456789"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                                    <InputWithLabel
                                        id="father_email"
                                        label="Email Address"
                                        type="email"
                                        value={data.father_email ?? ''}
                                        onChange={(value) => setData('father_email', value)}
                                        error={errors.father_email}
                                        placeholder="father@email.com"
                                    />
                                    <InputWithLabel
                                        id="father_occupation"
                                        label="Occupation"
                                        value={data.father_occupation ?? ''}
                                        onChange={(value) => setData('father_occupation', value)}
                                        error={errors.father_occupation}
                                        placeholder="Job title"
                                    />
                                    <InputWithLabel
                                        id="father_company"
                                        label="Company"
                                        value={data.father_company ?? ''}
                                        onChange={(value) => setData('father_company', value)}
                                        error={errors.father_company}
                                        placeholder="Company name"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                                    <InputWithLabel
                                        id="father_monthly_income"
                                        label="Monthly Income"
                                        type="number"
                                        value={data.father_monthly_income?.toString() || ''}
                                        onChange={(value) => setData('father_monthly_income', parseFloat(value) || '')}
                                        error={errors.father_monthly_income}
                                        placeholder="0.00"
                                    />
                                    <InputWithLabel
                                        id="father_education"
                                        label="Education"
                                        value={data.father_education ?? ''}
                                        onChange={(value) => setData('father_education', value)}
                                        error={errors.father_education}
                                        placeholder="Educational attainment"
                                    />
                                    <InputWithLabel
                                        id="father_school"
                                        label="School"
                                        value={data.father_school ?? ''}
                                        onChange={(value) => setData('father_school', value)}
                                        error={errors.father_school}
                                        placeholder="School attended"
                                    />
                                </div>
                            </div>

                            {/* Mother's Information */}
                            <div className="border-b border-gray-100 dark:border-gray-800 pb-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Mother's Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <InputWithLabel
                                        id="mother_name"
                                        label="Full Name"
                                        value={data.mother_name ?? ''}
                                        onChange={(value) => setData('mother_name', value)}
                                        error={errors.mother_name}
                                        placeholder="Mother's full name"
                                    />
                                    <InputWithLabel
                                        id="mother_age"
                                        label="Age"
                                        type="number"
                                        value={data.mother_age?.toString() || ''}
                                        onChange={(value) => setData('mother_age', parseInt(value) || '')}
                                        error={errors.mother_age}
                                        placeholder="Age"
                                    />
                                    <InputWithLabel
                                        id="mother_mobile"
                                        label="Mobile Number"
                                        value={data.mother_mobile ?? ''}
                                        onChange={(value) => setData('mother_mobile', value)}
                                        error={errors.mother_mobile}
                                        placeholder="+639123456789"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                                    <InputWithLabel
                                        id="mother_email"
                                        label="Email Address"
                                        type="email"
                                        value={data.mother_email ?? ''}
                                        onChange={(value) => setData('mother_email', value)}
                                        error={errors.mother_email}
                                        placeholder="mother@email.com"
                                    />
                                    <InputWithLabel
                                        id="mother_occupation"
                                        label="Occupation"
                                        value={data.mother_occupation ?? ''}
                                        onChange={(value) => setData('mother_occupation', value)}
                                        error={errors.mother_occupation}
                                        placeholder="Job title"
                                    />
                                    <InputWithLabel
                                        id="mother_company"
                                        label="Company"
                                        value={data.mother_company ?? ''}
                                        onChange={(value) => setData('mother_company', value)}
                                        error={errors.mother_company}
                                        placeholder="Company name"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                                    <InputWithLabel
                                        id="mother_monthly_income"
                                        label="Monthly Income"
                                        type="number"
                                        value={data.mother_monthly_income?.toString() || ''}
                                        onChange={(value) => setData('mother_monthly_income', parseFloat(value) || '')}
                                        error={errors.mother_monthly_income}
                                        placeholder="0.00"
                                    />
                                    <InputWithLabel
                                        id="mother_education"
                                        label="Education"
                                        value={data.mother_education ?? ''}
                                        onChange={(value) => setData('mother_education', value)}
                                        error={errors.mother_education}
                                        placeholder="Educational attainment"
                                    />
                                    <InputWithLabel
                                        id="mother_school"
                                        label="School"
                                        value={data.mother_school ?? ''}
                                        onChange={(value) => setData('mother_school', value)}
                                        error={errors.mother_school}
                                        placeholder="School attended"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Staff-specific sections */}
                    {user.role === 'osas_staff' && (
                        <div className="border-b border-gray-100 dark:border-gray-800 pb-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Staff Information</h2>
                            <div className="max-w-md">
                                <InputWithLabel
                                    id="staff_id"
                                    label="Staff ID"
                                    value={data.staff_id ?? ''}
                                    onChange={(value) => setData('staff_id', value)}
                                    error={errors.staff_id}
                                    required
                                    placeholder="e.g. STAFF001"
                                />
                            </div>
                        </div>
                    )}

                    {/* Form Actions */}
                    <div className="flex items-center justify-end gap-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                        <Button
                            asChild
                            variant="ghost"
                            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
                        >
                            <Link href={route(backRoute, user.id)}>
                                Cancel
                            </Link>
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            variant="default"
                            className="text-sm flex items-center gap-2 border-b border-transparent hover:border-gray-400 dark:hover:border-gray-500 pb-1"
                        >
                            <Save className="h-4 w-4" />
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
