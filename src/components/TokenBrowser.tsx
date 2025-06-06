
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, RefreshCw, Copy, Check, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { HelloWorldToken, queryAllTokens } from '@/utils/cryptoUtils';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const TokenBrowser = () => {
  const [tokens, setTokens] = useState<HelloWorldToken[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(20);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [hasMore, setHasMore] = useState(true);
  const [showWalletDialog, setShowWalletDialog] = useState(false);

  const loadTokens = async (page: number = 1, reset: boolean = false) => {
    setIsLoading(true);
    try {
      const skip = (page - 1) * limit;
      const fetchedTokens = await queryAllTokens({
        limit: limit + 1, // Fetch one extra to check if there are more
        skip,
        sortOrder
      });
      
      // Check if there are more tokens
      const hasMoreTokens = fetchedTokens.length > limit;
      setHasMore(hasMoreTokens);
      
      // Remove the extra token if present
      const tokensToShow = hasMoreTokens ? fetchedTokens.slice(0, limit) : fetchedTokens;
      
      if (reset || page === 1) {
        setTokens(tokensToShow);
      } else {
        setTokens(prev => [...prev, ...tokensToShow]);
      }
      
      toast({
        title: "Tokens Loaded",
        description: `Found ${tokensToShow.length} tokens (page ${page}).`,
      });
    } catch (error) {
      console.error('Error loading tokens:', error);
      
      // Check for wallet error
      if (error instanceof Error && error.message.includes("No wallet available over any communication substrate")) {
        setShowWalletDialog(true);
      } else {
        toast({
          title: "Error",
          description: "Failed to load tokens from blockchain.",
          variant: "destructive"
        });
      }
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

  const handleNextPage = () => {
    if (hasMore && !isLoading) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      loadTokens(nextPage);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1 && !isLoading) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      loadTokens(prevPage, true);
    }
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    loadTokens(1, true);
  };

  const handleSortChange = (newSortOrder: 'asc' | 'desc') => {
    setSortOrder(newSortOrder);
    setCurrentPage(1);
    loadTokens(1, true);
  };

  useEffect(() => {
    loadTokens();
  }, [sortOrder]);

  return (
    <>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Search className="h-5 w-5 text-theme-primary" />
              Blockchain Token Browser
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Button
                  onClick={() => handleSortChange('desc')}
                  variant={sortOrder === 'desc' ? 'default' : 'outline'}
                  size="sm"
                >
                  Newest
                </Button>
                <Button
                  onClick={() => handleSortChange('asc')}
                  variant={sortOrder === 'asc' ? 'default' : 'outline'}
                  size="sm"
                >
                  Oldest
                </Button>
              </div>
              <Button 
                onClick={handleRefresh}
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
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && currentPage === 1 ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Loading tokens from blockchain...</p>
            </div>
          ) : tokens.length === 0 ? (
            <div className="text-center py-8">
              <Search className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No tokens found on the blockchain.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="secondary">
                  Page {currentPage} • {tokens.length} tokens
                </Badge>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1 || isLoading}
                    variant="outline"
                    size="sm"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    onClick={handleNextPage}
                    disabled={!hasMore || isLoading}
                    variant="outline"
                    size="sm"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {tokens.map((token, index) => (
                <div key={`${token.token.txid}-${token.token.outputIndex}`} className="border border-border rounded-lg p-4 bg-card">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-foreground">
                          Token #{(currentPage - 1) * limit + index + 1}
                        </span>
                        <Badge variant="outline">
                          {token.token.satoshis} sats
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Message (Hash):</span>
                          <div className="flex items-center gap-2 mt-1">
                            <code className="text-xs font-mono bg-muted px-2 py-1 rounded flex-1 break-all text-muted-foreground">
                              {token.message}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyHash(token.message)}
                            >
                              {copiedHash === token.message ? (
                                <Check className="h-4 w-4 text-theme-primary" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Transaction ID:</span>
                          <code className="block text-xs font-mono bg-muted px-2 py-1 rounded mt-1 break-all text-muted-foreground">
                            {token.token.txid}
                          </code>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Output Index: {token.token.outputIndex}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && currentPage > 1 && (
                <div className="text-center py-4">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showWalletDialog} onOpenChange={setShowWalletDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Wallet Required</AlertDialogTitle>
            <AlertDialogDescription>
              You need to install the Metanet Desktop Client before continuing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowWalletDialog(false)}>
              Dismiss
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <a 
                href="https://metanet.bsvb.tech/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                Install Metanet Desktop Client
                <ExternalLink className="h-4 w-4" />
              </a>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TokenBrowser;
