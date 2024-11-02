"use client";

import { ROOT_URL } from "@/utils/common";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import { Button } from "@mui/material";
import { useState } from "react";

interface ShowResultButtonProps {
  roomId: string;
  disabled?: boolean;
}

export default function ShowResultButton({
  roomId,
  disabled = false,
}: Readonly<ShowResultButtonProps>) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function voteStart(roomId: string) {
    setIsLoading(true);
    await fetch(new URL(`/api/room/${roomId}/result`, ROOT_URL));
  }

  return (
    <Button
      variant="contained"
      sx={{ backgroundColor: "#818FB4", color: "#ededed", width: "180px" }}
      endIcon={<FactCheckIcon />}
      onClick={() => voteStart(roomId)}
      disabled={disabled || isLoading}
    >
      結果を表示
    </Button>
  );
}
