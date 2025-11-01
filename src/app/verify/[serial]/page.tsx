import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { generateSEOMetadata } from "@/lib/seo";
import { getMockRecord, mockNetworkInfo } from "@/lib/mockChain";

interface VerifyPageProps {
  params: {
    serial: string;
  };
}

export async function generatePageMetadata({ params }: VerifyPageProps): Promise<Metadata> {
  return generateSEOMetadata({
    title: `Verify Serial ${params.serial}`,
    description: `Blockchain verification for Lowther loudspeaker serial number ${params.serial}`,
    keywords: ["verification", "blockchain", "authenticity", "serial"],
    url: `/verify/${params.serial}`,
  });
}

export default function VerifyPage({ params }: VerifyPageProps) {
  const record = getMockRecord(params.serial);

  if (!record) {
    notFound();
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
      case "pending":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700">Pending</Badge>;
      case "invalid":
        return <Badge variant="destructive">Invalid</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-6 sm:px-6 lg:px-8 xl:px-12 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Serial Verification
            </h1>
            <p className="text-muted-foreground">
              Blockchain authenticity record for Lowther loudspeaker
            </p>
          </div>

          {/* Serial Number */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-bold">Serial Number</h2>
                {getStatusBadge(record.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-mono font-bold text-center py-4 bg-neutral-100 rounded-lg">
                {record.serial}
              </div>
            </CardContent>
          </Card>

          {/* Product Details */}
          <Card className="mb-6">
            <CardHeader>
              <h2 className="font-display text-xl font-bold">Product Details</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Manufacturing Date</label>
                  <p className="font-medium">{new Date(record.date).toLocaleDateString('en-GB')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Veneer</label>
                  <p className="font-medium">{record.veneer}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Drive Units</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {record.drivers.map((driver, index) => (
                    <Badge key={index} variant="outline" className="font-mono">
                      {driver}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Blockchain Record */}
          <Card className="mb-6">
            <CardHeader>
              <h2 className="font-display text-xl font-bold">Blockchain Record</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Network</label>
                <p className="font-medium">{mockNetworkInfo.network}</p>
              </div>
              
              {record.blockNumber && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Block Number</label>
                  <p className="font-mono text-sm">{record.blockNumber.toLocaleString()}</p>
                </div>
              )}
              
              {record.transactionHash && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Transaction Hash</label>
                  <p className="font-mono text-xs break-all bg-neutral-100 p-2 rounded">
                    {record.transactionHash}
                  </p>
                </div>
              )}
              
              {record.owner && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Current Owner</label>
                  <p className="font-mono text-xs break-all bg-neutral-100 p-2 rounded">
                    {record.owner}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contract Info */}
          <Card className="mb-8">
            <CardHeader>
              <h2 className="font-display text-xl font-bold">Smart Contract</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Contract Address</label>
                  <p className="font-mono text-xs break-all bg-neutral-100 p-2 rounded">
                    {mockNetworkInfo.contractAddress}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="text-muted-foreground">Last Block</label>
                    <p className="font-medium">{mockNetworkInfo.lastBlock.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-muted-foreground">Gas Price</label>
                    <p className="font-medium">{mockNetworkInfo.gasPrice}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/labs/wallet">Verify Another Serial</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">
              This is a demonstration of blockchain verification technology. 
              Records shown are simulated for development purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
