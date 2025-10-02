import Address from '@/components/address';
import CivilStatusSelector from '@/components/civil-status-selector';
import CourseSelector from '@/components/course-selector';
import { DatePicker } from '@/components/date-picker';
import ErrorBoundary from '@/components/error-boundary';
import { InputWithLabel } from '@/components/input-with-label';
import PlaceOfBirth from '@/components/place-of-birth';
import PwdRadio from '@/components/pwd-radio';
import ReligionSelector from '@/components/religion-selector';
import ResidenceTypeSelector from '@/components/residence-type-selector';
import SexSelector from '@/components/sex-selector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import YearLevelSelector from '@/components/year-level-selector';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User as UserType } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { toast } from 'sonner';

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
}

interface EditStudentProfileProps {
    user: StudentWithProfile;
}

export default function EditStudentProfile({ user }: EditStudentProfileProps) {
    const { data, setData, put, processing, errors } = useForm({
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
        date_of_birth: user.studentProfile.date_of_birth
            ? typeof user.studentProfile.date_of_birth === 'string'
                ? user.studentProfile.date_of_birth.split('T')[0]
                : new Date(user.studentProfile.date_of_birth).toISOString().split('T')[0]
            : '',
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
        zip_code: user.studentProfile.zip_code || '',
        status_of_parents: user.studentProfile.status_of_parents || '',
        father_name: user.studentProfile.father_name || '',
        father_age: user.studentProfile.father_age || 0,
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
    });

    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => [
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
        ],
        [user.id],
    );

    // Memoize parent data to prevent infinite re-renders
    const fatherData = useMemo(
        () => ({
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
        }),
        [
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
        ],
    );

    const motherData = useMemo(
        () => ({
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
        }),
        [
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
        ],
    );

    // Memoize the data change handler to prevent re-creation on every render
    const handleDataChange = useCallback(
        (field: string, value: string | number) => {
            setData(field as keyof typeof data, value);
        },
        [setData],
    );

    const onSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            put(route('osas.students.update', user.id), {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    toast.success('Profile updated successfully!');
                    // Optionally, you can refresh the page or re-fetch data here if needed
                },
                onError: () => {
                    toast.error('Failed to update profile. Please check the form for errors.');
                },
            });
        },
        [put, user.id],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Student Profile" />
            <ErrorBoundary>
                <div className="flex h-full flex-1 flex-col space-y-6 p-6">
                    {/* Header */}
                    <div className="mb-2 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                            <div>
                                <h1 className="text-2xl leading-tight font-bold text-gray-900 md:text-3xl dark:text-gray-100">
                                    Edit Student Profile
                                </h1>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Update student information, address, academic, and family details.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2 self-start md:self-center">
                            <Button variant="ghost" asChild className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                                <Link href={route('osas.students.details', user.id)}>Cancel</Link>
                            </Button>
                            <Button type="submit" form="edit-student-profile-form" disabled={processing} className="flex items-center gap-2">
                                <Save className="h-4 w-4" />
                                {processing ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </div>
                    <Separator className="my-2" />

                    <form onSubmit={onSubmit} className="space-y-8" id="edit-student-profile-form">
                        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-3">
                            {/* Column 1 */}
                            <div className="flex h-full flex-col gap-8">
                                {/* Student Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Student Information</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-8">
                                            {/* Personal Details */}
                                            <div>
                                                <div className="mb-2 font-semibold text-gray-700 dark:text-gray-200">Personal Details</div>
                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                    <InputWithLabel
                                                        id="first_name"
                                                        label="First Name"
                                                        required
                                                        value={data.first_name}
                                                        onChange={(value) => handleDataChange('first_name', value)}
                                                        error={errors['first_name']}
                                                        placeholder="Enter first name"
                                                    />
                                                    <InputWithLabel
                                                        id="middle_name"
                                                        label="Middle Name"
                                                        required
                                                        value={data.middle_name}
                                                        onChange={(value) => handleDataChange('middle_name', value)}
                                                        error={errors['middle_name']}
                                                        placeholder="Enter middle name"
                                                    />
                                                    <InputWithLabel
                                                        id="last_name"
                                                        label="Last Name"
                                                        required
                                                        value={data.last_name}
                                                        onChange={(value) => handleDataChange('last_name', value)}
                                                        error={errors['last_name']}
                                                        placeholder="Enter last name"
                                                    />
                                                    <SexSelector
                                                        value={data.sex}
                                                        onChange={(value) => handleDataChange('sex', value)}
                                                        error={errors['sex']}
                                                        required
                                                        className="w-full"
                                                    />
                                                    <CivilStatusSelector
                                                        value={data.civil_status}
                                                        onChange={(value) => handleDataChange('civil_status', value)}
                                                        error={errors['civil_status']}
                                                        required
                                                        className="w-full"
                                                    />
                                                    <DatePicker
                                                        id="date_of_birth"
                                                        label="Date of Birth"
                                                        required
                                                        value={data.date_of_birth ? new Date(data.date_of_birth) : undefined}
                                                        onChange={(date) => setData('date_of_birth', date ? date.toISOString().split('T')[0] : '')}
                                                        error={errors['date_of_birth']}
                                                        maxDate={new Date()}
                                                        className="w-full"
                                                    />
                                                </div>
                                                <div className="mt-6">
                                                    <PlaceOfBirth
                                                        data={{ place_of_birth: data.place_of_birth || '' }}
                                                        setData={setData}
                                                        errors={errors}
                                                        processing={processing}
                                                    />
                                                </div>
                                                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                                                    <ReligionSelector
                                                        value={data.religion}
                                                        onChange={(value) => setData('religion', value)}
                                                        error={errors.religion}
                                                        required={false}
                                                    />
                                                    <ResidenceTypeSelector
                                                        value={data.residence_type}
                                                        onChange={(value) => setData('residence_type', value)}
                                                        error={errors.residence_type}
                                                        required={false}
                                                        className="w-full"
                                                    />
                                                    <div className="col-span-2">
                                                        <PwdRadio
                                                            value={data.is_pwd ? 'Yes' : 'No'}
                                                            onChange={(val) => setData('is_pwd', val === 'Yes')}
                                                            disabilityType={data.disability_type || ''}
                                                            onDisabilityTypeChange={(val) => setData('disability_type', val)}
                                                            error={errors.is_pwd}
                                                            disabilityTypeError={errors.disability_type}
                                                            required={false}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Address */}
                                            <div>
                                                <Address
                                                    data={{
                                                        street: data.street,
                                                        barangay: data.barangay,
                                                        city: data.city,
                                                        province: data.province,
                                                        zip_code: data.zip_code || '',
                                                    }}
                                                    setData={(field, value) => setData(field, value)}
                                                    errors={errors}
                                                    processing={processing}
                                                />
                                            </div>
                                            {/* Academic Details */}
                                            <div>
                                                <div className="mb-2 font-semibold text-gray-700 dark:text-gray-200">Academic Details</div>
                                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                                    <InputWithLabel
                                                        id="student_id"
                                                        label="Student ID"
                                                        value={data.student_id}
                                                        onChange={(value) => setData('student_id', value)}
                                                        error={errors.student_id}
                                                        required
                                                        placeholder="e.g. MBC2023-1234"
                                                    />
                                                    <CourseSelector
                                                        value={data.course}
                                                        onChange={(value) => setData('course', value)}
                                                        error={errors.course}
                                                        required
                                                        majorValue={data.major}
                                                        onMajorChange={(value) => setData('major', value)}
                                                        majorError={errors.major}
                                                    />
                                                    <YearLevelSelector
                                                        value={data.year_level}
                                                        onChange={(value) => setData('year_level', value)}
                                                        error={errors.year_level}
                                                        required
                                                        className="w-full"
                                                    />
                                                    <InputWithLabel
                                                        id="existing_scholarships"
                                                        label="Existing Scholarships"
                                                        value={data.existing_scholarships}
                                                        onChange={(value) => setData('existing_scholarships', value)}
                                                        error={errors.existing_scholarships}
                                                        placeholder="List any current scholarships..."
                                                    />
                                                </div>
                                            </div>
                                            {/* Contact Information */}
                                            <div>
                                                <div className="mb-2 font-semibold text-gray-700 dark:text-gray-200">Contact Information</div>
                                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                                    <InputWithLabel
                                                        id="email"
                                                        label="Email Address"
                                                        type="email"
                                                        value={data.email}
                                                        onChange={(value) => setData('email', value)}
                                                        error={errors.email}
                                                        required
                                                    />
                                                    <InputWithLabel
                                                        id="mobile_number"
                                                        label="Mobile Number"
                                                        value={data.mobile_number}
                                                        onChange={(value) => setData('mobile_number', value)}
                                                        error={errors.mobile_number}
                                                        placeholder="+639123456789"
                                                    />
                                                    <InputWithLabel
                                                        id="telephone_number"
                                                        label="Telephone Number"
                                                        value={data.telephone_number}
                                                        onChange={(value) => setData('telephone_number', value)}
                                                        error={errors.telephone_number}
                                                        placeholder="(02) 123-4567"
                                                    />
                                                </div>
                                            </div>
                                            {/* Guardian & Siblings */}
                                            <div>
                                                <div className="mb-2 font-semibold text-gray-700 dark:text-gray-200">Guardian & Siblings</div>
                                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                                    <InputWithLabel
                                                        id="guardian_name"
                                                        label="Guardian Name"
                                                        value={data.guardian_name}
                                                        onChange={(value) => setData('guardian_name', value)}
                                                        error={errors.guardian_name}
                                                        placeholder="Guardian's full name"
                                                    />
                                                    <InputWithLabel
                                                        id="total_siblings"
                                                        label="Total Siblings"
                                                        type="number"
                                                        value={data.total_siblings?.toString() || ''}
                                                        onChange={(value) => setData('total_siblings', value === '' ? 0 : parseInt(value))}
                                                        error={errors.total_siblings}
                                                        placeholder="0"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                            {/* Column 2 */}
                            <div className="flex h-full flex-col gap-8">
                                {/* Father's Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Father's Information</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 gap-6">
                                            <InputWithLabel
                                                id="father_name"
                                                label="Full Name"
                                                value={fatherData.name}
                                                onChange={(value) => handleDataChange('father_name', value)}
                                                error={errors['father_name']}
                                                placeholder="Father's full name"
                                            />
                                            <InputWithLabel
                                                id="father_age"
                                                label="Age"
                                                type="number"
                                                value={fatherData.age?.toString() || ''}
                                                onChange={(value) => handleDataChange('father_age', value === '' ? 0 : parseInt(value))}
                                                error={errors['father_age']}
                                                placeholder="Age"
                                            />
                                            <InputWithLabel
                                                id="father_address"
                                                label="Address"
                                                value={fatherData.address}
                                                onChange={(value) => handleDataChange('father_address', value)}
                                                error={errors['father_address']}
                                                placeholder="Home address"
                                            />
                                            <InputWithLabel
                                                id="father_telephone"
                                                label="Telephone"
                                                value={fatherData.telephone}
                                                onChange={(value) => handleDataChange('father_telephone', value)}
                                                error={errors['father_telephone']}
                                                placeholder="(02) 123-4567"
                                            />
                                            <InputWithLabel
                                                id="father_mobile"
                                                label="Mobile Number"
                                                value={fatherData.mobile}
                                                onChange={(value) => handleDataChange('father_mobile', value)}
                                                error={errors['father_mobile']}
                                                placeholder="+639123456789"
                                            />
                                            <InputWithLabel
                                                id="father_email"
                                                label="Email Address"
                                                type="email"
                                                value={fatherData.email}
                                                onChange={(value) => handleDataChange('father_email', value)}
                                                error={errors['father_email']}
                                                placeholder="father@email.com"
                                            />
                                            <InputWithLabel
                                                id="father_occupation"
                                                label="Occupation"
                                                value={fatherData.occupation}
                                                onChange={(value) => handleDataChange('father_occupation', value)}
                                                error={errors['father_occupation']}
                                                placeholder="Job title"
                                            />
                                            <InputWithLabel
                                                id="father_company"
                                                label="Company"
                                                value={fatherData.company}
                                                onChange={(value) => handleDataChange('father_company', value)}
                                                error={errors['father_company']}
                                                placeholder="Company name"
                                            />
                                            <InputWithLabel
                                                id="father_monthly_income"
                                                label="Monthly Income"
                                                type="number"
                                                value={fatherData.monthly_income?.toString() || ''}
                                                onChange={(value) => handleDataChange('father_monthly_income', value === '' ? 0 : parseFloat(value))}
                                                error={errors['father_monthly_income']}
                                                placeholder="0.00"
                                            />
                                            <InputWithLabel
                                                id="father_education"
                                                label="Education"
                                                value={fatherData.education}
                                                onChange={(value) => handleDataChange('father_education', value)}
                                                error={errors['father_education']}
                                                placeholder="Educational attainment"
                                            />
                                            <InputWithLabel
                                                id="father_school"
                                                label="School"
                                                value={fatherData.school}
                                                onChange={(value) => handleDataChange('father_school', value)}
                                                error={errors['father_school']}
                                                placeholder="School attended"
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                            {/* Column 3 */}
                            <div className="flex h-full flex-col gap-8">
                                {/* Mother's Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Mother's Information</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 gap-6">
                                            <InputWithLabel
                                                id="mother_name"
                                                label="Full Name"
                                                value={motherData.name}
                                                onChange={(value) => handleDataChange('mother_name', value)}
                                                error={errors['mother_name']}
                                                placeholder="Mother's full name"
                                            />
                                            <InputWithLabel
                                                id="mother_age"
                                                label="Age"
                                                type="number"
                                                value={motherData.age?.toString() || ''}
                                                onChange={(value) => handleDataChange('mother_age', value === '' ? 0 : parseInt(value))}
                                                error={errors['mother_age']}
                                                placeholder="Age"
                                            />
                                            <InputWithLabel
                                                id="mother_address"
                                                label="Address"
                                                value={motherData.address}
                                                onChange={(value) => handleDataChange('mother_address', value)}
                                                error={errors['mother_address']}
                                                placeholder="Home address"
                                            />
                                            <InputWithLabel
                                                id="mother_telephone"
                                                label="Telephone"
                                                value={motherData.telephone}
                                                onChange={(value) => handleDataChange('mother_telephone', value)}
                                                error={errors['mother_telephone']}
                                                placeholder="(02) 123-4567"
                                            />
                                            <InputWithLabel
                                                id="mother_mobile"
                                                label="Mobile Number"
                                                value={motherData.mobile}
                                                onChange={(value) => handleDataChange('mother_mobile', value)}
                                                error={errors['mother_mobile']}
                                                placeholder="+639123456789"
                                            />
                                            <InputWithLabel
                                                id="mother_email"
                                                label="Email Address"
                                                type="email"
                                                value={motherData.email}
                                                onChange={(value) => handleDataChange('mother_email', value)}
                                                error={errors['mother_email']}
                                                placeholder="mother@email.com"
                                            />
                                            <InputWithLabel
                                                id="mother_occupation"
                                                label="Occupation"
                                                value={motherData.occupation}
                                                onChange={(value) => handleDataChange('mother_occupation', value)}
                                                error={errors['mother_occupation']}
                                                placeholder="Job title"
                                            />
                                            <InputWithLabel
                                                id="mother_company"
                                                label="Company"
                                                value={motherData.company}
                                                onChange={(value) => handleDataChange('mother_company', value)}
                                                error={errors['mother_company']}
                                                placeholder="Company name"
                                            />
                                            <InputWithLabel
                                                id="mother_monthly_income"
                                                label="Monthly Income"
                                                type="number"
                                                value={motherData.monthly_income?.toString() || ''}
                                                onChange={(value) => handleDataChange('mother_monthly_income', value === '' ? 0 : parseFloat(value))}
                                                error={errors['mother_monthly_income']}
                                                placeholder="0.00"
                                            />
                                            <InputWithLabel
                                                id="mother_education"
                                                label="Education"
                                                value={motherData.education}
                                                onChange={(value) => handleDataChange('mother_education', value)}
                                                error={errors['mother_education']}
                                                placeholder="Educational attainment"
                                            />
                                            <InputWithLabel
                                                id="mother_school"
                                                label="School"
                                                value={motherData.school}
                                                onChange={(value) => handleDataChange('mother_school', value)}
                                                error={errors['mother_school']}
                                                placeholder="School attended"
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </form>
                </div>
            </ErrorBoundary>
        </AppLayout>
    );
}
