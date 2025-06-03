import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Search,
    Filter,
    GraduationCap,
    Users,
    BookOpen,
    Target,
    Clock,
    AlertCircle,
    ExternalLink,
    Grid,
    List,
    X
} from 'lucide-react';

interface Scholarship {
    id: number;
    name: string;
    type: string;
    typeLabel: string;
    description: string;
    stipendAmount: number | null;
    applicationDeadline: string;
    availableSlots: number;
    gwaRequirement: number | null;
    canApply: boolean;
    status: string;
}

interface ScholarshipsSearchProps {
    scholarships: Scholarship[];
    filters: {
        types: { value: string; label: string }[];
        gwaRanges: { min: number; max: number; label: string }[];
        stipendRanges: { min: number; max: number; label: string }[];
    };
    searchParams: {
        search?: string;
        type?: string;
        minStipend?: number;
        maxStipend?: number;
        maxGwa?: number;
        sort?: string;
        view?: string;
    };
}

interface BreadcrumbItem {
    title: string;
    href: string;
}

const getScholarshipTypeIcon = (type: string) => {
    const icons = {
        'academic_full': <GraduationCap className="h-5 w-5" />,
        'academic_partial': <GraduationCap className="h-5 w-5" />,
        'student_assistantship': <Users className="h-5 w-5" />,
        'performing_arts_full': <BookOpen className="h-5 w-5" />,
        'performing_arts_partial': <BookOpen className="h-5 w-5" />,
        'economic_assistance': <Target className="h-5 w-5" />
    };
    return icons[type as keyof typeof icons] || <GraduationCap className="h-5 w-5" />;
};

