"use client";

import { Player, supabase } from "@/utils/supabase";
import { Box, Chip, CircularProgress, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import OvertimeStartButton from "../button/OvertimeStartButton";

interface ReadyToOvertimeProps {
  isHost: boolean;
  roomId: string;
}

export default function ReadyToOvertime({
  isHost,
  roomId,
}: Readonly<ReadyToOvertimeProps>) {
  const [maxVotedPlayers, setMaxVotedPlayers] = useState<Player[] | null>(null);

  useEffect(() => {
    async function setMaxVoted() {
      const players = await supabase
        .from("players")
        .select()
        .eq("room_id", roomId);
      if (!players.data || players.error) {
        return;
      }
      const maxVotedCount = players.data.reduce((acc, player) => {
        return Math.max(acc, player.voted_count);
      }, 0);
      setMaxVotedPlayers(
        players.data.filter((player) => player.voted_count === maxVotedCount)
      );
    }

    setMaxVoted();
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
        同票となりました
      </Typography>
      <Box alignSelf={"center"} marginY={1}>
        <Typography variant="subtitle2" textAlign={"center"}>
          最多得票プレイヤー
        </Typography>
        {!maxVotedPlayers && <CircularProgress color="inherit" />}
        <Stack spacing={0.5}>
          {maxVotedPlayers?.map((player) => (
            <Chip label={player.player_name} key={player.id} />
          ))}
        </Stack>
      </Box>
      <Typography variant="subtitle1" textAlign={"center"}>
        {isHost
          ? "1分間の延長戦を開始してください"
          : "まもなく1分間の延長戦が始まります"}
      </Typography>
      {isHost && (
        <Box alignSelf={"center"} marginTop={1}>
          <OvertimeStartButton roomId={roomId} />
        </Box>
      )}
    </Stack>
  );
}
