import { supabase } from "@/utils/supabase";
import { StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";
import { generate } from "random-words";

export async function POST() {
  const id = generate({ exactly: 3, join: "-" });

  const { data, error } = await supabase
    .from("rooms")
    .insert({ id })
    .select()
    .single();
  if (error) {
    return NextResponse.json(error, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }

  return NextResponse.json(data, { status: StatusCodes.CREATED });
}
