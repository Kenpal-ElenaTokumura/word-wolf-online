"use client";

import { Player, Room, supabase } from "@/utils/supabase";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import GameResetButton from "../button/GameResetButton";

interface ResultProps {
  isHost: boolean;
  roomId: string;
  room: Room;
}

export default function Result({
  isHost,
  roomId,
  room,
}: Readonly<ResultProps>) {
  const [maxVotedPlayer, setMaxVotedPlayer] = useState<Player | null>(null);

  useEffect(() => {
    async function fetchPlayers() {
      const players = await supabase
        .from("players")
        .select()
        .eq("room_id", roomId);
      if (!players.data || players.error) {
        return;
      }
      setMaxVotedPlayer(
        players.data.reduce(
          (max, player) =>
            player.voted_count > max.voted_count ? player : max,
          { player_name: "none", voted_count: 0 } as Player
        )
      );
    }

    fetchPlayers();
  }, []);

  return (
    <Stack
      justifySelf={"center"}
      sx={{
        width: "300px",
        backgroundColor: "#EEEEEE",
        borderRadius: "10px",
        padding: 2,
        color: "#435585",
      }}
    >
      <Typography variant="h5" fontWeight={"700"} textAlign={"center"}>
        結果発表
      </Typography>
      <Typography textAlign={"center"} marginTop={1}>
        {!maxVotedPlayer && <CircularProgress color="inherit" />}
        {maxVotedPlayer &&
          `投票の結果、${maxVotedPlayer.player_name} さんが吊られました`}
      </Typography>
      <Typography
        variant="h6"
        fontWeight={"600"}
        textAlign={"center"}
        margin={1}
      >
        {maxVotedPlayer &&
          `${maxVotedPlayer.is_wolf ? "村人" : "人狼"} の勝利です`}
      </Typography>
      <table
        style={{ margin: "0 0 1rem", padding: "0.25rem 0.5rem", border: "solid" }}
      >
        <thead>
          <tr>
            <th>村人のお題</th>
            <th>人狼のお題</th>
          </tr>
        </thead>
        <tbody>
          <tr key="topics">
            <td style={{ textAlign: "center" }}>{room.majority_word}</td>
            <td style={{ textAlign: "center" }}>{room.wolf_word}</td>
          </tr>
        </tbody>
      </table>
      {isHost && (
        <Box alignSelf={"center"}>
          <GameResetButton roomId={roomId} />
        </Box>
      )}
    </Stack>
  );
}
