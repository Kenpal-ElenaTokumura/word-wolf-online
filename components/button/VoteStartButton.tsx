"use client";

import { Button } from "@mui/material";
import HowToVoteIcon from "@mui/icons-material/HowToVote";
import { ROOT_URL } from "@/utils/common";

function voteStart(roomId: string) {
  fetch(new URL(`/api/room/${roomId}/vote`, ROOT_URL), {
    method: "PATCH",
  });
}

interface VoteStartButtonProps {
  roomId: string;
  disabled?: boolean;
}

export default function VoteStartButton({
  roomId,
  disabled = false,
}: Readonly<VoteStartButtonProps>) {
  return (
    <Button
      variant="contained"
      sx={{ backgroundColor: "#818FB4", color: "#ededed", width: "180px" }}
      endIcon={<HowToVoteIcon />}
      onClick={() => voteStart(roomId)}
      disabled={disabled}
    >
      投票を開始
    </Button>
  );
}
