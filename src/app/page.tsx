import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirect to login page for now
  // In a real app, you might want to check authentication status first
  redirect('/login')
}
