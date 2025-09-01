import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import FlashcardGenerator from '@/components/FlashcardGenerator';

const Generator = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-4 py-6 border-b border-border">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Flashcard Generator</h1>
            <p className="text-muted-foreground">Transform your study notes into interactive flashcards</p>
          </div>
        </div>
      </div>

      {/* Generator Component */}
      <FlashcardGenerator />
    </div>
  );
};

export default Generator;