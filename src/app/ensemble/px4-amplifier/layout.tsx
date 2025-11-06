import { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/seo";
import { getPageMetadata } from "@/lib/metadata-config";

const pageMetadata = getPageMetadata("ensemble/px4-amplifier");

export const metadata: Metadata = generateSEOMetadata({
  title: pageMetadata.title,
  description: pageMetadata.description,
  keywords: pageMetadata.keywords,
  image: pageMetadata.ogImage,
  url: "/ensemble/px4-amplifier",
});

export default function PX4AmplifierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


