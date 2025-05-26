import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ThoughtEditor from '@/components/ThoughtEditor';
import HashVerification from '@/components/HashVerification';
import TokenBrowser from '@/components/TokenBrowser';
import { generateHash, submitToBlockchain, ThoughtData } from '@/utils/cryptoUtils';
import { toast } from '@/hooks/use-toast';
import { Shield, Lock, Database } from 'lucide-react';

interface Thought {
  id: string;
  title: string;
  content: string;
  hash: string;
  timestamp: Date;
  isPrivate: boolean;
  onChain: boolean;
  txid?: string; // Transaction ID from blockchain
}

const Index = () => {
  const [thoughts, setThoughts] = useState<Thought[]>([]);

  // Load thoughts from localStorage on component mount
  useEffect(() => {
    const savedThoughts = localStorage.getItem('cryptoThoughts');
    if (savedThoughts) {
      const parsed = JSON.parse(savedThoughts);
      // Convert timestamp strings back to Date objects
      const thoughtsWithDates = parsed.map((thought: any) => ({
        ...thought,
        timestamp: new Date(thought.timestamp)
      }));
      setThoughts(thoughtsWithDates);
    }
  }, []);

  // Save thoughts to localStorage whenever thoughts change
  useEffect(() => {
    localStorage.setItem('cryptoThoughts', JSON.stringify(thoughts));
  }, [thoughts]);

  const handleSubmitThought = async (thoughtData: ThoughtData) => {
    try {
      // Generate cryptographic hash
      const hash = await generateHash(thoughtData);
      
      const newThought: Thought = {
        id: crypto.randomUUID(),
        title: thoughtData.title,
        content: thoughtData.content,
        hash,
        timestamp: new Date(),
        isPrivate: thoughtData.isPrivate,
        onChain: false
      };

      // Add to local state immediately
      setThoughts(prev => [newThought, ...prev]);

      toast({
        title: "Thought Created",
        description: "Your thought has been hashed and is being submitted to the blockchain.",
      });

      // Submit to blockchain in background
      try {
        const txid = await submitToBlockchain(hash);
        
        // Update the thought to mark it as on-chain with transaction ID
        setThoughts(prev => 
          prev.map(thought => 
            thought.id === newThought.id 
              ? { ...thought, onChain: true, txid }
              : thought
          )
        );

        toast({
          title: "Blockchain Proof Created",
          description: `Your thought proof has been recorded on-chain. TX: ${txid}`,
        });
      } catch (blockchainError) {
        console.error('Blockchain submission failed:', blockchainError);
        toast({
          title: "Blockchain Error",
          description: "Failed to submit to blockchain, but your hash has been saved locally.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error creating thought:', error);
      toast({
        title: "Error",
        description: "Failed to create thought proof. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%239C92AC%22%20fill-opacity=%220.05%22%3E%3Ccircle%20cx=%2230%22%20cy=%2230%22%20r=%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      {/* Glowing orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block relative">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-6 tracking-tight">
              Immutify
            </h1>
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/20 via-purple-400/20 to-blue-400/20 blur-lg rounded-lg"></div>
          </div>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
            Publish your ideas with{" "}
            <span className="text-cyan-400 font-semibold">cryptographic proof</span>{" "}
            of existence. Create a verifiable timestamp without revealing your content to the world.
          </p>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 backdrop-blur-sm">
                <Shield className="h-8 w-8 text-cyan-400 mx-auto mb-3" />
                <h3 className="text-slate-200 font-semibold mb-2">Immutable Proof</h3>
                <p className="text-slate-400 text-sm">Your ideas are cryptographically secured on the blockchain</p>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 backdrop-blur-sm">
                <Lock className="h-8 w-8 text-purple-400 mx-auto mb-3" />
                <h3 className="text-slate-200 font-semibold mb-2">Private by Design</h3>
                <p className="text-slate-400 text-sm">Only you know the content, the world sees the proof</p>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 backdrop-blur-sm">
                <Database className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                <h3 className="text-slate-200 font-semibold mb-2">Decentralized</h3>
                <p className="text-slate-400 text-sm">No central authority, no single point of failure</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content with Tabs */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-blue-500/20 rounded-2xl blur-lg"></div>
          <div className="relative bg-slate-800/30 border border-slate-700/50 rounded-2xl backdrop-blur-xl p-8">
            <Tabs defaultValue="create" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8 bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
                <TabsTrigger 
                  value="create" 
                  className="data-[state=active]:bg-cyan-500/30 data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-cyan-400/50 data-[state=active]:shadow-lg text-slate-300 hover:text-slate-200 transition-all duration-200"
                >
                  Create Proof
                </TabsTrigger>
                <TabsTrigger 
                  value="verify" 
                  className="data-[state=active]:bg-purple-500/30 data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-purple-400/50 data-[state=active]:shadow-lg text-slate-300 hover:text-slate-200 transition-all duration-200"
                >
                  Verify Hash
                </TabsTrigger>
                <TabsTrigger 
                  value="browse" 
                  className="data-[state=active]:bg-blue-500/30 data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-blue-400/50 data-[state=active]:shadow-lg text-slate-300 hover:text-slate-200 transition-all duration-200"
                >
                  Browse Tokens
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="create" className="space-y-6">
                <ThoughtEditor onSubmit={handleSubmitThought} />
              </TabsContent>
              
              <TabsContent value="verify" className="space-y-6">
                <HashVerification />
              </TabsContent>
              
              <TabsContent value="browse" className="space-y-6">
                <TokenBrowser />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pb-8">
          <p className="text-slate-500 text-sm">
            Powered by blockchain technology • Built for creators and innovators
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
