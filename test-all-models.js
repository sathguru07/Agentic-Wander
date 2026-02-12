import fs from "fs";
import path from "path";

const envContent = fs.readFileSync(path.resolve('.env.local'), 'utf-8');
const apiKeyMatch = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : null;

// Read models from file
const modelsData = JSON.parse(fs.readFileSync("models.json", "utf-8"));
// Filter for generateContent support and get names
const candidates = modelsData.models
    .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent"))
    .map(m => m.name.replace("models/", ""));

console.log(`Found ${candidates.length} candidates.`);

async function testModel(modelName) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
    const data = {
        contents: [{
            parts: [{ text: "Hello" }]
        }]
    };

    try {
        process.stdout.write(`Testing ${modelName}... `);
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            console.log(`[SUCCESS]`);
            return true;
        } else {
            console.log(`[FAILED] ${response.status} ${response.statusText}`);
            // Log detailed error for debugging if needed, but keep it brief for scanning
            return false;
        }
    } catch (error) {
        console.log(`[ERROR] ${error.message}`);
        return false;
    }
}

async function run() {
    // Prioritize likely candidates
    const priority = [
        "gemini-2.0-flash-lite-preview-02-05",
        "gemini-2.0-flash-001",
        "gemini-2.0-flash-lite-001",
        "gemini-1.5-flash",
        "gemini-1.5-pro",
        "gemini-1.0-pro"
    ];

    // Sort candidates: priority items come first
    candidates.sort((a, b) => {
        const pA = priority.indexOf(a);
        const pB = priority.indexOf(b);
        // If both in priority list, lower index is better
        if (pA > -1 && pB > -1) return pA - pB;
        // If only a is in priority, it comes first
        if (pA > -1) return -1;
        // If only b is in priority, it comes first
        if (pB > -1) return 1;
        // alphabetical otherwise
        return a.localeCompare(b);
    });

    console.log("Starting tests...");
    for (const model of candidates) {
        const success = await testModel(model);
        if (success) {
            console.log(`\n!!! FOUND WORKING MODEL: ${model} !!!`);
            break;
        }
    }
}

run();
