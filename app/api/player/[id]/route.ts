import { supabase } from "@/utils/supabase";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const playerId = (await params).id;

  const player = await supabase.from("players").delete().eq("id", playerId);
  if (player.error) {
    return NextResponse.json(
      { error: "Failed to delete player" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }

  return new Response(null, { status: StatusCodes.NO_CONTENT });
}
