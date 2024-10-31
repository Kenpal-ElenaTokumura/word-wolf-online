"use client";

import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import { Button } from "@mui/material";
import { redirect } from "next/navigation";

export default function CreateButton() {
  return (
    <Button
      variant="contained"
      sx={{ width: "150px", backgroundColor: "#818FB4", color: "#ededed" }}
      startIcon={<MeetingRoomIcon />}
      onClick={() => redirect("/create")}
    >
      ルームを作成
    </Button>
  );
}
