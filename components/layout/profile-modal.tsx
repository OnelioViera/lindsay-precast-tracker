'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const roleDisplayNames: { [key: string]: string } = {
  designer: 'CAD Designer',
  manager: 'Project Manager',
  production: 'Production Specialist',
  other: 'Other',
};

function formatRole(role: string): string {
  return roleDisplayNames[role] || role;
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'designer',
  });

  // Update form data when modal opens or session changes
  useEffect(() => {
    if (isOpen && session?.user) {
      setFormData({
        name: session.user.name || '',
        email: session.user.email || '',
        role: (session.user as any).role || 'designer',
      });
      setMessage('');
    }
  }, [isOpen, session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Profile updated successfully!');
        setTimeout(() => {
          // Refresh the page to reload session data
          window.location.reload();
        }, 1000);
      } else {
        setMessage(data.message || 'Failed to update profile');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your full name"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              placeholder="Enter your email"
              disabled
              className="mt-1 bg-gray-100 cursor-not-allowed text-gray-600"
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          <div>
            <Label htmlFor="role" className="text-sm font-medium text-gray-700">Role</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
              <SelectTrigger className="mt-1">
                <SelectValue>{formatRole(formData.role)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="designer">CAD Designer</SelectItem>
                <SelectItem value="manager">Project Manager</SelectItem>
                <SelectItem value="production">Production Specialist</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
              message.includes('successfully')
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.includes('successfully') && <CheckCircle className="h-4 w-4" />}
              {message}
            </div>
          )}

          <div className="flex gap-3 pt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:shadow-purple-500/40 hover:scale-105 transition-all duration-200 font-semibold"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </span>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

