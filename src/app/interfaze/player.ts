export interface Player {
  id: string;
  user: string;
  room: string;
  playerNumber: number;
  owner?: boolean;
  turn: boolean;
}
