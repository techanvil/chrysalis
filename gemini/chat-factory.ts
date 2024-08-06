/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 *
 * See the getting started guide for more information
 * https://ai.google.dev/gemini-api/docs/get-started/node
 */

import {
  ChatSession,
  GenerativeModel,
  GoogleGenerativeAI,
  // HarmCategory,
  // HarmBlockThreshold,
} from "@google/generative-ai";
// import {
//   FileState,
//   GoogleAICacheManager,
//   GoogleAIFileManager,
// } from '@google/generative-ai/server'; // TODO, maybe use context cache for subject data. https://ai.google.dev/gemini-api/docs/caching?lang=node

const apiKey = process.env.GEMINI_API_KEY;

// TODO: Use invariant?
if (!apiKey) {
  throw new Error("Missing GEMINI_API_KEY");
}

const genAI = new GoogleGenerativeAI(apiKey);

const chats: Record<
  string,
  {
    model: GenerativeModel;
    chatSession: ChatSession;
    sendMessage: (message: string) => Promise<string>;
  }
> = {};

// const systemInstruction =
// "You are a data analyst tasked with querying a dataset. The dataset represents an epic, across a series of sprints. Reports should be concise and insightful, and formatted using Markdown.";
// "You are a data scientist tasked with extracting insights from a dataset.",

export function getChat(systemInstruction: string) {
  console.log("Getting model...", { systemInstruction });

  if (chats[systemInstruction]) {
    return chats[systemInstruction];
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction,
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  const chatSession = model.startChat({
    generationConfig,
    // safetySettings: Adjust safety settings
    // See https://ai.google.dev/gemini-api/docs/safety-settings
    history: [],
  });

  return (chats[systemInstruction] = {
    model,
    chatSession,
    sendMessage: async (message: string) => {
      const result = await chatSession.sendMessage(message);
      console.log(result.response.text());
      return result.response.text();
    },
  });
}
