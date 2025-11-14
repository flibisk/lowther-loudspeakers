import { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/seo";
import { getPageMetadata } from "@/lib/metadata-config";

const pageMetadata = getPageMetadata("collection/super-tweeter");

export const metadata: Metadata = generateSEOMetadata({
  title: pageMetadata.title,
  description: pageMetadata.description,
  keywords: pageMetadata.keywords,
  image: pageMetadata.ogImage,
  url: "/collection/super-tweeter",
});

export default function SuperTweeterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


