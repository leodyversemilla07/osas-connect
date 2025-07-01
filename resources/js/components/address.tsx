import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import InputError from "@/components/input-error";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useLocationData from "@/hooks/use-location-data";
import { useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface AddressProps {
    data: {
        street: string;
        barangay: string;
        city: string;
        province: string;
        zip_code: string;
    };
    setData: (field: 'street' | 'barangay' | 'city' | 'province' | 'zip_code', value: string) => void;
    errors: Record<string, string>;
    processing: boolean;
}

export default function Address({ data, setData, errors, processing }: AddressProps) {
    const {
        provinces,
        cities,
        barangays,
        handleProvinceChange,
        handleCityChange,
        handleBarangayChange
    } = useLocationData(data, setData);

    // Memoized handlers to prevent unnecessary re-renders
    const handleStreetChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setData("street", e.target.value);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleZipCodeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setData("zip_code", e.target.value);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="grid gap-2">
            <Label>
                Address<span className="text-red-500">*</span>
            </Label>
            <Card>
                <CardContent>
                    <div className="space-y-4">
                        {/* Row 1: Province | City/Municipality */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="province">
                                    Province<span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={provinces.find(p => p.name === data.province)?.code || ""}
                                    onValueChange={handleProvinceChange}
                                    disabled={processing}
                                >
                                    <SelectTrigger id="province" className="w-full truncate" size="default">
                                        <SelectValue placeholder="Select Province" className="truncate" />
                                    </SelectTrigger>
                                    <SelectContent className="w-full">
                                        {provinces.map((province) => (
                                            <SelectItem key={province.code} value={province.code} className="truncate">
                                                {province.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.province} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="city">
                                    City/Municipality<span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={cities.find(c => c.name === data.city)?.code || ""}
                                    onValueChange={handleCityChange}
                                    disabled={processing || cities.length === 0}
                                >
                                    <SelectTrigger id="city" className="w-full truncate" size="default">
                                        <SelectValue placeholder="Select City/Municipality" className="truncate" />
                                    </SelectTrigger>
                                    <SelectContent className="w-full">
                                        {cities.map((city) => (
                                            <SelectItem key={city.code} value={city.code} className="truncate">
                                                {city.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.city} />
                            </div>
                        </div>

                        {/* Row 2: Barangay | Street/Sitio */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="barangay">
                                    Barangay<span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={barangays.find(b => b.name === data.barangay)?.code || ""}
                                    onValueChange={handleBarangayChange}
                                    disabled={processing || barangays.length === 0}
                                >
                                    <SelectTrigger id="barangay" className="w-full truncate" size="default">
                                        <SelectValue placeholder="Select Barangay" className="truncate" />
                                    </SelectTrigger>
                                    <SelectContent className="w-full">
                                        {barangays.map((brgy) => (
                                            <SelectItem key={brgy.code} value={brgy.code} className="truncate">
                                                {brgy.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.barangay} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="street">
                                    Street/Sitio<span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="street"
                                    type="text"
                                    required
                                    value={data.street}
                                    onChange={handleStreetChange}
                                    disabled={processing}
                                    placeholder="House No., Street, or Sitio"
                                />
                                <InputError message={errors.street} />
                            </div>
                        </div>

                        {/* Row 3: Zip Code (single field, but keep grid for alignment) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="zip_code">
                                    Zip Code<span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="zip_code"
                                    type="number"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    required
                                    value={data.zip_code}
                                    onChange={handleZipCodeChange}
                                    disabled={processing}
                                    placeholder="e.g. 5203"
                                />
                                <InputError message={errors.zip_code} />
                            </div>
                            <div />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
