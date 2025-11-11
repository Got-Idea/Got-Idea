import { GoogleGenAI } from "@google/genai";
import { AiProvider } from "../types";

async function generateWithGemini(prompt: string, apiKey: string, currentCode?: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-2.5-pro';

    const fullPrompt = currentCode ?
    `
    You are an expert web developer. Your task is to modify the provided HTML, CSS, and JavaScript code based on the user's request, focusing on adding or improving functionality.

    Here is the current code of the single-file web application:
    \`\`\`html
    ${currentCode}
    \`\`\`

    The user wants to make the following change: "${prompt}"

    Please adhere to these strict requirements:
    1.  **Modify, Don't Replace:** Intelligently modify the existing code to incorporate the user's request. Focus on enhancing functionality and interactivity. Do not start from scratch unless the request is a complete overhaul.
    2.  **Maintain Structure:** Preserve the single-file, inline-everything (CSS in \`<style>\`, JS in \`<script>\`) structure.
    3.  **Robust JavaScript:** Ensure any new or modified JavaScript is well-written, functional, and integrated with the existing code.
    4.  **Code Only:** Your entire response must be ONLY the complete, updated HTML code for the website, enclosed in a single markdown code block. Do NOT include explanations.
    `
    :
    `
    You are an expert web developer specializing in creating fully functional and interactive single-file web applications using HTML, CSS, and JavaScript.

    Your task is to generate the complete code for an application based on the user's request.

    The user's request is: "${prompt}"

    Please adhere to the following strict requirements:
    1.  **Single File Output:** Generate a single, self-contained \`index.html\` file.
    2.  **Inline Everything:**
        -   All CSS must be included within a \`<style>\` tag in the \`<head>\`.
        -   All JavaScript must be included within a \`<script>\` tag right before the closing \`</body>\` tag.
        -   Do not use any external CSS or JS files.
    3.  **Functionality First:** The generated JavaScript should be robust and make the application as interactive and functional as requested. For example, if a user asks for a "todo list app", it should have working functionality to add, remove, and mark todos as complete. For extra credit, use \`localStorage\` to persist data across browser sessions.
    4.  **Modern & Responsive:** The application must be modern, aesthetically pleasing, and fully responsive. Use modern CSS features like Flexbox or Grid.
    5.  **Code Only:** Your entire response must be ONLY the HTML code for the application, enclosed in a single markdown code block like this:
        \`\`\`html
        <!DOCTYPE html>
        <html>
        ...
        </html>
        \`\`\`
        Do NOT include any explanations, introductions, or closing remarks outside of the code block.
  `;
    const response = await ai.models.generateContent({
        model,
        contents: fullPrompt,
    });

    const code = response.text;
    const match = code.match(/```html\n([\sS]*?)\n```/);
    if (match && match[1]) {
        return match[1].trim();
    }
    // Fallback for cases where the model doesn't use markdown
    if (code.trim().startsWith('<!DOCTYPE html>')) {
        return code.trim();
    }
    return code.trim();
}


export async function generateWebsiteCode(prompt: string, provider: AiProvider, apiKey: string, currentCode?: string): Promise<string> {
  if (!apiKey) {
    throw new Error("API key is not set for the selected provider.");
  }

  try {
    switch (provider) {
      case 'gemini':
        return await generateWithGemini(prompt, apiKey, currentCode);
      case 'anthropic':
        // Placeholder for future implementation
        throw new Error("Anthropic Claude is not yet supported.");
      default:
        // This is a type error, but adding for runtime safety
        throw new Error(`Unsupported AI provider: ${provider}`);
    }
  } catch (error) {
    console.error(`Error generating website code with ${provider}:`, error);
    if (error instanceof Error) {
        return Promise.reject(new Error(`Failed to generate code: ${error.message}`));
    }
    return Promise.reject(new Error("An unknown error occurred while generating code."));
  }
}