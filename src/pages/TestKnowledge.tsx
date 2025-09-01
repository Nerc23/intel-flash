import React, { useState, useEffect } from 'react';
import { ArrowLeft, Brain, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import UserNav from '@/components/UserNav';

type TestMode = 'selection' | 'multiple-choice' | 'fill-blank' | 'true-false';

interface Question {
  id: string;
  question: string;
  answer: string;
  options?: string[];
  type: 'multiple-choice' | 'fill-blank' | 'true-false';
}

const TestKnowledge = () => {
  const navigate = useNavigate();
  const [currentMode, setCurrentMode] = useState<TestMode>('selection');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  // Sample questions - in real app, fetch from Supabase
  const generateQuestions = (type: 'multiple-choice' | 'fill-blank' | 'true-false'): Question[] => {
    const baseQuestions = [
      { q: 'What is photosynthesis?', a: 'The process by which plants convert sunlight into energy' },
      { q: 'What is the capital of France?', a: 'Paris' },
      { q: 'What is DNA?', a: 'Deoxyribonucleic acid' },
      { q: 'What is gravity?', a: 'A force that attracts objects toward each other' },
      { q: 'What is oxygen?', a: 'A chemical element essential for breathing' }
    ];

    if (type === 'multiple-choice') {
      return baseQuestions.slice(0, 5).map((item, index) => ({
        id: `mc-${index}`,
        question: item.q,
        answer: item.a,
        type: 'multiple-choice',
        options: [
          item.a,
          'A completely different answer',
          'Another plausible but incorrect option',
          'A scientific-sounding incorrect answer'
        ].sort(() => Math.random() - 0.5)
      }));
    }

    if (type === 'fill-blank') {
      return [
        {
          id: 'fb-1',
          question: 'Plants convert sunlight into energy through a process called ____.',
          answer: 'photosynthesis',
          type: 'fill-blank'
        },
        {
          id: 'fb-2',
          question: 'The capital city of France is ____.',
          answer: 'Paris',
          type: 'fill-blank'
        },
        {
          id: 'fb-3',
          question: 'DNA stands for ____ acid.',
          answer: 'Deoxyribonucleic',
          type: 'fill-blank'
        }
      ];
    }

    if (type === 'true-false') {
      return [
        {
          id: 'tf-1',
          question: 'Photosynthesis occurs only in the roots of plants.',
          answer: 'false',
          type: 'true-false'
        },
        {
          id: 'tf-2',
          question: 'Paris is the capital of France.',
          answer: 'true',
          type: 'true-false'
        },
        {
          id: 'tf-3',
          question: 'Gravity pushes objects away from each other.',
          answer: 'false',
          type: 'true-false'
        },
        {
          id: 'tf-4',
          question: 'Oxygen is essential for human breathing.',
          answer: 'true',
          type: 'true-false'
        }
      ];
    }

    return [];
  };

  const startTest = (type: 'multiple-choice' | 'fill-blank' | 'true-false') => {
    const testQuestions = generateQuestions(type);
    setQuestions(testQuestions);
    setCurrentMode(type);
    setCurrentQuestion(0);
    setScore(0);
    setCompleted(false);
    setShowResult(false);
    setUserAnswer('');
    setSelectedOption(null);
  };

  const checkAnswer = () => {
    const current = questions[currentQuestion];
    let correct = false;

    if (current.type === 'multiple-choice') {
      correct = selectedOption !== null && current.options![selectedOption] === current.answer;
    } else if (current.type === 'fill-blank') {
      correct = userAnswer.toLowerCase().trim() === current.answer.toLowerCase().trim();
    } else if (current.type === 'true-false') {
      correct = userAnswer.toLowerCase() === current.answer.toLowerCase();
    }

    if (correct) {
      setScore(score + 1);
    }

    setShowResult(true);
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setShowResult(false);
        setUserAnswer('');
        setSelectedOption(null);
      } else {
        setCompleted(true);
      }
    }, 1500);
  };

  const resetTest = () => {
    setCurrentMode('selection');
    setQuestions([]);
    setCurrentQuestion(0);
    setScore(0);
    setCompleted(false);
    setShowResult(false);
    setUserAnswer('');
    setSelectedOption(null);
  };

  if (currentMode === 'selection') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
        {/* Header */}
        <div className="px-4 py-6 border-b border-border bg-background/95 backdrop-blur">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Test Your Knowledge</h1>
                <p className="text-muted-foreground">Choose a test mode to challenge yourself</p>
              </div>
            </div>
            <UserNav />
          </div>
        </div>

        {/* Test Mode Selection */}
        <div className="max-w-4xl mx-auto p-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20">
              <CardHeader className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Multiple Choice</CardTitle>
                <CardDescription>
                  Test your knowledge with challenging alternatives that seem almost correct
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  onClick={() => startTest('multiple-choice')}
                >
                  Start Multiple Choice
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-accent/20">
              <CardHeader className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                  <Input className="w-6 h-6 text-accent pointer-events-none" />
                </div>
                <CardTitle>Fill in the Blank</CardTitle>
                <CardDescription>
                  Complete sentences with immediate visual feedback on your answers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  variant="secondary"
                  onClick={() => startTest('fill-blank')}
                >
                  Start Fill in Blank
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-destructive/20">
              <CardHeader className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-destructive" />
                </div>
                <CardTitle>True or False</CardTitle>
                <CardDescription>
                  Determine the truth of statements to test your understanding
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => startTest('true-false')}
                >
                  Start True/False
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
        <div className="px-4 py-6 border-b border-border bg-background/95 backdrop-blur">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Test Complete!</h1>
            <UserNav />
          </div>
        </div>

        <div className="max-w-2xl mx-auto p-6">
          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Brain className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Congratulations!</CardTitle>
              <CardDescription>You completed the test</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-3xl font-bold text-primary">
                {score} / {questions.length}
              </div>
              <Badge variant="secondary" className="text-lg px-6 py-2">
                {Math.round((score / questions.length) * 100)}% Score
              </Badge>
              <div className="flex gap-4 justify-center">
                <Button onClick={resetTest}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button variant="outline" onClick={() => navigate('/')}>
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="px-4 py-6 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={resetTest}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Test Selection
            </Button>
            <div>
              <h1 className="text-xl font-bold">Question {currentQuestion + 1} of {questions.length}</h1>
              <p className="text-sm text-muted-foreground">Score: {score} / {currentQuestion + (showResult ? 1 : 0)}</p>
            </div>
          </div>
          <UserNav />
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{currentQ?.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Multiple Choice */}
            {currentQ?.type === 'multiple-choice' && (
              <div className="space-y-3">
                {currentQ.options?.map((option, index) => (
                  <Button
                    key={index}
                    variant={selectedOption === index ? "default" : "outline"}
                    className="w-full text-left justify-start h-auto p-4"
                    onClick={() => setSelectedOption(index)}
                    disabled={showResult}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            )}

            {/* Fill in the Blank */}
            {currentQ?.type === 'fill-blank' && (
              <div className="space-y-4">
                <Input
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Enter your answer..."
                  className="text-lg"
                  disabled={showResult}
                />
                {showResult && (
                  <div className={`flex items-center gap-2 p-3 rounded-lg ${
                    userAnswer.toLowerCase().trim() === currentQ.answer.toLowerCase().trim()
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {userAnswer.toLowerCase().trim() === currentQ.answer.toLowerCase().trim() ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className="font-medium">
                      {userAnswer.toLowerCase().trim() === currentQ.answer.toLowerCase().trim() 
                        ? 'Correct!' 
                        : `Incorrect. Answer: ${currentQ.answer}`
                      }
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* True/False */}
            {currentQ?.type === 'true-false' && (
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant={userAnswer === 'true' ? "default" : "outline"}
                  className="h-16 text-lg"
                  onClick={() => setUserAnswer('true')}
                  disabled={showResult}
                >
                  True
                </Button>
                <Button
                  variant={userAnswer === 'false' ? "default" : "outline"}
                  className="h-16 text-lg"
                  onClick={() => setUserAnswer('false')}
                  disabled={showResult}
                >
                  False
                </Button>
              </div>
            )}

            {!showResult && (currentMode !== 'multiple-choice' || selectedOption !== null) && (
              <Button 
                className="w-full" 
                onClick={checkAnswer}
                disabled={
                  (currentMode === 'fill-blank' && !userAnswer.trim()) ||
                  (currentMode === 'true-false' && !userAnswer) ||
                  (currentMode === 'multiple-choice' && selectedOption === null)
                }
              >
                Check Answer
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestKnowledge;