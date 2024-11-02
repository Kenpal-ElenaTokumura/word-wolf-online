"use client";

import { ROOT_URL } from "@/utils/common";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { Button } from "@mui/material";
import { useState } from "react";

interface OvertimeStartButtonProps {
  roomId: string;
  disabled?: boolean;
}

export default function OvertimeStartButton({
  roomId,
  disabled = false,
}: Readonly<OvertimeStartButtonProps>) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function overtimeStart(roomId: string) {
    setIsLoading(true);
    await fetch(new URL(`/api/room/${roomId}/overtime`, ROOT_URL), {
      method: "PATCH",
    });
  }

  return (
    <Button
      variant="contained"
      sx={{ backgroundColor: "#818FB4", color: "#ededed", width: "180px" }}
      endIcon={<KeyboardReturnIcon />}
      onClick={() => overtimeStart(roomId)}
      disabled={disabled || isLoading}
    >
      延長戦を開始
    </Button>
  );
}
