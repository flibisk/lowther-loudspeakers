import { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/seo";
import { getPageMetadata } from "@/lib/metadata-config";

const pageMetadata = getPageMetadata("brand/paul-voigt-era");

export const metadata: Metadata = generateSEOMetadata({
  title: pageMetadata.title,
  description: pageMetadata.description,
  keywords: pageMetadata.keywords,
  image: pageMetadata.ogImage,
  url: "/brand/paul-voigt-era",
});

export default function PaulVoigtEraLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


