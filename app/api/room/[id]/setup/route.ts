import { RoomStatus } from "@/utils/common";
import callModel from "@/utils/llm";
import { Player, supabase } from "@/utils/supabase";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const roomId = (await params).id;

  const validationResult = await validateRequest(request);
  if (validationResult instanceof NextResponse) {
    return validationResult;
  }
  const { category, playTimeMins } = validationResult;

  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .select()
    .eq("id", roomId)
    .single();
  if (roomError || !room) {
    return NextResponse.error();
  }

  if (room.status !== RoomStatus.WAITING) {
    return NextResponse.json(
      { error: "Room is not waiting to setup" },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  const { data: players, error: playersError } = await supabase
    .from("players")
    .select()
    .eq("room_id", roomId);
  if (playersError || !players) {
    return NextResponse.error();
  }
  if (players.length < 3) {
    return NextResponse.json(
      { error: "At least 3 players are required" },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  const topics = await callModel(category, roomId);
  const wolf = await decideWolf(roomId);
  const gameSec = playTimeMins * 60;

  if (!wolf) {
    return NextResponse.json(
      { error: "Failed to decide wolf" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }

  // update players
  const wolfResult = await supabase
    .from("players")
    .update({ is_wolf: true })
    .eq("id", wolf.id);
  if (wolfResult.error) {
    console.error(wolfResult.error);
    return NextResponse.json(
      { error: "Failed to update player" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
  // update room
  const roomResult = await supabase
    .from("rooms")
    .update({
      status: RoomStatus.READY,
      majority_word: topics.majorityWord,
      wolf_word: topics.wolfWord,
      game_sec: gameSec,
    })
    .eq("id", roomId);
  if (roomResult.error) {
    console.error(roomResult.error);
    return NextResponse.json(
      { error: "Failed to update room" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }

  return new Response(null, { status: StatusCodes.NO_CONTENT });
}

async function validateRequest(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json(
      { error: "content-type must be application/json" },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  const { category, playTimeMins } = await request.json();

  // category optional string
  if (category && typeof category !== "string") {
    return NextResponse.json(
      { error: "category must be string" },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  // endTime optional number
  if (playTimeMins && typeof playTimeMins !== "number" && playTimeMins > 60) {
    return NextResponse.json(
      { error: "playMins must be number under 60" },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  return { category: category ?? "ランダム", playTimeMins: playTimeMins ?? 5 };
}

async function decideWolf(roomId: string) {
  // get players
  const { data: players, error: playersError } = await supabase
    .from("players")
    .select()
    .eq("room_id", roomId);
  if (playersError || !players) {
    return null;
  }

  // decide wolf
  const wolf = players[Math.floor(Math.random() * players.length)];

  return wolf as Player;
}
