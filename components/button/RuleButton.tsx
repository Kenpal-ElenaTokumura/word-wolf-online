"use client";

import ArticleIcon from "@mui/icons-material/Article";
import { Button } from "@mui/material";
import { redirect } from "next/navigation";

export default function RuleButton() {
  return (
    <Button
      variant="contained"
      sx={{ width: "150px", backgroundColor: "#818FB4", color: "#ededed" }}
      startIcon={<ArticleIcon />}
      onClick={() => redirect("/about")}
    >
      ルールを読む
    </Button>
  );
}
