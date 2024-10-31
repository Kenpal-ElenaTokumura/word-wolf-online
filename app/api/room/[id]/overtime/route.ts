import { RoomStatus } from "@/utils/common";
import { supabase } from "@/utils/supabase";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const roomId = (await params).id;

  const room = await supabase.from("rooms").select().eq("id", roomId).single();
  if (room.error || !room.data) {
    return NextResponse.json(
      { error: "Room not found" },
      { status: StatusCodes.NOT_FOUND }
    );
  }
  if (room.data.status !== RoomStatus.READY_TO_OVERTIME) {
    return NextResponse.json(
      { error: "Room is not in READY_TO_RE_VOTE status" },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  const endAt = Date.now() + 60 * 1000;
  const endAtString = new Date(endAt).toISOString();

  const roomResult = await supabase
    .from("rooms")
    .update({
      status: RoomStatus.DISCUSSING,
      game_sec: 60,
      end_at: endAtString,
    })
    .eq("id", roomId);
  if (roomResult.error) {
    return NextResponse.json(
      { error: "Failed to update room status" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
  const playersResult = await supabase
    .from("players")
    .update({ is_voted: false, voted_count: 0 })
    .eq("room_id", roomId);
  if (playersResult.error) {
    return NextResponse.json(
      { error: "Failed to update players" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }

  return new Response(null, { status: StatusCodes.NO_CONTENT });
}
