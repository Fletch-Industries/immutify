
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Shield, Check, X } from 'lucide-react';
import { generateHashForVerification } from '@/utils/cryptoUtils';
import { toast } from '@/hooks/use-toast';

const HashVerification = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [expectedHash, setExpectedHash] = useState('');
  const [verificationResult, setVerificationResult] = useState<{ verified: boolean; generatedHash: string } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    if (!title.trim() || !content.trim() || !expectedHash.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to verify the hash.",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    
    try {
      const generatedHash = await generateHashForVerification(title, content);
      const verified = generatedHash === expectedHash.trim();
      
      setVerificationResult({ verified, generatedHash });
      
      toast({
        title: verified ? "Hash Verified!" : "Hash Mismatch",
        description: verified 
          ? "The hash matches your input data." 
          : "The generated hash doesn't match the expected hash.",
        variant: verified ? "default" : "destructive"
      });
    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: "Verification Error",
        description: "Failed to verify hash. Please check your inputs.",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const clearForm = () => {
    setTitle('');
    setContent('');
    setExpectedHash('');
    setVerificationResult(null);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          Hash Verification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Title (used as hash key)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        
        <Textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[150px]"
        />
        
        <Input
          placeholder="Expected Hash"
          value={expectedHash}
          onChange={(e) => setExpectedHash(e.target.value)}
        />
        
        <div className="flex items-center gap-4">
          <Button 
            onClick={handleVerify}
            disabled={isVerifying}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isVerifying ? (
              <>
                <Shield className="h-4 w-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Verify Hash
              </>
            )}
          </Button>
          
          <Button variant="outline" onClick={clearForm}>
            Clear Form
          </Button>
        </div>
        
        {verificationResult && (
          <div className={`border rounded-lg p-4 ${verificationResult.verified ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              {verificationResult.verified ? (
                <Check className="h-5 w-5 text-green-600" />
              ) : (
                <X className="h-5 w-5 text-red-600" />
              )}
              <Badge variant={verificationResult.verified ? "default" : "destructive"}>
                {verificationResult.verified ? "Verified" : "Mismatch"}
              </Badge>
            </div>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium">Generated Hash:</span>
                <code className="block text-xs font-mono mt-1 p-2 bg-white rounded border">
                  {verificationResult.generatedHash}
                </code>
              </div>
              <div>
                <span className="text-sm font-medium">Expected Hash:</span>
                <code className="block text-xs font-mono mt-1 p-2 bg-white rounded border">
                  {expectedHash}
                </code>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HashVerification;
