'use client';

import NextLink, { LinkProps } from 'next/link';
import { AnchorHTMLAttributes, forwardRef } from 'react';

type CustomLinkProps = LinkProps & AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: React.ReactNode;
};

// プリフェッチを無効化したLinkコンポーネント
// プリロード警告を防ぐため、デフォルトでprefetch={false}に設定
const Link = forwardRef<HTMLAnchorElement, CustomLinkProps>(
  ({ children, prefetch = false, ...props }, ref) => {
    return (
      <NextLink ref={ref} prefetch={prefetch} {...props}>
        {children}
      </NextLink>
    );
  }
);

Link.displayName = 'Link';

export default Link;
