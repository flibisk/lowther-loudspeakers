import { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/seo";
import { getPageMetadata } from "@/lib/metadata-config";

const pageMetadata = getPageMetadata("brand/donald-chave-era");

export const metadata: Metadata = generateSEOMetadata({
  title: pageMetadata.title,
  description: pageMetadata.description,
  keywords: pageMetadata.keywords,
  image: pageMetadata.ogImage,
  url: "/brand/donald-chave-era",
});

export default function DonaldChaveEraLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


