'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, FolderKanban, Clock, BarChart3, Users } from 'lucide-react';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if authenticated and status is confirmed
    if (status === 'authenticated' && session) {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Lindsay Precast
              </h1>
              <p className="text-sm text-gray-600">Design Management System</p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/login"
                className="px-6 py-2 text-indigo-600 hover:text-indigo-700 font-medium transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Streamline Your Precast Design Management
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Professional design management system built for Lindsay Precast. Manage projects, track time, oversee production, and collaborate seamlessly.
              </p>
            </div>

            <div className="flex gap-4">
              <Link
                href="/register"
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-xl transition-all duration-200 flex items-center gap-2 group"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:tranpurple-x-1 transition" />
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 border-2 border-indigo-600 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-all duration-200"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Right Features */}
          <div className="space-y-4">
            <FeatureCard
              icon={FolderKanban}
              title="Project Management"
              description="Create, track, and manage all your precast design projects with ease."
            />
            <FeatureCard
              icon={Clock}
              title="Time Tracking"
              description="Real-time time tracking for accurate project costing and resource management."
            />
            <FeatureCard
              icon={Users}
              title="Team Collaboration"
              description="Role-based access control for designers, engineers, and project managers."
            />
            <FeatureCard
              icon={BarChart3}
              title="Analytics & Reports"
              description="Comprehensive reporting and analytics to track project performance."
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h3>
            <p className="text-xl text-gray-600">
              Powerful tools designed for modern precast design management
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="p-8 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl">
              <FolderKanban className="w-12 h-12 text-indigo-600 mb-4" />
              <h4 className="text-xl font-bold text-gray-900 mb-2">Projects</h4>
              <p className="text-gray-700">Organize and manage multiple design projects with custom fields and templates.</p>
            </div>
            <div className="p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
              <Clock className="w-12 h-12 text-purple-600 mb-4" />
              <h4 className="text-xl font-bold text-gray-900 mb-2">Time Tracking</h4>
              <p className="text-gray-700">Track design hours with start/stop controls and automatic duration calculation.</p>
            </div>
            <div className="p-8 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl">
              <Users className="w-12 h-12 text-indigo-600 mb-4" />
              <h4 className="text-xl font-bold text-gray-900 mb-2">Customers</h4>
              <p className="text-gray-700">Maintain detailed customer information and manage all client interactions.</p>
            </div>
            <div className="p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
              <BarChart3 className="w-12 h-12 text-purple-600 mb-4" />
              <h4 className="text-xl font-bold text-gray-900 mb-2">Library</h4>
              <p className="text-gray-700">Create and manage reusable design templates and product specifications.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to get started?</h3>
          <p className="text-lg mb-8 text-indigo-100">
            Join Lindsay Precast's design management system today and streamline your workflow.
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:shadow-xl transition-all duration-200"
          >
            Create Your Account
          </Link>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: any) {
  return (
    <div className="flex gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-md transition">
      <Icon className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
      <div>
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}


