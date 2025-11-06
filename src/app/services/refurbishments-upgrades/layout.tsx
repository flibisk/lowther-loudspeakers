import { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/seo";
import { getPageMetadata } from "@/lib/metadata-config";

const pageMetadata = getPageMetadata("services/refurbishments-upgrades");

export const metadata: Metadata = generateSEOMetadata({
  title: pageMetadata.title,
  description: pageMetadata.description,
  keywords: pageMetadata.keywords,
  image: pageMetadata.ogImage,
  url: "/services/refurbishments-upgrades",
});

export default function RefurbishmentsUpgradesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


