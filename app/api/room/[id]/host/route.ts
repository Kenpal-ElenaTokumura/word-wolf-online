import { supabase } from "@/utils/supabase";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const roomId = (await params).id;

  if (request.headers.get("content-type") !== "application/json") {
    return NextResponse.json(
      { error: "content-type must be application/json" },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  const { hostId } = await request.json();
  if (!hostId || typeof hostId !== "string") {
    return NextResponse.json(
      { error: "host_id is required and must be a string" },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  const { data: player, error: playerError } = await supabase
    .from("players")
    .update({ room_id: roomId })
    .match({ id: hostId })
    .single();
  if (playerError) {
    return NextResponse.json(playerError, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }

  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .update({ host_id: hostId })
    .match({ id: roomId })
    .single();
  if (roomError) {
    return NextResponse.json(roomError, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }

  return NextResponse.json({ room, player }, { status: StatusCodes.OK });
}
