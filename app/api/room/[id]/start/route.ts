import { RoomStatus } from "@/utils/common";
import { supabase } from "@/utils/supabase";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const roomId = (await params).id;

  const { data: currentRoom, error: currentRoomError } = await supabase
    .from("rooms")
    .select()
    .eq("id", roomId)
    .single();
  if (currentRoomError || !currentRoom) {
    return NextResponse.error();
  }

  if (currentRoom.status !== RoomStatus.READY) {
    return NextResponse.json(
      { error: "Room is not ready to start" },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  const endAt = Date.now() + currentRoom.game_sec * 1000;
  const endAtString = new Date(endAt).toISOString();

  const { error: roomError } = await supabase
    .from("rooms")
    .update({ status: RoomStatus.DISCUSSING, end_at: endAtString })
    .eq("id", roomId)
    .single();
  if (roomError) {
    return NextResponse.error();
  }

  return new Response(null, { status: StatusCodes.NO_CONTENT });
}
