"use client";

import PlayerCreateForm from "@/components/form/PlayerCreateForm";
import LoadingPage from "@/components/LoadingPage";
import NavBar from "@/components/NavBar";
import { ROOT_URL } from "@/utils/common";
import { createHostPlayer } from "@/utils/player";
import { Room } from "@/utils/supabase";
import { Grid2 as Grid } from "@mui/material";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const [room, setRoom] = useState<Room | null>(null);

  async function createRoom() {
    const apiUrl = new URL("/api/room", ROOT_URL);
    const room = await fetch(apiUrl, { method: "POST" })
      .then((res) => res.json() as Promise<Room>)
      .catch((err) => {
        console.error("Error:", err);
        return null;
      });
    return room;
  }

  let isInit = true;
  useEffect(() => {
    if (isInit) {
      createRoom()
        .then((room) => {
          if (!room) {
            notFound();
          }
          setRoom(room);
        })
        .catch(() => {
          notFound();
        });
    }
    isInit = false;
  }, []);
  // https://react.dev/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development

  if (!room) return <LoadingPage />;

  return (
    <main>
      <NavBar />
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "80vh" }}
      >
        <Grid>
          <PlayerCreateForm roomId={room.id} createPlayer={createHostPlayer} />
        </Grid>
      </Grid>
    </main>
  );
}
