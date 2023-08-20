'use client';
import { withAuth } from '@/features/auth/hoc';
import SSE from '../../features/sse';

function SSEPage() {
  return <SSE />;
}

export default withAuth(SSEPage);
