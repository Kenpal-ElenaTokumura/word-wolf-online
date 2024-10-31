"use client";

import { Typography } from "@mui/material";
import { useState, useEffect } from "react";

interface CountDownTimerProps {
  seconds: number;
}

export default function CountDownTimer({
  seconds,
}: Readonly<CountDownTimerProps>) {
  const [countTime, setCountTime] = useState<number>(seconds);

  useEffect(() => {
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
    </>
  );
}
