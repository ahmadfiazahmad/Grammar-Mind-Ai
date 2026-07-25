import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import {join} from 'node:path';
import { GoogleGenAI } from '@google/genai';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(express.json());

const geminiSystemPrompt = `You are an expert English grammar and spelling correction engine.

Correct grammar, spelling, punctuation, capitalization, and sentence structure.

Preserve:

- original meaning
- original tone
- paragraph structure
- formatting
- bullet points
- numbering
- markdown
- code blocks

Do NOT rewrite the content.

Do NOT summarize.

Do NOT add explanations.

Do NOT make the writing more creative.

Do NOT change the author's voice.

Return ONLY the corrected text.`;

app.post('/api/correct', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || typeof text !== 'string') {
      res.status(400).json({ success: false, error: 'Text is required and must be a string' });
      return;
    }

    if (!process.env['GEMINI_API_KEY']) {
      res.status(500).json({ success: false, error: 'GEMINI_API_KEY is not configured.' });
      return;
    }

    const ai = new GoogleGenAI({ apiKey: process.env['GEMINI_API_KEY'] });
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: text,
      config: {
        systemInstruction: geminiSystemPrompt,
        temperature: 0.1,
      },
    });

    res.json({ success: true, correctedText: response.text });
    return;
  } catch (error: unknown) {
    console.error('Error generating grammar correction:', error);
    
    if (error && typeof error === 'object' && 'status' in error && error.status === 429) {
      res.status(429).json({ success: false, error: 'Rate limit exceeded. Please try again later.' });
      return;
    }

    res.status(500).json({ success: false, error: 'Failed to correct text.' });
    return;
  }
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
