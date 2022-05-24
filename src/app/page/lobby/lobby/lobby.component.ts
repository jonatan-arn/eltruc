import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Player } from 'src/app/interfaze/player';
import { GameService } from 'src/app/service/game.service';
import { SocketService } from 'src/app/service/room.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss'],
})
export class LobbyComponent implements OnInit {
  players: Player[] = [];
  roomID: string = '';
  roomIDArray: string[] = [];

  isOwner: boolean = false;
  constructor(
    private socketService: SocketService,
    private route: Router,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    //Done when create a room
    if (this.players.length == 0) {
      this.players = this.socketService.players;
    }
    this.isOwner = this.socketService.owner;

    //Save room id
    this.roomID = this.players[0].room;
    for (var i = 0; i < this.roomID.length; i++) {
      this.roomIDArray.push(this.roomID.charAt(i));
    } //On  new:player:owner if current player is owner of room
    if (this.socketService.player.owner)
      this.socketService.newPlayerOwnerEven.subscribe((data) => {
        //Check what player number is not in use a give the first one to the new player
        let playerNumber = 0;
        const numbers = [1, 2, 3, 4];
        let currentNumbers: number[] = [];
        for (let p of this.players) {
          if (p.id != '0') currentNumbers.push(p.playerNumber);
        }
        var difference = numbers.filter(
          (x) => currentNumbers.indexOf(x) === -1
        );
        playerNumber = difference[0];

        //Save new player on array
        this.socketService.players.push({
          ...data,
          turn: false,
          playerNumber: playerNumber,
        });
        //If u dont update the array like this the ngOnChange on players component dont execute because if it is
        //an array only check if the array change if u point to the same array and not if if change the value of it
        this.players = [...this.socketService.players];

        //Update all current players with the new one
        this.socketService.updatePlayers(this.players);
      });

    //On new:player
    this.socketService.newPlayerEvenGuest.subscribe((players) => {
      //when the updatePlayers execute this is the owner this execute on the others clients
      for (let p of players)
        if (p.id == this.socketService.player.id) this.socketService.player = p;
      this.socketService.players = players;
      this.players = players;
    });
    //On leave:player
    this.socketService.leaveRoomEve.subscribe((data) => {
      const { players, socketLeave } = data;
      this.socketService.playerLeave = socketLeave.username;
      this.socketService.players = players;
      this.players = players;
    });

    this.socketService.startGameEve.subscribe((cardPlayers) => {
      this.gameService.cardsPlayers = cardPlayers;
      this.route.navigate(['/game']);
    });
  }
  ngOnDestroy(): void {
    //this.socketService.leaveRoom(this.players);
  }
  startGame() {
    if (this.players.length == 4) {
      this.socketService.postGame(this.players);
      this.route.navigate(['/game']);
    }
  }
}
