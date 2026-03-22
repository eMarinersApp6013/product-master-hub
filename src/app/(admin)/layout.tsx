import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin-sidebar'

const ADMIN_EMAIL = 'marinersapp@gmail.com'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await currentUser()

  if (!user) {
    redirect('/sign-in')
  }

  const emails = user.emailAddresses.map((e) => e.emailAddress)
  if (!emails.includes(ADMIN_EMAIL)) {
    redirect('/dashboard')
  }

  return (
    <div className="flex h-screen bg-[#0B1120] overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
