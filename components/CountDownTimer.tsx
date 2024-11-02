"use client";

import { Typography } from "@mui/material";
import { useState, useEffect, useRef } from "react";

interface CountDownTimerProps {
  seconds: number;
}

export default function CountDownTimer({
  seconds,
}: Readonly<CountDownTimerProps>) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [countTime, setCountTime] = useState<number>(seconds);

  function playAlarm() {
    if (audioRef.current) {
      audioRef.current.play();
    } else {
      console.error("Audio element not found");
    }
  }

  useEffect(() => {
    if (countTime <= 0) {
      playAlarm();
      return;
    }

    const timer = setInterval(() => {
      setCountTime((prevCount) => prevCount - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countTime]);

  return (
    <>
      <Typography variant="h4" alignSelf={"center"} suppressHydrationWarning>
        {countTime > 0 &&
          `${String(Math.floor(countTime / 60)).padStart(2, "0")}:${String(
            countTime % 60
          ).padStart(2, "0")}`}{" "}
        {countTime <= 0 && "Time's up!"}
      </Typography>
      {countTime <= 0 && (
        <Typography variant="subtitle2" alignSelf={"center"}>
          投票に移ります
        </Typography>
      )}
      <audio ref={audioRef} src="/alarm.mp3">
        <track kind="captions" label="Time up sound" />
      </audio>
    </>
  );
}
