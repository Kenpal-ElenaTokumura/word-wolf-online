"use client";

import { Box, Stack, Typography } from "@mui/material";
import ShowResultButton from "../button/ShowResultButton";
import { Player } from "@/utils/supabase";
import VoteForm from "../form/VoteForm";
import { useEffect, useState } from "react";

interface VotingProps {
  isHost: boolean;
  roomId: string;
  playerId: string;
  players: Player[];
  topic: string;
}

export default function Voting({
  isHost,
  roomId,
  playerId,
  players,
  topic,
}: Readonly<VotingProps>) {
  const [votedNum, setVotedNum] = useState<number>(0);

  useEffect(() => {
    const votedPlayers = players.filter((player) => player.is_voted);
    setVotedNum(votedPlayers.length);
  }, [players]);

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
        投票中
      </Typography>
      <Typography variant="subtitle1" textAlign={"center"}>
        あなたのお題は {topic} です
      </Typography>
      <VoteForm roomId={roomId} playerId={playerId} players={players} />
      <Typography variant="subtitle2" textAlign={"center"} marginTop={1}>
        {votedNum} / {players.length} 人が投票しました
      </Typography>
      {isHost && (
        <>
          <Box alignSelf={"center"} marginTop={1}>
            <ShowResultButton
              roomId={roomId}
              disabled={
                players.filter((player) => player.is_voted).length !==
                players.length
              }
            />
          </Box>
          <Typography variant="caption" textAlign={"center"} marginTop={1}>
            全員が投票すると、結果を表示できます
          </Typography>
        </>
      )}
    </Stack>
  );
}
