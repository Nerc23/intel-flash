-- Create subjects table for organizing flashcards
CREATE TABLE public.subjects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#8B5CF6', -- Default purple color
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

-- Create policies for subjects
CREATE POLICY "Users can view their own subjects" 
ON public.subjects 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own subjects" 
ON public.subjects 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subjects" 
ON public.subjects 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subjects" 
ON public.subjects 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add subject_id to flashcards table
ALTER TABLE public.flashcards 
ADD COLUMN subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE;

-- Create index for better performance
CREATE INDEX idx_flashcards_subject_id ON public.flashcards(subject_id);
CREATE INDEX idx_subjects_user_id ON public.subjects(user_id);

-- Add trigger for automatic timestamp updates on subjects
CREATE TRIGGER update_subjects_updated_at
BEFORE UPDATE ON public.subjects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();