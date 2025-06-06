import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Shield, Check, X, FileText } from 'lucide-react';
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
    );
  };

  const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
  const hasContent = content.trim() || selectedFile;

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
          className="text-lg font-medium"
        />
        
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <FileText className="h-4 w-4" />
            <span>Add text content (optional if uploading media)</span>
          </div>
          
          <Textarea
            placeholder="Enter the content you want to verify..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[150px] resize-none"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Shield className="h-4 w-4" />
            <span>Upload media (optional - will be hashed for verification)</span>
          </div>
          <MediaUpload 
            onMediaSelected={setSelectedFile} 
            selectedFile={selectedFile}
          />
        </div>
        
        <Input
          placeholder="Expected Hash"
          value={expectedHash}
          onChange={(e) => setExpectedHash(e.target.value)}
        />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {content && (
              <Badge variant="outline" className="text-sm">
                {wordCount} words
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              onClick={handleVerify}
              disabled={!title.trim() || !hasContent || !expectedHash.trim() || isVerifying}
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
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>Verification:</strong> Enter the same title and content/media used when creating the proof. 
            The generated hash will be compared against your expected hash.
          </p>
        </div>
        
        {renderVerificationResult()}
      </CardContent>
    </Card>
  );
};

export default HashVerification;
