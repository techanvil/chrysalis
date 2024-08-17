import {
  ChatSession,
  GenerativeModel,
  GoogleGenerativeAI,
  // HarmCategory,
  // HarmBlockThreshold,
} from "@google/generative-ai";
import { roughSizeOfObject } from "./utils";
// import {
//   FileState,
//   GoogleAICacheManager,
//   GoogleAIFileManager,
// } from '@google/generative-ai/server'; // TODO, maybe use context cache for subject data. https://ai.google.dev/gemini-api/docs/caching?lang=node

const MAX_ROUGH_CHAT_SESSION_SIZE =
  Number(process.env.MAX_ROUGH_CHAT_SESSION_SIZE) || 1024 * 1024; // 1 MiB
const MAX_CHATS = Number(process.env.MAX_CHAT_SESSIONS) || 100;

const API_KEY = process.env.GEMINI_API_KEY;

// TODO: Use invariant?
if (!API_KEY) {
  throw new Error("Missing GEMINI_API_KEY");
}

const genAI = new GoogleGenerativeAI(API_KEY);

// TODO: Cache to disk/DB.
const chats: Record<
  string, // User email address.
  Record<
    string, // System instruction. TODO: Use a hash.
    {
      model: GenerativeModel;
      chatSession: ChatSession;
      sendMessage: (message: string) => Promise<string>;
      lastUpdated: number;
    }
  >
> = {};

console.log("Created generative AI instance and chat cache");

// const systemInstruction =
// "You are a data analyst tasked with querying a dataset. The dataset represents an epic, across a series of sprints. Reports should be concise and insightful, and formatted using Markdown.";
// "You are a data scientist tasked with extracting insights from a dataset.",

export function getChat(userEmail: string, systemInstruction: string) {
  // console.log("Getting model...", { systemInstruction });

  const userChats = (chats[userEmail] = chats[userEmail] || {});

  if (userChats[systemInstruction]) {
    console.log("Reusing model. Size:", {
      model: roughSizeOfObject(userChats[systemInstruction].model),
      chatSession: roughSizeOfObject(userChats[systemInstruction].chatSession),
    });

    return userChats[systemInstruction];
  }

  checkMaxChatSessions();

  console.log("Creating model");

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

  userChats[systemInstruction] = {
    model,
    chatSession,
    sendMessage: async (message: string) => {
      const result = await chatSession.sendMessage(message);

      console.log("Updated model. Size:", {
        model: roughSizeOfObject(userChats[systemInstruction].model),
        chatSession: roughSizeOfObject(
          userChats[systemInstruction].chatSession
        ),
      });

      userChats[systemInstruction].lastUpdated = Date.now();

      // console.log(result.response.text());
      const responseText = result.response.text();

      if (
        roughSizeOfObject(userChats[systemInstruction].chatSession) >
        MAX_ROUGH_CHAT_SESSION_SIZE
      ) {
        console.log("Chat session size exceeded. Deleting chat:", {
          userEmail,
          lastUpdated: userChats[systemInstruction].lastUpdated,
          // systemInstruction,
        });
        delete userChats[systemInstruction];
      }

      return responseText;
    },
    lastUpdated: Date.now(),
  };

  console.log("Created model. Size:", {
    model: roughSizeOfObject(userChats[systemInstruction].model),
    chatSession: roughSizeOfObject(userChats[systemInstruction].chatSession),
  });

  return userChats[systemInstruction];
}

function checkMaxChatSessions() {
  const chatCount = Object.keys(chats).reduce(
    (count, userEmail) => count + Object.keys(chats[userEmail]).length,
    0
  );

  if (chatCount < MAX_CHATS) {
    console.log("Chat count:", chatCount);
    return;
  }

  console.log("Max chats reached. Cleaning up the oldest chat...");

  const oldestChat = Object.keys(chats).reduce(
    (oldest, userEmail) => {
      const userChats = chats[userEmail];

      return Object.keys(userChats).reduce((oldest, systemInstruction) => {
        return userChats[systemInstruction].lastUpdated < oldest.lastUpdated
          ? {
              userEmail,
              systemInstruction,
              lastUpdated: userChats[systemInstruction].lastUpdated,
            }
          : oldest;
      }, oldest);
    },
    {
      userEmail: "",
      systemInstruction: "",
      lastUpdated: Infinity,
    }
  );

  // console.log("Deleting chat", oldestChat);
  console.log("Deleting chat", {
    userEmail: oldestChat.userEmail,
    lastUpdated: oldestChat.lastUpdated,
  });

  delete chats[oldestChat.userEmail][oldestChat.systemInstruction];
}
