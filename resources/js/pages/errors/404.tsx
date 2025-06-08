import { Head } from '@inertiajs/react';
import { FileQuestion, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
    message?: string;
}

export default function Error404({ message = 'The page you are looking for could not be found.' }: Props) {
    return (
        <>
            <Head title="Page Not Found" />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="mx-auto w-24 h-24 flex items-center justify-center bg-blue-100 dark:bg-blue-900/20 rounded-full mb-6">
                        <FileQuestion className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                    </div>

                    <Card>
                        <CardHeader className="text-center">
                            <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                404
                            </CardTitle>
                            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                Page Not Found
                            </CardTitle>
                            <CardDescription className="text-base">
                                {message}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="text-center space-y-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                The page you're looking for might have been moved, deleted, or doesn't exist.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Button asChild variant="outline" className="inline-flex items-center gap-2">
                                    <a href="javascript:history.back()">
                                        <ArrowLeft className="h-4 w-4" />
                                        Go Back
                                    </a>
                                </Button>

                                <Button asChild className="inline-flex items-center gap-2">
                                    <a href="/">
                                        <Home className="h-4 w-4" />
                                        Go to Dashboard
                                    </a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
