import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, apiKey, provider = 'openai' } = await req.json();
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "API key is required. Please add your API key in Settings." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Generating code with ${provider} for prompt:`, prompt.substring(0, 100));

    const systemPrompt = `You are an expert React developer. Generate clean, modern, production-ready React code based on user requirements.

Guidelines:
- Use functional components with hooks
- Include TypeScript types
- Use Tailwind CSS for styling with semantic design tokens
- Follow React best practices
- Keep code modular and maintainable
- Add helpful comments for complex logic
- Use modern ES6+ features
- Return ONLY the code, no explanations or markdown

Generate complete, working code that can be directly used.`;

    let apiUrl = '';
    let headers: Record<string, string> = {};
    let body: any = {};

    if (provider === 'openai') {
      apiUrl = 'https://api.openai.com/v1/chat/completions';
      headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      };
      body = {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        stream: true,
        temperature: 0.7,
      };
    } else if (provider === 'anthropic') {
      apiUrl = 'https://api.anthropic.com/v1/messages';
      headers = {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      };
      body = {
        model: 'claude-sonnet-4-5',
        max_tokens: 4096,
        messages: [
          { role: 'user', content: `${systemPrompt}\n\n${prompt}` }
        ],
        stream: true,
      };
    } else if (provider === 'gemini') {
      apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:streamGenerateContent?key=${apiKey}`;
      headers = {
        'Content-Type': 'application/json',
      };
      body = {
        contents: [{
          parts: [{ text: `${systemPrompt}\n\n${prompt}` }]
        }],
      };
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`${provider} API Error:`, response.status, errorText);
      
      return new Response(
        JSON.stringify({ error: `${provider} API error: ${errorText}` }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("generate-code error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
