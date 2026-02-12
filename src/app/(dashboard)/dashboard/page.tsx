import { auth } from '@/auth';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const session = await auth();

  return (
    <DashboardClient user={session?.user} />
  );
}