import type { PSGCLocation } from '@/types/locations';

const sortLocations = (data: PSGCLocation[]) => data.sort((a, b) => a.name.localeCompare(b.name));

export const fetchProvinces = async (): Promise<PSGCLocation[]> => {
    const response = await fetch('https://psgc.gitlab.io/api/provinces/');
    const data = await response.json();
    return sortLocations(data);
};

export const fetchCities = async (provinceCode: string): Promise<PSGCLocation[]> => {
    const response = await fetch(`https://psgc.gitlab.io/api/provinces/${provinceCode}/cities-municipalities/`);
    const data = await response.json();
    return sortLocations(data);
};

export const fetchBarangays = async (cityCode: string): Promise<PSGCLocation[]> => {
    const response = await fetch(`https://psgc.gitlab.io/api/cities-municipalities/${cityCode}/barangays/`);
    const data = await response.json();
    return sortLocations(data);
};
