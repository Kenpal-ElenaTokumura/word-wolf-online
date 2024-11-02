import GameResetButton from "@/components/button/GameResetButton";
import NavBar from "@/components/NavBar";
import RealtimeContainer from "@/components/room/RealtimeContainer";
import { supabase } from "@/utils/supabase";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid2 as Grid,
  Stack,
} from "@mui/material";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

export default async function Page({
  params,
}: Readonly<{ params: Promise<{ roomId: string }> }>) {
  const { roomId } = await params;

  // Check if the room exists
  const room = await supabase.from("rooms").select().eq("id", roomId).single();
  if (!room.data || room.error) {
    notFound();
  }

  // Check if the player is in the room
  const playerId = (await cookies()).get("playerId")?.value;
  if (!playerId) {
    redirect(`/join/${roomId}`);
  }
  const player = await supabase
    .from("players")
    .select()
    .eq("id", playerId)
    .single();
  if (!player.data || player.error || player.data.room_id !== roomId) {
    redirect(`/join/${roomId}`);
  }

  // Get all players in the room
  const players = await supabase
    .from("players")
    .select()
    .eq("room_id", roomId)
    .order("created_at", { ascending: true });
  if (!players.data || players.error) {
    notFound();
  }

  const isHost = room.data.host_id === playerId;

  return (
    <main>
      <NavBar isRoom isHost={isHost} />
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "80vh" }}
      >
        <Grid>
          <RealtimeContainer
            roomId={roomId}
            playerId={playerId}
            isHost={isHost}
            initialRoom={room.data}
            initialPlayers={players.data}
          />
          {isHost && (
            <Box
              justifySelf={"center"}
              margin={2}
              sx={{
                width: "300px",
                borderRadius: "10px",
                color: "#435585",
              }}
            >
              <Accordion
                sx={{
                  backgroundColor: "gray",
                  color: "#ededed",
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  ゲーム管理
                </AccordionSummary>
                <AccordionDetails>
                  <Stack alignItems={"center"}>
                    <GameResetButton roomId={roomId} />
                  </Stack>
                </AccordionDetails>
              </Accordion>
            </Box>
          )}
        </Grid>
      </Grid>
    </main>
  );
}
