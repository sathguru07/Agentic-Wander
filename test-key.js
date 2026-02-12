import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

const envContent = fs.readFileSync(path.resolve('.env.local'), 'utf-8');
const apiKeyMatch = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : null;

console.log("Testing API Key:", apiKey ? "Found" : "Missing");

const genAI = new GoogleGenerativeAI(apiKey);

async function run() {
    try {
        console.log("Testing gemini-2.0-flash...");
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent("Hello");
        console.log("Success with gemini-2.0-flash:", await result.response.text());
    } catch (error) {
        console.error("Error with gemini-2.0-flash:", error.message);
    }
}

run();
