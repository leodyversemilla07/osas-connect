import { Button } from '@/components/ui/button';
import { Head } from '@inertiajs/react';
import { ArrowLeft, Home } from 'lucide-react';

interface Props {
    message?: string;
}

export default function Error404({ message = 'The page you are looking for could not be found.' }: Props) {
    return (
        <>
            <Head title="Page Not Found" />
            <div className="bg-background flex min-h-screen flex-col items-center justify-center px-4">
                <div className="text-center">
                    <div className="text-primary mb-2 text-6xl font-bold">404</div>
                    <div className="text-foreground mb-2 text-xl font-semibold">Page Not Found</div>
                    {message && <div className="text-muted-foreground mb-6 text-base">{message}</div>}
                    <div className="flex flex-col justify-center gap-2 sm:flex-row">
                        <Button variant="outline" className="inline-flex items-center gap-2" onClick={() => window.history.back()}>
                            <ArrowLeft className="text-primary h-4 w-4" />
                            Go Back
                        </Button>
                        <Button asChild className="inline-flex items-center gap-2">
                            <a href="/">
                                <Home className="text-primary dark:text-primary-foreground h-4 w-4" />
                                Dashboard
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
