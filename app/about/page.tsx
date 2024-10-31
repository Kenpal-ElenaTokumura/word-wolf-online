import NavBar from "@/components/NavBar";
import { Box, Typography } from "@mui/material";

export default function Page() {
  return (
    <main>
      <NavBar />
      <Box
        justifySelf={"center"}
        margin={2}
        padding={2}
        sx={{
          maxWidth: "800px",
          color: "#435585",
          backgroundColor: "#EEEEEE",
          borderRadius: "10px",
        }}
      >
        <Box marginY={1}>
          <Typography variant="h6" fontWeight={"700"}>
            ワードウルフとは
          </Typography>
        </Box>
        <Typography variant="body1">
          ワードウルフは、通常4〜8人程度で2つの陣営に分かれ、会話を楽しむワードゲームです。
        </Typography>
        <Box marginY={1}>
          <Typography variant="body1">
            「市民」と呼ばれる多数派のお題を配られるグループと、
          </Typography>
          <Typography variant="body1">
            「人狼」と呼ばれる少数派のお題を配られる1人に分かれます。
          </Typography>
        </Box>
        <Box marginY={1}>
          <Typography variant="body1">
            自身に配られたお題が、市民のものか人狼のものかは、ゲーム終了までわかりません。
          </Typography>
        </Box>
        <Box marginY={1}>
          <Typography variant="h6" fontWeight={"700"}>
            プレイヤーの目的
          </Typography>
        </Box>
        <Box marginY={1}>
          <Typography variant="body1">
            市民は、誰が人狼かを見抜くこと、
          </Typography>
          <Typography variant="body1">
            人狼は、市民に見つからないようにすることです。
          </Typography>
        </Box>
        <Box marginY={1}>
          <Typography variant="h6" fontWeight={"700"}>
            ゲームの流れ
          </Typography>
        </Box>
        <Box marginY={1}>
          <Typography variant="body1">
            決められた議論時間のあいだ、プレイヤーはそれぞれ自分のお題について議論します。
          </Typography>
          <Typography variant="body1">
            議論時間が終わったら、プレイヤー全員で誰が人狼かを投票します。
          </Typography>
        </Box>
        <Box marginY={1}>
          <Typography variant="body1">
            投票で同票が出た場合、1分間の再議論の後、再投票を行います。
          </Typography>
        </Box>
        <Box marginY={1}>
          <Typography variant="h6" fontWeight={"700"}>
            勝利条件
          </Typography>
        </Box>
        <Box marginY={1}>
          <Typography variant="body1">
            投票で人狼が選ばれた場合、市民側の勝利です。
          </Typography>
          <Typography variant="body1">
            投票で人狼が選ばれなかった場合、人狼側の勝利です。
          </Typography>
        </Box>
      </Box>
    </main>
  );
}
