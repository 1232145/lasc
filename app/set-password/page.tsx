'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function SetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenReady, setTokenReady] = useState(false);

  useEffect(() => {
    // Parse tokens from the URL hash fragment
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');
    const type = params.get('type');

    if (type === 'invite' && access_token && refresh_token) {
      // Set session for the password setup
      supabase.auth.setSession({ access_token, refresh_token }).then(({ error }) => {
        if (error) setError(error.message);
        else setTokenReady(true);
      });
    } else {
      setError('Invalid or expired link');
    }
  }, []);

  const handleSetPassword = async () => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setError(error.message);
    else setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        {submitted ? (
          <p className="text-green-600 font-medium text-center">
            Password set successfully. You can now log in.
          </p>
        ) : error ? (
          <p className="text-red-600 font-medium text-center">{error}</p>
        ) : !tokenReady ? (
          <p className="text-gray-500 text-center">Loading set-password link...</p>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Set Your Password</h2>
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:ring-2 focus:ring-orange-300 focus:border-orange-500 transition-colors"
            />
            <button
              onClick={handleSetPassword}
              className="w-full bg-orange-600 text-white font-medium py-2 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Set Password
            </button>
          </>
        )}
      </div>
    </div>
  );
}