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
    const { prompt } = await req.json();
    const apiKey = Deno.env.get('GOOGLE_API_KEY');
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Google API key not configured. Please contact the administrator." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log('Generating code for prompt:', prompt.substring(0, 100));

    const systemPrompt = `You are an expert web developer. Generate a complete, self-contained HTML page with embedded styles and scripts.

IMPORTANT RULES:
- Create ONE complete HTML file with everything embedded
- Use <style> tags in the <head> for ALL CSS
- Use <script> tags before </body> for ALL JavaScript
- Use modern CSS (flexbox, grid, custom properties)
- Make it responsive and mobile-friendly
- Add beautiful colors, gradients, and modern design
- Include smooth animations and transitions
- Follow web best practices
- Return ONLY the HTML code, no explanations

Generate complete, working code that can be directly rendered in a browser.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:streamGenerateContent?key=${apiKey}&alt=sse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemPrompt + '\n\n' + prompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Gemini API Error:', response.status, errorText);
      
      return new Response(
        JSON.stringify({ error: `API error: ${errorText}` }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Return the stream directly
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
