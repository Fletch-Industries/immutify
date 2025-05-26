
import React from 'react';
import ThoughtCard from './ThoughtCard';
import { Card, CardContent } from '@/components/ui/card';
import { Hash } from 'lucide-react';

interface ThoughtListProps {
  thoughts: Array<{
    id: string;
    title: string;
    content: string;
    hash: string;
    timestamp: Date;
    isPrivate: boolean;
    onChain: boolean;
  }>;
}

const ThoughtList = ({ thoughts }: ThoughtListProps) => {
  if (thoughts.length === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Hash className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No thoughts published yet</h3>
          <p className="text-gray-500">Start by creating your first cryptographically verified thought above.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Published Thoughts</h2>
      {thoughts.map((thought) => (
        <ThoughtCard key={thought.id} thought={thought} />
      ))}
    </div>
  );
};

export default ThoughtList;
