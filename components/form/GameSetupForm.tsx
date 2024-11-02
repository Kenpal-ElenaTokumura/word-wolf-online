"use client";

import { ROOT_URL } from "@/utils/common";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import { LoadingButton } from "@mui/lab";
import { Box, Slider, Stack, TextField } from "@mui/material";
import { FormEvent, useState } from "react";

interface GameSetupProps {
  roomId: string;
  disabled?: boolean;
}

export default function GameSetupForm({
  roomId,
  disabled = false,
}: Readonly<GameSetupProps>) {
  const placeholderCategory = [
    "動物",
    "食べ物",
    "国",
    "都市",
    "アニメ",
    "映画",
    "歴史",
    "科学",
    "文学",
    "スポーツ",
    "音楽",
    "芸能",
    "ゲーム",
    "ポケモン",
  ];

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [category, setCategory] = useState<string>(
    placeholderCategory[Math.floor(Math.random() * placeholderCategory.length)]
  );
  const [playTimeMins, setPlayTimeMins] = useState<number>(5);

  const marks = [
    { value: 1, label: "1 min" },
    { value: 15, label: "15 mins" },
  ];

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    await fetch(new URL(`/api/room/${roomId}/setup`, ROOT_URL), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ category, playTimeMins }),
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack alignItems={"center"} marginY={1} spacing={1}>
        <TextField
          label="カテゴリ"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          variant="outlined"
          required
        />
        <Box width={"200px"}>
          <Slider
            aria-label="議論時間"
            min={1}
            max={15}
            marks={marks}
            valueLabelDisplay="auto"
            value={playTimeMins}
            onChange={(event, value) => setPlayTimeMins(value as number)}
          />
        </Box>
        <Box>
          <LoadingButton
            variant="contained"
            sx={{
              backgroundColor: "#818FB4",
              color: "#ededed",
              width: "180px",
            }}
            endIcon={<SettingsSuggestIcon />}
            type="submit"
            disabled={disabled}
            loading={isLoading}
          >
            ゲームを設定
          </LoadingButton>
        </Box>
      </Stack>
    </form>
  );
}
