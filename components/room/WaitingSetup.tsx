"use client";

import { ROOT_URL } from "@/utils/common";
import { Player, Room } from "@/utils/supabase";
import { Box, Chip, Stack, Typography } from "@mui/material";
import GameSetupForm from "../form/GameSetupForm";
import DisplayRoomUrl from "../DisplayRoomUrl";
import { useState } from "react";

interface WaitingSetupProps {
  isHost: boolean;
  roomId: string;
  room: Room;
  playerId: string;
  players: Player[];
}

export default function WaitingSetup({
  isHost,
  roomId,
  room,
  playerId,
  players,
}: Readonly<WaitingSetupProps>) {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  async function deletePlayer(playerId: string) {
    setIsProcessing(true);
    await fetch(new URL(`/api/player/${playerId}`, ROOT_URL), {
      method: "DELETE",
    });
    setIsProcessing(false);
  }

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
        ゲームを準備中
      </Typography>
      <Typography variant="subtitle1" textAlign={"center"}>
        {isHost ? "他のプレイヤーを待っています" : "ホストの準備を待っています"}
      </Typography>
      {isHost && (
        <>
          {
            <Box alignSelf={"center"} marginTop={1}>
              <Typography variant="subtitle2" textAlign={"center"}>
                参加者一覧
              </Typography>
              <Stack spacing={0.5}>
                {players.map((player) => {
                  if (player.id !== room.host_id) {
                    return (
                      <Chip
                        label={player.player_name}
                        key={player.id}
                        onDelete={() => {
                          deletePlayer(player.id);
                        }}
                        disabled={isProcessing}
                      />
                    );
                  } else {
                    return (
                      <Chip
                        label={player.player_name}
                        key={player.id}
                        color="info"
                      />
                    );
                  }
                })}
              </Stack>
            </Box>
          }
          <Box alignSelf={"center"} marginTop={2}>
            <GameSetupForm roomId={roomId} disabled={players.length < 3} />
          </Box>
        </>
      )}
      {!isHost && (
        <Box alignSelf={"center"} marginTop={1}>
          <Typography variant="subtitle2" textAlign={"center"}>
            参加者一覧
          </Typography>
          <Stack spacing={0.5}>
            {players.map((player) => (
              <Chip
                label={player.player_name}
                key={player.id}
                color={player.id === playerId ? "info" : "default"}
              />
            ))}
          </Stack>
        </Box>
      )}
      <Typography variant="subtitle2" textAlign={"center"} marginTop={2}>
        URLを共有して友達を招待しよう
      </Typography>
      <Box alignSelf={"center"}>
        <DisplayRoomUrl roomId={roomId} />
      </Box>
    </Stack>
  );
}
