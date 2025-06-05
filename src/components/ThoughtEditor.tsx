
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Hash, Shield, Eye, EyeOff, FileText } from 'lucide-react';
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
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hash className="h-5 w-5 text-purple-600" />
          Publish Your Thought
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Enter a title for your thought..."
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
            placeholder={isPrivate 
              ? "Write your idea, process, or thought here. This will be cryptographically hashed and can serve as proof of existence..."
              : "Write your idea, process, or thought here. This content will be published directly on the blockchain for everyone to see..."
            }
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[200px] resize-none"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Hash className="h-4 w-4" />
            <span>Upload media (optional - only hash will be stored on-chain)</span>
          </div>
          <MediaUpload 
            onMediaSelected={setSelectedFile} 
            selectedFile={selectedFile}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {content && (
              <Badge variant="outline" className="text-sm">
                {wordCount} words
              </Badge>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPrivate(!isPrivate)}
              className="flex items-center gap-2"
            >
              {isPrivate ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {isPrivate ? 'Private' : 'Public'}
            </Button>
          </div>
          
          <Button 
            onClick={handleSubmit}
            disabled={!title.trim() || !hasContent || isSubmitting}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {isSubmitting ? (
              <>
                <Shield className="h-4 w-4 mr-2 animate-spin" />
                {isPrivate ? 'Creating Proof...' : 'Publishing...'}
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                {isPrivate ? 'Create Proof' : 'Publish Content'}
              </>
            )}
          </Button>
        </div>
        
        {isPrivate ? (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-sm text-amber-800">
              <strong>Private Mode:</strong> Only the cryptographic hash will be stored on-chain. 
              Your content and media files remain private but provably existed at this timestamp.
            </p>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Public Mode:</strong> Your text content will be published directly on the blockchain.
              Media files will only have their hash stored on-chain for privacy.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ThoughtEditor;
