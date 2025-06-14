import { Head, Link, useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { useMemo, useCallback } from 'react';
import { type User as UserType, type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import ErrorBoundary from '@/components/error-boundary';
import PlaceOfBirthForm from '@/components/place-of-birth-form';
import { FormField } from '@/components/forms/form-field';
import { FormSection } from '@/components/forms/form-section';
import { StyledInput } from '@/components/forms/styled-input';
import { ParentInformation } from '@/components/forms/parent-information';

interface StudentWithProfile extends UserType {
    studentProfile: {
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
}

interface EditStudentProfileProps {
    user: StudentWithProfile;
}

export default function EditStudentProfile({ user }: EditStudentProfileProps) {
    const { data, setData, put, processing, errors, wasSuccessful } = useForm({
        first_name: user.first_name || '',
        middle_name: user.middle_name || '',
        last_name: user.last_name || '',        
        email: user.email || '',
        student_id: user.studentProfile.student_id || '',
        course: user.studentProfile.course || '',
        major: user.studentProfile.major || '',
        year_level: user.studentProfile.year_level || '',
        existing_scholarships: user.studentProfile.existing_scholarships || '',
        civil_status: user.studentProfile.civil_status || '',
        sex: user.studentProfile.sex || '',
        date_of_birth: user.studentProfile.date_of_birth ?
            (typeof user.studentProfile.date_of_birth === 'string'
                ? user.studentProfile.date_of_birth.split('T')[0]
                : new Date(user.studentProfile.date_of_birth).toISOString().split('T')[0]
            ) : '',
        place_of_birth: user.studentProfile.place_of_birth || '',
        mobile_number: user.studentProfile.mobile_number || '',
        telephone_number: user.studentProfile.telephone_number || '',
        is_pwd: user.studentProfile.is_pwd || false,
        disability_type: user.studentProfile.disability_type || '',
        religion: user.studentProfile.religion || '',
        residence_type: user.studentProfile.residence_type || '',
        guardian_name: user.studentProfile.guardian_name || '',
        street: user.studentProfile.street || '',
        barangay: user.studentProfile.barangay || '',
        city: user.studentProfile.city || '',
        province: user.studentProfile.province || '',
        status_of_parents: user.studentProfile.status_of_parents || '',
        father_name: user.studentProfile.father_name || '',        father_age: user.studentProfile.father_age || 0,
        father_address: user.studentProfile.father_address || '',
        father_telephone: user.studentProfile.father_telephone || '',
        father_mobile: user.studentProfile.father_mobile || '',
        father_email: user.studentProfile.father_email || '',
        father_occupation: user.studentProfile.father_occupation || '',
        father_company: user.studentProfile.father_company || '',
        father_monthly_income: user.studentProfile.father_monthly_income || 0,
        father_education: user.studentProfile.father_education || '',
        father_school: user.studentProfile.father_school || '',
        mother_name: user.studentProfile.mother_name || '',
        mother_age: user.studentProfile.mother_age || 0,
        mother_address: user.studentProfile.mother_address || '',
        mother_telephone: user.studentProfile.mother_telephone || '',
        mother_mobile: user.studentProfile.mother_mobile || '',
        mother_email: user.studentProfile.mother_email || '',
        mother_occupation: user.studentProfile.mother_occupation || '',
        mother_company: user.studentProfile.mother_company || '',
        mother_monthly_income: user.studentProfile.mother_monthly_income || 0,
        mother_education: user.studentProfile.mother_education || '',
        mother_school: user.studentProfile.mother_school || '',
        total_siblings: user.studentProfile.total_siblings || 0,
    });    const breadcrumbs: BreadcrumbItem[] = useMemo(() => [
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
        {
            title: 'Edit Student Profile',
            href: route('osas.students.edit', user.id),
        },
    ], [user.id]);    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        put(route('osas.students.update', user.id));
    }, [put, user.id]);// Memoize parent data to prevent infinite re-renders
    const fatherData = useMemo(() => ({
        name: data.father_name,
        age: data.father_age,
        address: data.father_address,
        telephone: data.father_telephone,
        mobile: data.father_mobile,
        email: data.father_email,
        occupation: data.father_occupation,
        company: data.father_company,
        monthly_income: data.father_monthly_income,
        education: data.father_education,
        school: data.father_school,
    }), [
        data.father_name,
        data.father_age,
        data.father_address,
        data.father_telephone,
        data.father_mobile,
        data.father_email,
        data.father_occupation,
        data.father_company,
        data.father_monthly_income,
        data.father_education,
        data.father_school,
    ]);    const motherData = useMemo(() => ({
        name: data.mother_name,
        age: data.mother_age,
        address: data.mother_address,
        telephone: data.mother_telephone,
        mobile: data.mother_mobile,
        email: data.mother_email,
        occupation: data.mother_occupation,
        company: data.mother_company,
        monthly_income: data.mother_monthly_income,
        education: data.mother_education,
        school: data.mother_school,
    }), [
        data.mother_name,
        data.mother_age,
        data.mother_address,
        data.mother_telephone,
        data.mother_mobile,
        data.mother_email,
        data.mother_occupation,
        data.mother_company,
        data.mother_monthly_income,
        data.mother_education,
        data.mother_school,
    ]);    // Memoize the data change handler to prevent re-creation on every render
    const handleDataChange = useCallback((field: string, value: string | number) => {
        setData(field as keyof typeof data, value);
    }, [setData]);return (<AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Edit Student Profile" />

        <ErrorBoundary>
            <div className="flex h-full flex-1 flex-col space-y-6 p-6">
            {/* Header */}
            <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
                <div className="flex items-center gap-4 mb-2">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        Edit Student
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
            )}            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <FormSection title="Basic Information">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField label="First Name" required error={errors.first_name}>
                            <StyledInput
                                id="first_name"
                                value={data.first_name}
                                onChange={(e) => setData('first_name', e.target.value)}
                            />
                        </FormField>

                        <FormField label="Middle Name" error={errors.middle_name}>
                            <StyledInput
                                id="middle_name"
                                value={data.middle_name}
                                onChange={(e) => setData('middle_name', e.target.value)}
                            />
                        </FormField>

                        <FormField label="Last Name" required error={errors.last_name}>
                            <StyledInput
                                id="last_name"
                                value={data.last_name}
                                onChange={(e) => setData('last_name', e.target.value)}
                            />
                        </FormField>
                    </div>
                </FormSection>                {/* Contact Information */}
                <FormSection title="Contact Information">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField label="Email Address" required error={errors.email}>
                            <StyledInput
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                        </FormField>
                    </div>
                </FormSection>                {/* Academic Information */}
                <FormSection title="Academic Information">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField label="Student ID" required error={errors.student_id}>
                            <StyledInput
                                id="student_id"
                                value={data.student_id}
                                onChange={(e) => setData('student_id', e.target.value)}
                                placeholder="e.g. MBC2023-1234"
                            />
                        </FormField>

                        <FormField label="Course" required error={errors.course}>
                            <StyledInput
                                id="course"
                                value={data.course}
                                onChange={(e) => setData('course', e.target.value)}
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField label="Major" error={errors.major}>
                            <StyledInput
                                id="major"
                                value={data.major}
                                onChange={(e) => setData('major', e.target.value)}
                                placeholder="e.g. Web Development"
                            />
                        </FormField>

                        <FormField label="Existing Scholarships" error={errors.existing_scholarships}>
                            <StyledInput
                                as="textarea"
                                id="existing_scholarships"
                                value={data.existing_scholarships}
                                onChange={(e) => setData('existing_scholarships', e.target.value)}
                                placeholder="List any current scholarships..."
                            />
                        </FormField>
                    </div>
                </FormSection>                {/* Personal Information */}
                <FormSection title="Personal Information">
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
                            <StyledInput
                                id="date_of_birth"
                                type="date"
                                value={data.date_of_birth}
                                onChange={(e) => setData('date_of_birth', e.target.value)}
                            />
                        </FormField>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="grid gap-2">
                            <PlaceOfBirthForm
                                data={{
                                    place_of_birth: data.place_of_birth || '',
                                }}
                                setData={(field, value) => setData(field, value)}
                                errors={errors}
                                processing={processing}
                            />
                        </div>

                        <FormField label="Religion" error={errors.religion}>
                            <StyledInput
                                id="religion"
                                value={data.religion}
                                onChange={(e) => setData('religion', e.target.value)}
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField label="Mobile Number" error={errors.mobile_number}>
                            <StyledInput
                                id="mobile_number"
                                value={data.mobile_number}
                                onChange={(e) => setData('mobile_number', e.target.value)}
                                placeholder="+639123456789"
                            />
                        </FormField>

                        <FormField label="Telephone Number" error={errors.telephone_number}>
                            <StyledInput
                                id="telephone_number"
                                value={data.telephone_number}
                                onChange={(e) => setData('telephone_number', e.target.value)}
                                placeholder="Landline number"
                            />
                        </FormField>

                        <FormField label="Guardian Name" error={errors.guardian_name}>
                            <StyledInput
                                id="guardian_name"
                                value={data.guardian_name}
                                onChange={(e) => setData('guardian_name', e.target.value)}
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
                                    <StyledInput
                                        id="disability_type"
                                        value={data.disability_type}
                                        onChange={(e) => setData('disability_type', e.target.value)}
                                        placeholder="Specify disability type"
                                    />
                                </FormField>
                            </div>
                        )}
                    </div>
                </FormSection>                {/* Address Information */}
                <FormSection title="Address Information">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField label="Street" error={errors.street}>
                            <StyledInput
                                id="street"
                                value={data.street}
                                onChange={(e) => setData('street', e.target.value)}
                                placeholder="Street address"
                            />
                        </FormField>

                        <FormField label="Barangay" error={errors.barangay}>
                            <StyledInput
                                id="barangay"
                                value={data.barangay}
                                onChange={(e) => setData('barangay', e.target.value)}
                                placeholder="Barangay"
                            />
                        </FormField>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField label="City" error={errors.city}>
                            <StyledInput
                                id="city"
                                value={data.city}
                                onChange={(e) => setData('city', e.target.value)}
                                placeholder="City"
                            />
                        </FormField>

                        <FormField label="Province" error={errors.province}>
                            <StyledInput
                                id="province"
                                value={data.province}
                                onChange={(e) => setData('province', e.target.value)}
                                placeholder="Province"
                            />
                        </FormField>
                    </div>
                </FormSection>

                {/* Family Background */}
                <FormSection title="Family Background">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField label="Status of Parents" error={errors.status_of_parents}>
                            <Select value={data.status_of_parents} onValueChange={(value) => setData('status_of_parents', value)}>
                                <SelectTrigger className="border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Living Together">Living Together</SelectItem>
                                    <SelectItem value="Separated">Separated</SelectItem>
                                    <SelectItem value="Father Deceased">Father Deceased</SelectItem>
                                    <SelectItem value="Mother Deceased">Mother Deceased</SelectItem>
                                    <SelectItem value="Both Deceased">Both Deceased</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormField>                        <FormField label="Total Number of Siblings" error={errors.total_siblings}>
                            <StyledInput
                                id="total_siblings"
                                type="number"
                                min="0"
                                value={data.total_siblings?.toString() || ''}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value === '') {
                                        setData('total_siblings', 0);
                                    } else {
                                        const numValue = parseInt(value, 10);
                                        if (!isNaN(numValue)) {
                                            setData('total_siblings', numValue);
                                        }
                                    }
                                }}
                                placeholder="0"
                            />
                        </FormField>
                    </div>
                </FormSection>                
                {/* Father's Information */}
                <FormSection title="Father's Information">                    
                    <ParentInformation
                        parentType="father"
                        data={fatherData}
                        onDataChange={handleDataChange}
                        errors={errors}
                    />
                </FormSection>                
                {/* Mother's Information */}
                <FormSection title="Mother's Information">                    
                    <ParentInformation
                        parentType="mother"
                        data={motherData}
                        onDataChange={handleDataChange}
                        errors={errors}
                    />
                </FormSection>{/* Form Actions */}
                <div className="flex items-center justify-end gap-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <Button
                        variant="ghost"
                        asChild
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                        <Link href={route('osas.students.details', user.id)}>
                            Cancel
                        </Link>
                    </Button>
                    <Button
                        type="submit"
                        disabled={processing}
                        className="flex items-center gap-2"
                    >
                        <Save className="h-4 w-4" />
                        {processing ? 'Saving...' : 'Save Changes'}
                    </Button>                
                    </div>
            </form>
        </div>
        </ErrorBoundary>
    </AppLayout>
    );
}
