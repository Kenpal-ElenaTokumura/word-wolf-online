"use client";

import { Button } from "@mui/material";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { ROOT_URL } from "@/utils/common";

function overtimeStart(roomId: string) {
  fetch(new URL(`/api/room/${roomId}/overtime`, ROOT_URL), {
    method: "PATCH",
  });
}

interface OvertimeStartButtonProps {
  roomId: string;
  disabled?: boolean;
}

export default function OvertimeStartButton({
  roomId,
  disabled = false,
}: Readonly<OvertimeStartButtonProps>) {
  return (
    <Button
      variant="contained"
      sx={{ backgroundColor: "#818FB4", color: "#ededed", width: "180px" }}
      endIcon={<KeyboardReturnIcon />}
      onClick={() => overtimeStart(roomId)}
      disabled={disabled}
    >
      延長戦を開始
    </Button>
  );
}
