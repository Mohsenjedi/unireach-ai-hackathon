'use client';

import { useState } from 'react';
import { Send, CheckCircle, UserPlus } from 'lucide-react';
import { apiUrl } from '@/lib/api';

const MAJORS = ['Computer Science', 'Medicine', 'Business Administration', 'Engineering', 'Environmental Sciences'];

export default function LeadCaptureForm() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    full_name: '', email: '', nationality: '', desired_major: MAJORS[0],
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFormData(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch(apiUrl('/leads'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, country_of_residence: formData.nationality, degree_level: 'Bachelor', start_date: 'Autumn 2025', phone: '+000000000' }),
      });
      if (!res.ok) {
        throw new Error('Failed to submit application');
      }
      setSubmitted(true);
    } catch {
      setError('Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-xl flex flex-col items-center justify-center gap-4 min-h-[200px]">
        <CheckCircle className="w-10 h-10 text-emerald-400" />
        <h2 className="text-lg font-semibold text-white">Application Received</h2>
        <p className="text-sm text-slate-400 text-center">Your interest has been logged. Our admissions team will follow up shortly.</p>
        <button onClick={() => setSubmitted(false)}
          className="mt-2 px-5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm text-white rounded-lg transition-colors">
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <UserPlus className="w-5 h-5 text-emerald-400 shrink-0" />
        <h2 className="text-lg font-semibold text-white">Student Onboarding</h2>
        <span className="text-xs text-slate-400 hidden sm:inline">— Lead Intake Portal</span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {error && (
          <div className="rounded-lg border border-red-700 bg-red-950/30 px-3 py-2 text-sm text-red-300">
            {error}
          </div>
        )}
        {/* 2-column row: Name + Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Full Name</label>
            <input
              type="text" required placeholder="John Doe"
              onChange={set('full_name')}
              className="bg-slate-800 border border-slate-700 text-sm text-white placeholder:text-slate-500 px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500 transition-colors w-full"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Email Address</label>
            <input
              type="email" required placeholder="john@example.com"
              onChange={set('email')}
              className="bg-slate-800 border border-slate-700 text-sm text-white placeholder:text-slate-500 px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500 transition-colors w-full"
            />
          </div>
        </div>

        {/* 2-column row: Nationality + Major */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Country of Origin</label>
            <input
              type="text" placeholder="India"
              onChange={set('nationality')}
              className="bg-slate-800 border border-slate-700 text-sm text-white placeholder:text-slate-500 px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500 transition-colors w-full"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Desired Major</label>
            <select
              onChange={set('desired_major')}
              className="bg-slate-800 border border-slate-700 text-sm text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer w-full"
            >
              {MAJORS.map(m => <option key={m} className="bg-slate-900">{m}</option>)}
            </select>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit" disabled={isSubmitting}
          className="flex items-center justify-center gap-2 w-full sm:w-auto sm:self-end px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <Send className="w-4 h-4" />
          {isSubmitting ? 'Submitting…' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
}
