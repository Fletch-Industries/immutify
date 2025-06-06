
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Hash, Shield, Eye, EyeOff, FileText, Lock, Globe } from 'lucide-react';
import MediaUpload from './MediaUpload';

interface ThoughtEditorProps {
  onSubmit: (thought: { title: string; content: string; isPrivate: boolean; mediaFile?: File }) => void;
}

const ThoughtEditor = ({ onSubmit }: ThoughtEditorProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || (!content.trim() && !selectedFile)) return;
    
    setIsSubmitting(true);
    await onSubmit({ 
      title, 
      content, 
      isPrivate, 
      mediaFile: selectedFile || undefined 
    });
    setTitle('');
    setContent('');
    setSelectedFile(null);
    setIsSubmitting(false);
  };

  const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
  const hasContent = content.trim() || selectedFile;

  return (
    <Card className="w-full max-w-4xl mx-auto crypto-card hex-pattern">
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-crypto-purple/20 to-crypto-blue/20 rounded-lg border border-primary/30">
            <Hash className="h-6 w-6 text-crypto-purple animate-pulse-glow" />
          </div>
          <span className="crypto-gradient-text text-2xl font-bold">Create Immutable Proof</span>
        </CardTitle>
        <div className="absolute top-4 right-4 flex gap-2">
          <div className="w-3 h-3 bg-crypto-purple rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-crypto-green rounded-full animate-pulse delay-150"></div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="crypto-input">
          <Input
            placeholder="Enter a cryptographic identifier for your proof..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-medium bg-muted/50 border-primary/30"
          />
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="h-4 w-4 text-crypto-blue" />
            <span>Thought content (optional if uploading media)</span>
          </div>
          
          <div className="crypto-input">
            <Textarea
              placeholder={isPrivate 
                ? "Write your idea, process, or thought here. This will be cryptographically hashed and can serve as immutable proof of existence..."
                : "Write your idea, process, or thought here. This content will be published directly on the blockchain for everyone to see..."
              }
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px] resize-none bg-muted/50 border-primary/30"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Hash className="h-4 w-4 text-crypto-green" />
            <span>Media attachment (optional - only hash stored on-chain)</span>
          </div>
          <div className="blockchain-block">
            <MediaUpload 
              onMediaSelected={setSelectedFile} 
              selectedFile={selectedFile}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {content && (
              <Badge variant="outline" className="border-crypto-green/30 text-crypto-green bg-crypto-green/10">
                {wordCount} words
              </Badge>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPrivate(!isPrivate)}
              className={`flex items-center gap-2 border transition-all duration-300 ${
                isPrivate 
                  ? 'border-crypto-orange/30 text-crypto-orange bg-crypto-orange/10 hover:bg-crypto-orange/20' 
                  : 'border-crypto-cyan/30 text-crypto-cyan bg-crypto-cyan/10 hover:bg-crypto-cyan/20'
              }`}
            >
              {isPrivate ? <Lock className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
              {isPrivate ? 'Private' : 'Public'}
            </Button>
          </div>
          
          <Button 
            onClick={handleSubmit}
            disabled={!title.trim() || !hasContent || isSubmitting}
            className="neon-button text-white font-semibold px-6 py-3"
          >
            <span className="flex items-center gap-2">
              {isSubmitting ? (
                <>
                  <Shield className="h-5 w-5 animate-spin" />
                  {isPrivate ? 'Creating Proof...' : 'Publishing...'}
                </>
              ) : (
                <>
                  <Shield className="h-5 w-5" />
                  {isPrivate ? 'Create Proof' : 'Publish Content'}
                </>
              )}
            </span>
          </Button>
        </div>
        
        {isPrivate ? (
          <div className="blockchain-block bg-gradient-to-r from-crypto-orange/10 to-crypto-green/10 border-crypto-orange/20">
            <p className="text-sm text-muted-foreground">
              <strong className="text-crypto-orange">Private Mode:</strong> Only the cryptographic hash will be stored on-chain. 
              Your content and media files remain private but provably existed at this timestamp.
            </p>
          </div>
        ) : (
          <div className="blockchain-block bg-gradient-to-r from-crypto-cyan/10 to-crypto-blue/10 border-crypto-cyan/20">
            <p className="text-sm text-muted-foreground">
              <strong className="text-crypto-cyan">Public Mode:</strong> Your text content will be published directly on the blockchain.
              Media files will only have their hash stored on-chain for privacy.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ThoughtEditor;
