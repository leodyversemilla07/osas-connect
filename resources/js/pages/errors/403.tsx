
import { Head } from '@inertiajs/react';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
    message?: string;
}

export default function Error403({ message = 'You are not authorized to access this resource.' }: Props) {
    return (
        <>
            <Head title="Access Denied" />
            <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
                <div className="text-center">
                    <div className="text-6xl font-bold text-primary mb-2">403</div>
                    <div className="text-xl font-semibold text-foreground mb-2">Access Denied</div>
                    {message && (
                        <div className="text-base text-muted-foreground mb-6">{message}</div>
                    )}
                    <div className="flex flex-col sm:flex-row gap-2 justify-center">
                        <Button variant="outline" className="inline-flex items-center gap-2" onClick={() => window.history.back()}>
                            <ArrowLeft className="h-4 w-4 text-primary" />
                            Go Back
                        </Button>
                        <Button asChild className="inline-flex items-center gap-2">
                            <a href="/">
                                <Home className="h-4 w-4 text-primary dark:text-primary-foreground" />
                                Dashboard
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
