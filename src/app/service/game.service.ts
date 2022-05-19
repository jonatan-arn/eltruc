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
  @Output() envitEve: EventEmitter<any> = new EventEmitter();
  @Output() awaitResponseStartEve: EventEmitter<any> = new EventEmitter();
  @Output() awaitResponseEndEve: EventEmitter<any> = new EventEmitter();
  @Output() getTrucStatusEve: EventEmitter<any> = new EventEmitter();
  @Output() getEnvitStatusEve: EventEmitter<any> = new EventEmitter();
  socket!: Socket;
  cardsPlayers: cardsPlayer[] = [];
  me!: cardsPlayer;
  top!: cardsPlayer;
  left!: cardsPlayer;
  right!: cardsPlayer;
  trucResponsePlayers = { left: '', right: '' };
  envitResponsePlayers = { left: '', right: '' };

  constructor(private socketService: SocketService) {
    this.socket = this.socketService.getSocket();
    this.socket.on('played:card', (data) => {
      this.cardPlayedEven.emit(data);
    });
    this.socket.on('start:game', (cards) => {
      this.getCardsEve.emit(cards);
    });
    this.socket.on('truc', (data) => {
      this.trucEve.emit(data);
    });
    this.socket.on('envit', (data) => {
      this.envitEve.emit(data);
    });
    this.socket.on('await:response:start', (data) => {
      this.awaitResponseStartEve.emit(data);
    });

    this.socket.on('await:response:end', (data) => {
      this.awaitResponseEndEve.emit(data);
    });
    this.socket.on('truc:status', (data) => {
      this.getTrucStatusEve.emit(data);
    });
    this.socket.on('envit:status', (data) => {
      this.getEnvitStatusEve.emit(data);
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
  trucar(trucState: string, p1: cardsPlayer, p2: cardsPlayer) {
    this.socket.emit('player:truc', {
      trucState,

      playerLeft: p1.player,
      playerRight: p2.player,
    });
  }
  envidar(envitState: string, p1: cardsPlayer, p2: cardsPlayer) {
    this.socket.emit('player:envit', {
      envitState,
      playerLeft: p1.player,
      playerRight: p2.player,
    });
  }
  waitResponse(p1: cardsPlayer, p2: cardsPlayer) {
    this.socket.emit('await:response:start', {
      me: p1.player,
      top: p2.player,
    });
  }
  trucResponse(state: string, oldState: string) {
    this.socket.emit('response:truc', {
      state,
      oldState,
      left: this.left.player,
      right: this.right.player,
    });
  }
  envitResponse(state: string, oldState: string) {
    this.socket.emit('response:envit', {
      state,
      oldState,
      left: this.left.player,
      right: this.right.player,
    });
  }
  sendTrucStatus(res: any, playerNumber: number) {
    this.socket.emit('send:truc:status', {
      ...res,
      playerActionNumber: playerNumber,
    });
  }
  sendEnvitStatus(res: any, playerNumber: number) {
    this.socket.emit('send:envit:status', {
      ...res,
      playerActionNumber: playerNumber,
    });
  }
}
