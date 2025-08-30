import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export async function POST(req: Request) {
    const { kontext, trello } = await req.json();

    if (trello) {
        console.log("[Trello Debug] Trello context received from client:", trello ? "Yes" : "No");
        console.log("[Trello Debug] Trello context preview:", trello?.substring(0, 200));
    }
    if (kontext) {
        console.log("[Kontext Debug] Context received from client:", kontext ? "Yes" : "No");
        console.log("[Kontext Debug] Context preview:", kontext?.substring(0, 200));
    }

    if (!kontext && !trello) {
        return Response.json({ error: "Missing context" }, { status: 400 });
    }

    const combinedContext = `
    ${kontext}
    ${trello}
    `;

    console.log("[Combined Debug] Combined context preview:", combinedContext?.substring(0, 200));

    const { text } = await generateText({
        model: openai("gpt-4o"),
        system: combinedContext || "You are a helpful assistant that helps users with their calendar and meeting information.",
        prompt: "List all meetings of last week",
    });

    return Response.json({ response: text });
}

