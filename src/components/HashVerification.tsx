
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Shield, Check, X, FileText, Scan } from 'lucide-react';
import { generateHashForVerification, generateFileHash } from '@/utils/cryptoUtils';
import { toast } from '@/hooks/use-toast';
import MediaUpload from './MediaUpload';

const HashVerification = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [expectedHash, setExpectedHash] = useState('');
  const [verificationResult, setVerificationResult] = useState<{ verified: boolean; generatedHash: string } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    if (!title.trim() || (!content.trim() && !selectedFile) || !expectedHash.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a title, content or file, and the expected hash to verify.",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    
    try {
      // Generate combined hash of title, content, and media
      const generatedHash = await generateHashForVerification(title, content, selectedFile || undefined);

      const verified = generatedHash === expectedHash.trim();
      
      setVerificationResult({ verified, generatedHash });
      
      const hasMedia = selectedFile ? " with media" : "";
      const hasContent = content.trim() ? " with content" : "";
      const description = `title${hasContent}${hasMedia}`;
      
      toast({
        title: verified ? "Hash Verified!" : "Hash Mismatch",
        description: verified 
          ? `The hash matches your ${description}.` 
          : `The generated hash doesn't match the expected hash for your ${description}.`,
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
    setSelectedFile(null);
    setExpectedHash('');
    setVerificationResult(null);
  };

  const renderVerificationResult = () => {
    if (!verificationResult) return null;

    return (
      <div className={`crypto-card p-6 ${verificationResult.verified ? 'verified-badge' : 'unverified-badge'} bg-opacity-10`}>
        <div className="flex items-center gap-3 mb-4">
          {verificationResult.verified ? (
            <div className="flex items-center gap-2">
              <Check className="h-6 w-6 text-crypto-green animate-pulse-glow" />
              <span className="verified-badge font-semibold">
                Verified
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <X className="h-6 w-6 text-red-400 animate-pulse" />
              <span className="unverified-badge font-semibold">
                Mismatch
              </span>
            </div>
          )}
        </div>
        <div className="space-y-4">
          <div>
            <span className="text-sm font-medium text-muted-foreground">Generated Hash:</span>
            <div className="hash-display mt-2 relative overflow-hidden">
              {verificationResult.generatedHash}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-scan"></div>
            </div>
          </div>
          <div>
            <span className="text-sm font-medium text-muted-foreground">Expected Hash:</span>
            <div className="hash-display mt-2">
              {expectedHash}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
  const hasContent = content.trim() || selectedFile;

  return (
    <Card className="w-full max-w-4xl mx-auto crypto-card hex-pattern">
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-crypto-green/20 to-crypto-blue/20 rounded-lg border border-primary/30">
            <Shield className="h-6 w-6 text-crypto-green animate-pulse-glow" />
          </div>
          <span className="crypto-gradient-text text-2xl font-bold">Hash Verification</span>
        </CardTitle>
        <div className="absolute top-4 right-4">
          <div className="w-3 h-3 bg-crypto-green rounded-full animate-pulse"></div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="crypto-input">
          <Input
            placeholder="Title (cryptographic key identifier)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-medium bg-muted/50 border-primary/30"
          />
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="h-4 w-4 text-crypto-blue" />
            <span>Content verification (optional if uploading media)</span>
          </div>
          
          <div className="crypto-input">
            <Textarea
              placeholder="Enter the content to verify against the hash..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[150px] resize-none bg-muted/50 border-primary/30"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 text-crypto-purple" />
            <span>Media verification (optional - hash will be computed)</span>
          </div>
          <div className="blockchain-block">
            <MediaUpload 
              onMediaSelected={setSelectedFile} 
              selectedFile={selectedFile}
            />
          </div>
        </div>
        
        <div className="crypto-input">
          <Input
            placeholder="Expected Hash (SHA-256)"
            value={expectedHash}
            onChange={(e) => setExpectedHash(e.target.value)}
            className="font-mono bg-muted/50 border-primary/30"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {content && (
              <Badge variant="outline" className="border-crypto-green/30 text-crypto-green bg-crypto-green/10">
                {wordCount} words
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              onClick={handleVerify}
              disabled={!title.trim() || !hasContent || !expectedHash.trim() || isVerifying}
              className="neon-button text-white font-semibold px-6 py-3"
            >
              <span className="flex items-center gap-2">
                {isVerifying ? (
                  <>
                    <Scan className="h-5 w-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield className="h-5 w-5" />
                    Verify Hash
                  </>
                )}
              </span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={clearForm}
              className="border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
            >
              Clear Form
            </Button>
          </div>
        </div>
        
        <div className="blockchain-block bg-gradient-to-r from-crypto-blue/10 to-crypto-purple/10 border-crypto-blue/20">
          <p className="text-sm text-muted-foreground">
            <strong className="text-crypto-blue">Verification Protocol:</strong> Enter the same title and content/media used when creating the proof. 
            The cryptographic hash will be computed and compared against your expected hash for integrity validation.
          </p>
        </div>
        
        {renderVerificationResult()}
      </CardContent>
    </Card>
  );
};

export default HashVerification;
