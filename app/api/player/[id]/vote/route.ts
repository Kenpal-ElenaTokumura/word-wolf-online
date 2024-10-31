import { RoomStatus } from "@/utils/common";
import { supabase } from "@/utils/supabase";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const playerId = (await params).id;

  const validationResult = await validateRequest(request);
  if (validationResult instanceof NextResponse) {
    return validationResult;
  }
  const { roomId, targetId } = validationResult;

  // Check if the room is in VOTING status
  const room = await supabase
    .from("rooms")
    .select("status")
    .eq("id", roomId)
    .single();
  if (room.error || !room.data) {
    return NextResponse.json(
      { error: "Room not found" },
      { status: StatusCodes.NOT_FOUND }
    );
  }
  if (room.data.status !== RoomStatus.VOTING) {
    return NextResponse.json(
      { error: "Room is not in VOTING status" },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  // Check if the player has already
  const player = await supabase
    .from("players")
    .select("is_voted")
    .eq("id", playerId)
    .single();
  if (player.error || !player.data) {
    return NextResponse.json(
      { error: "Player not found" },
      { status: StatusCodes.NOT_FOUND }
    );
  }
  if (player.data.is_voted) {
    return NextResponse.json(
      { error: "Player has already voted" },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  // Update player's is_voted to true
  const voteFrom = await supabase
    .from("players")
    .update({ is_voted: true })
    .eq("id", playerId)
    .single();
  if (voteFrom.error) {
    return NextResponse.error();
  }

  // Increment the voted_count of the target player
  const voteTo = await supabase.rpc("voted_count_increment", {
    row_id: targetId,
  });
  if (voteTo.error) {
    return NextResponse.error();
  }

  return new Response(null, { status: StatusCodes.NO_CONTENT });
}

async function validateRequest(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json(
      { error: "Invalid content-type" },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  const { roomId, targetId } = await request.json();
  if (!roomId || typeof roomId !== "string") {
    return NextResponse.json(
      { error: "roomId is required" },
      { status: StatusCodes.BAD_REQUEST }
    );
  }
  if (!targetId || typeof targetId !== "string") {
    return NextResponse.json(
      { error: "targetId is required" },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  return { roomId, targetId };
}
