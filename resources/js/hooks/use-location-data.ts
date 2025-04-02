import { useState, useEffect } from 'react';
import { fetchProvinces, fetchCities, fetchBarangays } from '@/lib/location-service';
import type { PSGCLocation } from '@/types/locations';

export default function useLocationData(
    data: { province: string; city: string; barangay: string; },
    setData: (field: 'province' | 'city' | 'barangay', value: string) => void
) {
    const [provinces, setProvinces] = useState<PSGCLocation[]>([]);
    const [cities, setCities] = useState<PSGCLocation[]>([]);
    const [barangays, setBarangays] = useState<PSGCLocation[]>([]);

    useEffect(() => {
        fetchProvinces().then(setProvinces);
    }, []);

    useEffect(() => {
        if (data.province && provinces.length > 0) {
            const selectedProvince = provinces.find(p => p.name === data.province);
            if (selectedProvince) {
                fetchCities(selectedProvince.code).then(setCities);
            }
        }
    }, [data.province, provinces]);

    useEffect(() => {
        if (data.city && cities.length > 0) {
            const selectedCity = cities.find(c => c.name === data.city);
            if (selectedCity) {
                fetchBarangays(selectedCity.code).then(setBarangays);
            }
        }
    }, [data.city, cities]);

    const handleProvinceChange = (value: string) => {
        const selectedProvince = provinces.find(p => p.code === value);
        if (selectedProvince) {
            setData("province", selectedProvince.name);
            setData("city", "");
            setData("barangay", "");
            setCities([]);
            setBarangays([]);
            fetchCities(value).then(setCities);
        }
    };

    const handleCityChange = (value: string) => {
        const selectedCity = cities.find(c => c.code === value);
        if (selectedCity) {
            setData("city", selectedCity.name);
            setData("barangay", "");
            setBarangays([]);
            fetchBarangays(value).then(setBarangays);
        }
    };

    const handleBarangayChange = (value: string) => {
        const selectedBarangay = barangays.find(b => b.code === value);
        if (selectedBarangay) {
            setData("barangay", selectedBarangay.name);
        }
    };

    return {
        provinces,
        cities,
        barangays,
        handleProvinceChange,
        handleCityChange,
        handleBarangayChange
    };
}
