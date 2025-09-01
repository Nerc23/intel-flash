import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FlashcardGenerationRequest {
  prompt: string;
  subject?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client for user authentication
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: corsHeaders }
      );
    }

    // Get user profile and check plan limits
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('plan_type')
      .eq('user_id', user.id)
      .single();

    if (!profile) {
      return new Response(
        JSON.stringify({ error: "User profile not found" }),
        { status: 404, headers: corsHeaders }
      );
    }

    // Check daily usage for freemium users
    const today = new Date().toISOString().split('T')[0];
    const { data: todayFlashcards, error: countError } = await supabaseClient
      .from('flashcards')
      .select('id', { count: 'exact' })
      .eq('user_id', user.id)
      .gte('created_at', `${today}T00:00:00Z`)
      .lt('created_at', `${today}T23:59:59Z`);

    if (countError) {
      console.error('Error counting flashcards:', countError);
    }

    const dailyCount = todayFlashcards?.length || 0;
    const isFreemium = profile.plan_type === 'freemium';
    const dailyLimit = 5; // Freemium daily limit

    if (isFreemium && dailyCount >= dailyLimit) {
      return new Response(
        JSON.stringify({ 
          error: "Daily limit reached", 
          message: `You've reached your daily limit of ${dailyLimit} flashcards. Upgrade to Premium for unlimited generation!`,
          remainingCount: 0
        }),
        { status: 429, headers: corsHeaders }
      );
    }

    // Parse request body
    const { prompt, subject }: FlashcardGenerationRequest = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Call Hugging Face API for question-answering
    const huggingFaceResponse = await fetch(
      "https://api-inference.huggingface.co/models/distilbert-base-cased-distilled-squad",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${Deno.env.get("HUGGING_FACE_API_KEY")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: {
            question: "What are the key concepts I should remember?",
            context: prompt
          }
        }),
      }
    );

    if (!huggingFaceResponse.ok) {
      throw new Error(`Hugging Face API error: ${huggingFaceResponse.statusText}`);
    }

    const aiResult = await huggingFaceResponse.json();

    // Generate flashcards from the AI response
    const flashcards = generateFlashcardsFromResponse(prompt, aiResult, subject);

    // Save flashcards to database
    const { data: savedFlashcards, error: saveError } = await supabaseClient
      .from('flashcards')
      .insert({
        user_id: user.id,
        title: subject || 'AI Generated Flashcards',
        content: flashcards
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving flashcards:', saveError);
      throw new Error('Failed to save flashcards');
    }

    const remainingCount = isFreemium ? Math.max(0, dailyLimit - dailyCount - 1) : 999;

    return new Response(
      JSON.stringify({ 
        flashcards,
        remainingCount,
        planType: profile.plan_type,
        savedFlashcard: savedFlashcards
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in generate-flashcards function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

function generateFlashcardsFromResponse(originalText: string, aiResponse: any, subject?: string): any[] {
  // Simple fallback flashcard generation
  const sentences = originalText.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const flashcards = [];

  // Try to use AI response if available
  if (aiResponse && aiResponse.answer) {
    flashcards.push({
      id: 1,
      front: "What are the key concepts from this text?",
      back: aiResponse.answer,
      subject: subject || "General"
    });
  }

  // Create additional flashcards from sentences
  sentences.slice(0, 4).forEach((sentence, index) => {
    const cleanSentence = sentence.trim();
    if (cleanSentence.length > 20) {
      flashcards.push({
        id: flashcards.length + 1,
        front: `What does this statement mean: "${cleanSentence.substring(0, 50)}..."?`,
        back: cleanSentence,
        subject: subject || "General"
      });
    }
  });

  // Ensure we have at least one flashcard
  if (flashcards.length === 0) {
    flashcards.push({
      id: 1,
      front: "What is the main topic of this text?",
      back: originalText.substring(0, 200) + (originalText.length > 200 ? "..." : ""),
      subject: subject || "General"
    });
  }

  return flashcards.slice(0, 5); // Limit to 5 flashcards per generation
}