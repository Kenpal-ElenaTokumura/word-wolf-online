import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Toolbar from "@mui/material/Toolbar";

interface NavBarProps {
  isRoom?: boolean;
  isHost?: boolean;
}

export default function NavBar({
  isRoom = false,
  isHost = false,
}: Readonly<NavBarProps>) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ backgroundColor: "#363062" }}>
        <Toolbar>
          <Link
            href="/"
            variant="h6"
            sx={{ fontWeight: 700 }}
            underline="none"
            color="#ededed"
          >
            WORD WOLF ONLINE
          </Link>
          <Box sx={{ flexGrow: 1 }} />
          {isRoom && isHost && "Host Room"}
          {isRoom && !isHost && "Room"}
        </Toolbar>
      </AppBar>
      <Toolbar />
    </Box>
  );
}
