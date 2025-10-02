import { fetchBarangays, fetchCities, fetchProvinces } from '@/lib/location-service';
import type { PSGCLocation } from '@/types/locations';
import { useCallback, useEffect, useState } from 'react';

export default function useLocationData(
    data: { province: string; city: string; barangay: string },
    setData: (field: 'province' | 'city' | 'barangay', value: string) => void,
) {
    const [provinces, setProvinces] = useState<PSGCLocation[]>([]);
    const [cities, setCities] = useState<PSGCLocation[]>([]);
    const [barangays, setBarangays] = useState<PSGCLocation[]>([]);
    useEffect(() => {
        fetchProvinces().then((allProvinces) => {
            // Filter to only show specific provinces
            const allowedProvinces = ['Oriental Mindoro', 'Occidental Mindoro', 'Palawan', 'Marinduque'];
            const filteredProvinces = allProvinces.filter((province) => allowedProvinces.includes(province.name));
            setProvinces(filteredProvinces);
        });
    }, []);
    useEffect(() => {
        if (data.province && provinces.length > 0 && cities.length === 0) {
            const selectedProvince = provinces.find((p) => p.name === data.province);
            if (selectedProvince) {
                fetchCities(selectedProvince.code).then(setCities);
            }
        }
    }, [data.province, provinces, cities.length]);

    useEffect(() => {
        if (data.city && cities.length > 0 && barangays.length === 0) {
            const selectedCity = cities.find((c) => c.name === data.city);
            if (selectedCity) {
                fetchBarangays(selectedCity.code).then(setBarangays);
            }
        }
    }, [data.city, cities, barangays.length]);
    const handleProvinceChange = useCallback(
        (value: string) => {
            const selectedProvince = provinces.find((p) => p.code === value);
            if (selectedProvince) {
                // Clear dependent fields first
                setCities([]);
                setBarangays([]);

                // Update form data
                setData('province', selectedProvince.name);
                setData('city', '');
                setData('barangay', '');

                // Fetch new cities
                fetchCities(value).then(setCities);
            }
        },
        [provinces, setData],
    );

    const handleCityChange = useCallback(
        (value: string) => {
            const selectedCity = cities.find((c) => c.code === value);
            if (selectedCity) {
                // Clear dependent fields first
                setBarangays([]);

                // Update form data
                setData('city', selectedCity.name);
                setData('barangay', '');

                // Fetch new barangays
                fetchBarangays(value).then(setBarangays);
            }
        },
        [cities, setData],
    );

    const handleBarangayChange = useCallback(
        (value: string) => {
            const selectedBarangay = barangays.find((b) => b.code === value);
            if (selectedBarangay) {
                setData('barangay', selectedBarangay.name);
            }
        },
        [barangays, setData],
    );

    return {
        provinces,
        cities,
        barangays,
        handleProvinceChange,
        handleCityChange,
        handleBarangayChange,
    };
}
