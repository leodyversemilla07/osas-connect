import { Head } from '@inertiajs/react';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  message?: string;
}

export default function Error403({ message = 'You are not authorized to access this resource.' }: Props) {
  return (
    <>
      <Head title="Access Denied" />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="mx-auto w-24 h-24 flex items-center justify-center bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
            <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>
          
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Access Denied
              </CardTitle>
              <CardDescription className="text-base">
                {message}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="text-center">
              <Button asChild variant="outline" className="inline-flex items-center gap-2">
                <a href="/">
                  <ArrowLeft className="h-4 w-4" />
                  Go back to dashboard
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
