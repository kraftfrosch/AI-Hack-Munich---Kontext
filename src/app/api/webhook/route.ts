export async function POST(req: Request) {

    console.log("Webhook received");

    // Send message to Discord
    await fetch("http://localhost:3000/api/discord", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ "message": "Start your weekly project report: https://ai-hack-munich-kontext-5moe.vercel.app/update/review" }),
    });

    return Response.json({ message: "Webhook received" });
}