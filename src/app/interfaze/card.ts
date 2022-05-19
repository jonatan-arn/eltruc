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
  { numero: '4', palo: 'o', trucValue: 9 },
  { numero: '5', palo: 'o', trucValue: 8 },
  { numero: '6', palo: 'o', trucValue: 7 },
  { numero: '7', palo: 'o', trucValue: 4 },
  { numero: '3', palo: 'o', trucValue: 5 },

  { numero: '4', palo: 'c', trucValue: 9 },
  { numero: '5', palo: 'c', trucValue: 8 },
  { numero: '6', palo: 'c', trucValue: 7 },
  { numero: '7', palo: 'c', trucValue: 6 },
  { numero: '3', palo: 'c', trucValue: 5 },

  { numero: '4', palo: 'e', trucValue: 9 },
  { numero: '5', palo: 'e', trucValue: 8 },
  { numero: '6', palo: 'e', trucValue: 7 },
  { numero: '7', palo: 'e', trucValue: 3 },
  { numero: '3', palo: 'e', trucValue: 5 },
  { numero: '1', palo: 'e', trucValue: 1 },

  { numero: '4', palo: 'b', trucValue: 9 },
  { numero: '5', palo: 'b', trucValue: 8 },
  { numero: '6', palo: 'b', trucValue: 7 },
  { numero: '7', palo: 'b', trucValue: 6 },
  { numero: '3', palo: 'b', trucValue: 5 },
  { numero: '1', palo: 'b', trucValue: 2 },
];
export const defaultCard: card = { numero: '', palo: '', trucValue: 0 };
