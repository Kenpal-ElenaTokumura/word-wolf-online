"use client";

import { ROOT_URL } from "@/utils/common";
import AlarmOnIcon from "@mui/icons-material/AlarmOn";
import { Button } from "@mui/material";
import { useState } from "react";

interface GameStartButtonProps {
  roomId: string;
  disabled?: boolean;
}

export default function GameStartButton({
  roomId,
  disabled = false,
}: Readonly<GameStartButtonProps>) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function gameStart(roomId: string) {
    setIsLoading(true);
    await fetch(new URL(`/api/room/${roomId}/start`, ROOT_URL), {
      method: "PATCH",
    });
  }

  return (
    <Button
      variant="contained"
      sx={{ backgroundColor: "#818FB4", color: "#ededed", width: "180px" }}
      endIcon={<AlarmOnIcon />}
      onClick={() => gameStart(roomId)}
      disabled={disabled || isLoading}
    >
      ゲームを開始
    </Button>
  );
}
