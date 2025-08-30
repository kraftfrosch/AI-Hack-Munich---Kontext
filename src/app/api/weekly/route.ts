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
        prompt: `
        You are a helpful assitant that creates a progress update for a given week.
        The progress update should be in markdown format.
        The progress update should be in the following format:
        # Progress Update
        ## Achivements
        ## Blockers
        ## Next Week's Goals
        ## Meetings

        You get the context of the users email and trello board.

        Example: 
        # Progress Update
        ## Achivements
        - Closed EU client Superscale.ai for 500k
        ## Blockers
        - We need legal approval for deployment
        ## Next Week's Goals
        - Get legal approval for deployment
        ## Meetings
        - Meeting with the EU client Superscale.ai on 2025-08-30
        `,
    });

    return Response.json({ response: text });
}

