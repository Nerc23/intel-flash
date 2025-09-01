
import React, { useState } from 'react';
import { Wand2, FileText, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const FlashcardGenerator = () => {
  const [studyNotes, setStudyNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [flashcards, setFlashcards] = useState<Array<{question: string, answer: string}>>([]);

  const generateFlashcards = async () => {
    if (!studyNotes.trim()) {
      toast.error('Please enter your study notes first');
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation (replace with actual AI API call)
    setTimeout(() => {
      const mockFlashcards = [
        {
          question: "What is the main concept discussed in your notes?",
          answer: "Based on your study material, this would be the key concept explanation."
        },
        {
          question: "How does this topic relate to practical applications?",
          answer: "This concept applies to real-world scenarios in the following ways..."
        },
        {
          question: "What are the important details to remember?",
          answer: "Key details include the main points and supporting information from your notes."
        }
      ];
      
      setFlashcards(mockFlashcards);
      setIsGenerating(false);
      toast.success('Flashcards generated successfully!');
    }, 2000);
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Generate Your <span className="text-hero inline">AI Flashcards</span>
          </h2>
          <p className="text-subtitle max-w-2xl mx-auto">
            Paste your study notes below and watch as AI transforms them into interactive flashcards
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Input Section */}
          <div className="study-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-card-title">Your Study Notes</h3>
            </div>

            <div className="space-y-4">
              <Textarea
                placeholder="Paste your study notes here... 

Example:
- Photosynthesis is the process by which plants convert sunlight into energy
- It occurs in the chloroplasts of plant cells
- The equation is: 6CO2 + 6H2O + light energy → C6H12O6 + 6O2
- There are two main stages: light reactions and the Calvin cycle"
                value={studyNotes}
                onChange={(e) => setStudyNotes(e.target.value)}
                className="study-input min-h-[300px] resize-none"
              />

              <Button 
                onClick={generateFlashcards}
                disabled={isGenerating}
                className="w-full btn-hero"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating Flashcards...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 mr-2" />
                    Generate Flashcards
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Preview Section */}
          <div className="study-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-secondary/10">
                <Plus className="w-5 h-5 text-secondary" />
              </div>
              <h3 className="text-card-title">Generated Flashcards</h3>
              {flashcards.length > 0 && (
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-accent/10 text-accent">
                  {flashcards.length} cards
                </span>
              )}
            </div>

            <div className="space-y-4">
              {flashcards.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                    <Wand2 className="w-8 h-8" />
                  </div>
                  <p>Your generated flashcards will appear here</p>
                </div>
              ) : (
                flashcards.map((card, index) => (
                  <div key={index} className="relative">
                    <FlashcardPreview question={card.question} answer={card.answer} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
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
            <div className="text-xs font-semibold text-primary uppercase tracking-wide">Question</div>
            <p className="text-lg font-medium text-foreground">{question}</p>
            <div className="text-xs text-muted-foreground">Click to reveal answer</div>
          </div>
        </div>
        <div className="flashcard-back">
          <div className="space-y-4">
            <div className="text-xs font-semibold text-accent uppercase tracking-wide">Answer</div>
            <p className="text-base text-foreground leading-relaxed">{answer}</p>
            <div className="text-xs text-muted-foreground">Click to see question</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardGenerator;
