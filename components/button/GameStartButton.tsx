"use client";

import { Button } from "@mui/material";
import AlarmOnIcon from "@mui/icons-material/AlarmOn";
import { ROOT_URL } from "@/utils/common";

function gameStart(roomId: string) {
  fetch(new URL(`/api/room/${roomId}/start`, ROOT_URL), {
    method: "PATCH",
  });
}

interface GameStartButtonProps {
  roomId: string;
  disabled?: boolean;
}

export default function GameStartButton({
  roomId,
  disabled = false,
}: Readonly<GameStartButtonProps>) {
  return (
    <Button
      variant="contained"
      sx={{ backgroundColor: "#818FB4", color: "#ededed", width: "180px" }}
      endIcon={<AlarmOnIcon />}
      onClick={() => gameStart(roomId)}
      disabled={disabled}
    >
      ゲームを開始
    </Button>
  );
}
