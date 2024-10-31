export const ROOT_URL = process.env.NEXT_PUBLIC_ROOT_URL;

export enum RoomStatus {
  /**
   * Waiting for topic to be decided
   */
  WAITING = "waiting",
  /**
   * Ready to start
   */
  READY = "ready",
  /**
   * Discussing about the topic
   */
  DISCUSSING = "discussing",
  /**
   * Voting for the wolf
   */
  VOTING = "voting",
  /**
   * Overtime when the maximum number of votes is duplicated
   */
  READY_TO_OVERTIME = "ready_to_overtime",
  /**
   * Game over
   */
  GAME_OVER = "game_over",
}
export type RoomStatusType = keyof typeof RoomStatus;
