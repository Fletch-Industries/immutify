
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Check, X, FileText, Upload } from 'lucide-react';
import { generateHashForVerification, generateFileHash } from '@/utils/cryptoUtils';
import { toast } from '@/hooks/use-toast';
import MediaUpload from './MediaUpload';

const HashVerification = () => {
  // Text verification state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [expectedHash, setExpectedHash] = useState('');
  const [verificationResult, setVerificationResult] = useState<{ verified: boolean; generatedHash: string } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // File verification state
  const [fileTitle, setFileTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileExpectedHash, setFileExpectedHash] = useState('');
  const [fileVerificationResult, setFileVerificationResult] = useState<{ verified: boolean; generatedHash: string } | null>(null);
  const [isVerifyingFile, setIsVerifyingFile] = useState(false);

  const handleVerifyText = async () => {
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

  const handleVerifyFile = async () => {
    if (!fileTitle.trim() || !selectedFile || !fileExpectedHash.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a title, select a file, and enter the expected hash.",
        variant: "destructive"
      });
      return;
    }

    setIsVerifyingFile(true);
    
    try {
      const generatedHash = await generateFileHash(selectedFile, fileTitle);
      const verified = generatedHash === fileExpectedHash.trim();
      
      setFileVerificationResult({ verified, generatedHash });
      
      toast({
        title: verified ? "File Hash Verified!" : "File Hash Mismatch",
        description: verified 
          ? "The file hash matches the expected hash." 
          : "The generated file hash doesn't match the expected hash.",
        variant: verified ? "default" : "destructive"
      });
    } catch (error) {
      console.error('File verification error:', error);
      toast({
        title: "File Verification Error",
        description: "Failed to verify file hash. Please check your inputs.",
        variant: "destructive"
      });
    } finally {
      setIsVerifyingFile(false);
    }
  };

  const clearTextForm = () => {
    setTitle('');
    setContent('');
    setExpectedHash('');
    setVerificationResult(null);
  };

  const clearFileForm = () => {
    setFileTitle('');
    setSelectedFile(null);
    setFileExpectedHash('');
    setFileVerificationResult(null);
  };

  const renderVerificationResult = (result: { verified: boolean; generatedHash: string } | null, expectedHash: string) => {
    if (!result) return null;

    return (
      <div className={`border rounded-lg p-4 ${result.verified ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
        <div className="flex items-center gap-2 mb-2">
          {result.verified ? (
            <Check className="h-5 w-5 text-green-600" />
          ) : (
            <X className="h-5 w-5 text-red-600" />
          )}
          <Badge variant={result.verified ? "default" : "destructive"}>
            {result.verified ? "Verified" : "Mismatch"}
          </Badge>
        </div>
        <div className="space-y-2">
          <div>
            <span className="text-sm font-medium">Generated Hash:</span>
            <code className="block text-xs font-mono mt-1 p-2 bg-white rounded border">
              {result.generatedHash}
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

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          Hash Verification
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="text" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="text" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Text Content
            </TabsTrigger>
            <TabsTrigger value="file" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              File Upload
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="space-y-4">
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
                onClick={handleVerifyText}
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
              
              <Button variant="outline" onClick={clearTextForm}>
                Clear Form
              </Button>
            </div>
            
            {renderVerificationResult(verificationResult, expectedHash)}
          </TabsContent>
          
          <TabsContent value="file" className="space-y-4">
            <Input
              placeholder="Title (used as hash key)"
              value={fileTitle}
              onChange={(e) => setFileTitle(e.target.value)}
            />
            
            <MediaUpload
              onMediaSelected={setSelectedFile}
              selectedFile={selectedFile}
            />
            
            <Input
              placeholder="Expected File Hash"
              value={fileExpectedHash}
              onChange={(e) => setFileExpectedHash(e.target.value)}
            />
            
            <div className="flex items-center gap-4">
              <Button 
                onClick={handleVerifyFile}
                disabled={isVerifyingFile}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isVerifyingFile ? (
                  <>
                    <Shield className="h-4 w-4 mr-2 animate-spin" />
                    Verifying File...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Verify File Hash
                  </>
                )}
              </Button>
              
              <Button variant="outline" onClick={clearFileForm}>
                Clear Form
              </Button>
            </div>
            
            {renderVerificationResult(fileVerificationResult, fileExpectedHash)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default HashVerification;
