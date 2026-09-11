import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'DISHA 2026 - Wafy Leaders Meet',
  description: 'Registration for DISHA 2026 WAFY Leaders Meet at Neebar Gate Natural Resort, Kakkadampoyil',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+Malayalam:wght@100..900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <main>{children}</main>
        <footer style={{ textAlign: 'center', padding: '0px 20px 24px', color: 'var(--secondary-text)', fontSize: '14px', lineHeight: '1.6', marginTop: '-10px' }}>
          <p style={{ marginTop: '0', fontSize: '0.9rem' }}>
            Developed by <a href="https://wa.me/917559865389?text=Hi%20Dot%20Projects%2C%20we%20experienced%20your%20registration%20website%20for%20MLA%20office%20Kunnamangalam%20events%2C%20we%20have%20an%20enquiry." target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Dot Projects</a>
          </p>
          <div style={{ marginTop: '12px' }}>
            <Link href="/admin" style={{ opacity: 0.5, textDecoration: 'none', color: 'inherit', fontSize: '12px' }}>
              Admin Login
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
