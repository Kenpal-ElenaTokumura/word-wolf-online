"use client";

import { ROOT_URL } from "@/utils/common";
import { Player } from "@/utils/supabase";
import {
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

interface VoteFormProps {
  roomId: string;
  playerId: string;
  players: Player[];
}

export default function VoteForm({
  roomId,
  playerId,
  players,
}: Readonly<VoteFormProps>) {
  const [voteTargetId, setVoteTargetId] = useState<string>("");
  const [isVoted, setIsVoted] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  async function votePost(event: React.FormEvent<HTMLFormElement>) {
    setIsProcessing(true);
    event.preventDefault();
    await fetch(new URL(`/api/player/${playerId}/vote`, ROOT_URL), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roomId: roomId,
        targetId: voteTargetId,
      }),
    });
    setIsVoted(true);
    setIsProcessing(false);
  }

  useEffect(() => {
    const player = players.find((player) => player.id === playerId);
    if (player?.is_voted) {
      setIsVoted(true);
    } else {
      setIsVoted(false);
    }
  }, [players, isVoted]);

  return (
    <form onSubmit={votePost}>
      <Stack spacing={0.5} marginY={1}>
        <Typography variant="subtitle2" textAlign={"center"}>
          人狼だと思うプレイヤーを選んでください
        </Typography>
        <Select
          value={voteTargetId}
          onChange={(event: SelectChangeEvent) => {
            setVoteTargetId(event.target.value);
          }}
          required
          disabled={isVoted || isProcessing}
        >
          {players.map((player) => (
            <MenuItem key={player.id} value={player.id}>
              {player.player_name}
            </MenuItem>
          ))}
        </Select>
        <Button
          type="submit"
          variant="contained"
          sx={{ backgroundColor: "#818FB4", color: "#ededed" }}
          disabled={isVoted || isProcessing}
        >
          投票
        </Button>
      </Stack>
    </form>
  );
}
