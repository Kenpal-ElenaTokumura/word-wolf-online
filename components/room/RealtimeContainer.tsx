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
  roomId: string;
  playerId: string;
  isHost: boolean;
  initialRoom: Room;
  initialPlayers: Player[];
}

export default function RealtimeContainer({
  roomId,
  playerId,
  isHost,
  initialRoom,
  initialPlayers,
}: Readonly<RealtimeContainerProps>) {
  const [realtimeRoom, setRealtimeRoom] = useState<Room>(initialRoom);
  const [realtimePlayers, setRealtimePlayers] =
    useState<Player[]>(initialPlayers);

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
      .channel(`room:${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "rooms",
          filter: `id=eq.${roomId}`,
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
      .channel(`player:${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "players",
          filter: `room_id=eq.${roomId}`,
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
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => handlePlayersUpdate(payload)
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "players",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => handlePlayerDelete(payload)
      )
      .subscribe();

    // Check if player is in the room
    if (
      realtimePlayers.find((player) => player.id === playerId) === undefined
    ) {
      redirect(`/join/${roomId}`);
    }

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, realtimePlayers, setRealtimePlayers]);

  useEffect(() => {
    supabase
      .from("players")
      .select()
      .eq("room_id", roomId)
      .then(({ data }) => {
        if (data) {
          setRealtimePlayers(data);
        }
      });
  }, [realtimeRoom.status]);

  return (
    <>
      {realtimeRoom.status === RoomStatus.WAITING && (
        <WaitingSetup
          isHost={isHost}
          roomId={roomId}
          playerId={playerId}
          room={realtimeRoom}
          players={realtimePlayers}
        />
      )}
      {realtimeRoom.status === RoomStatus.READY && (
        <WaitingStart
          isHost={isHost}
          roomId={roomId}
          players={realtimePlayers}
        />
      )}
      {realtimeRoom.status === RoomStatus.DISCUSSING && (
        <Discussing
          isHost={isHost}
          roomId={roomId}
          room={realtimeRoom}
          topic={
            realtimePlayers.find((player) => player.id === playerId)!
              .is_wolf === true
              ? realtimeRoom.wolf_word ?? ""
              : realtimeRoom.majority_word ?? ""
          }
        />
      )}
      {realtimeRoom.status === RoomStatus.VOTING && (
        <Voting
          isHost={isHost}
          roomId={roomId}
          playerId={playerId}
          players={realtimePlayers}
          topic={
            realtimePlayers.find((player) => player.id === playerId)!
              .is_wolf === true
              ? realtimeRoom.wolf_word ?? ""
              : realtimeRoom.majority_word ?? ""
          }
        />
      )}
      {realtimeRoom.status === RoomStatus.READY_TO_OVERTIME && (
        <ReadyToOvertime isHost={isHost} roomId={roomId} />
      )}
      {realtimeRoom.status === RoomStatus.GAME_OVER && (
        <Result isHost={isHost} roomId={roomId} room={realtimeRoom} />
      )}
    </>
  );
}
