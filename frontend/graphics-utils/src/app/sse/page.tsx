'use client';
import SSE from '../../features/sse';

import { withAuth } from '@/shared/hoc';

function SSEPage() {
  return <SSE />;
}

export default withAuth(SSEPage);
