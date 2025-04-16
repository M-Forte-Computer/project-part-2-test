import './globals.css'

export const metadata = {
  title: 'Task Management App',
  description: 'Manage your tasks and projects',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
