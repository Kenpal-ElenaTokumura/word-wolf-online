"use client";

import { RoomStatus } from "@/utils/common";
import { Player, Room, supabase } from "@/utils/supabase";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import Discussing from "./Discussing";
import ReadyToOvertime from "./ReadyToOvertime";
import Result from "./Result";
import Voting from "./Voting";
import WaitingSetup from "./WaitingSetup";
import WaitingStart from "./WaitingStart";

interface RealtimeContainerProps {
  playerId: string;
  isHost: boolean;
  room: Room;
  players: Player[];
}

export default function RealtimeContainer({
  playerId,
  isHost,
  room,
  players,
}: Readonly<RealtimeContainerProps>) {
  const [realtimeRoom, setRealtimeRoom] = useState<Room>(room);
  const [realtimePlayers, setRealtimePlayers] = useState<Player[]>(players);

  function handlePlayersUpdate(payload: any) {
    setRealtimePlayers((prevPlayers) => {
      return prevPlayers.map((player) =>
        player.id === payload.new.id ? (payload.new as Player) : player
      );
    });
  }

  function handlePlayerDelete(payload: any) {
    setRealtimePlayers((prevPlayers) =>
      prevPlayers.filter((player) => player.id !== payload.old.id)
    );
  }

  useEffect(() => {
    const channel = supabase
      .channel(`room:${room.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "rooms",
          filter: `id=eq.${room.id}`,
        },
        (payload) => setRealtimeRoom(payload.new as Room)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, realtimeRoom, setRealtimeRoom]);

  useEffect(() => {
    const channel = supabase
      .channel(`player:${room.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "players",
          filter: `room_id=eq.${room.id}`,
        },
        (payload) =>
          setRealtimePlayers((prevPlayers) => [
            ...prevPlayers,
            payload.new as Player,
          ])
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "players",
          filter: `room_id=eq.${room.id}`,
        },
        (payload) => handlePlayersUpdate(payload)
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "players",
          filter: `room_id=eq.${room.id}`,
        },
        (payload) => handlePlayerDelete(payload)
      )
      .subscribe();

    // Check if player is in the room
    if (
      realtimePlayers.find((player) => player.id === playerId) === undefined
    ) {
      redirect(`/join/${realtimeRoom.id}`);
    }

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, realtimePlayers, setRealtimePlayers]);

  return (
    <>
      {realtimeRoom.status === RoomStatus.WAITING && (
        <WaitingSetup
          isHost={isHost}
          roomId={realtimeRoom.id}
          playerId={playerId}
          room={realtimeRoom}
          players={realtimePlayers}
        />
      )}
      {realtimeRoom.status === RoomStatus.READY && (
        <WaitingStart
          isHost={isHost}
          roomId={realtimeRoom.id}
          players={realtimePlayers}
        />
      )}
      {realtimeRoom.status === RoomStatus.DISCUSSING && (
        <Discussing
          isHost={isHost}
          roomId={realtimeRoom.id}
          room={realtimeRoom}
          topic={
            players.find((player) => player.id === playerId)!.is_wolf === true
              ? realtimeRoom.wolf_word ?? ""
              : realtimeRoom.majority_word ?? ""
          }
        />
      )}
      {realtimeRoom.status === RoomStatus.VOTING && (
        <Voting
          isHost={isHost}
          roomId={realtimeRoom.id}
          playerId={playerId}
          players={realtimePlayers}
          topic={
            players.find((player) => player.id === playerId)!.is_wolf === true
              ? realtimeRoom.wolf_word ?? ""
              : realtimeRoom.majority_word ?? ""
          }
        />
      )}
      {realtimeRoom.status === RoomStatus.READY_TO_OVERTIME && (
        <ReadyToOvertime isHost={isHost} roomId={realtimeRoom.id} />
      )}
      {realtimeRoom.status === RoomStatus.GAME_OVER && (
        <Result isHost={isHost} roomId={realtimeRoom.id} room={realtimeRoom} />
      )}
    </>
  );
}
