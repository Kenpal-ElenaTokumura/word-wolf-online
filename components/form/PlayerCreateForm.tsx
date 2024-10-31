"use client";

import { Player, Room } from "@/utils/supabase";
import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  Grid2 as Grid,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import { redirect } from "next/navigation";
import { FormEvent, useState } from "react";

interface PlayerCreateFormProps {
  roomId: string;
  createPlayer: (
    name: string,
    roomId: string
  ) => Promise<
    | {
        room: Room;
        player: Player;
      }
    | Player
    | null
  >;
}

export default function PlayerCreateForm({
  roomId,
  createPlayer,
}: Readonly<PlayerCreateFormProps>) {
  const [playerName, setPlayerName] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!playerName) {
      return;
    }
    await createPlayer(playerName, roomId);
    setPlayerName("");
    redirect(`/${roomId}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack
        padding={2}
        sx={{ backgroundColor: "#EEEEEE", borderRadius: "10px" }}
      >
        <Box
          sx={{ color: "#435585", fontWeight: 700 }}
          justifySelf={"center"}
          marginX={"auto"}
          marginBottom={1}
        >
          プレイヤー名を入力してください
        </Box>
        <Grid
          container
          justifyContent={"center"}
          marginX={"auto"}
          spacing={0.5}
        >
          <Grid>
            <TextField
              id="playerName"
              name="playerName"
              label="Player Name"
              placeholder="I'm not wolf"
              required
              variant="outlined"
              sx={{ backgroundColor: "gainsboro", borderRadius: "5px" }}
              type="text"
              value={playerName}
              onChange={(event) => setPlayerName(event.target.value)}
            />
          </Grid>
          <Grid alignSelf={"center"}>
            <IconButton
              aria-label="Create Player"
              color="primary"
              type="submit"
            >
              <SendIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Stack>
    </form>
  );
}
