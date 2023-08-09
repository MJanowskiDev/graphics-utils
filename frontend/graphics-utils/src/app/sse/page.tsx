import Image from 'next/image';
import Link from 'next/link';

import logo from '../../../public/images/graphics_utils_logo.svg';
import author from '../../../public/images/mjanowskidev.png';
import SSE from '../../features/sse';
import { Footer, Navbar } from '@/features/ui';

export default function SSEPage() {
  return <SSE />;
}
