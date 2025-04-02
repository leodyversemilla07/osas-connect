import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            {...props}
            src="/images/logo.png"
            alt="App Logo"
            width={props.width || 32}
            height={props.height || 32}
            className={`rounded-full object-cover ${props.className || ''}`}
            style={{
                ...props.style,
                aspectRatio: '1/1',
            }}
        />
    );
}
