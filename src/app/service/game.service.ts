import { EventEmitter, Injectable, Output } from '@angular/core';
import { Socket } from 'socket.io-client';
import { SocketService } from './room.service';
import { card, cardsPlayer } from '../interfaze/card';
import { Player } from '../interfaze/player';
@Injectable({
  providedIn: 'root',
})
export class GameService {
  @Output() cardPlayedEven: EventEmitter<any> = new EventEmitter();
  @Output() getCardsEve: EventEmitter<any> = new EventEmitter();
  @Output() trucEve: EventEmitter<any> = new EventEmitter();

  socket!: Socket;
  cardsPlayers: cardsPlayer[] = [];
  constructor(private socketService: SocketService) {
    this.socket = this.socketService.getSocket();
    this.socket.on('played:card', (data) => {
      console.log('eve');

      this.cardPlayedEven.emit(data);
    });
    this.socket.on('start:game', (cards) => {
      this.getCardsEve.emit(cards);
    });
    this.socket.on('truc', (data) => {
      this.trucEve.emit(data);
    });
  }

  sendCards(cardsGame: cardsPlayer[]) {
    this.socket.emit('send:cards', cardsGame);
  }
  playedCard(card: card, cardsGame: cardsPlayer[], nextPlayer: Player) {
    nextPlayer.turn = true;
    this.socket.emit('played:card', {
      card: card,
      cards: cardsGame,
      nextPlayer: nextPlayer,
    });
  }
  trucar(trucState: string, left: Player, right: Player) {
    this.socket.emit('player:truc', {
      trucState: trucState,
      playerLeft: left,
      playerRight: right,
    });
  }
  waitResponse(me: Player, top: Player) {
    this.socket.emit('await:response', { me: me, top: top });
  }
}
