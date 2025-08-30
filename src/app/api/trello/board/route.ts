import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const boardId = url.searchParams.get("boardId") || "68b2d261fd8b6b2f72c7167d";

  if (!boardId) {
    return NextResponse.json({ error: "Missing boardId" }, { status: 400 });
  }

  const apiKey = process.env.TRELLO_API_KEY || process.env.NEXT_PUBLIC_TRELLO_API_KEY;
  const token = process.env.TRELLO_TOKEN || process.env.NEXT_PUBLIC_TRELLO_TOKEN;

  if (!apiKey || !token) {
    return NextResponse.json(
      { error: "Missing Trello credentials (TRELLO_API_KEY/TRELLO_TOKEN)" },
      { status: 500 }
    );
  }

  const trelloUrl = new URL(`https://api.trello.com/1/boards/${boardId}`);
  trelloUrl.searchParams.set("key", apiKey);
  trelloUrl.searchParams.set("token", token);
  trelloUrl.searchParams.set("fields", "all");
  trelloUrl.searchParams.set("lists", "all");
  trelloUrl.searchParams.set("list_fields", "all");
  trelloUrl.searchParams.set("cards", "all");
  trelloUrl.searchParams.set("card_fields", "all");
  trelloUrl.searchParams.set("members", "all");
  trelloUrl.searchParams.set("member_fields", "all");
  trelloUrl.searchParams.set("labels", "all");
  trelloUrl.searchParams.set("checklists", "all");

  const resp = await fetch(trelloUrl.toString(), { cache: "no-store" });
  if (!resp.ok) {
    const text = await resp.text();
    return NextResponse.json(
      { error: `Trello error ${resp.status}: ${text}` },
      { status: resp.status }
    );
  }

  const data = await resp.json();
  return NextResponse.json(data);
}


