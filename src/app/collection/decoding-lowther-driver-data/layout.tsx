import { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Decoding Lowther Driver Data",
  description: "How we measure, compare and listen to our drive units.",
  keywords: ["Lowther", "drive units", "measurement", "technical data", "driver data", "frequency response", "impedance"],
  image: "/images/og/decoding-lowther-driver-data.jpg",
  url: "/collection/decoding-lowther-driver-data",
});

export default function DecodingLowtherDriverDataLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

