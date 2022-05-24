import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { environment } from 'src/environments/environment.prod';
import { cardsPlayer } from '../interfaze/card';
import { Player } from '../interfaze/player';
@Injectable({
  providedIn: 'root',
})
export class SocketService {
  //Username of player who leave
  playerLeave: string = '';
  private REST_API_SERVER = environment.REST_API_SERVER + 'api/';

  player!: Player;
  players: Player[] = [];
  socket!: Socket;
  owner: boolean = false;
  gameID: number = 0;

  //On connected:room
  @Output() enterRoomEven: EventEmitter<Player> = new EventEmitter();

  //On new:player:owner
  @Output() newPlayerOwnerEven: EventEmitter<Player> = new EventEmitter();

  //On new:player
  @Output() newPlayerEvenGuest: EventEmitter<Player[]> = new EventEmitter();

  //On full:room
  @Output() fullRoom: EventEmitter<any> = new EventEmitter();

  //On undefined:room
  @Output() undefinedRoom: EventEmitter<any> = new EventEmitter();

  //On name:in:room
  @Output() nameInRoom: EventEmitter<any> = new EventEmitter();

  //On leave:player
  @Output() leaveRoomEve: EventEmitter<any> = new EventEmitter();

  //On start:game
  @Output() startGameEve: EventEmitter<cardsPlayer[]> = new EventEmitter();

  constructor(private http: HttpClient) {
    this.socket = io(environment.REST_API_SERVER, {
      transports: ['websocket'],
    });

    this.socket.on('connected:room', (data) => {
      this.enterRoomEven.emit(data);
    });

    this.socket.on('new:player:owner', (data) => {
      this.newPlayerOwnerEven.emit(data);
    });
    this.socket.on('new:player', (data) => {
      this.newPlayerEvenGuest.emit(data);
    });
    this.socket.on('full:room', () => {
      this.fullRoom.emit();
    });
    this.socket.on('undefined:room', () => {
      this.undefinedRoom.emit();
    });
    this.socket.on('name:in:room', () => {
      this.nameInRoom.emit();
    });
    this.socket.on('leave:player', (data) => {
      this.leaveRoomEve.emit(data);
    });
    this.socket.on('start:game', (cards) => {
      this.startGameEve.emit(cards);
    });
  }

  //Emit socket connected to server
  connectSocket() {
    this.socket.emit('connection');
  }

  //Emit socket create  a room with a username
  createRoom(name: string) {
    this.socket.emit('create:room', { user: name });
  }

  //Emit socket join  a room with a username and room id
  joinRoom(name: string, roomID: string) {
    this.socket.emit('join:room', { user: name, roomID: roomID });
  }

  //Get current socket
  getSocket(): Socket {
    return this.socket;
  }

  //Add a new player to the players array
  addPlayer(player: Player) {
    if (this.owner) {
      player.playerNumber = 1;
    }
    this.player = player;
    this.players.push(player);
  }

  //Update the current players to all sockets in the room
  updatePlayers(players: Player[]) {
    this.socket.emit('updateplayers:room', { players });
  }

  //Emit a socket leave the room
  leaveRoom(players: Player[]) {
    this.socket.emit('leave:room', { players });
  }
  postGame(players: Player[]) {
    // this.http
    //   .post<any>(this.REST_API_SERVER, players)
    //   .subscribe((res) => (this.gameID = res.id));
  }
  updateGame(team1Points: number, team2Points: number) {
    // this.http
    //   .put<any>(this.REST_API_SERVER + this.gameID, {
    //     team1Points,
    //     team2Points,
    //   })
    //   .subscribe();
  }
}
