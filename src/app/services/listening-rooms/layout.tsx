import { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/seo";
import { getPageMetadata } from "@/lib/metadata-config";

const pageMetadata = getPageMetadata("services/listening-rooms");

export const metadata: Metadata = generateSEOMetadata({
  title: pageMetadata.title,
  description: pageMetadata.description,
  keywords: pageMetadata.keywords,
  image: pageMetadata.ogImage,
  url: "/services/listening-rooms",
});

export default function ListeningRoomsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


