import { Head, Link, useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { type User as UserType, type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

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

function FormField({
    label,
    required = false,
    error,
    children,
    className
}: {
    label: string;
    required?: boolean;
    error?: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cn("space-y-1", className)}>
            <Label className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {children}
            {error && (
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
        </div>
    );
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
                </div>                {/* Success Message */}
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
                            <FormField label="First Name" required error={errors.first_name}>
                                <Input
                                    id="first_name"
                                    value={data.first_name}
                                    onChange={(e) => setData('first_name', e.target.value)}
                                    className="border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500"
                                />
                            </FormField>

                            <FormField label="Middle Name" error={errors.middle_name}>
                                <Input
                                    id="middle_name"
                                    value={data.middle_name}
                                    onChange={(e) => setData('middle_name', e.target.value)}
                                    className="border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500"
                                />
                            </FormField>

                            <FormField label="Last Name" required error={errors.last_name}>
                                <Input
                                    id="last_name"
                                    value={data.last_name}
                                    onChange={(e) => setData('last_name', e.target.value)}
                                    className="border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500"
                                />
                            </FormField>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="border-b border-gray-100 dark:border-gray-800 pb-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Contact Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField label="Email Address" required error={errors.email}>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500"
                                />
                            </FormField>

                            {user.role === 'osas_staff' && (
                                <FormField label="Mobile Number" error={errors.mobile_number}>
                                    <Input
                                        id="mobile_number"
                                        value={data.mobile_number}
                                        onChange={(e) => setData('mobile_number', e.target.value)}
                                        className="border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500"
                                        placeholder="+639123456789"
                                    />
                                </FormField>
                            )}
                        </div>
                    </div>                    {/* Student-specific sections */}
                    {user.role === 'student' && (
                        <>
                            {/* Academic Information */}
                            <div className="border-b border-gray-100 dark:border-gray-800 pb-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Academic Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <FormField label="Student ID" required error={errors.student_id}>
                                        <Input
                                            id="student_id"
                                            value={data.student_id}
                                            onChange={(e) => setData('student_id', e.target.value)}
                                            className="border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500"
                                            placeholder="e.g. MBC2023-1234"
                                        />
                                    </FormField>

                                    <FormField label="Course" required error={errors.course}>
                                        <Input
                                            id="course"
                                            value={data.course}
                                            onChange={(e) => setData('course', e.target.value)}
                                            className="border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500"
                                            placeholder="e.g. BSIT"
                                        />
                                    </FormField>

                                    <FormField label="Year Level" required error={errors.year_level}>
                                        <Select value={data.year_level} onValueChange={(value) => setData('year_level', value)}>
                                            <SelectTrigger className="border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent">
                                                <SelectValue placeholder="Select year level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1st Year">1st Year</SelectItem>
                                                <SelectItem value="2nd Year">2nd Year</SelectItem>
                                                <SelectItem value="3rd Year">3rd Year</SelectItem>
                                                <SelectItem value="4th Year">4th Year</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormField>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                    <FormField label="Major" error={errors.major}>
                                        <Input
                                            id="major"
                                            value={data.major}
                                            onChange={(e) => setData('major', e.target.value)}
                                            className="border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500"
                                            placeholder="e.g. Web Development"
                                        />
                                    </FormField>

                                    <FormField label="Existing Scholarships" error={errors.existing_scholarships}>
                                        <Textarea
                                            id="existing_scholarships"
                                            value={data.existing_scholarships}
                                            onChange={(e) => setData('existing_scholarships', e.target.value)}
                                            className="border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500 min-h-[40px] resize-none"
                                            placeholder="List any current scholarships..."
                                        />
                                    </FormField>
                                </div>
                            </div>

                            {/* Personal Information */}
                            <div className="border-b border-gray-100 dark:border-gray-800 pb-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Personal Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <FormField label="Civil Status" required error={errors.civil_status}>
                                        <Select value={data.civil_status} onValueChange={(value) => setData('civil_status', value)}>
                                            <SelectTrigger className="border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent">
                                                <SelectValue placeholder="Select civil status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Single">Single</SelectItem>
                                                <SelectItem value="Married">Married</SelectItem>
                                                <SelectItem value="Widowed">Widowed</SelectItem>
                                                <SelectItem value="Separated">Separated</SelectItem>
                                                <SelectItem value="Annulled">Annulled</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormField>

                                    <FormField label="Sex" required error={errors.sex}>
                                        <Select value={data.sex} onValueChange={(value) => setData('sex', value)}>
                                            <SelectTrigger className="border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent">
                                                <SelectValue placeholder="Select sex" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Male">Male</SelectItem>
                                                <SelectItem value="Female">Female</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormField>

                                    <FormField label="Date of Birth" error={errors.date_of_birth}>
                                        <Input
                                            id="date_of_birth"
                                            type="date"
                                            value={data.date_of_birth}
                                            onChange={(e) => setData('date_of_birth', e.target.value)}
                                            className="border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500"
                                        />
                                    </FormField>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                                    <FormField label="Place of Birth" error={errors.place_of_birth}>
                                        <Input
                                            id="place_of_birth"
                                            value={data.place_of_birth}
                                            onChange={(e) => setData('place_of_birth', e.target.value)}
                                            className="border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500"
                                            placeholder="Birth place"
                                        />
                                    </FormField>

                                    <FormField label="Religion" error={errors.religion}>
                                        <Input
                                            id="religion"
                                            value={data.religion}
                                            onChange={(e) => setData('religion', e.target.value)}
                                            className="border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500"
                                            placeholder="Religion"
                                        />
                                    </FormField>

                                    <FormField label="Residence Type" error={errors.residence_type}>
                                        <Select value={data.residence_type} onValueChange={(value) => setData('residence_type', value)}>
                                            <SelectTrigger className="border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent">
                                                <SelectValue placeholder="Select residence type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Parent's House">Parent's House</SelectItem>
                                                <SelectItem value="Boarding House">Boarding House</SelectItem>
                                                <SelectItem value="With Guardian">With Guardian</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormField>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                                    <FormField label="Mobile Number" error={errors.mobile_number}>
                                        <Input
                                            id="mobile_number"
                                            value={data.mobile_number}
                                            onChange={(e) => setData('mobile_number', e.target.value)}
                                            className="border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500"
                                            placeholder="+639123456789"
                                        />
                                    </FormField>

                                    <FormField label="Telephone Number" error={errors.telephone_number}>
                                        <Input
                                            id="telephone_number"
                                            value={data.telephone_number}
                                            onChange={(e) => setData('telephone_number', e.target.value)}
                                            className="border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500"
                                            placeholder="Landline number"
                                        />
                                    </FormField>

                                    <FormField label="Guardian Name" error={errors.guardian_name}>
                                        <Input
                                            id="guardian_name"
                                            value={data.guardian_name}
                                            onChange={(e) => setData('guardian_name', e.target.value)}
                                            className="border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500"
                                            placeholder="Full name of guardian"
                                        />
                                    </FormField>
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
                                            <FormField label="Disability Type" error={errors.disability_type}>
                                                <Input
                                                    id="disability_type"
                                                    value={data.disability_type}
                                                    onChange={(e) => setData('disability_type', e.target.value)}
                                                    className="border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500"
                                                    placeholder="Specify disability type"
                                                />
                                            </FormField>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Address Information */}
                            <div className="border-b border-gray-100 dark:border-gray-800 pb-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Address Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField label="Street" error={errors.street}>
                                        <Input
                                            id="street"
                                            value={data.street}
                                            onChange={(e) => setData('street', e.target.value)}
                                            className="border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500"
                                            placeholder="Street address"
                                        />
                                    </FormField>

                                    <FormField label="Barangay" error={errors.barangay}>
                                        <Input
                                            id="barangay"
                                            value={data.barangay}
                                            onChange={(e) => setData('barangay', e.target.value)}
                                            className="border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500"
                                            placeholder="Barangay"
                                        />
                                    </FormField>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                    <FormField label="City" error={errors.city}>
                                        <Input
                                            id="city"
                                            value={data.city}
                                            onChange={(e) => setData('city', e.target.value)}
                                            className="border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500"
                                            placeholder="City"
                                        />
                                    </FormField>

                                    <FormField label="Province" error={errors.province}>
                                        <Input
                                            id="province"
                                            value={data.province}
                                            onChange={(e) => setData('province', e.target.value)}
                                            className="border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500"
                                            placeholder="Province"
                                        />
                                    </FormField>
                                </div>
                            </div>

                            {/* Family Background */}
                            <div className="border-b border-gray-100 dark:border-gray-800 pb-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Family Background</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField label="Status of Parents" error={errors.status_of_parents}>
                                        <Select value={data.status_of_parents} onValueChange={(value) => setData('status_of_parents', value)}>
                                            <SelectTrigger className="border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>                                            <SelectContent>
                                                <SelectItem value="Living Together">Living Together</SelectItem>
                                                <SelectItem value="Separated">Separated</SelectItem>
                                                <SelectItem value="Father Deceased">Father Deceased</SelectItem>
                                                <SelectItem value="Mother Deceased">Mother Deceased</SelectItem>
                                                <SelectItem value="Both Deceased">Both Deceased</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormField>

                                    <FormField label="Total Number of Siblings" error={errors.total_siblings}>
                                        <Input
                                            id="total_siblings"
                                            type="number"
                                            min="0"
                                            value={data.total_siblings}
                                            onChange={(e) => setData('total_siblings', parseInt(e.target.value) || 0)}
                                            className="border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500"
                                            placeholder="0"
                                        />
                                    </FormField>
                                </div>
                            </div>

                            {/* Father's Information */}
                            <div className="border-b border-gray-100 dark:border-gray-800 pb-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Father's Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <FormField label="Full Name" error={errors.father_name}>
                                        <Input
                                            id="father_name"
                                            value={data.father_name}
                                            onChange={(e) => setData('father_name', e.target.value)}
                                            className="border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500"
                                            placeholder="Father's full name"
                                        />
                                    </FormField>

                                    <FormField label="Age" error={errors.father_age}>
                                        <Input
                                            id="father_age"
                                            type="number"
                                            min="0"
                                            max="120"
                                            value={data.father_age}
                                            onChange={(e) => setData('father_age', parseInt(e.target.value) || '')}
                                            className="border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500"
                                            placeholder="Age"
                                        />
                                    </FormField>

                                    <FormField label="Mobile Number" error={errors.father_mobile}>
                                        <Input
                                            id="father_mobile"
                                            value={data.father_mobile}
                                            onChange={(e) => setData('father_mobile', e.target.value)}
                                            className="border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500"
                                            placeholder="+639123456789"
                                        />
                                    </FormField>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                                    <FormField label="Email Address" error={errors.father_email}>
                                        <Input
                                            id="father_email"
                                            type="email"
                                            value={data.father_email}
                                            onChange={(e) => setData('father_email', e.target.value)}
                                            className="border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500"
                                            placeholder="father@email.com"
                                        />
                                    </FormField>

                                    <FormField label="Occupation" error={errors.father_occupation}>
                                        <Input
                                            id="father_occupation"
                                            value={data.father_occupation}
                                            onChange={(e) => setData('father_occupation', e.target.value)}
                                            className="border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500"
                                            placeholder="Job title"
                                        />
                                    </FormField>

                                    <FormField label="Company" error={errors.father_company}>
                                        <Input
                                            id="father_company"
                                            value={data.father_company}
                                            onChange={(e) => setData('father_company', e.target.value)}
                                            className="border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500"
                                            placeholder="Company name"
                                        />
                                    </FormField>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                                    <FormField label="Monthly Income" error={errors.father_monthly_income}>
                                        <Input
                                            id="father_monthly_income"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={data.father_monthly_income}
                                            onChange={(e) => setData('father_monthly_income', parseFloat(e.target.value) || '')}
                                            className="border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500"
                                            placeholder="0.00"
                                        />
                                    </FormField>

                                    <FormField label="Education" error={errors.father_education}>
                                        <Input
                                            id="father_education"
                                            value={data.father_education}
                                            onChange={(e) => setData('father_education', e.target.value)}
                                            className="border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500"
                                            placeholder="Educational attainment"
                                        />
                                    </FormField>

                                    <FormField label="School" error={errors.father_school}>
                                        <Input
                                            id="father_school"
                                            value={data.father_school}
                                            onChange={(e) => setData('father_school', e.target.value)}
                                            className="border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500"
                                            placeholder="School attended"
                                        />
                                    </FormField>
                                </div>
                            </div>

                            {/* Mother's Information */}
                            <div className="border-b border-gray-100 dark:border-gray-800 pb-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Mother's Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <FormField label="Full Name" error={errors.mother_name}>
                                        <Input
                                            id="mother_name"
                                            value={data.mother_name}
                                            onChange={(e) => setData('mother_name', e.target.value)}
                                            className="border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500"
                                            placeholder="Mother's full name"
                                        />
                                    </FormField>

                                    <FormField label="Age" error={errors.mother_age}>
                                        <Input
                                            id="mother_age"
                                            type="number"
                                            min="0"
                                            max="120"
                                            value={data.mother_age}
                                            onChange={(e) => setData('mother_age', parseInt(e.target.value) || '')}
                                            className="border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500"
                                            placeholder="Age"
                                        />
                                    </FormField>

                                    <FormField label="Mobile Number" error={errors.mother_mobile}>
                                        <Input
                                            id="mother_mobile"
                                            value={data.mother_mobile}
                                            onChange={(e) => setData('mother_mobile', e.target.value)}
                                            className="border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500"
                                            placeholder="+639123456789"
                                        />
                                    </FormField>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                                    <FormField label="Email Address" error={errors.mother_email}>
                                        <Input
                                            id="mother_email"
                                            type="email"
                                            value={data.mother_email}
                                            onChange={(e) => setData('mother_email', e.target.value)}
                                            className="border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500"
                                            placeholder="mother@email.com"
                                        />
                                    </FormField>

                                    <FormField label="Occupation" error={errors.mother_occupation}>
                                        <Input
                                            id="mother_occupation"
                                            value={data.mother_occupation}
                                            onChange={(e) => setData('mother_occupation', e.target.value)}
                                            className="border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500"
                                            placeholder="Job title"
                                        />
                                    </FormField>

                                    <FormField label="Company" error={errors.mother_company}>
                                        <Input
                                            id="mother_company"
                                            value={data.mother_company}
                                            onChange={(e) => setData('mother_company', e.target.value)}
                                            className="border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500"
                                            placeholder="Company name"
                                        />
                                    </FormField>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                                    <FormField label="Monthly Income" error={errors.mother_monthly_income}>
                                        <Input
                                            id="mother_monthly_income"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={data.mother_monthly_income}
                                            onChange={(e) => setData('mother_monthly_income', parseFloat(e.target.value) || '')}
                                            className="border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500"
                                            placeholder="0.00"
                                        />
                                    </FormField>

                                    <FormField label="Education" error={errors.mother_education}>
                                        <Input
                                            id="mother_education"
                                            value={data.mother_education}
                                            onChange={(e) => setData('mother_education', e.target.value)}
                                            className="border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500"
                                            placeholder="Educational attainment"
                                        />
                                    </FormField>

                                    <FormField label="School" error={errors.mother_school}>
                                        <Input
                                            id="mother_school"
                                            value={data.mother_school}
                                            onChange={(e) => setData('mother_school', e.target.value)}
                                            className="border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500"
                                            placeholder="School attended"
                                        />
                                    </FormField>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Staff-specific sections */}
                    {user.role === 'osas_staff' && (
                        <div className="border-b border-gray-100 dark:border-gray-800 pb-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Staff Information</h2>
                            <div className="max-w-md">
                                <FormField label="Staff ID" required error={errors.staff_id}>
                                    <Input
                                        id="staff_id"
                                        value={data.staff_id}
                                        onChange={(e) => setData('staff_id', e.target.value)}
                                        className="border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-400 dark:focus-visible:border-gray-500"
                                        placeholder="e.g. STAFF001"
                                    />
                                </FormField>
                            </div>
                        </div>
                    )}                    {/* Form Actions */}
                    <div className="flex items-center justify-end gap-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                        <Link
                            href={route(backRoute, user.id)}
                            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="text-sm text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 transition-colors disabled:opacity-50 flex items-center gap-2 border-b border-transparent hover:border-gray-400 dark:hover:border-gray-500 pb-1"
                        >
                            <Save className="h-4 w-4" />
                            {processing ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
