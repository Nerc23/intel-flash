import React from 'react';
import { ArrowLeft, Play, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Demo = () => {
  const navigate = useNavigate();

  const demoSteps = [
    {
      title: "1. Paste Your Notes",
      description: "Copy and paste any study material - textbooks, lectures, or handwritten notes",
      example: "Photosynthesis is the process by which plants convert sunlight into energy..."
    },
    {
      title: "2. AI Generates Questions",
      description: "Our AI analyzes your content and creates relevant questions and answers",
      example: "Question: What is the main function of photosynthesis?\nAnswer: To convert sunlight into energy for plants"
    },
    {
      title: "3. Study with Flashcards",
      description: "Interactive flashcards help you memorize and test your knowledge",
      example: "Click to flip cards, track progress, and master your subjects"
    }
  ];

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Demo: How It Works</h1>
            <p className="text-subtitle">See how AI Study Buddy transforms your notes into flashcards</p>
          </div>
        </div>

        {/* Demo Steps */}
        <div className="space-y-8">
          {demoSteps.map((step, index) => (
            <div key={index} className="study-card">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-card-title mb-3">{step.title}</h3>
                  <p className="text-card-content mb-4">{step.description}</p>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-4 h-4 text-accent" />
                      <span className="text-sm font-medium text-accent">Example:</span>
                    </div>
                    <p className="text-sm text-foreground font-mono">{step.example}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Button 
            onClick={() => navigate('/generator')}
            className="btn-hero flex items-center gap-2"
          >
            <Play className="w-5 h-5" />
            Try It Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Demo;