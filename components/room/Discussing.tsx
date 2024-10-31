"use client";

import { Stack, Typography } from "@mui/material";
import VoteStartButton from "../button/VoteStartButton";
import CountDownTimer from "../CountDownTimer";
import { Room } from "@/utils/supabase";

interface DiscussingProps {
  isHost: boolean;
  roomId: string;
  room: Room;
  topic: string;
}

export default function Discussing({
  isHost,
  roomId,
  room,
  topic,
}: Readonly<DiscussingProps>) {
  const endAt = room.end_at ? new Date(room.end_at) : null;
  const milliSeconds = endAt ? endAt.getTime() - Date.now() : 0;
  const seconds = Math.floor(milliSeconds / 1000);

  return (
    <Stack
      justifySelf={"center"}
      sx={{
        width: "300px",
        backgroundColor: "#EEEEEE",
        borderRadius: "10px",
        padding: 2,
        color: "#435585",
      }}
    >
      <Typography variant="h5" fontWeight={"700"} textAlign={"center"}>
        議論中
      </Typography>
      <Typography variant="subtitle1" textAlign={"center"}>
        あなたのお題は {topic} です
      </Typography>
      <CountDownTimer seconds={seconds} />
      <Typography variant="subtitle2" textAlign={"center"} marginTop={1}>
        人狼だと思うプレイヤーを探し出してください
      </Typography>
      {isHost && (
        <Stack spacing={1} alignItems={"center"} marginTop={2}>
          <VoteStartButton roomId={roomId} />
          <Typography variant="caption">
            議論を即時に終了し、投票を開始します
          </Typography>
        </Stack>
      )}
    </Stack>
  );
}
