"use client";

import { Button } from "@mui/material";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import { ROOT_URL } from "@/utils/common";

function voteStart(roomId: string) {
  fetch(new URL(`/api/room/${roomId}/result`, ROOT_URL));
}

interface ShowResultButtonProps {
  roomId: string;
  disabled?: boolean;
}

export default function ShowResultButton({
  roomId,
  disabled = false,
}: Readonly<ShowResultButtonProps>) {
  return (
    <Button
      variant="contained"
      sx={{ backgroundColor: "#818FB4", color: "#ededed", width: "180px" }}
      endIcon={<FactCheckIcon />}
      onClick={() => voteStart(roomId)}
      disabled={disabled}
    >
      結果を表示
    </Button>
  );
}
