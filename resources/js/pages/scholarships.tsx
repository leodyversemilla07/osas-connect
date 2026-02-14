import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Head, Link } from '@inertiajs/react';
import { Calendar, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

interface Scholarship {
    id: number;
    name: string;
    amount: string;
    deadline: string;
    daysRemaining: number;
    type: 'Academic Scholarship' | 'Student Assistantship Program' | 'Performing Arts Scholarship' | 'Economic Assistance';
    description: string;
    requirements: string[];
}

interface ScholarshipsProps {
    auth?: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        } | null;
    };
    scholarships: Scholarship[];
}

export default function Scholarships({ auth, scholarships }: ScholarshipsProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState<string>('all');
    const isAuthenticated = Boolean(auth?.user);

    const filteredScholarships = useMemo(() => {
        return (scholarships || []).filter((scholarship) => {
            const matchesSearch =
                scholarship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                scholarship.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = selectedType === 'all' || scholarship.type === selectedType;
            return matchesSearch && matchesType;
        });
    }, [scholarships, searchTerm, selectedType]);

    return (
        <>
            <Head title="Scholarships - OSAS Connect" />

            <div className="bg-background min-h-screen font-sans antialiased">
                <SiteHeader />

                <main className="pt-16">
                    <section className="border-b">
                        <div className="container mx-auto px-4 py-20 md:px-6">
                            <div className="mx-auto max-w-3xl space-y-5 text-center">
                                <Badge variant="secondary">Scholarship Programs</Badge>
                                <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Find your scholarship opportunity</h1>
                                <p className="text-muted-foreground text-lg">
                                    Browse active programs, review requirements, and start your application when ready.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="container mx-auto px-4 py-10 md:px-6">
                        <div className="mb-8 grid gap-3 md:grid-cols-[1fr_240px]">
                            <div className="relative">
                                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                <Input
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search scholarships..."
                                    className="pl-9"
                                />
                            </div>

                            <Select value={selectedType} onValueChange={setSelectedType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="Academic Scholarship">Academic Scholarship</SelectItem>
                                    <SelectItem value="Student Assistantship Program">Student Assistantship</SelectItem>
                                    <SelectItem value="Performing Arts Scholarship">Performing Arts</SelectItem>
                                    <SelectItem value="Economic Assistance">Economic Assistance</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-xl font-semibold">{selectedType === 'all' ? 'All Scholarships' : selectedType}</h2>
                            <p className="text-muted-foreground text-sm">
                                {filteredScholarships.length} result{filteredScholarships.length === 1 ? '' : 's'}
                            </p>
                        </div>

                        {filteredScholarships.length === 0 ? (
                            <Card>
                                <CardContent className="py-14 text-center">
                                    <p className="text-muted-foreground mb-4">No scholarships match your current filters.</p>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setSearchTerm('');
                                            setSelectedType('all');
                                        }}
                                    >
                                        Clear Filters
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                                {filteredScholarships.map((scholarship) => (
                                    <Card key={scholarship.id} className="h-full">
                                        <CardHeader className="space-y-3">
                                            <Badge variant="outline" className="w-fit">
                                                {scholarship.type}
                                            </Badge>
                                            <CardTitle className="line-clamp-2 text-xl">{scholarship.name}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <p className="text-muted-foreground line-clamp-3 text-sm">{scholarship.description}</p>

                                            <div className="bg-muted/50 flex items-center justify-between rounded-md px-3 py-2 text-sm">
                                                <span className="font-semibold">{scholarship.amount}</span>
                                                <span className="text-muted-foreground flex items-center gap-1">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    {scholarship.daysRemaining} days left
                                                </span>
                                            </div>

                                            <div>
                                                <p className="mb-2 text-sm font-medium">Requirements</p>
                                                <ul className="text-muted-foreground space-y-1 text-sm">
                                                    {scholarship.requirements.slice(0, 3).map((requirement) => (
                                                        <li key={requirement} className="flex items-start gap-2">
                                                            <span className="bg-primary mt-2 h-1.5 w-1.5 rounded-full" />
                                                            <span className="line-clamp-1">{requirement}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <Button asChild className="w-full">
                                                <Link href={isAuthenticated ? `/student/scholarships/${scholarship.id}/apply` : route('login')}>
                                                    {isAuthenticated ? 'Apply Now' : 'Login to Apply'}
                                                </Link>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </section>
                </main>

                <SiteFooter />
            </div>
        </>
    );
}
