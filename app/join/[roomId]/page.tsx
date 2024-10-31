import PlayerCreateForm from "@/components/form/PlayerCreateForm";
import NavBar from "@/components/NavBar";
import { RoomStatus } from "@/utils/common";
import { createPlayer } from "@/utils/player";
import { supabase } from "@/utils/supabase";
import { Grid2 as Grid, Stack, Typography } from "@mui/material";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: Readonly<{ params: Promise<{ roomId: string }> }>) {
  const { roomId } = await params;

  const room = await supabase.from("rooms").select().eq("id", roomId).single();
  if (!room.data || room.error) {
    notFound();
  }

  return (
    <main>
      <NavBar />
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "80vh" }}
      >
        <Grid>
          {room.data.status === RoomStatus.WAITING && (
            <PlayerCreateForm roomId={roomId} createPlayer={createPlayer} />
          )}
          {room.data.status !== RoomStatus.WAITING && (
            <Stack alignItems={"center"}>
              <Typography variant="h5">ゲームが進行中</Typography>
              <Typography variant="h6">
                ゲームが進行中のため、新しいプレイヤーは参加できません。
              </Typography>
              <Typography variant="subtitle1">
                ゲームが終了するまでお待ちください。
              </Typography>
            </Stack>
          )}
        </Grid>
      </Grid>
    </main>
  );
}
