
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ThoughtEditor from '@/components/ThoughtEditor';
import ThoughtList from '@/components/ThoughtList';
import HashVerification from '@/components/HashVerification';
import TokenBrowser from '@/components/TokenBrowser';
import { generateHash, submitToBlockchain, ThoughtData } from '@/utils/cryptoUtils';
import { toast } from '@/hooks/use-toast';

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            CryptoThoughts
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Publish your ideas with cryptographic proof of existence. 
            Create a verifiable timestamp without revealing your content to the world.
          </p>
        </div>

        {/* Main Content with Tabs */}
        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="create">Create Proof</TabsTrigger>
            <TabsTrigger value="thoughts">My Thoughts</TabsTrigger>
            <TabsTrigger value="verify">Verify Hash</TabsTrigger>
            <TabsTrigger value="browse">Browse Tokens</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="space-y-6">
            <ThoughtEditor onSubmit={handleSubmitThought} />
          </TabsContent>
          
          <TabsContent value="thoughts" className="space-y-6">
            <ThoughtList thoughts={thoughts} />
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
  );
};

export default Index;
