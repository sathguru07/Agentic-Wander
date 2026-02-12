import fs from "fs";
import path from "path";

const envContent = fs.readFileSync(path.resolve('.env.local'), 'utf-8');
const apiKeyMatch = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : null;

async function run() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Error ${response.status}: ${response.statusText}`);
        } else {
            const json = await response.json();
            fs.writeFileSync("models.json", JSON.stringify(json, null, 2));
            console.log("Models written to models.json");
        }
    } catch (error) {
        console.error("Fetch Error:", error);
    }
}

run();
