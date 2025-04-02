import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import InputError from "@/components/input-error";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useLocationData from "@/hooks/use-location-data";

interface AddressFormProps {
    data: {
        street: string;
        barangay: string;
        city: string;
        province: string;
    };
    setData: (field: 'street' | 'barangay' | 'city' | 'province', value: string) => void;
    errors: Record<string, string>;
    processing: boolean;
}

export default function AddressForm({ data, setData, errors, processing }: AddressFormProps) {
    const { 
        provinces,
        cities,
        barangays,
        handleProvinceChange,
        handleCityChange,
        handleBarangayChange
    } = useLocationData(data, setData);

    return (
        <div className="grid gap-2">
            <Label>Complete Address *</Label>
            <div className="rounded-md border p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="province">Province *</Label>
                        <Select
                            value={provinces.find(p => p.name === data.province)?.code || ""}
                            onValueChange={handleProvinceChange}
                            disabled={processing}
                        >
                            <SelectTrigger id="province" className="truncate">
                                <SelectValue placeholder="Select Province" />
                            </SelectTrigger>
                            <SelectContent>
                                {provinces.map((province) => (
                                    <SelectItem key={province.code} value={province.code}>
                                        {province.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.province} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="city">City/Municipality *</Label>
                        <Select
                            value={cities.find(c => c.name === data.city)?.code || ""}
                            onValueChange={handleCityChange}
                            disabled={processing || cities.length === 0}
                        >
                            <SelectTrigger id="city" className="truncate">
                                <SelectValue placeholder="Select City/Municipality" />
                            </SelectTrigger>
                            <SelectContent>
                                {cities.map((city) => (
                                    <SelectItem key={city.code} value={city.code}>
                                        {city.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.city} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="barangay">Barangay *</Label>
                        <Select
                            value={barangays.find(b => b.name === data.barangay)?.code || ""}
                            onValueChange={handleBarangayChange}
                            disabled={processing || barangays.length === 0}
                        >
                            <SelectTrigger id="barangay" className="truncate">
                                <SelectValue placeholder="Select Barangay" />
                            </SelectTrigger>
                            <SelectContent>
                                {barangays.map((brgy) => (
                                    <SelectItem key={brgy.code} value={brgy.code}>
                                        {brgy.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.barangay} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="street">Street/Sitio *</Label>
                        <Input
                            id="street"
                            type="text"
                            required
                            value={data.street}
                            onChange={(e) => setData("street", e.target.value)}
                            disabled={processing}
                            placeholder="House No., Street, or Sitio"
                        />
                        <InputError message={errors.street} />
                    </div>
                </div>
            </div>
        </div>
    );
};
