
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Hash, Clock, Eye, EyeOff, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThoughtCardProps {
  thought: {
    id: string;
    title: string;
    content: string;
    hash: string;
    timestamp: Date;
    isPrivate: boolean;
    onChain: boolean;
    txid?: string;
  };
}

const ThoughtCard = ({ thought }: ThoughtCardProps) => {
  const [showContent, setShowContent] = useState(!thought.isPrivate);
  const [hashCopied, setHashCopied] = useState(false);

  const copyHash = async () => {
    await navigator.clipboard.writeText(thought.hash);
    setHashCopied(true);
    setTimeout(() => setHashCopied(false), 2000);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{thought.title}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={thought.onChain ? "default" : "secondary"}>
              {thought.onChain ? "On-Chain" : "Pending"}
            </Badge>
            <Badge variant={thought.isPrivate ? "outline" : "secondary"}>
              {thought.isPrivate ? "Private" : "Public"}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          {formatDate(thought.timestamp)}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {thought.isPrivate && (
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
            <span className="text-sm text-gray-600">Content is private</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowContent(!showContent)}
              className="flex items-center gap-2"
            >
              {showContent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showContent ? "Hide" : "Show"}
            </Button>
          </div>
        )}
        
        {showContent && (
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{thought.content}</p>
          </div>
        )}
        
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Cryptographic Proof</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyHash}
              className="flex items-center gap-2"
            >
              {hashCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {hashCopied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <Hash className="h-4 w-4 text-purple-600 flex-shrink-0" />
            <code className="text-xs font-mono text-gray-600 break-all bg-white px-2 py-1 rounded">
              {thought.hash}
            </code>
          </div>
          {thought.txid && (
            <div className="text-xs text-gray-500 mt-2">
              <strong>Transaction ID:</strong> {thought.txid}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ThoughtCard;
