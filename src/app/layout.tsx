import ProviderComponent from '@/src/components/layouts/provider-component';
import '@/src/app/globals.css';
import { MantineProvider } from '@mantine/core';

export const metadata = {
    title: {
        template: '%s | BHC',
        default: 'BHC',
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="font-sans text-gray-900 dark:text-white bg-gray-50 dark:bg-black">
            <MantineProvider>
                <ProviderComponent>{children}</ProviderComponent>
            </MantineProvider>
            </body>
        </html>
    );
}
