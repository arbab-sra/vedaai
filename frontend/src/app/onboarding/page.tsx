"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function OnboardingPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [occupation, setOccupation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch(`${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001').replace(/\\/+$/, '')}/api/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, organizationName, occupation }),
      });
      
      if (res.ok) {
        router.push('/');
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold mb-2">Welcome to VedaAI 👋</h1>
        <p className="text-gray-500 mb-8">Let's set up your educator profile so we can personalize your generated assignments.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Jane Doe"
              required
              className="h-12 bg-gray-50"
            />
          </div>

          <div className="space-y-2">
            <Label>Organization / Institution Name</Label>
            <Input 
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              placeholder="e.g. CCSU, XYZ High School"
              required
              className="h-12 bg-gray-50"
            />
          </div>

          <div className="space-y-2">
            <Label>Occupation</Label>
            <Input 
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              placeholder="e.g. Professor, High School Teacher"
              required
              className="h-12 bg-gray-50"
            />
          </div>

          <Button type="submit" className="w-full h-12 text-base rounded-xl" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Complete Setup'}
          </Button>
        </form>
      </div>
    </div>
  );
}
