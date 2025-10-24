'use client';

import React, { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

function AuthCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    const type = searchParams.get('type');

    if (type === 'recovery') {
      router.push(`/reset-password#${searchParams.toString()}`);
      return;
    }

    if (accessToken && refreshToken) {
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      router.push('/admin');
    }
  }, [searchParams, router]);

  return <p>Processing authentication...</p>;
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <AuthCallback />
    </Suspense>
  );
}