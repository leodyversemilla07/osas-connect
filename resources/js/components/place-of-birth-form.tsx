import { Label } from "@/components/ui/label";
import InputError from "@/components/input-error";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect, useCallback } from "react";
import { fetchProvinces, fetchCities } from '@/lib/location-service';
import type { PSGCLocation } from '@/types/locations';

interface PlaceOfBirthFormProps {
    data: {
        place_of_birth: string;
    };
    setData: (field: 'place_of_birth', value: string) => void;
    errors: Record<string, string> | Partial<Record<string, string>>;
    processing: boolean;
}

interface PlaceOfBirthData {
    province: string;
    city: string;
}

export default function PlaceOfBirthForm({ data, setData, errors, processing }: PlaceOfBirthFormProps) {
    const [provinces, setProvinces] = useState<PSGCLocation[]>([]);
    const [cities, setCities] = useState<PSGCLocation[]>([]);
    const [loadingCities, setLoadingCities] = useState(false);
    const [birthData, setBirthData] = useState<PlaceOfBirthData>(() => {
        // Parse existing place_of_birth string
        if (data.place_of_birth) {
            const parts = data.place_of_birth.split(', ');
            if (parts.length === 2) {
                return { city: parts[0], province: parts[1] };
            }
        }
        return { province: '', city: '' };
    });

    // Load provinces on mount
    useEffect(() => {
        fetchProvinces().then(setProvinces);
    }, []);    // Load cities when province changes
    useEffect(() => {
        if (birthData.province && provinces.length > 0) {
            const selectedProvince = provinces.find(p => p.name === birthData.province);
            if (selectedProvince) {
                setLoadingCities(true);
                fetchCities(selectedProvince.code)
                    .then(setCities)
                    .finally(() => setLoadingCities(false));
            }
        } else {
            setCities([]); // Clear cities if no province is selected
        }
    }, [birthData.province, provinces]);

    // Update parent form data when birth data changes
    useEffect(() => {
        if (birthData.province && birthData.city) {
            setData('place_of_birth', `${birthData.city}, ${birthData.province}`);
        } else {
            setData('place_of_birth', '');
        }
    }, [birthData.province, birthData.city, setData]); const handleProvinceChange = useCallback((value: string) => {
        const selectedProvince = provinces.find(p => p.code === value);
        if (selectedProvince) {
            setBirthData(prev => ({
                ...prev,
                province: selectedProvince.name,
                city: '' // Reset city when province changes
            }));
            // Cities will be fetched by the useEffect above
        }
    }, [provinces]);

    const handleCityChange = useCallback((value: string) => {
        const selectedCity = cities.find(c => c.code === value);
        if (selectedCity) {
            setBirthData(prev => ({
                ...prev,
                city: selectedCity.name
            }));
        }
    }, [cities]);

    return (
        <div className="grid gap-2">
            <div className="rounded-md border p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="birth_province">Province *</Label>
                        <Select
                            value={provinces.find(p => p.name === birthData.province)?.code || ""}
                            onValueChange={handleProvinceChange}
                            disabled={processing}
                        >
                            <SelectTrigger id="birth_province" className="truncate">
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
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="birth_city">City/Municipality *</Label>                        <Select
                            value={cities.find(c => c.name === birthData.city)?.code || ""}
                            onValueChange={handleCityChange}
                            disabled={processing || cities.length === 0 || loadingCities}
                        >
                            <SelectTrigger id="birth_city" className="truncate">
                                <SelectValue placeholder={loadingCities ? "Loading cities..." : "Select City/Municipality"} />
                            </SelectTrigger>
                            <SelectContent>
                                {cities.map((city) => (
                                    <SelectItem key={city.code} value={city.code}>
                                        {city.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
            <InputError message={errors.place_of_birth || ''} />
        </div>
    );
}
