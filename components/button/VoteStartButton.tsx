"use client";

import { Button } from "@mui/material";
import HowToVoteIcon from "@mui/icons-material/HowToVote";
import { ROOT_URL } from "@/utils/common";
import { useState } from "react";

interface VoteStartButtonProps {
  roomId: string;
  disabled?: boolean;
}

export default function VoteStartButton({
  roomId,
  disabled = false,
}: Readonly<VoteStartButtonProps>) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function voteStart(roomId: string) {
    setIsLoading(true);
    await fetch(new URL(`/api/room/${roomId}/vote`, ROOT_URL), {
      method: "PATCH",
    });
  }

  return (
    <Button
      variant="contained"
      sx={{ backgroundColor: "#818FB4", color: "#ededed", width: "180px" }}
      endIcon={<HowToVoteIcon />}
      onClick={() => voteStart(roomId)}
      disabled={disabled || isLoading}
    >
      投票を開始
    </Button>
  );
}
