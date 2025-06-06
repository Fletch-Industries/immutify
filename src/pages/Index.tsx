
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Hash, Shield, Clock, FileText, Search, Database } from "lucide-react";
import ThoughtEditor from "@/components/ThoughtEditor";
import ThoughtList from "@/components/ThoughtList";
import HashVerification from "@/components/HashVerification";
import TokenBrowser from "@/components/TokenBrowser";

const Index = () => {
  const [thoughts, setThoughts] = useState<Array<{
    id: string;
    title: string;
    content: string;
    hash: string;
    timestamp: Date;
    isPrivate: boolean;
    onChain: boolean;
    txid?: string;
  }>>([]);

  const addThought = (thought: {
    id: string;
    title: string;
    content: string;
    hash: string;
    timestamp: Date;
    isPrivate: boolean;
    onChain: boolean;
    txid?: string;
  }) => {
    setThoughts(prev => [thought, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 circuit-pattern opacity-30" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Hash className="h-8 w-8 text-business-primary" />
            <h1 className="text-4xl font-bold crypto-gradient-text">
              CryptoThoughts
            </h1>
          </div>
          <p className="text-xl text-business-secondary max-w-2xl mx-auto">
            Secure your thoughts with cryptographic verification. Create immutable records of your ideas with blockchain-backed integrity.
          </p>
        </div>

        <Tabs defaultValue="create" className="w-full max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="create" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Create
            </TabsTrigger>
            <TabsTrigger value="thoughts" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Thoughts
            </TabsTrigger>
            <TabsTrigger value="verify" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Verify
            </TabsTrigger>
            <TabsTrigger value="tokens" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Tokens
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-8">
            <Card className="crypto-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Create New Thought
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ThoughtEditor onSave={addThought} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="thoughts" className="space-y-8">
            <ThoughtList thoughts={thoughts} />
          </TabsContent>

          <TabsContent value="verify" className="space-y-8">
            <Card className="crypto-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Hash Verification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <HashVerification />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tokens" className="space-y-8">
            <Card className="crypto-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Token Browser
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TokenBrowser />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="crypto-card">
            <CardContent className="p-6 text-center">
              <Hash className="h-12 w-12 text-business-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Cryptographic Security</h3>
              <p className="text-business-secondary">
                Each thought is secured with SHA-256 hashing for immutable verification
              </p>
            </CardContent>
          </Card>

          <Card className="crypto-card">
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 text-business-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Privacy Control</h3>
              <p className="text-business-secondary">
                Choose between public verification or private thought storage
              </p>
            </CardContent>
          </Card>

          <Card className="crypto-card">
            <CardContent className="p-6 text-center">
              <Clock className="h-12 w-12 text-business-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Timestamp Proof</h3>
              <p className="text-business-secondary">
                Immutable timestamps prove when your thoughts were created
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
