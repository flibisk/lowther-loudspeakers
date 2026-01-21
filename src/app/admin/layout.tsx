import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import { AdminSidebar } from '@/components/admin/sidebar';

// Admin emails that have access
const ADMIN_EMAILS = [
  'social@lowtherloudspeakers.com',
  'hello@lowtherloudspeakers.com',
];

async function getAdminUser() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('tye_session');

  if (!sessionCookie?.value) {
    return null;
  }

  const [userId] = sessionCookie.value.split(':');
  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      displayName: true,
      fullName: true,
      role: true,
    },
  });

  // Check if user is admin either by role or by email
  if (!user) return null;
  if (user.role !== 'ADMIN' && !ADMIN_EMAILS.includes(user.email)) {
    return null;
  }

  return user;
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAdminUser();

  if (!user) {
    redirect('/account?error=unauthorized');
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar user={user} />
        
        {/* Main content */}
        <main className="flex-1 ml-64">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
