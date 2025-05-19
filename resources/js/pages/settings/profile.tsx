import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import AddressForm from '@/components/address-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PhotoIdUpload } from '@/components/PhotoIdUpload';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

interface ProfileFormData {
    photo_id: File | null;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    email: string;
    student_id: string;
    course: string;
    major: string;
    year_level: string;
    civil_status: string;
    sex: string;
    date_of_birth: string;
    place_of_birth: string;
    street: string;
    barangay: string;
    city: string;
    province: string;
    mobile_number: string;
    telephone_number: string | null;
    is_pwd: string;  // Changed from boolean to string to match form data type
    disability_type: string | null;
    religion: string;
    residence_type: string;
    guardian_name: string;
    scholarships: string | null;
    [key: string]: FormDataEntryValue | File | null | undefined;
}

export default function Profile({ mustVerifyEmail, status, photoUrl }: { mustVerifyEmail: boolean; status?: string; photoUrl?: string }) {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<ProfileFormData>('profileForm', {
        photo_id: null,
        first_name: auth.user.first_name ?? '',
        middle_name: auth.user.middle_name ?? null,
        last_name: auth.user.last_name ?? '',
        email: auth.user.email ?? '',
        student_id: auth.user.student_profile?.student_id ?? '',
        course: auth.user.student_profile?.course ?? '',
        major: auth.user.student_profile?.major ?? 'None',
        year_level: auth.user.student_profile?.year_level ?? '',
        civil_status: auth.user.student_profile?.civil_status ?? '',
        sex: auth.user.student_profile?.sex ?? '',
        date_of_birth: auth.user.student_profile?.date_of_birth ? new Date(auth.user.student_profile.date_of_birth).toISOString().split('T')[0] : '',
        place_of_birth: auth.user.student_profile?.place_of_birth ?? '',
        street: auth.user.student_profile?.street ?? '',
        barangay: auth.user.student_profile?.barangay ?? '',
        city: auth.user.student_profile?.city ?? '',
        province: auth.user.student_profile?.province ?? '',
        mobile_number: auth.user.student_profile?.mobile_number ? auth.user.student_profile.mobile_number.replace('+63', '') : '',
        telephone_number: auth.user.student_profile?.telephone_number ?? null,
        is_pwd: auth.user.student_profile?.is_pwd ? 'Yes' : 'No',  // Convert boolean to string
        disability_type: auth.user.student_profile?.disability_type ?? null,
        religion: auth.user.student_profile?.religion ?? '',
        residence_type: auth.user.student_profile?.residence_type ?? '',
        guardian_name: auth.user.student_profile?.guardian_name ?? '',
        scholarships: auth.user.student_profile?.existing_scholarships ?? null
    });

    console.log('Profile Data:', data);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'), {
            preserveScroll: true,
            preserveState: true,
            onError: (errors) => {
                console.error('Form submission errors:', errors);
            },
            forceFormData: true
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <form onSubmit={submit} className="space-y-8">
                    {/* Basic Information Section */}
                    <div className="space-y-6">
                        <HeadingSmall title="Basic Information" description="Your core identity details" />

                        {/* Names */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="first_name">First Name</Label>
                                <Input
                                    id="first_name"
                                    value={data.first_name}
                                    onChange={(e) => setData('first_name', e.target.value)}
                                    required
                                    autoComplete="given-name"
                                    placeholder="First name"
                                />
                                <InputError message={errors.first_name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="last_name">Last Name</Label>
                                <Input
                                    id="last_name"
                                    value={data.last_name}
                                    onChange={(e) => setData('last_name', e.target.value)}
                                    required
                                    autoComplete="family-name"
                                    placeholder="Last name"
                                />
                                <InputError message={errors.last_name} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="middle_name">Middle Name</Label>
                            <Input
                                id="middle_name"
                                value={data.middle_name ?? ''}
                                onChange={(e) => setData('middle_name', e.target.value || null)}
                                autoComplete="additional-name"
                                placeholder="Middle name (optional)"
                            />
                            <InputError message={errors.middle_name} />
                        </div>

                        {/* Photo ID Upload */}
                        <div className="grid gap-2">
                            <Label htmlFor="photo_id">1x1 ID Photo</Label>
                            <PhotoIdUpload
                                onChange={(file) => setData('photo_id', file)}
                                existingPhotoUrl={photoUrl}
                            />
                            <InputError message={errors.photo_id} />
                        </div>
                    </div>

                    {/* Personal Information Section */}
                    <div className="space-y-6">
                        <HeadingSmall title="Personal Information" description="Your personal details and background" />

                        {/* Sex and Civil Status */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="sex">Sex</Label>
                                <RadioGroup
                                    value={data.sex}
                                    onValueChange={(value) => setData('sex', value)}
                                    className="flex gap-4"
                                    required
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Male" id="male" />
                                        <Label htmlFor="male" className="cursor-pointer">Male</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Female" id="female" />
                                        <Label htmlFor="female" className="cursor-pointer">Female</Label>
                                    </div>
                                </RadioGroup>
                                <InputError message={errors.sex} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="civil_status">Civil Status</Label>
                                <Select
                                    value={data.civil_status}
                                    onValueChange={(value) => setData('civil_status', value)}
                                    required
                                >
                                    <SelectTrigger id="civil_status">
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
                                <InputError message={errors.civil_status} />
                            </div>
                        </div>

                        {/* Birth Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="date_of_birth">Date of Birth</Label>
                                <Input
                                    id="date_of_birth"
                                    type="date"
                                    required
                                    value={data.date_of_birth}
                                    onChange={(e) => setData('date_of_birth', e.target.value)}
                                />
                                <InputError message={errors.date_of_birth} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="place_of_birth">Place of Birth</Label>
                                <Input
                                    id="place_of_birth"
                                    type="text"
                                    required
                                    value={data.place_of_birth}
                                    onChange={(e) => setData('place_of_birth', e.target.value)}
                                    placeholder="City/Municipality, Province"
                                />
                                <InputError message={errors.place_of_birth} />
                            </div>
                        </div>

                        {/* Religion */}
                        <div className="grid gap-2">
                            <Label htmlFor="religion">Religion</Label>
                            <Select
                                value={data.religion}
                                onValueChange={(value) => setData('religion', value)}
                                required
                            >
                                <SelectTrigger id="religion">
                                    <SelectValue placeholder="Select religion" />
                                </SelectTrigger>
                                <SelectContent className="max-h-80">
                                    <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                                    <SelectItem value="None">None</SelectItem>
                                    <SelectItem value="Roman Catholic">Roman Catholic</SelectItem>
                                    <SelectItem value="Islam">Islam</SelectItem>
                                    <SelectItem value="Iglesia ni Cristo">Iglesia ni Cristo</SelectItem>
                                    <SelectItem value="Iglesia Filipina Independiente">Iglesia Filipina Independiente</SelectItem>
                                    <SelectItem value="United Methodist Church">United Methodist Church</SelectItem>
                                    <SelectItem value="Seventh Day Adventist">Seventh Day Adventist</SelectItem>
                                    <SelectItem value="Buddhist">Buddhist</SelectItem>
                                    <SelectItem value="Jehovah's Witness">Jehovah's Witness</SelectItem>
                                    <SelectItem value="United Church of Christ">United Church of Christ</SelectItem>
                                    <SelectItem value="Aglipay">Aglipay</SelectItem>
                                    <SelectItem value="Baptist Conference">Baptist Conference</SelectItem>
                                    <SelectItem value="Bible Baptist Church">Bible Baptist Church</SelectItem>
                                    <SelectItem value="Church of Christ">Church of Christ</SelectItem>
                                    <SelectItem value="Church of Jesus Christ of Latter-Day Saints">Church of Jesus Christ of Latter-Day Saints</SelectItem>
                                    <SelectItem value="Evangelical Presbyterian Church">Evangelical Presbyterian Church</SelectItem>
                                    <SelectItem value="Foursquare Gospel Church">Foursquare Gospel Church</SelectItem>
                                    <SelectItem value="Jesus is Lord Church">Jesus is Lord Church</SelectItem>
                                    <SelectItem value="Lutheran Church">Lutheran Church</SelectItem>
                                    <SelectItem value="Presbyterian Church">Presbyterian Church</SelectItem>
                                    <SelectItem value="Salvation Army">Salvation Army</SelectItem>
                                    <SelectItem value="Southern Baptist Church">Southern Baptist Church</SelectItem>
                                    <SelectItem value="Tribal Religions">Tribal Religions</SelectItem>
                                    <SelectItem value="Alliance of Bible Christian Communities">Alliance of Bible Christian Communities</SelectItem>
                                    <SelectItem value="Assemblies of God">Assemblies of God</SelectItem>
                                    <SelectItem value="Bread of Life Ministries">Bread of Life Ministries</SelectItem>
                                    <SelectItem value="Christian and Missionary Alliance Church">Christian and Missionary Alliance Church</SelectItem>
                                    <SelectItem value="Evangelical Free Church">Evangelical Free Church</SelectItem>
                                    <SelectItem value="Victory Chapel Christian Fellowship">Victory Chapel Christian Fellowship</SelectItem>
                                    <SelectItem value="Word International Ministries">Word International Ministries</SelectItem>
                                    <SelectItem value="Other Evangelical Churches">Other Evangelical Churches</SelectItem>
                                    <SelectItem value="Other Baptist Denominations">Other Baptist Denominations</SelectItem>
                                    <SelectItem value="Other Methodist Denominations">Other Methodist Denominations</SelectItem>
                                    <SelectItem value="Other Protestant Denominations">Other Protestant Denominations</SelectItem>
                                    <SelectItem value="Other Religious Affiliations">Other Religious Affiliations</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.religion} />
                        </div>

                        {/* PWD Information */}
                        <div className="grid gap-2">
                            <Label>Person with Disability (PWD)</Label>
                            <RadioGroup
                                value={data.is_pwd}
                                onValueChange={(value) => setData('is_pwd', value)}
                                className="flex gap-4"
                                required
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Yes" id="pwd-yes" />
                                    <Label htmlFor="pwd-yes" className="cursor-pointer">Yes</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="No" id="pwd-no" />
                                    <Label htmlFor="pwd-no" className="cursor-pointer">No</Label>
                                </div>
                            </RadioGroup>
                            <InputError message={errors.is_pwd} />
                        </div>

                        {data.is_pwd === "Yes" && (
                            <div className="grid gap-2">
                                <Label htmlFor="disability_type">Type of Disability</Label>
                                <Input
                                    id="disability_type"
                                    type="text"
                                    required
                                    value={data.disability_type ?? ''}
                                    onChange={(e) => setData('disability_type', e.target.value || null)}
                                    placeholder="Visual Impairment, Hearing Impairment, etc."
                                />
                                <InputError message={errors.disability_type} />
                            </div>
                        )}
                    </div>

                    {/* Contact Information Section */}
                    <div className="space-y-6">
                        <HeadingSmall title="Contact Information" description="Your contact details and current address" />

                        {/* Contact Numbers */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="mobile_number">Mobile Number</Label>
                                <div className="flex">
                                    <div className="flex items-center justify-center px-3 border border-r-0 rounded-l-md bg-muted">
                                        +63
                                    </div>
                                    <Input
                                        id="mobile_number"
                                        type="tel"
                                        className="rounded-l-none"
                                        value={data.mobile_number}
                                        onChange={(e) => {
                                            let value = e.target.value.replace(/\D/g, '');
                                            if (value.startsWith('0')) value = value.substring(1);
                                            if (value.length > 10) value = value.substring(0, 10);
                                            setData('mobile_number', value);
                                        }}
                                        maxLength={10}
                                        required
                                        placeholder="912 345 6789"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">Enter your number without the leading zero</p>
                                <InputError message={errors.mobile_number} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="telephone_number">Telephone Number</Label>
                                <Input
                                    id="telephone_number"
                                    type="tel"
                                    value={data.telephone_number ?? ''}
                                    onChange={(e) => setData('telephone_number', e.target.value)}
                                    placeholder="Telephone number (optional)"
                                />
                                <InputError message={errors.telephone_number} />
                            </div>
                        </div>

                        {/* Current Address */}
                        <AddressForm
                            data={{
                                street: data.street,
                                barangay: data.barangay,
                                city: data.city,
                                province: data.province,
                            }}
                            setData={(field, value) => setData(field as keyof ProfileFormData, value)}
                            errors={{
                                street: errors.street ?? '',
                                barangay: errors.barangay ?? '',
                                city: errors.city ?? '',
                                province: errors.province ?? ''
                            }}
                            processing={processing}
                        />

                        {/* Residence Information */}
                        <div className="grid gap-2">
                            <Label className="text-base">Current Residence *</Label>
                            <div className="rounded-md border p-4 space-y-3">
                                <RadioGroup
                                    value={data.residence_type}
                                    onValueChange={(value) => {
                                        setData('residence_type', value);
                                        setData('guardian_name', value === 'With Guardian' ? '' : 'Not Applicable');
                                    }}
                                    className="grid gap-3"
                                    disabled={processing}
                                    required
                                >
                                    <Label
                                        htmlFor="parents-house"
                                        className={`flex items-center space-x-3 rounded-md border p-3 transition-colors hover:bg-muted cursor-pointer ${data.residence_type === "Parent's House" ? 'border-primary bg-muted/50' : ''}`}
                                    >
                                        <RadioGroupItem value="Parent's House" id="parents-house" />
                                        <div className="grid gap-0.5">
                                            <span className="font-medium">Parent's House</span>
                                            <span className="text-sm text-muted-foreground">Living with parents at family residence</span>
                                        </div>
                                    </Label>

                                    <Label
                                        htmlFor="boarding-house"
                                        className={`flex items-center space-x-3 rounded-md border p-3 transition-colors hover:bg-muted cursor-pointer ${data.residence_type === "Boarding House" ? 'border-primary bg-muted/50' : ''}`}
                                    >
                                        <RadioGroupItem value="Boarding House" id="boarding-house" />
                                        <div className="grid gap-0.5">
                                            <span className="font-medium">Boarding House</span>
                                            <span className="text-sm text-muted-foreground">Renting a room or apartment near campus</span>
                                        </div>
                                    </Label>

                                    <Label
                                        htmlFor="with-guardian"
                                        className={`flex items-center space-x-3 rounded-md border p-3 transition-colors hover:bg-muted cursor-pointer ${data.residence_type === "With Guardian" ? 'border-primary bg-muted/50' : ''}`}
                                    >
                                        <RadioGroupItem value="With Guardian" id="with-guardian" />
                                        <div className="grid gap-0.5">
                                            <span className="font-medium">With Guardian</span>
                                            <span className="text-sm text-muted-foreground">Living with a legal guardian or relative</span>
                                        </div>
                                    </Label>
                                </RadioGroup>
                            </div>
                            <InputError message={errors.residence_type} />
                        </div>

                        {data.residence_type === "With Guardian" ? (
                            <div className="grid gap-2">
                                <Label htmlFor="guardian_name" className="text-base">Guardian's Full Name *</Label>
                                <Input
                                    id="guardian_name"
                                    type="text"
                                    required
                                    value={data.guardian_name}
                                    onChange={(e) => setData('guardian_name', e.target.value)}
                                    disabled={processing}
                                    placeholder="Complete name of your guardian"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Enter the complete name of your legal guardian or relative
                                </p>
                                <InputError message={errors.guardian_name} />
                            </div>
                        ) : (
                            <Input
                                type="hidden"
                                name="guardian_name"
                                value="Not Applicable"
                            />
                        )}
                    </div>

                    {/* Academic Information Section */}
                    <div className="space-y-6">
                        <HeadingSmall title="Academic Information" description="Your academic details and status" />

                        {/* Student ID */}
                        <div className="grid gap-2">
                            <Label htmlFor="student_id">Student ID</Label>
                            <Input
                                id="student_id"
                                type="text"
                                required
                                value={data.student_id}
                                onChange={(e) => setData('student_id', e.target.value)}
                                disabled
                                placeholder="MBC2025-001"
                            />
                            <p className="text-xs text-muted-foreground">Student ID cannot be changed</p>
                            <InputError message={errors.student_id} />
                        </div>

                        {/* Course Selection */}
                        <div className="grid gap-2">
                            <Label htmlFor="course">Course</Label>
                            <Select
                                value={data.course}
                                onValueChange={(value) => {
                                    setData('course', value);
                                    if (value !== "Bachelor of Secondary Education" && value !== "Bachelor of Elementary Education") {
                                        setData('major', 'None');
                                    }
                                }}
                                required
                            >
                                <SelectTrigger id="course">
                                    <SelectValue placeholder="Select a course" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Bachelor of Arts in Political Science">Bachelor of Arts in Political Science</SelectItem>
                                    <SelectItem value="Bachelor of Science in Tourism Management">Bachelor of Science in Tourism Management</SelectItem>
                                    <SelectItem value="Bachelor of Science in Hospitality Management">Bachelor of Science in Hospitality Management</SelectItem>
                                    <SelectItem value="Bachelor of Science in Information Technology">Bachelor of Science in Information Technology</SelectItem>
                                    <SelectItem value="Bachelor of Science in Computer Engineering">Bachelor of Science in Computer Engineering</SelectItem>
                                    <SelectItem value="Bachelor of Science in Criminology">Bachelor of Science in Criminology</SelectItem>
                                    <SelectItem value="Bachelor of Secondary Education">Bachelor of Secondary Education</SelectItem>
                                    <SelectItem value="Bachelor of Elementary Education">Bachelor of Elementary Education</SelectItem>
                                    <SelectItem value="Bachelor of Science in Fisheries">Bachelor of Science in Fisheries</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.course} />
                        </div>

                        {/* Major Selection (Conditional) */}
                        {(data.course === "Bachelor of Secondary Education" || data.course === "Bachelor of Elementary Education") && (
                            <div className="grid gap-2">
                                <Label htmlFor="major">Major</Label>
                                <Select
                                    value={data.major}
                                    onValueChange={(value) => setData('major', value)}
                                >
                                    <SelectTrigger id="major">
                                        <SelectValue placeholder="Select a major" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {data.course === "Bachelor of Secondary Education" ? (
                                            <>
                                                <SelectItem value="English">English</SelectItem>
                                                <SelectItem value="Mathematics">Mathematics</SelectItem>
                                                <SelectItem value="Science">Science</SelectItem>
                                                <SelectItem value="Filipino">Filipino</SelectItem>
                                                <SelectItem value="Social Studies">Social Studies</SelectItem>
                                            </>
                                        ) : (
                                            <>
                                                <SelectItem value="General Education">General Education</SelectItem>
                                                <SelectItem value="Special Education">Special Education</SelectItem>
                                                <SelectItem value="Pre-School Education">Pre-School Education</SelectItem>
                                            </>
                                        )}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.major} />
                            </div>
                        )}

                        {/* Year Level */}
                        <div className="grid gap-2">
                            <Label htmlFor="year_level">Year Level</Label>
                            <Select
                                value={data.year_level}
                                onValueChange={(value) => setData('year_level', value)}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select year level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1st Year">1st Year</SelectItem>
                                    <SelectItem value="2nd Year">2nd Year</SelectItem>
                                    <SelectItem value="3rd Year">3rd Year</SelectItem>
                                    <SelectItem value="4th Year">4th Year</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.year_level} />
                        </div>

                        {/* Scholarships */}
                        <div className="grid gap-2">
                            <Label htmlFor="scholarships">Existing Scholarship/s</Label>
                            <Input
                                id="scholarships"
                                type="text"
                                value={data.scholarships ?? ''}
                                onChange={(e) => setData('scholarships', e.target.value)}
                                placeholder="Enter your scholarship/s (if any)"
                            />
                            <p className="text-xs text-muted-foreground">
                                If you have multiple scholarships, separate them with commas
                            </p>
                            <InputError message={errors.scholarships} />
                        </div>
                    </div>

                    {/* Account Information Section */}
                    <div className="space-y-6">
                        <HeadingSmall title="Account Information" description="Your email and account settings" />

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoComplete="username"
                                placeholder="Email address"
                            />
                            <p className="text-xs text-muted-foreground">Must be your university email ending with @minsu.edu.ph</p>
                            <InputError className="mt-2" message={errors.email} />
                        </div>

                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <div>
                                <p className="text-muted-foreground -mt-4 text-sm">
                                    Your email address is unverified.{' '}
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                    >
                                        Click here to resend the verification email.
                                    </Link>
                                </p>

                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 text-sm font-medium text-green-600">
                                        A new verification link has been sent to your email address.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Form Actions */}
                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Save Changes</Button>

                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm text-neutral-600">Saved</p>
                        </Transition>
                    </div>
                </form>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
