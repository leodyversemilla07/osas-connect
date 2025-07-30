import { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="fixed inset-0 flex items-center justify-center bg-white/70 z-50">
                    <Alert variant="destructive" className="my-6 p-6 rounded-lg shadow-lg flex flex-col items-center text-center animate-fade-in">
                        <div className="flex items-center justify-center mb-4">
                            <RefreshCcw className="h-8 w-8 text-red-600 mr-2 animate-spin-slow" aria-hidden="true" />
                            <AlertTitle className="text-xl font-bold text-red-700">Something went wrong</AlertTitle>
                        </div>
                        <AlertDescription className="mt-2 text-base text-gray-700">
                            {this.state.error?.message || 'An unexpected error occurred.'}
                        </AlertDescription>
                        <div className="mt-6">
                            <Button
                                variant="destructive"
                                onClick={() => window.location.reload()}
                                className="gap-2 px-6 py-2 text-base font-semibold rounded-md shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all duration-150"
                                aria-label="Reload Page"
                            >
                                <RefreshCcw className="h-5 w-5" />
                                Reload Page
                            </Button>
                        </div>
                    </Alert>
                </div>
            );
        }

        return this.props.children;
    }
}
