import { Player } from './player';

export interface card {
  palo: string;
  numero: string;
  trucValue: number;
}
export interface cardsPlayer {
  cards: card[];
  player: Player;
  cardPlayed: card;
}
export const cards: card[] = [
  { numero: '4', palo: 'oros', trucValue: 9 },
  { numero: '5', palo: 'oros', trucValue: 8 },
  { numero: '6', palo: 'oros', trucValue: 7 },
  { numero: '7', palo: 'oros', trucValue: 4 },
  { numero: '3', palo: 'oros', trucValue: 5 },

  { numero: '4', palo: 'copes', trucValue: 9 },
  { numero: '5', palo: 'copes', trucValue: 8 },
  { numero: '6', palo: 'copes', trucValue: 7 },
  { numero: '7', palo: 'copes', trucValue: 6 },
  { numero: '3', palo: 'copes', trucValue: 5 },

  { numero: '4', palo: 'espases', trucValue: 9 },
  { numero: '5', palo: 'espases', trucValue: 8 },
  { numero: '6', palo: 'espases', trucValue: 7 },
  { numero: '7', palo: 'espases', trucValue: 3 },
  { numero: '3', palo: 'espases', trucValue: 5 },
  { numero: '1', palo: 'espases', trucValue: 1 },

  { numero: '4', palo: 'bastos', trucValue: 9 },
  { numero: '5', palo: 'bastos', trucValue: 8 },
  { numero: '6', palo: 'bastos', trucValue: 7 },
  { numero: '7', palo: 'bastos', trucValue: 6 },
  { numero: '3', palo: 'bastos', trucValue: 5 },
  { numero: '1', palo: 'bastos', trucValue: 2 },
];
