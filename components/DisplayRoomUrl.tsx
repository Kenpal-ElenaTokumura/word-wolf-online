import {
  FilledInput,
  FormControl,
  IconButton,
  InputLabel,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { ROOT_URL } from "@/utils/common";

interface DisplayRoomUrlProps {
  roomId: string;
}

export default function DisplayRoomUrl({
  roomId,
}: Readonly<DisplayRoomUrlProps>) {
  async function copyRoomUrl() {
    try {
      await navigator.clipboard.writeText(new URL(roomId, ROOT_URL).toString());
    } catch (error) {
      console.error("Failed to copy: ", error);
    }
  }

  return (
    <FormControl variant="filled">
      <InputLabel>Room URL</InputLabel>
      <FilledInput
        id="roomId"
        value={roomId}
        readOnly
        endAdornment={
          <IconButton size="small" onClick={copyRoomUrl}>
            <ContentCopyIcon />
          </IconButton>
        }
        sx={{ width: "280px" }}
      />
    </FormControl>
  );
}
