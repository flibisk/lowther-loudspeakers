import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trust Your Ears | Lowther Loudspeakers',
  description: 'Community-driven album listening recommendations. Discover what the Lowther community is listening to and discussing.',
};

export default function TrustYourEarsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
