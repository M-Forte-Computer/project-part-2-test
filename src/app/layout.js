import './globals.css'

export const metadata = {
  title: 'Task Management App',
  description: 'Track your projects and tasks',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
