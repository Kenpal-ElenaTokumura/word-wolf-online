import { Grid2 as Grid, CircularProgress } from "@mui/material";
import NavBar from "./NavBar";

export default function LoadingPage() {
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
          <CircularProgress color="inherit" />
        </Grid>
      </Grid>
    </main>
  );
}
