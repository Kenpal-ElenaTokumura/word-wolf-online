import { RoomStatus } from "@/utils/common";
import { supabase } from "@/utils/supabase";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const roomId = (await params).id;

  // Check if the room is in VOTING status
  const room = await supabase.from("rooms").select().eq("id", roomId).single();
  if (room.error || !room.data) {
    return NextResponse.json(
      { error: "Room not found" },
      { status: StatusCodes.NOT_FOUND }
    );
  }
  if (room.data.status !== RoomStatus.VOTING) {
    return NextResponse.json(
      { error: "Room is not in voting status" },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  // Check if all players have voted
  const players = await supabase.from("players").select().eq("room_id", roomId);
  if (players.error || !players.data) {
    return NextResponse.json(
      { error: "Players not found" },
      { status: StatusCodes.NOT_FOUND }
    );
  }
  const votedPlayers = players.data.filter((player) => player.is_voted);
  if (votedPlayers.length !== players.data.length) {
    return NextResponse.json(
      { error: "Not all players have voted" },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  // Check if max voted count is duplicated
  const maxVotedCount = players.data.reduce((acc, player) => {
    return Math.max(acc, player.voted_count);
  }, 0);
  const maxVotedPlayers = players.data.filter(
    (player) => player.voted_count === maxVotedCount
  );
  const updateStatus =
    maxVotedPlayers.length === 1
      ? RoomStatus.GAME_OVER
      : RoomStatus.READY_TO_OVERTIME;

  // Update room status
  const updateRoomResult = await supabase
    .from("rooms")
    .update({ status: updateStatus })
    .eq("id", roomId);
  if (updateRoomResult.error) {
    return NextResponse.json(
      { error: "Failed to update room status" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }

  return NextResponse.json(
    { room: room.data, players: players.data },
    { status: StatusCodes.OK }
  );
}
