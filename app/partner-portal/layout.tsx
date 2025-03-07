import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Partner Portal | Sick Day Sports Club',
  description: 'Access the partner portal for guides and partners of Sick Day Sports Club.',
};

export default function PartnerPortalLayout({
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