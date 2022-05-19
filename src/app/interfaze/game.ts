import { cardsPlayer } from './card';
import { Player } from './player';

export interface gameState {
  trucValue: number;
  envitValue: number;
  trucState: string;
  envitState: string;
  tie: boolean;
  playerStartHand: Player;
  trucViewText: string;
  envitViewText: string;
  roundWinners: Map<number, { team1: boolean; team2: boolean }>;
  nameTurn: string;
  team1Points: number;
  team2Points: number;
  cardsPlayedRound: number;
  round: number;
  team: number;
  trucDiabled: boolean;
  envitDiabled: boolean;
  isEnvidar: boolean;
  end: boolean;
  winner: string;
}

export const defaultGameState: gameState = {
  trucValue: 1,
  envitValue: 1,
  trucState: 'truc',
  envitState: 'envidar',
  tie: false,
  trucViewText: 'trucar',
  envitViewText: 'envidar',
  playerStartHand: {
    id: '0',
    playerNumber: 0,
    room: '0',
    turn: false,
    user: '',
    owner: false,
  },
  roundWinners: new Map([
    [1, { team1: false, team2: false }],
    [2, { team1: false, team2: false }],
    [3, { team1: false, team2: false }],
  ]),
  nameTurn: '',
  team1Points: 0,
  team2Points: 0,
  cardsPlayedRound: 0,
  round: 0,
  team: 0,
  trucDiabled: false,
  envitDiabled: false,
  isEnvidar: false,
  end: false,
  winner: '',
};
export const defautlTrucStates = [
  { state: 'truc', value: 2 },
  { state: 'retruc', value: 3 },
  { state: 'quatre val', value: 4 },
  { state: 'joc fora', value: 30 },
];
export const defautlEnvitStates = [
  { state: 'envidar', value: 2 },
  { state: 'torne', value: 4 },
  { state: 'la falta', value: 30 },
];