const getScholarshipTypeColor = (type: string) => {
    const colors = {
        'academic_full': 'bg-blue-100 text-blue-800',
        'academic_partial': 'bg-blue-100 text-blue-800',
        'student_assistantship': 'bg-green-100 text-green-800',
        'performing_arts_full': 'bg-purple-100 text-purple-800',
        'performing_arts_partial': 'bg-purple-100 text-purple-800',
        'economic_assistance': 'bg-orange-100 text-orange-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

export default function ScholarshipsSearch({ scholarships, filters, searchParams }: ScholarshipsSearchProps) {
    const [searchTerm, setSearchTerm] = useState(searchParams.search || '');
    const [selectedType, setSelectedType] = useState(searchParams.type || '');
    const [stipendRange, setStipendRange] = useState([searchParams.minStipend || 0, searchParams.maxStipend || 100000]);
    const [gwaFilter, setGwaFilter] = useState(searchParams.maxGwa || 4.0);
    const [sortBy, setSortBy] = useState(searchParams.sort || 'deadline');
    const [viewMode, setViewMode] = useState(searchParams.view || 'grid');
    const [showFilters, setShowFilters] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Scholarships', href: '#' },
    ];

    // Filter and sort scholarships
    const filteredScholarships = scholarships
        .filter(scholarship => {
            // Search filter
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                if (!scholarship.name.toLowerCase().includes(searchLower) &&
                    !scholarship.description.toLowerCase().includes(searchLower) &&
                    !scholarship.typeLabel.toLowerCase().includes(searchLower)) {
                    return false;
                }
            }

            // Type filter
            if (selectedType && scholarship.type !== selectedType) {
                return false;
            }

            // Stipend filter
            if (scholarship.stipendAmount) {
                if (scholarship.stipendAmount < stipendRange[0] || scholarship.stipendAmount > stipendRange[1]) {
                    return false;
                }
            }

            // GWA filter
            if (scholarship.gwaRequirement && scholarship.gwaRequirement > gwaFilter) {
                return false;
            }

            return true;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'deadline':
                    return new Date(a.applicationDeadline).getTime() - new Date(b.applicationDeadline).getTime();
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'stipend':
                    return (b.stipendAmount || 0) - (a.stipendAmount || 0);
                case 'slots':
                    return b.availableSlots - a.availableSlots;
                default:
                    return 0;
            }
        });

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchTerm) params.set('search', searchTerm);
        if (selectedType) params.set('type', selectedType);
        if (stipendRange[0] > 0) params.set('minStipend', stipendRange[0].toString());
        if (stipendRange[1] < 100000) params.set('maxStipend', stipendRange[1].toString());
        if (gwaFilter < 4.0) params.set('maxGwa', gwaFilter.toString());
        params.set('sort', sortBy);
        params.set('view', viewMode);

        router.get(`/student/scholarships?${params.toString()}`);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedType('');
        setStipendRange([0, 100000]);
        setGwaFilter(4.0);
        setSortBy('deadline');
        router.get('/student/scholarships');
    };

    const getDaysLeft = (deadline: string) => {
        const deadlineDate = new Date(deadline);
        const now = new Date();
        return Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    };

    const ScholarshipCard = ({ scholarship }: { scholarship: Scholarship }) => {
        const daysLeft = getDaysLeft(scholarship.applicationDeadline);
        const isExpiringSoon = daysLeft <= 7 && daysLeft > 0;
        const isExpired = daysLeft <= 0;

        return (
            <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                            {getScholarshipTypeIcon(scholarship.type)}
                            <Badge className={getScholarshipTypeColor(scholarship.type)}>
                                {scholarship.typeLabel}
                            </Badge>
                        </div>
                        {scholarship.stipendAmount && (
                            <div className="text-right">
                                <div className="text-lg font-bold text-green-600">
                                    ₱{scholarship.stipendAmount.toLocaleString()}
                                </div>
                                <div className="text-xs text-gray-500">Stipend</div>
                            </div>
                        )}
                    </div>
                    <CardTitle className="text-lg leading-tight">{scholarship.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-gray-600 text-sm line-clamp-3">{scholarship.description}</p>

                    <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Deadline:</span>
                            <span className={`font-medium ${isExpiringSoon ? 'text-orange-600' : isExpired ? 'text-red-600' : ''}`}>
                                {new Date(scholarship.applicationDeadline).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Available Slots:</span>
                            <span className="font-medium">{scholarship.availableSlots}</span>
                        </div>
                        {scholarship.gwaRequirement && (
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">GWA Requirement:</span>
                                <span className="font-medium">{scholarship.gwaRequirement}</span>
                            </div>
                        )}
                    </div>

                    {isExpiringSoon && (
                        <Alert className="border-orange-200 bg-orange-50">
                            <Clock className="h-4 w-4" />
                            <AlertDescription className="text-orange-800">
                                Only {daysLeft} days left to apply!
                            </AlertDescription>
                        </Alert>
                    )}

                    {isExpired && (
                        <Alert className="border-red-200 bg-red-50">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription className="text-red-800">
                                Application deadline has passed
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="flex gap-2 pt-4">
                        <Button
                            className="flex-1"
                            onClick={() => router.visit(`/student/scholarships/${scholarship.id}`)}
                            variant="outline"
                        >
                            View Details
                        </Button>
                        {scholarship.canApply && !isExpired && (
                            <Button
                                onClick={() => router.visit(`/student/scholarships/${scholarship.id}/apply`)}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                Apply
                                <ExternalLink className="h-4 w-4 ml-1" />
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    };

    const ScholarshipListItem = ({ scholarship }: { scholarship: Scholarship }) => {
        const daysLeft = getDaysLeft(scholarship.applicationDeadline);
        const isExpiringSoon = daysLeft <= 7 && daysLeft > 0;
        const isExpired = daysLeft <= 0;

        return (
            <Card className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                            {getScholarshipTypeIcon(scholarship.type)}
                            <h3 className="text-lg font-semibold">{scholarship.name}</h3>
                            <Badge className={getScholarshipTypeColor(scholarship.type)}>
                                {scholarship.typeLabel}
                            </Badge>
                            {isExpiringSoon && (
                                <Badge className="bg-orange-100 text-orange-800">
                                    {daysLeft} days left
                                </Badge>
                            )}
                        </div>

                        <p className="text-gray-600">{scholarship.description}</p>

                        <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                                <span className="text-gray-600">Deadline:</span>
                                <span className="ml-2 font-medium">
                                    {new Date(scholarship.applicationDeadline).toLocaleDateString()}
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-600">Slots:</span>
                                <span className="ml-2 font-medium">{scholarship.availableSlots}</span>
                            </div>
                            {scholarship.gwaRequirement && (
                                <div>
                                    <span className="text-gray-600">GWA:</span>
                                    <span className="ml-2 font-medium">{scholarship.gwaRequirement}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                        {scholarship.stipendAmount && (
                            <div className="text-right">
                                <div className="text-xl font-bold text-green-600">
                                    ₱{scholarship.stipendAmount.toLocaleString()}
                                </div>
                                <div className="text-xs text-gray-500">Stipend Amount</div>
                            </div>
                        )}

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => router.visit(`/student/scholarships/${scholarship.id}`)}
                            >
                                View Details
                            </Button>
                            {scholarship.canApply && !isExpired && (
                                <Button
                                    onClick={() => router.visit(`/student/scholarships/${scholarship.id}/apply`)}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    Apply Now
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </Card>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head>
                <title>Browse Scholarships - MinSU OSAS Connect</title>
                <meta name="description" content="Find and apply for scholarships at MinSU" />
            </Head>

            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between"></div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        Available Scholarships
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Discover scholarship opportunities that match your profile
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                    >
                        {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                    </Button>
                </div>
            </div>

            {/* Search and Filters */}
            <Card className={`transition-all duration-300 ${showFilters ? 'block' : 'hidden'}`}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Search className="h-5 w-5" />
                        Search & Filter Scholarships
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Search */}
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Search scholarships by name, type, or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full"
                            />
                        </div>
                        <Button onClick={handleSearch}>
                            <Search className="h-4 w-4 mr-2" />
                            Search
                        </Button>
                    </div>

                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Type Filter */}
                        <div className="space-y-2">
                            <Label>Scholarship Type</Label>
                            <Select value={selectedType} onValueChange={setSelectedType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Types</SelectItem>
                                    {filters.types.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Sort */}
                        <div className="space-y-2">
                            <Label>Sort By</Label>
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="deadline">Application Deadline</SelectItem>
                                    <SelectItem value="name">Name (A-Z)</SelectItem>
                                    <SelectItem value="stipend">Stipend Amount</SelectItem>
                                    <SelectItem value="slots">Available Slots</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Stipend Range */}
                        <div className="space-y-2">
                            <Label>Stipend Range: ₱{stipendRange[0].toLocaleString()} - ₱{stipendRange[1].toLocaleString()}</Label>
                            <Slider
                                value={stipendRange}
                                onValueChange={setStipendRange}
                                max={100000}
                                min={0}
                                step={5000}
                                className="w-full"
                            />
                        </div>

                        {/* GWA Filter */}
                        <div className="space-y-2">
                            <Label>Maximum GWA Requirement: {gwaFilter}</Label>
                            <Slider
                                value={[gwaFilter]}
                                onValueChange={(value) => setGwaFilter(value[0])}
                                max={4.0}
                                min={1.0}
                                step={0.1}
                                className="w-full"
                            />
                        </div>
                    </div>

                    {/* Filter Actions */}
                    <div className="flex gap-2">
                        <Button onClick={handleSearch}>Apply Filters</Button>
                        <Button variant="outline" onClick={clearFilters}>
                            <X className="h-4 w-4 mr-2" />
                            Clear All
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Search */}
            {!showFilters && (
                <div className="flex gap-4">
                    <div className="flex-1">
                        <Input
                            placeholder="Quick search scholarships..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                    </div>
                    <Button onClick={handleSearch}>
                        <Search className="h-4 w-4 mr-2" />
                        Search
                    </Button>
                </div>
            )}

            {/* Results Summary */}
            <div className="flex items-center justify-between">
                <p className="text-gray-600">
                    Showing {filteredScholarships.length} of {scholarships.length} scholarships
                </p>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">View:</span>
                    <Button
                        variant={viewMode === 'grid' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                    >
                        <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === 'list' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                    >
                        <List className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Scholarships Grid/List */}
            {filteredScholarships.length === 0 ? (
                <Card className="p-12 text-center">
                    <GraduationCap className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No scholarships found</h3>
                    <p className="text-gray-600 mb-4">
                        Try adjusting your search criteria or filters to find more results.
                    </p>
                    <Button onClick={clearFilters}>Clear All Filters</Button>
                </Card>
            ) : (
                <div className={
                    viewMode === 'grid'
                        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                        : 'space-y-4'
                }>
                    {filteredScholarships.map((scholarship) => (
                        viewMode === 'grid'
                            ? <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
                            : <ScholarshipListItem key={scholarship.id} scholarship={scholarship} />
                    ))}
                </div>
            )}
        </AppLayout >
    );
}
