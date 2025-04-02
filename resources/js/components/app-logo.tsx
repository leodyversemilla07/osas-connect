import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
                <AppLogoIcon className="size-full" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold">OSAS Connect</span>
            </div>
        </>
    );
}
