import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import AuthLayout from '@/layouts/auth-layout';
import AddressForm from '@/components/address-form';

interface AcceptInvitationProps {
    invitation: {
        email: string;
        position: string;
        department: string;
        token: string;
    };
}

type InvitationForm = {
    first_name: string;
    last_name: string;
    middle_name: string;
    staff_id: string;
    password: string;
    password_confirmation: string;
    civil_status: string;
    sex: string;
    date_of_birth: string;
    place_of_birth: string;
    street: string;
    barangay: string;
    city: string;
    province: string;
    mobile_number: string;
    telephone_number: string;
    is_pwd: string;
    disability_type: string;
    religion: string;
    residence_type: string;
    office_location: string;
    token: string;
};

export default function AcceptInvitation({ invitation }: AcceptInvitationProps) {
    const { data, setData, post, processing, errors } = useForm<Required<InvitationForm>>({
        first_name: '',
        last_name: '',
        middle_name: '',
        staff_id: '',
        password: '',
        password_confirmation: '',
        civil_status: 'Single',
        sex: 'Male',
        date_of_birth: '',
        place_of_birth: '',
        street: '',
        barangay: '',
        city: '',
        province: '',
        mobile_number: '',
        telephone_number: '',
        is_pwd: 'No',
        disability_type: '',
        religion: 'Prefer not to say',
        residence_type: "Parent's House",
        office_location: '',
        token: invitation.token
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('staff.accept-invitation'), {
            preserveScroll: true
        });
    };

    return (
        <AuthLayout 
            title="Complete your registration" 
            description="Welcome to OSAS Connect! Please complete your profile to activate your account."
        >
            <Head title="Accept Staff Invitation" />

            <form onSubmit={submit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="last_name">Last Name</Label>
                            <Input
                                id="last_name"
                                type="text"
                                required
                                autoFocus
                                value={data.last_name}
                                onChange={(e) => setData('last_name', e.target.value)}
                                disabled={processing}
                                placeholder="Doe"
                            />
                            <InputError message={errors.last_name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="first_name">First Name</Label>
                            <Input
                                id="first_name"
                                type="text"
                                required
                                value={data.first_name}
                                onChange={(e) => setData('first_name', e.target.value)}
                                disabled={processing}
                                placeholder="John"
                            />
                            <InputError message={errors.first_name} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="middle_name">Middle Name</Label>
                        <Input
                            id="middle_name"
                            type="text"
                            value={data.middle_name}
                            onChange={(e) => setData('middle_name', e.target.value)}
                            disabled={processing}
                            placeholder="Enter your middle name"
                        />
                        <InputError message={errors.middle_name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="staff_id">Staff ID</Label>
                        <Input
                            id="staff_id"
                            type="text"
                            required
                            value={data.staff_id}
                            onChange={(e) => setData('staff_id', e.target.value)}
                            disabled={processing}
                            placeholder="Enter your staff ID"
                        />
                        <InputError message={errors.staff_id} />
                    </div>

                    <div className="grid gap-2">
                        <Label>Department</Label>
                        <Input
                            type="text"
                            value={invitation.department}
                            disabled
                            className="bg-muted"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Position</Label>
                        <Input
                            type="text"
                            value={invitation.position}
                            disabled
                            className="bg-muted"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={invitation.email}
                            disabled
                            className="bg-muted"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="office_location">Office Location</Label>
                        <Input
                            id="office_location"
                            type="text"
                            value={data.office_location}
                            onChange={(e) => setData('office_location', e.target.value)}
                            disabled={processing}
                            placeholder="Enter your office location"
                        />
                        <InputError message={errors.office_location} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Sex</Label>
                            <RadioGroup
                                value={data.sex}
                                onValueChange={(value) => setData('sex', value)}
                                className="flex gap-4"
                                disabled={processing}
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
                                disabled={processing}
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

                    <div className="grid gap-2">
                        <Label htmlFor="date_of_birth">Date of Birth</Label>
                        <Input
                            id="date_of_birth"
                            type="date"
                            required
                            value={data.date_of_birth}
                            onChange={(e) => setData('date_of_birth', e.target.value)}
                            disabled={processing}
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
                            disabled={processing}
                            placeholder="City/Municipality, Province"
                        />
                        <InputError message={errors.place_of_birth} />
                    </div>

                    <AddressForm
                        data={{
                            street: data.street,
                            barangay: data.barangay,
                            city: data.city,
                            province: data.province,
                        }}
                        setData={(field, value) => setData(field, value)}
                        errors={errors}
                        processing={processing}
                    />

                    <div className="grid gap-2">
                        <Label htmlFor="mobile_number">Mobile Number</Label>
                        <div className="flex">
                            <div className="flex items-center justify-center px-3 border border-r-0 rounded-l-md bg-muted">
                                +63
                            </div>
                            <Input
                                id="mobile_number"
                                type="tel"
                                required
                                className="rounded-l-none"
                                value={data.mobile_number}
                                onChange={(e) => {
                                    // Remove any non-digit characters and ensure it doesn't start with 0
                                    let value = e.target.value.replace(/\D/g, '');
                                    if (value.startsWith('0')) value = value.substring(1);
                                    // Limit to 10 digits
                                    if (value.length > 10) value = value.substring(0, 10);
                                    setData('mobile_number', value);
                                }}
                                disabled={processing}
                                placeholder="9123456789"
                                maxLength={10}
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
                            value={data.telephone_number}
                            onChange={(e) => setData('telephone_number', e.target.value)}
                            disabled={processing}
                            placeholder="Telephone number (optional)"
                        />
                        <InputError message={errors.telephone_number} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="religion">Religion</Label>
                        <Select
                            value={data.religion}
                            onValueChange={(value) => setData('religion', value)}
                            disabled={processing}
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
                                <SelectItem value="Other Religious Affiliations">Other Religious Affiliations</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.religion} />
                    </div>

                    <div className="grid gap-2">
                        <Label>Person with Disability (PWD)</Label>
                        <RadioGroup
                            value={data.is_pwd}
                            onValueChange={(value) => setData('is_pwd', value)}
                            className="flex gap-4"
                            disabled={processing}
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

                    {data.is_pwd === 'Yes' && (
                        <div className="grid gap-2">
                            <Label htmlFor="disability_type">Type of Disability</Label>
                            <Input
                                id="disability_type"
                                type="text"
                                required
                                value={data.disability_type}
                                onChange={(e) => setData('disability_type', e.target.value)}
                                disabled={processing}
                                placeholder="Visual Impairment, Hearing Impairment, etc."
                            />
                            <InputError message={errors.disability_type} />
                        </div>
                    )}

                    <div className="grid gap-2">
                        <Label>Current Residence</Label>
                        <RadioGroup
                            value={data.residence_type}
                            onValueChange={(value) => setData('residence_type', value)}
                            className="grid gap-3"
                            disabled={processing}
                        >
                            <Label
                                htmlFor="own-house"
                                className={`flex items-center space-x-3 rounded-md border p-3 transition-colors hover:bg-muted cursor-pointer ${data.residence_type === "Own House" ? 'border-primary bg-muted/50' : ''}`}
                            >
                                <RadioGroupItem value="Own House" id="own-house" />
                                <div className="grid gap-0.5">
                                    <span className="font-medium">Own House</span>
                                    <span className="text-sm text-muted-foreground">Living in your own house</span>
                                </div>
                            </Label>

                            <Label
                                htmlFor="renting"
                                className={`flex items-center space-x-3 rounded-md border p-3 transition-colors hover:bg-muted cursor-pointer ${data.residence_type === "Renting" ? 'border-primary bg-muted/50' : ''}`}
                            >
                                <RadioGroupItem value="Renting" id="renting" />
                                <div className="grid gap-0.5">
                                    <span className="font-medium">Renting</span>
                                    <span className="text-sm text-muted-foreground">Renting a house or apartment</span>
                                </div>
                            </Label>

                            <Label
                                htmlFor="company-provided"
                                className={`flex items-center space-x-3 rounded-md border p-3 transition-colors hover:bg-muted cursor-pointer ${data.residence_type === "Company Provided" ? 'border-primary bg-muted/50' : ''}`}
                            >
                                <RadioGroupItem value="Company Provided" id="company-provided" />
                                <div className="grid gap-0.5">
                                    <span className="font-medium">Company Provided</span>
                                    <span className="text-sm text-muted-foreground">Living in company-provided housing</span>
                                </div>
                            </Label>
                        </RadioGroup>
                        <InputError message={errors.residence_type} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="Password"
                        />
                        <p className="text-xs text-muted-foreground">
                            At least 8 characters with uppercase, lowercase, number, and special character
                        </p>
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Confirm Password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="Confirm password"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>
                </div>

                <Button type="submit" className="w-full" disabled={processing}>
                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                    Complete Registration
                </Button>
            </form>
        </AuthLayout>
    );
}