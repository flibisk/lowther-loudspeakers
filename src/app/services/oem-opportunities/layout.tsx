import { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/seo";
import { getPageMetadata } from "@/lib/metadata-config";

const pageMetadata = getPageMetadata("services/oem-opportunities");

export const metadata: Metadata = generateSEOMetadata({
  title: pageMetadata.title,
  description: pageMetadata.description,
  keywords: pageMetadata.keywords,
  image: pageMetadata.ogImage,
  url: "/services/oem-opportunities",
});

export default function OEMOpportunitiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


