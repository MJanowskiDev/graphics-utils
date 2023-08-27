'use client';

import { ReactNode } from 'react';
import Link, { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '../button';

interface ActiveLinkProps extends LinkProps {
  children: ReactNode;
  classActive?: string;
  className?: string;
}

const checkMatching = (path: string, href: string) => {
  if (href !== '/') {
    return path.includes(href);
  } else {
    return href.match(path);
  }
};

export const NavbarLink = ({
  children,
  classActive = 'text-purple-600 underline underline-offset-4 decoration-1',
  className,
  ...props
}: ActiveLinkProps) => {
  const pathname = usePathname();

  const pathMatches = checkMatching(pathname, props.href.toString());
  return (
    <Link {...props} className={pathMatches ? `${classActive}` : `${className}`}>
      <Button variant="tertiary">{children}</Button>
    </Link>
  );
};
