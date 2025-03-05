'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabase = createClientComponentClient();

interface EmailStats {
  total_sent: number;
  total_opened: number;
  total_clicked: number;
  by_type: {
    beta: {
      sent: number;
      opened: number;
      clicked: number;
    };
    waitlist: {
      sent: number;
      opened: number;
      clicked: number;
    };
  };
}

interface EmailEvent {
  email_id: string;
  recipient: string;
  email_type: 'beta' | 'waitlist';
  status: 'sent' | 'opened' | 'clicked';
  created_at: string;
}

interface RecentEmail extends EmailEvent {}

export default function EmailStats() {
  const [stats, setStats] = useState<EmailStats | null>(null);
  const [recentEmails, setRecentEmails] = useState<RecentEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sendingTest, setSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{ success?: boolean; message?: string; error?: string } | null>(null);

  useEffect(() => {
    fetchEmailStats();
  }, []);

  async function fetchEmailStats() {
    try {
      // Check if the table exists first
      const { error: tableError } = await supabase
        .from('email_tracking')
        .select('count')
        .limit(1)
        .single();

      if (tableError?.code === 'PGRST116') {
        setStats({
          total_sent: 0,
          total_opened: 0,
          total_clicked: 0,
          by_type: {
            beta: { sent: 0, opened: 0, clicked: 0 },
            waitlist: { sent: 0, opened: 0, clicked: 0 }
          }
        });
        setRecentEmails([]);
        setLoading(false);
        return;
      }

      // Fetch all email tracking events
      const { data: trackingData, error: trackingError } = await supabase
        .from('email_tracking')
        .select('*')
        .order('created_at', { ascending: false });

      if (trackingError) throw trackingError;

      // Calculate statistics
      const stats: EmailStats = {
        total_sent: 0,
        total_opened: 0,
        total_clicked: 0,
        by_type: {
          beta: { sent: 0, opened: 0, clicked: 0 },
          waitlist: { sent: 0, opened: 0, clicked: 0 }
        }
      };

      (trackingData as EmailEvent[]).forEach(event => {
        if (event.status === 'sent') {
          stats.total_sent++;
          stats.by_type[event.email_type].sent++;
        } else if (event.status === 'opened') {
          stats.total_opened++;
          stats.by_type[event.email_type].opened++;
        } else if (event.status === 'clicked') {
          stats.total_clicked++;
          stats.by_type[event.email_type].clicked++;
        }
      });

      setStats(stats);
      setRecentEmails(trackingData.slice(0, 10) as RecentEmail[]); // Get 10 most recent events
    } catch (error) {
      console.error('Error fetching email stats:', error);
      setError('Failed to load email statistics. Please make sure the email_tracking table exists in your database.');
    } finally {
      setLoading(false);
    }
  }

  async function sendTestEmail() {
    setSendingTest(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send test email');
      }

      setTestResult({
        success: true,
        message: 'Test email sent successfully!'
      });

      // Refresh stats
      await fetchEmailStats();
    } catch (error) {
      console.error('Error sending test email:', error);
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send test email'
      });
    } finally {
      setSendingTest(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 text-red-700 p-4 rounded-lg">
            <p>{error}</p>
            <p className="mt-2 text-sm">
              To fix this, make sure you have:
              <ol className="list-decimal ml-6 mt-2">
                <li>Run the Supabase migrations</li>
                <li>Connected to the correct database</li>
                <li>Have proper permissions set up</li>
              </ol>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!stats?.total_sent && !recentEmails.length) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Email Statistics</h1>
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h2 className="text-xl font-semibold mb-2">No Email Data Yet</h2>
              <p className="text-gray-600 mb-4">
                Start sending emails to beta testers or waitlist members to see statistics here.
              </p>
              <button
                onClick={sendTestEmail}
                disabled={sendingTest}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#4a7729] hover:bg-[#3a6629] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4a7729] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sendingTest ? 'Sending...' : 'Send Test Email'}
              </button>
              {testResult && (
                <div className={`mt-4 p-4 rounded-md ${testResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {testResult.message || testResult.error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Email Statistics</h1>
          <button
            onClick={sendTestEmail}
            disabled={sendingTest}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#4a7729] hover:bg-[#3a6629] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4a7729] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sendingTest ? 'Sending...' : 'Send Test Email'}
          </button>
        </div>

        {testResult && (
          <div className={`mb-6 p-4 rounded-md ${testResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {testResult.message || testResult.error}
          </div>
        )}

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Total Sent</h3>
            <p className="text-3xl font-bold text-[#4a7729]">{stats?.total_sent || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Total Opened</h3>
            <p className="text-3xl font-bold text-[#4a7729]">{stats?.total_opened || 0}</p>
            <p className="text-sm text-gray-500">
              {stats && stats.total_sent > 0
                ? `${((stats.total_opened / stats.total_sent) * 100).toFixed(1)}% open rate`
                : '0% open rate'}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Total Clicked</h3>
            <p className="text-3xl font-bold text-[#4a7729]">{stats?.total_clicked || 0}</p>
            <p className="text-sm text-gray-500">
              {stats && stats.total_opened > 0
                ? `${((stats.total_clicked / stats.total_opened) * 100).toFixed(1)}% click rate`
                : '0% click rate'}
            </p>
          </div>
        </div>

        {/* Stats by Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Beta Program Emails</h3>
            <div className="space-y-2">
              <p>Sent: {stats?.by_type.beta.sent || 0}</p>
              <p>Opened: {stats?.by_type.beta.opened || 0}</p>
              <p>Clicked: {stats?.by_type.beta.clicked || 0}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Waitlist Emails</h3>
            <div className="space-y-2">
              <p>Sent: {stats?.by_type.waitlist.sent || 0}</p>
              <p>Opened: {stats?.by_type.waitlist.opened || 0}</p>
              <p>Clicked: {stats?.by_type.waitlist.clicked || 0}</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        {recentEmails.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Recent Email Activity</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Time</th>
                    <th className="text-left py-2">Email</th>
                    <th className="text-left py-2">Type</th>
                    <th className="text-left py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEmails.map((email) => (
                    <tr key={`${email.email_id}-${email.status}`} className="border-b">
                      <td className="py-2">
                        {new Date(email.created_at).toLocaleString()}
                      </td>
                      <td className="py-2">{email.recipient}</td>
                      <td className="py-2 capitalize">{email.email_type}</td>
                      <td className="py-2 capitalize">{email.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 