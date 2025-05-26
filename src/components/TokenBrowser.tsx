
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, RefreshCw, Copy, Check } from 'lucide-react';
import { HelloWorldToken, queryAllTokens } from '@/utils/cryptoUtils';
import { toast } from '@/hooks/use-toast';

const TokenBrowser = () => {
  const [tokens, setTokens] = useState<HelloWorldToken[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const loadTokens = async () => {
    setIsLoading(true);
    try {
      const fetchedTokens = await queryAllTokens();
      setTokens(fetchedTokens);
      toast({
        title: "Tokens Loaded",
        description: `Found ${fetchedTokens.length} tokens on the blockchain.`,
      });
    } catch (error) {
      console.error('Error loading tokens:', error);
      toast({
        title: "Error",
        description: "Failed to load tokens from blockchain.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyHash = async (hash: string) => {
    await navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
    toast({
      title: "Copied",
      description: "Hash copied to clipboard.",
    });
  };

  useEffect(() => {
    loadTokens();
  }, []);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-green-600" />
            Blockchain Token Browser
          </CardTitle>
          <Button 
            onClick={loadTokens}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">Loading tokens from blockchain...</p>
          </div>
        ) : tokens.length === 0 ? (
          <div className="text-center py-8">
            <Search className="h-8 w-8 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">No tokens found on the blockchain.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="secondary">{tokens.length} tokens found</Badge>
            </div>
            {tokens.map((token, index) => (
              <div key={`${token.token.txid}-${token.token.outputIndex}`} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium">Token #{index + 1}</span>
                      <Badge variant="outline">
                        {token.token.satoshis} sats
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-600">Message (Hash):</span>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded flex-1 break-all">
                            {token.message}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyHash(token.message)}
                          >
                            {copiedHash === token.message ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Transaction ID:</span>
                        <code className="block text-xs font-mono bg-gray-100 px-2 py-1 rounded mt-1 break-all">
                          {token.token.txid}
                        </code>
                      </div>
                      <div className="text-xs text-gray-500">
                        Output Index: {token.token.outputIndex}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TokenBrowser;
