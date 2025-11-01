import { Metadata } from "next";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { generateSEOMetadata } from "@/lib/seo";

const isAmbassadorFeatureEnabled = process.env.NEXT_PUBLIC_FEATURE_AMBASSADOR === "true";

export const metadata: Metadata = generateSEOMetadata({
  title: "Ambassador Programme",
  description: "Join our exclusive ambassador programme and help share the Lowther story with fellow audio enthusiasts.",
  keywords: ["ambassador", "programme", "community", "exclusive"],
  url: "/ambassador",
});

export default function AmbassadorPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 sm:px-6 lg:px-8 xl:px-12 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="mb-4">Exclusive Programme</Badge>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Lowther Ambassador Programme
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join our exclusive community of Lowther enthusiasts and help share 
              the story of handcrafted excellence with fellow audio lovers.
            </p>
          </div>

          {/* Feature Status */}
          {!isAmbassadorFeatureEnabled && (
            <Card className="mb-12 border-amber-200 bg-amber-50">
              <CardContent className="p-6 text-center">
                <Badge variant="outline" className="mb-4">Coming Soon</Badge>
                <p className="text-muted-foreground">
                  The Ambassador Programme is currently in development. 
                  Check back soon for more information.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Programme Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <h2 className="font-display text-2xl font-bold">What's Included</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div>
                    <h3 className="font-medium">Exclusive Access</h3>
                    <p className="text-sm text-muted-foreground">
                      Early access to new products and limited editions
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div>
                    <h3 className="font-medium">Community Events</h3>
                    <p className="text-sm text-muted-foreground">
                      Invitations to exclusive listening sessions and workshops
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div>
                    <h3 className="font-medium">Special Pricing</h3>
                    <p className="text-sm text-muted-foreground">
                      Ambassador discounts on products and services
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div>
                    <h3 className="font-medium">Direct Support</h3>
                    <p className="text-sm text-muted-foreground">
                      Direct line to our technical team and founders
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="font-display text-2xl font-bold">Requirements</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div>
                    <h3 className="font-medium">Lowther Owner</h3>
                    <p className="text-sm text-muted-foreground">
                      Must own at least one Lowther loudspeaker
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div>
                    <h3 className="font-medium">Audio Enthusiast</h3>
                    <p className="text-sm text-muted-foreground">
                      Passionate about high-quality audio and craftsmanship
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div>
                    <h3 className="font-medium">Community Minded</h3>
                    <p className="text-sm text-muted-foreground">
                      Willing to share experiences and help fellow enthusiasts
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div>
                    <h3 className="font-medium">Quality Focus</h3>
                    <p className="text-sm text-muted-foreground">
                      Appreciates and promotes excellence in audio equipment
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Application Form */}
          {isAmbassadorFeatureEnabled ? (
            <Card>
              <CardHeader>
                <h2 className="font-display text-2xl font-bold">Apply Now</h2>
                <p className="text-muted-foreground">
                  Tell us about yourself and why you'd like to become a Lowther Ambassador.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <Input placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input type="email" placeholder="your@email.com" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Lowther Model</label>
                  <Input placeholder="Which Lowther loudspeaker do you own?" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Audio Experience</label>
                  <textarea 
                    className="w-full p-3 border border-border rounded-md resize-none"
                    rows={4}
                    placeholder="Tell us about your audio journey and experience with Lowther loudspeakers..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Why Ambassador?</label>
                  <textarea 
                    className="w-full p-3 border border-border rounded-md resize-none"
                    rows={4}
                    placeholder="Why would you like to become a Lowther Ambassador? How would you help spread the word?"
                  />
                </div>
                
                <Button size="lg" className="w-full">
                  Submit Application
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <h2 className="font-display text-2xl font-bold mb-4">Stay Informed</h2>
                <p className="text-muted-foreground mb-6">
                  Be the first to know when the Ambassador Programme launches.
                </p>
                <div className="max-w-md mx-auto">
                  <div className="flex space-x-2">
                    <Input 
                      type="email" 
                      placeholder="Your email address" 
                      className="flex-1"
                    />
                    <Button>Notify Me</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contact */}
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Questions about the Ambassador Programme?
            </p>
            <Button variant="outline" asChild>
              <a href="/contact?subject=Ambassador Programme">Contact Us</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
