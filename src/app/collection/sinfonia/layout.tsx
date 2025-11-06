import { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/seo";
import { getPageMetadata } from "@/lib/metadata-config";

const pageMetadata = getPageMetadata("collection/sinfonia");

export const metadata: Metadata = generateSEOMetadata({
  title: pageMetadata.title,
  description: pageMetadata.description,
  keywords: pageMetadata.keywords,
  image: pageMetadata.ogImage,
  url: "/collection/sinfonia",
});

export default function SinfoniaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


