import CreateButton from "@/components/button/CreateButton";
import RuleButton from "@/components/button/RuleButton";
import NavBar from "@/components/NavBar";
import { Box, Stack } from "@mui/material";

export default function Home() {
  return (
    <main>
      <NavBar />
      <Box component={Stack} justifyContent="center" sx={{ minHeight: "80vh" }}>
        <Stack spacing={2} alignItems="center">
          <CreateButton />
          <RuleButton />
        </Stack>
      </Box>
    </main>
  );
}
