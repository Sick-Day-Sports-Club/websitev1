import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Apply to Become a Guide Partner | Sick Day Sports Club',
  description: 'Join our network of local guides and share your expertise with outdoor enthusiasts. Apply to become a guide partner with Sick Day Sports Club.',
};

export default function GuideApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
} 