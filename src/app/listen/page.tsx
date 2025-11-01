import { Metadata } from "next";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { generateSEOMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Listen",
  description: "Experience Lowther loudspeakers in person. Find listening rooms, dealers, and demo locations near you.",
  keywords: ["listen", "demo", "showroom", "dealer", "listening room"],
  url: "/listen",
});

export default function ListenPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 sm:px-6 lg:px-8 xl:px-12 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Listen to Lowther
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience our loudspeakers in person. Visit our listening rooms, 
              authorised dealers, or arrange a private demonstration.
            </p>
          </div>

          {/* Listening Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="p-8">
              <CardHeader>
                <h2 className="font-display text-2xl font-bold mb-4">Factory Listening Room</h2>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Visit our factory in Kent for an exclusive listening experience. 
                  Hear our complete range in purpose-built acoustic environments.
                </p>
                <div className="space-y-2 text-sm">
                  <div><strong>Location:</strong> Kent, United Kingdom</div>
                  <div><strong>Hours:</strong> By appointment only</div>
                  <div><strong>Duration:</strong> 1-2 hours</div>
                </div>
                <Button className="mt-6 w-full" asChild>
                  <Link href="/contact?subject=Factory Visit">Book a Visit</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="p-8">
              <CardHeader>
                <h2 className="font-display text-2xl font-bold mb-4">Authorised Dealers</h2>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Experience Lowther loudspeakers at our network of authorised dealers 
                  across the UK and Europe.
                </p>
                <div className="space-y-2 text-sm">
                  <div><strong>Locations:</strong> UK, Germany, Netherlands</div>
                  <div><strong>Services:</strong> Demo, consultation, installation</div>
                  <div><strong>Support:</strong> Local expertise and service</div>
                </div>
                <Button variant="outline" className="mt-6 w-full" asChild>
                  <Link href="/contact?subject=Dealer Locator">Find a Dealer</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Home Demonstration */}
          <Card className="mb-12">
            <CardContent className="p-8 text-center">
              <h2 className="font-display text-2xl font-bold mb-4">
                Home Demonstration
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                For serious buyers, we offer home demonstrations in selected areas. 
                Experience Lowther loudspeakers in your own listening environment.
              </p>
              <Button size="lg" asChild>
                <Link href="/contact?subject=Home Demo">Arrange Demo</Link>
              </Button>
            </CardContent>
          </Card>

          {/* What to Expect */}
          <div className="mb-12">
            <h2 className="font-display text-2xl font-bold mb-8 text-center">
              What to Expect
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                  🎵
                </div>
                <h3 className="font-display font-semibold mb-2">Music Selection</h3>
                <p className="text-sm text-muted-foreground">
                  Bring your favourite recordings to hear how they sound on Lowther loudspeakers
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                  🏠
                </div>
                <h3 className="font-display font-semibold mb-2">Room Discussion</h3>
                <p className="text-sm text-muted-foreground">
                  Learn about positioning and room acoustics for optimal performance
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                  💬
                </div>
                <h3 className="font-display font-semibold mb-2">Expert Consultation</h3>
                <p className="text-sm text-muted-foreground">
                  Get personalised advice from our team of acoustic engineers
                </p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="text-center">
            <h2 className="font-display text-2xl font-bold mb-4">
              Ready to Listen?
            </h2>
            <p className="text-muted-foreground mb-6">
              Contact us to arrange your Lowther listening experience.
            </p>
            <Button size="lg" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
