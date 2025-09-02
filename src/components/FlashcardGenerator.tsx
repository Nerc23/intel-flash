import React, { useState } from 'react';
import { Brain, Sparkles, BookOpen, ArrowRight, Shuffle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import SubjectManagement from '@/components/SubjectManagement';

interface Flashcard {
  question: string;
  answer: string;
}

const FlashcardGenerator = () => {
  const [studyNotes, setStudyNotes] = useState('');
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const { user } = useAuth();
  const { toast } = useToast();

  const generateFlashcards = async () => {
    if (!studyNotes.trim()) {
      toast({
        title: "Error",
        description: "Please enter some study notes to generate flashcards.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedSubjectId) {
      toast({
        title: "Subject Required",
        description: "Please select a subject before generating flashcards.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-flashcards', {
        body: { 
          studyNotes: studyNotes.trim(),
          userId: user?.id,
          subjectId: selectedSubjectId
        }
      });

      if (error) throw error;

      if (data?.flashcards) {
        setFlashcards(data.flashcards);
        toast({
          title: "Success!",
          description: `Generated ${data.flashcards.length} flashcards from your notes.`,
        });
        
        // Clear the notes after successful generation
        setStudyNotes('');
      } else {
        throw new Error('No flashcards generated');
      }
    } catch (error: any) {
      console.error('Error generating flashcards:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate flashcards. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="inline-flex p-4 rounded-full bg-primary/10 text-primary mb-4">
          <Brain className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold mb-2">AI Flashcard Generator</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Transform your study notes into intelligent flashcards using advanced AI. 
          Perfect for exam preparation and knowledge retention.
        </p>
      </div>

      {/* Subject Management Section */}
      <div className="mb-8">
        <SubjectManagement 
          onSubjectSelect={setSelectedSubjectId}
          selectedSubjectId={selectedSubjectId}
        />
      </div>

      {/* Subject Selection Alert */}
      {!selectedSubjectId && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please select or create a subject above to organize your flashcards before generating new ones.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Study Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste your study notes, lecture content, or any text you want to convert into flashcards..."
                value={studyNotes}
                onChange={(e) => setStudyNotes(e.target.value)}
                rows={12}
                className="resize-none study-input"
                disabled={!selectedSubjectId}
              />
              
              <Button 
                onClick={generateFlashcards}
                disabled={isGenerating || !studyNotes.trim() || !selectedSubjectId}
                className="w-full btn-hero"
              >
                {isGenerating ? (
                  <>
                    <Brain className="w-4 h-4 mr-2 animate-spin" />
                    Generating Flashcards...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Flashcards
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Flashcards Preview Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shuffle className="w-5 h-5" />
                Generated Flashcards
                {flashcards.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {flashcards.length} cards
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {flashcards.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Brain className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No flashcards yet</h3>
                  <p className="text-muted-foreground">
                    Enter your study notes and click generate to create AI-powered flashcards
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {flashcards.map((card, index) => (
                    <FlashcardPreview 
                      key={index} 
                      question={card.question} 
                      answer={card.answer} 
                    />
                  ))}
                  
                  <div className="flex gap-2 pt-4">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => window.location.href = '/test-knowledge'}
                    >
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Test Knowledge
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setFlashcards([])}
                    >
                      Clear All
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const FlashcardPreview: React.FC<{question: string, answer: string}> = ({ question, answer }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className={`flashcard ${isFlipped ? 'flipped' : ''}`}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className="flashcard-inner">
        <div className="flashcard-front">
          <div className="space-y-4">
            <Badge variant="secondary" className="text-xs">Question</Badge>
            <p className="text-base font-medium">{question}</p>
            <div className="text-xs text-muted-foreground">Click to reveal answer</div>
          </div>
        </div>
        <div className="flashcard-back">
          <div className="space-y-4">
            <Badge className="text-xs bg-accent text-accent-foreground">Answer</Badge>
            <p className="text-sm leading-relaxed">{answer}</p>
            <div className="text-xs text-muted-foreground">Click to see question</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardGenerator;