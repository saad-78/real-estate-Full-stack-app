import './globals.css'

export const metadata = {
  title: 'Real Estate Listing',
  description: 'Property listing and management system',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
