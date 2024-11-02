"use client";

import { ROOT_URL } from "@/utils/common";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { Button } from "@mui/material";
import { useState } from "react";

interface GameResetButtonProps {
  roomId: string;
}

export default function GameResetButton({
  roomId,
}: Readonly<GameResetButtonProps>) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function reset(roomId: string) {
    setIsLoading(true);
    await fetch(new URL(`/api/room/${roomId}/reset`, ROOT_URL), {
      method: "PATCH",
    });
    setIsLoading(false);
  }

  return (
    <Button
      variant="contained"
      sx={{ backgroundColor: "#818FB4", color: "#ededed", width: "180px" }}
      endIcon={<RestartAltIcon />}
      onClick={() => reset(roomId)}
      disabled={isLoading}
    >
      ゲームをリセット
    </Button>
  );
}
