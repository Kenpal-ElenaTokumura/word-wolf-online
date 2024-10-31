"use server";

import { cookies } from "next/headers";
import { ROOT_URL } from "./common";
import { Player, Room } from "./supabase";

export async function createPlayer(playerName: string, roomId: string) {
  const apiUrl = new URL("/api/player", ROOT_URL);
  const player = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ playerName, roomId }),
  })
    .then((res) => res.json() as Promise<Player>)
    .catch((err) => {
      console.error("Error:", err);
      return null;
    });

  if (player) {
    (await cookies()).set("playerId", player.id);
  }
  return player;
}

export async function createHostPlayer(name: string, roomId: string) {
  const player = await createPlayer(name, roomId);
  if (!player) {
    return null;
  }

  const hostPatchUrl = new URL(`/api/room/${roomId}/host`, ROOT_URL);
  const hostPatchResult = await fetch(hostPatchUrl, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ roomId, hostId: player.id }),
  })
    .then((res) => res.json() as Promise<{ room: Room; player: Player }>)
    .catch((err) => {
      console.error("Error:", err);
      return null;
    });
  if (!hostPatchResult) {
    return null;
  }

  return hostPatchResult;
}
