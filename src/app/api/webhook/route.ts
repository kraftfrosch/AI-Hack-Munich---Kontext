export async function POST(req: Request) {

    const json = await req.json();
    if (json["type"] === 0) {
        return Response.json({ message: "Webhook received" }, { status: 204 })
    }


    console.log("Webhook received");

    const message = "Start your weekly project report: https://ai-hack-munich-kontext-5moe.vercel.app/update/review";
    // Send message to Discord
    await fetch("https://ai-hack-munich-kontext-5moe.vercel.app/api/discord", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ "message": message }),
    });

    return Response.json({ message: message });
}