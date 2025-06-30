import { Label } from "@/components/ui/label";
import InputError from "@/components/input-error";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect, useCallback } from "react";
import { fetchProvinces, fetchCities } from '@/lib/location-service';
import type { PSGCLocation } from '@/types/locations';
import { Card, CardContent } from "@/components/ui/card";

interface PlaceOfBirthProps {
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

export default function PlaceOfBirth({ data, setData, errors, processing }: PlaceOfBirthProps) {
    const [provinces, setProvinces] = useState<PSGCLocation[]>([]);
    const [cities, setCities] = useState<PSGCLocation[]>([]);
    const [loadingCities, setLoadingCities] = useState(false);
    const [birthData, setBirthData] = useState<PlaceOfBirthData>(() => {
        if (data.place_of_birth) {
            const parts = data.place_of_birth.split(', ');
            if (parts.length === 2) {
                return { city: parts[0], province: parts[1] };
            }
        }
        return { province: '', city: '' };
    });

    useEffect(() => {
        fetchProvinces().then(setProvinces);
    }, []);
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
            setCities([]);
        }
    }, [birthData.province, provinces]);

    useEffect(() => {
        const newValue = birthData.province && birthData.city
            ? `${birthData.city}, ${birthData.province}`
            : '';
        if (data.place_of_birth !== newValue) {
            setData('place_of_birth', newValue);
        }
    }, [birthData.province, birthData.city, setData, data.place_of_birth]);

    const handleProvinceChange = useCallback((value: string) => {
        const selectedProvince = provinces.find(p => p.code === value);
        if (selectedProvince) {
            setBirthData(prev => ({
                ...prev,
                province: selectedProvince.name,
                city: ''
            }));
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
            <Label>
                Place of Birth<span className="text-red-500">*</span>
            </Label>
            <Card>
                <CardContent>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="birth_province">
                                    Province<span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={provinces.find(p => p.name === birthData.province)?.code || undefined}
                                    onValueChange={handleProvinceChange}
                                    disabled={processing}
                                >
                                    <SelectTrigger id="birth_province" className="w-full truncate" size="default">
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
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="birth_city">
                                    City/Municipality<span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={cities.find(c => c.name === birthData.city)?.code || undefined}
                                    onValueChange={handleCityChange}
                                    disabled={processing || cities.length === 0 || loadingCities}
                                >
                                    <SelectTrigger id="birth_city" className="w-full truncate" size="default">
                                        <SelectValue placeholder={loadingCities ? "Loading cities..." : "Select City/Municipality"} className="truncate" />
                                    </SelectTrigger>
                                    <SelectContent className="w-full">
                                        {cities.map((city) => (
                                            <SelectItem key={city.code} value={city.code} className="truncate">
                                                {city.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <InputError message={errors.place_of_birth || ''} />
        </div>
    );
}
