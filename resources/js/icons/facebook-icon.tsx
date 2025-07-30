import * as React from 'react';

export default function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            role="img"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <title>Facebook</title>
            <path d="M24 12a12 12 0 1 0-13.875 11.875v-8.437h-2.797V12h2.797V9.797c0-2.762 1.643-4.288 4.164-4.288 1.205 0 2.466.216 2.466.216v2.71h-1.39c-1.368 0-1.797.85-1.797 1.72V12h3.062l-.49 3.438h-2.572v8.437A12 12 0 0 0 24 12z" />
        </svg>
    );
}
