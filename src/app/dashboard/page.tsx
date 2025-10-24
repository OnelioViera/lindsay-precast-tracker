import { redirect } from 'next/navigation'

export default function DashboardRedirect() {
  // Redirect /dashboard to / (where the actual dashboard is)
  redirect('/')
}

