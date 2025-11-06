import { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/seo";
import { getPageMetadata } from "@/lib/metadata-config";

const pageMetadata = getPageMetadata("build-a-lowther");

export const metadata: Metadata = generateSEOMetadata({
  title: pageMetadata.title,
  description: pageMetadata.description,
  keywords: pageMetadata.keywords,
  image: pageMetadata.ogImage,
  url: "/build-a-lowther",
});

export default function BuildALowtherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


