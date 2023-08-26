'use client';
import SSE from '../../features/sse';

import { withAuth } from '@/features/auth/hoc';

function SSEPage() {
  return <SSE />;
}

export default withAuth(SSEPage);
