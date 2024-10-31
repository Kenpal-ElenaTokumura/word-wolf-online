"use client";

import { Player } from "@/utils/supabase";
import { Box, Stack, Typography } from "@mui/material";
import GameStartButton from "../button/GameStartButton";

interface WaitingStartProps {
  isHost: boolean;
  roomId: string;
  players: Player[];
}

export default function WaitingStart({
  isHost,
  roomId,
  players,
}: Readonly<WaitingStartProps>) {
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
        {isHost ? "準備完了" : "まもなく始まります"}
      </Typography>
      <Typography variant="subtitle1" textAlign={"center"} marginTop={1}>
        {isHost ? "さあ、始めましょう！" : "ホストの開始を待っています"}
      </Typography>
      {isHost && (
        <Box alignSelf={"center"} marginTop={1}>
          <GameStartButton roomId={roomId} />
        </Box>
      )}
    </Stack>
  );
}
