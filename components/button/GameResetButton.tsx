"use client";

import { Button } from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { ROOT_URL } from "@/utils/common";

function reset(roomId: string) {
  fetch(new URL(`/api/room/${roomId}/reset`, ROOT_URL), {
    method: "PATCH",
  });
}

interface GameResetButtonProps {
  roomId: string;
}

export default function GameResetButton({
  roomId,
}: Readonly<GameResetButtonProps>) {
  return (
    <Button
      variant="contained"
      sx={{ backgroundColor: "#818FB4", color: "#ededed", width: "180px" }}
      endIcon={<RestartAltIcon />}
      onClick={() => reset(roomId)}
    >
      ゲームをリセット
    </Button>
  );
}
