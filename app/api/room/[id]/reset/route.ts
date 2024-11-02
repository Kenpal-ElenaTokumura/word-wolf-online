import { RoomStatus } from "@/utils/common";
import { supabase } from "@/utils/supabase";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const roomId = (await params).id;

  // Reset the players' is_wolf to false
  // Reset the players' is_voted to false
  // Reset the players' voted_count to 0
  const players = await supabase
    .from("players")
    .update({
      is_wolf: false,
      is_voted: false,
      voted_count: 0,
    })
    .eq("room_id", roomId);
  if (players.error) {
    return NextResponse.json(
      { error: "Failed to update player status" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }

  // Reset the room status to WAITING
  // Reset the room topics to NULL
  // Reset the room end_at to NULL
  const room = await supabase
    .from("rooms")
    .update({
      status: RoomStatus.WAITING,
      majority_word: null,
      wolf_word: null,
      end_at: null,
    })
    .eq("id", roomId);
  if (room.error) {
    return NextResponse.json(
      { error: "Failed to update room status" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }

  return new Response(null, { status: StatusCodes.NO_CONTENT });
}
