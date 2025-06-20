import './globals.css'
import { Inter } from 'next/font/google'
import { Sidebar } from './components/Navigation/Sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 bg-gradient-to-b from-white to-gray-50">{children}</main>
        </div>
      </body>
    </html>
  )
}
