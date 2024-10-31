import { RoomStatus } from "@/utils/common";
import { supabase } from "@/utils/supabase";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  if (request.headers.get("content-type") !== "application/json") {
    return NextResponse.json(
      { error: "content-type must be application/json" },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  const { playerName, roomId } = await request.json();
  if (!playerName || typeof playerName !== "string") {
    return NextResponse.json(
      { error: "player_name is required and must be a string" },
      { status: StatusCodes.BAD_REQUEST }
    );
  }
  if (!roomId || typeof roomId !== "string") {
    return NextResponse.json(
      { error: "room_id is required and must be a string" },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .select()
    .eq("id", roomId)
    .single();
  if (roomError || !room) {
    return NextResponse.json(
      { error: "Room not found" },
      { status: StatusCodes.NOT_FOUND }
    );
  }
  if (room.status !== RoomStatus.WAITING) {
    return NextResponse.json(
      { error: "New players cannot join an ongoing session" },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  const { data: player, error: playerError } = await supabase
    .from("players")
    .insert({ player_name: playerName, room_id: roomId })
    .select()
    .single();
  if (playerError) {
    return NextResponse.json(playerError, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }

  return NextResponse.json(player, { status: StatusCodes.CREATED });
}
