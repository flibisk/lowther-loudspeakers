"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const isWalletFeatureEnabled = process.env.NEXT_PUBLIC_FEATURE_WALLET === "true";

export default function WalletPage() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [serialInput, setSerialInput] = useState("");
  const [keySequence, setKeySequence] = useState<string[]>([]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "g" || event.key === "w") {
        setKeySequence(prev => {
          const newSequence = [...prev, event.key];
          // Keep only last 2 keys
          const latest = newSequence.slice(-2);
          
          // Check for "gw" sequence
          if (latest.join("") === "gw") {
            setIsUnlocked(true);
          }
          
          return latest;
        });
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const handleSerialSubmit = () => {
    if (serialInput.trim()) {
      window.location.href = `/verify/${serialInput.trim()}`;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">🔗</span>
          </div>
          <h1 className="font-display text-2xl font-bold">Lowther Labs</h1>
          <p className="text-muted-foreground">
            {!isUnlocked ? "Access Restricted" : "Wallet Connect"}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {!isUnlocked ? (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                This area is restricted. Use keyboard shortcut to access.
              </p>
              <div className="space-y-2">
                <Badge variant="outline">Press G + W</Badge>
                <p className="text-xs text-muted-foreground">
                  Key sequence: {keySequence.join("") || "..."}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <Badge className="mb-4">Access Granted</Badge>
                <p className="text-sm text-muted-foreground">
                  Welcome to Lowther Labs. This area is under development.
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Connect Wallet</h3>
                  <Button 
                    disabled={!isWalletFeatureEnabled}
                    className="w-full"
                  >
                    {isWalletFeatureEnabled ? "Connect Wallet" : "Feature Disabled"}
                  </Button>
                  {!isWalletFeatureEnabled && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Wallet feature is currently disabled
                    </p>
                  )}
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Verify Serial Number</h3>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter Lowther serial"
                      value={serialInput}
                      onChange={(e) => setSerialInput(e.target.value)}
                    />
                    <Button 
                      onClick={handleSerialSubmit}
                      disabled={!serialInput.trim()}
                    >
                      Verify
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Check authenticity of your Lowther loudspeaker
                  </p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground text-center">
                  This is a development area for future blockchain features.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
