import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  title: 'Greenhill Hornets Scheduler - Sports Team Management',
  description: 'Greenhill School sports scheduling app. Manage teams, schedule games, track stats, and stream live for soccer, softball, and basketball.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
