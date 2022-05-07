import { Component, OnInit } from '@angular/core';
import { Player } from 'src/app/interfaze/player';
import { cardsPlayer, card, cards } from 'src/app/interfaze/card';
import { GameService } from 'src/app/service/game.service';
import { SocketService } from 'src/app/service/room.service';
import { MatDialog } from '@angular/material/dialog';
import { TrucComponent } from '../truc/truc.component';
import { EnvitComponent } from '../envit/envit.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  roundWinners = new Map([
    [1, { team1: false, team2: false }],
    [2, { team1: false, team2: false }],
    [3, { team1: false, team2: false }],
  ]);
  nameTurn = '';
  team1Points: number = 0;
  team2Points: number = 0;
  cardsPlayedRound: number = 0;
  round: number = 0;
  trucViewText: string = 'trucar';
  evitViewText: string = 'envidar';
  player!: Player;
  players!: Player[];
  cardsGame: cardsPlayer[] = [];
  cardsGameMap: Map<number, cardsPlayer> = new Map([]);
  me!: cardsPlayer;
  top!: cardsPlayer;
  left!: cardsPlayer;
  right!: cardsPlayer;
  playerStartHand!: Player;
  currentIndexes: number[] = [];
  tie: boolean = false;
  trucPoints: number = 1;
  envitPoints: number = 1;
  trucState: string = 'truc';
  envitState: string = '';
  constructor(
    private socketService: SocketService,
    private gameService: GameService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.player = this.socketService.player;
    this.players = this.socketService.players;
    this.round = 1;
    if (this.player.owner) {
      this.nameTurn = this.player.user;
      this.loadArray();
      this.draw();
    } else {
      this.cardsGame = this.gameService.cardsPlayers;
      this.loadMap();
    }
    for (let p of this.cardsGame) {
      if (p.player.playerNumber == 1) {
        this.playerStartHand = p.player;
        break;
      }
    }

    this.gameService.cardPlayedEven.subscribe((data) => {
      const { nextPlayer, cards, card } = data;
      this.nameTurn = nextPlayer.user;
      this.cardsGame = cards;
      this.loadMap();
      if (nextPlayer.id == this.player.id) {
        this.player = nextPlayer;
      }
      this.cardsPlayedRound++;
      if (this.cardsPlayedRound == 4) {
        this.setWinner();
        console.log(this.roundWinners);
        this.round++;
        this.cardsPlayedRound = 0;
      }
    });
    this.gameService.getCardsEve.subscribe((cards) => {
      this.cardsGame = cards;
      this.loadMap();
    });
    this.gameService.trucEve.subscribe((data) => {
      console.log(data);
      this.dialog.open(TrucComponent, {
        data: { trucState: this.trucState },
      });
    });
  }
  ngOnChanges(): void {
    this.cardsGame = this.gameService.cardsPlayers;
    this.loadArray();
  }
  generateCards() {
    this.currentIndexes = [];
    for (let i = 0; i < 12; i++) {
      let card = this.getCard();
      if (this.cardsGame[0].cards.length != 3)
        this.cardsGame[0].cards.push(card);
      else if (this.cardsGame[1].cards.length != 3)
        this.cardsGame[1].cards.push(card);
      else if (this.cardsGame[2].cards.length != 3)
        this.cardsGame[2].cards.push(card);
      else if (this.cardsGame[3].cards.length != 3)
        this.cardsGame[3].cards.push(card);
    }
    this.gameService.sendCards(this.cardsGame);
  }
  getCard(): card {
    let randomIndex = Math.floor(Math.random() * cards.length);
    while (this.currentIndexes.includes(randomIndex)) {
      randomIndex = Math.floor(Math.random() * cards.length);
    }
    this.currentIndexes.push(randomIndex);
    let card = cards[randomIndex];
    return card;
  }
  loadArray() {
    for (let p of this.players) {
      if (p.playerNumber != undefined) {
        this.cardsGame.push({
          player: p,
          cards: [],
          cardPlayed: { numero: '', palo: '', trucValue: 0 },
        });
      }
    }
    this.loadMap();
  }
  loadMap() {
    for (let pCards of this.cardsGame) {
      if (pCards.player.owner) this.nameTurn = pCards.player.user;

      this.cardsGameMap.set(pCards.player.playerNumber, pCards);
    }
    this.loadPlayers();
  }
  loadPlayers() {
    const myposition = this.player.playerNumber;
    let left = myposition - 1;
    let right = myposition + 1;
    let top = myposition + 2;

    this.me = this.cardsGameMap.get(myposition) as cardsPlayer;

    if (left == 0) this.left = this.cardsGameMap.get(4) as cardsPlayer;
    else this.left = this.cardsGameMap.get(left) as cardsPlayer;

    if (right == 5) this.right = this.cardsGameMap.get(1) as cardsPlayer;
    else this.right = this.cardsGameMap.get(right) as cardsPlayer;

    if (top == 6) this.top = this.cardsGameMap.get(2) as cardsPlayer;
    else if (top == 5) this.top = this.cardsGameMap.get(1) as cardsPlayer;
    else this.top = this.cardsGameMap.get(top) as cardsPlayer;
  }
  draw() {
    for (let cardsPlayer of this.cardsGame) cardsPlayer.cards = [];
    this.generateCards();
  }
  playCard(card: card) {
    if (this.cardsPlayedRound == 4) this.round = 2;
    if (!this.player.turn) console.log('No es tu turno');
    else {
      this.player.turn = false;

      for (let i = 0; i < this.cardsGame.length; i++)
        if (this.cardsGame[i].player.id == this.player.id) {
          for (let j = 0; j < this.cardsGame[i].cards.length; j++) {
            if (
              card.palo == this.cardsGame[i].cards[j].palo &&
              card.numero == this.cardsGame[i].cards[j].numero
            )
              this.cardsGame[i].cards.splice(j, 1);
            this.cardsGame[i].cardPlayed = card;
          }
        }
      this.me.cardPlayed = card;
      this.gameService.playedCard(card, this.cardsGame, this.right.player);
    }
  }
  setWinner() {
    let winner = this.cardsGame[0];
    let roundwinner = 0;
    let card = { numero: '', palo: '', trucValue: 100 };
    for (let player of this.cardsGame) {
      if (player.cardPlayed.trucValue < card.trucValue) {
        card = player.cardPlayed;
        winner = player;
      } else if (player.cardPlayed.trucValue == card.trucValue) {
        if (this.round == 1) {
          this.tie = true;
        } else {
          if (this.roundWinners.get(1)?.team1 == true) roundwinner = 1;
          else roundwinner = 2;
        }
        card = player.cardPlayed;
        winner = player;
      }
    }
    if (this.tie) {
      for (let player of this.cardsGame)
        if (player.cardPlayed.trucValue == winner.cardPlayed.trucValue) {
          if (player.player.playerNumber < winner.player.playerNumber)
            winner = player;
        }
    }

    this.player.turn = this.player.id == winner?.player.id ? true : false;
    let round = this.roundWinners.get(this.round);
    if (winner?.player.playerNumber == 1 || winner?.player.playerNumber == 3) {
      round = { team1: true, team2: false };
    } else {
      round = { team1: false, team2: true };
    }
    this.roundWinners.set(this.round, round);

    roundwinner = this.checkWinner();
    if (roundwinner != 0) {
      if (roundwinner == 1) {
        this.team1Points += this.trucPoints;
      } else if (roundwinner == 2) {
        this.team2Points += this.trucPoints;
      }
      this.resetTableCards();

      this.round = 1;
      let nextPlayer = ++this.playerStartHand.playerNumber;
      this.tie = false;
      if (nextPlayer > 4) nextPlayer = 1;
      for (let p of this.cardsGame) {
        if (p.player.playerNumber == nextPlayer) {
          this.playerStartHand = p.player;
          break;
        }
      }
      this.player.turn =
        this.playerStartHand.id == this.player.id ? true : false;
      if (this.player.turn == true) this.draw();
    }
  }
  checkWinner(): number {
    if (this.round == 2) {
      if (this.tie) {
        let round2 = this.roundWinners.get(2);
        if (round2?.team1 == true) {
          return 1;
        } else {
          return 2;
        }
      } else {
        let round1 = this.roundWinners.get(1);
        let round2 = this.roundWinners.get(2);
        if (round1?.team1 == true && round2?.team1 == true) {
          return 1;
        } else if (round1?.team2 == true && round2?.team2 == true) {
          return 2;
        }
      }
    }

    if (this.round == 3) {
      let round1 = this.roundWinners.get(1);
      let round2 = this.roundWinners.get(2);
      let round3 = this.roundWinners.get(3);
      let team1round = 0;
      let team2round = 0;

      if (round1?.team1 == true) {
        team1round++;
      } else {
        team2round++;
      }
      if (round2?.team1 == true) {
        team1round++;
      } else {
        team2round++;
      }
      if (round3?.team1 == true) {
        team1round++;
      } else {
        team2round++;
      }

      if (team1round == 2) {
        return 1;
      }
      if (team2round == 2) {
        return 2;
      }
    }
    return 0;
  }
  resetTableCards() {
    this.me.cardPlayed = { numero: '', palo: '', trucValue: 0 };
    this.top.cardPlayed = { numero: '', palo: '', trucValue: 0 };
    this.left.cardPlayed = { numero: '', palo: '', trucValue: 0 };
    this.right.cardPlayed = { numero: '', palo: '', trucValue: 0 };
    this.roundWinners.set(1, { team1: false, team2: false });
    this.roundWinners.set(2, { team1: false, team2: false });
    this.roundWinners.set(3, { team1: false, team2: false });
  }
  trucar() {
    if (this.player.turn == true) {
      this.gameService.trucar(
        this.trucState,
        this.left.player,
        this.right.player
      );
      this.gameService.waitResponse(this.me.player, this.top.player);
    }
  }
  envidar() {
    this.dialog.open(EnvitComponent, {
      data: { envitState: this.envitState },
    });
  }
}
