import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HireConnect - Professional Hiring Platform',
  description: 'Streamline your hiring process with our comprehensive platform for interview management, document submission, and seamless onboarding experience.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  )
}
