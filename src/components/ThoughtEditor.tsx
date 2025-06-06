
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
    <Card className="w-full max-w-4xl mx-auto theme-card theme-circuit">
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-theme-primary/20 to-theme-secondary/20 rounded-lg border border-primary/30">
            <Hash className="h-6 w-6 text-theme-primary animate-pulse-glow" />
          </div>
          <span className="theme-gradient-text text-2xl font-bold">Create Immutable Proof</span>
        </CardTitle>
        <div className="absolute top-4 right-4 flex gap-2">
          <div className="w-3 h-3 bg-theme-primary rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-theme-secondary rounded-full animate-pulse delay-150"></div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="theme-input">
          <Input
            placeholder="Enter a cryptographic identifier for your proof..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-medium bg-muted/50 border-primary/30"
          />
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="h-4 w-4 text-theme-secondary" />
            <span>Thought content (optional if uploading media)</span>
          </div>
          
          <div className="theme-input">
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
            <Hash className="h-4 w-4 text-theme-accent" />
            <span>Media attachment (optional - only hash stored on-chain)</span>
          </div>
          <div className="theme-block">
            <MediaUpload 
              onMediaSelected={setSelectedFile} 
              selectedFile={selectedFile}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {content && (
              <Badge variant="outline" className="border-theme-primary/30 text-theme-primary bg-theme-primary/10">
                {wordCount} words
              </Badge>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPrivate(!isPrivate)}
              className={`flex items-center gap-2 border transition-all duration-300 ${
                isPrivate 
                  ? 'border-theme-orange/30 text-theme-orange bg-theme-orange/10 hover:bg-theme-orange/20 hover:text-foreground' 
                  : 'border-theme-accent/30 text-theme-accent bg-theme-accent/10 hover:bg-theme-accent/20 hover:text-foreground'
              }`}
            >
              {isPrivate ? <Lock className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
              {isPrivate ? 'Private' : 'Public'}
            </Button>
          </div>
          
          <Button 
            onClick={handleSubmit}
            disabled={!title.trim() || !hasContent || isSubmitting}
            className="theme-button text-white font-semibold px-6 py-3"
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
          <div className="theme-block bg-gradient-to-r from-theme-orange/10 to-theme-primary/10 border-theme-orange/20">
            <p className="text-sm text-muted-foreground">
              <strong className="text-theme-orange">Private Mode:</strong> Only the cryptographic hash will be stored on-chain. 
              Your content and media files remain private but provably existed at this timestamp.
            </p>
          </div>
        ) : (
          <div className="theme-block bg-gradient-to-r from-theme-accent/10 to-theme-secondary/10 border-theme-accent/20">
            <p className="text-sm text-muted-foreground">
              <strong className="text-theme-accent">Public Mode:</strong> Your text content will be published directly on the blockchain.
              Media files will only have their hash stored on-chain for privacy.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ThoughtEditor;
