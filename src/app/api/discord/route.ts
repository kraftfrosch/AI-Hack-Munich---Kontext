import {
    Client,
    GatewayIntentBits,
    Partials,
    type TextChannel,
} from "discord.js";

// Initialize bot
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Channel],
});

let isBotReady = false;

client.once("ready", async () => {
    if (!client.user) return;
    console.log(`Discord bot is online as ${client.user.tag}`);
    isBotReady = true;
});

// Login the bot
const token = process.env.DISCORD_TOKEN;
if (!token) {
    throw new Error(
        "DISCORD_TOKEN is not set. Please set your Discord bot token.",
    );
}

client.login(token);

export async function POST(req: Request) {
    try {
        const { message } = await req.json();

        if (!message) {
            return Response.json({ error: "Message is required" }, { status: 400 });
        }

        // Use provided channelId or fall back to environment variable
        const targetChannelId = process.env.DISCORD_CHANNEL_ID || "<1410308102468796566>";

        if (!targetChannelId) {
            return Response.json(
                { error: "Channel ID is required (either in request body or DISCORD_CHANNEL_ID env var)" },
                { status: 400 },
            );
        }

        // Wait for bot to be ready (with timeout)
        let attempts = 0;
        const maxAttempts = 10;
        while (!isBotReady && attempts < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            attempts++;
        }

        if (!isBotReady) {
            return Response.json(
                { error: "Discord bot is not ready" },
                { status: 503 },
            );
        }

        // Clean channel ID (remove Discord formatting)
        const cleanChannelId = targetChannelId.trim().replace(/[<#@&!>]/g, "");

        // Fetch the channel
        const channel = (await client.channels.fetch(
            cleanChannelId,
        )) as TextChannel;

        if (!channel) {
            return Response.json({ error: "Channel not found" }, { status: 404 });
        }

        if (!channel.isTextBased()) {
            return Response.json(
                { error: "Channel is not a text channel" },
                { status: 400 },
            );
        }

        // Send the message
        const sentMessage = await channel.send(message);

        return Response.json({
            success: true,
            messageId: sentMessage.id,
            channelId: cleanChannelId,
        });
    } catch (error) {
        console.error("Discord API error:", error);
        return Response.json(
            { error: "Failed to send Discord message" },
            { status: 500 },
        );
    }
}

export async function GET() {
    return Response.json({
        status: isBotReady ? "ready" : "connecting",
        botUser: client.user?.tag || null,
    });
}
