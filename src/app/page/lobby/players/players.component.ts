import { Component, Input, OnInit } from '@angular/core';
import { Player } from 'src/app/interfaze/player';
import { SocketService } from 'src/app/service/room.service';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss'],
})
export class PlayersComponent implements OnInit {
  //Array of currents players
  @Input() players: Player[] = [];

  //Map of currents players use on view
  //Inicialize id to 0 to check if there is no player there
  playersAndGaps: Map<number, Player> = new Map([]);

  constructor(private socketService: SocketService) {}

  ngOnInit(): void {
    //Load players on the map
    // for (let p of this.players) {
    //   if (p.playerNumber != undefined)
    //     this.playersAndGaps.set(p.playerNumber, p);
    // }
    this.loadMap();
    console.log(this.playersAndGaps);
  }

  ngOnChanges(): void {
    //Load players on the map and set the current player position
    this.loadMap();

    //Check if there is a player who leave by checking if the username if not empty
    if (this.socketService.playerLeave != '') {
      //Look for that player key in map and set position to open
      let playerLeaveKey = [...this.playersAndGaps.entries()]
        .filter(({ 1: v }) => v.user === this.socketService.playerLeave)
        .map(([k]) => k);
      const playerLeavePosition = playerLeaveKey[0];
      this.playersAndGaps.set(playerLeavePosition, {
        id: '0',
        room: '',
        user: '',
        playerNumber: playerLeavePosition,
        turn: false,
      });
      this.socketService.playerLeave = '';
    }
  }

  //Clicke method to a player change position
  changeNumber(pNumber: number) {
    //Save old position
    const oldNumber = this.socketService.player.playerNumber;

    //Put new postion
    this.socketService.player.playerNumber = pNumber;
    //this.playersAndGaps.set(pNumber, { ...this.socketService.player });

    for (let i = 0; i < this.players.length; i++) {
      const p = this.players[i];
      if (p.id == this.socketService.player.id) {
        let changeP = { ...p };
        changeP.playerNumber = pNumber;
        this.players[i] = changeP;
      }
    }

    this.loadMap();

    //Update a player move position to the others
    this.socketService.updatePlayers(this.players);
  }
  loadMap() {
    const numbers = [1, 2, 3, 4];
    let notOpenPositions: number[] = [];
    for (let p of this.players) {
      if (p.playerNumber != undefined) {
        this.playersAndGaps.set(p.playerNumber, p);
        notOpenPositions.push(p.playerNumber);
      }
    }
    let difference = numbers.filter((x) => notOpenPositions.indexOf(x) === -1);

    for (let open of difference)
      this.playersAndGaps.set(open, {
        id: '0',
        room: '',
        user: '',
        playerNumber: open,
        turn: false,
      });
  }
}
