import { Component, OnInit } from '@angular/core';
import { Player } from 'src/app/interfaze/player';
import { cardsPlayer, card, cards, defaultCard } from 'src/app/interfaze/card';
import { GameService } from 'src/app/service/game.service';
import { SocketService } from 'src/app/service/room.service';
import { MatDialog } from '@angular/material/dialog';
import { TrucComponent } from '../truc/truc.component';
import { EnvitComponent } from '../envit/envit.component';
import { WaitComponent } from '../wait dialog/wait.component';
import {
  defaultGameState,
  defautlEnvitStates,
  defautlTrucStates,
  gameState,
} from 'src/app/interfaze/game';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  player!: Player;
  players!: Player[];
  cardsGame: cardsPlayer[] = [];
  cardsGameMap: Map<number, cardsPlayer> = new Map([]);
  currentIndexes: number[] = [];
  gameState: gameState = { ...defaultGameState };
  trucStates = defautlTrucStates;
  envitStates = defautlEnvitStates;
  envitTeamWinner = 0;
  //View
  me!: cardsPlayer;
  top!: cardsPlayer;
  left!: cardsPlayer;
  right!: cardsPlayer;

  constructor(
    private socketService: SocketService,
    private gameService: GameService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.player = this.socketService.player;
    this.gameState.team =
      this.player.playerNumber == 1 || this.player.playerNumber == 3 ? 1 : 2;

    this.players = this.socketService.players;
    this.gameState.round = 1;
    if (this.player.owner) {
      this.gameState.nameTurn = this.player.user;
      this.loadArray();
      this.draw();
    } else {
      this.cardsGame = this.gameService.cardsPlayers;
      this.loadMap();
    }
    for (let p of this.cardsGame) {
      if (p.player.playerNumber == 1) {
        this.gameState.playerStartHand = { ...p.player };
        console.log(this.gameState.playerStartHand);

        break;
      }
    }

    this.gameService.cardPlayedEven.subscribe((data) => {
      const { nextPlayer, cards, card } = data;
      this.gameState.nameTurn = nextPlayer.user;
      this.cardsGame = cards;
      this.loadMap();
      if (nextPlayer.id == this.player.id) {
        this.player = nextPlayer;
      }
      this.gameState.cardsPlayedRound++;
      if (this.gameState.cardsPlayedRound == 4) {
        this.gameState.envitDisabled = true;
        this.setWinner();
        this.gameState.round++;
        this.gameState.cardsPlayedRound = 0;
      }
    });
    this.gameService.getCardsEve.subscribe((cards) => {
      this.cardsGame = cards;
      this.loadMap();
    });

    this.gameService.trucEve.subscribe((data) => {
      this.dialog.open(TrucComponent, {
        data: { trucState: this.gameState.trucState },
        disableClose: true,
      });
    });
    this.gameService.envitEve.subscribe((data) => {
      console.log('a');

      this.dialog.open(EnvitComponent, {
        data: { envitState: this.gameState.envitState },
        disableClose: true,
      });
    });
    this.gameService.getTrucStatusEve.subscribe((res) => {
      const { state, value, playerActionNumber } = res;
      const data = this.checkAction(
        playerActionNumber,
        state,
        value,
        this.trucStates,
        this.gameState.trucState
      );
      if (data.status != 'undefined') {
        if (data.status == 'score') {
          const { team } = data.payload;
          this.scorePoints(team);
        } else if (data.status == 'current') {
          const { disabled, state, newValue } = data.payload;
          this.gameState = {
            ...this.gameState,
            trucValue: newValue,
            trucViewText: state,
            trucState: state,
            trucDiabled: disabled,
          };
        } else {
          const { state, newValue, teamAction } = data.payload;
          this.gameState = {
            ...this.gameState,
            trucValue: newValue,
            trucViewText: state,
            trucState: state,
          };
          if (this.player.turn) {
            if (teamAction == this.gameState.team) {
              this.gameService.trucar(
                this.gameState.trucState,
                this.me,
                this.top
              );

              this.gameService.waitResponse(this.left, this.right);
            } else {
              this.gameService.trucar(
                this.gameState.trucState,
                this.left,
                this.right
              );
              this.gameService.waitResponse(this.me, this.top);
            }
          }
        }
      }
    });
    this.gameService.getEnvitStatusEve.subscribe((res) => {
      const { state, value, playerActionNumber } = res;
      const data = this.checkAction(
        playerActionNumber,
        state,
        value,
        this.envitStates,
        this.gameState.envitState
      );
      if (data.status != 'undefined') {
        if (data.status == 'score') {
          const { team, state } = data.payload;
          this.envitTeamWinner = team;
          this.gameState = {
            ...this.gameState,
            envitViewText: state,
            envitState: state,
            envitDisabled: true,
          };
        } else if (data.status == 'current') {
          const { disabled, state, newValue } = data.payload;
          this.gameState = {
            ...this.gameState,
            envitValue: newValue,
            envitViewText: state,
            envitState: state,
            envitDisabled: disabled,
          };
        } else {
          const { state, newValue, teamAction } = data.payload;
          this.gameState = {
            ...this.gameState,
            envitValue: newValue,
            envitViewText: state,
            envitState: state,
          };
          if (this.player.turn) {
            if (teamAction == this.gameState.team) {
              this.gameService.envidar(
                this.gameState.envitState,
                this.me,
                this.top
              );

              this.gameService.waitResponse(this.left, this.right);
            } else {
              this.gameService.envidar(
                this.gameState.envitState,
                this.left,
                this.right
              );
              this.gameService.waitResponse(this.me, this.top);
            }
          }
        }
      }
    });
    this.gameService.awaitResponseStartEve.subscribe(() => {
      let dialogRef = this.dialog.open(WaitComponent, { disableClose: true });
      dialogRef.afterClosed().subscribe((res) => {
        if (this.player.playerNumber == 1 || this.player.playerNumber == 2) {
          if (res.type == 'truc')
            this.gameService.sendTrucStatus(res, this.player.playerNumber);
          else this.gameService.sendEnvitStatus(res, this.player.playerNumber);
        }
      });
    });
    this.gameService.me = this.me;
    this.gameService.top = this.top;
    this.gameService.left = this.left;
    this.gameService.right = this.right;
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
      if (pCards.player.turn) this.gameState.nameTurn = pCards.player.user;

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
    if (this.gameState.cardsPlayedRound == 4) this.gameState.round = 2;
    if (!this.player.turn) this.snackBar.open('no es tu turno');
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
    let round = { team1: false, team2: true };

    for (let player of this.cardsGame) {
      if (player.cardPlayed.trucValue < card.trucValue) {
        card = player.cardPlayed;
        winner = player;
      } else if (player.cardPlayed.trucValue == card.trucValue) {
        this.gameState.tie = true;

        if (this.gameState.round != 1) {
          if (this.gameState.roundWinners.get(1)?.team1 == true)
            roundwinner = 1;
          else roundwinner = 2;
        }
        card = player.cardPlayed;
        winner = player;
      }
    }
    if (this.gameState.tie) {
      if (this.gameState.round == 1) {
        for (let player of this.cardsGame)
          if (player.cardPlayed.trucValue == winner.cardPlayed.trucValue) {
            if (player.player.playerNumber < winner.player.playerNumber)
              winner = player;
          }
      } else {
        if (roundwinner == 1) round = { team1: true, team2: false };
        else round = { team1: false, team2: true };
      }
    }

    this.player.turn = this.player.id == winner?.player.id ? true : false;
    if (this.gameState.tie) {
      if (
        winner?.player.playerNumber == 1 ||
        winner?.player.playerNumber == 3
      ) {
        round = { team1: true, team2: false };
      } else {
        round = { team1: false, team2: true };
      }
    }
    this.gameState.roundWinners.set(this.gameState.round, round);
    roundwinner = this.checkWinner();
    this.scorePoints(roundwinner);
  }

  checkWinner(): number {
    if (this.gameState.round == 2) {
      if (this.gameState.tie) {
        let round2 = this.gameState.roundWinners.get(2);
        if (round2?.team1 == true) {
          return 1;
        } else {
          return 2;
        }
      } else {
        let round1 = this.gameState.roundWinners.get(1);
        let round2 = this.gameState.roundWinners.get(2);
        if (round1?.team1 == true && round2?.team1 == true) {
          return 1;
        } else if (round1?.team2 == true && round2?.team2 == true) {
          return 2;
        }
      }
    }

    if (this.gameState.round == 3) {
      //Calculate envit winner
      if (this.gameState.isEnvidar) {
        let envits: { playerNumber: number; envit: number }[] = [];
        this.cardsGameMap.forEach((v) => {
          let c = v.cards.filter((c) => c.palo == 'c');
          let b = v.cards.filter((b) => b.palo == 'b');
          let o = v.cards.filter((o) => o.palo == 'o');
          let a = v.cards.filter((a) => a.palo == 'a');
          if (c.length >= 2) {
            envits.push({
              playerNumber: v.player.playerNumber,
              envit: this.getEnvitValue(c),
            });
          } else if (b.length >= 2) {
            envits.push({
              playerNumber: v.player.playerNumber,
              envit: this.getEnvitValue(b),
            });
          } else if (o.length >= 2) {
            envits.push({
              playerNumber: v.player.playerNumber,
              envit: this.getEnvitValue(o),
            });
          } else if (a.length >= 2) {
            envits.push({
              playerNumber: v.player.playerNumber,
              envit: this.getEnvitValue(a),
            });
          }
        });
        let pWinner = Math.max(...envits.map((v) => v.envit));
        this.envitTeamWinner = pWinner == 1 || pWinner == 3 ? 1 : 2;
      }

      //Calculate truc winner
      let round1 = this.gameState.roundWinners.get(1);
      let round2 = this.gameState.roundWinners.get(2);
      let round3 = this.gameState.roundWinners.get(3);
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
  getEnvitValue(array: card[]) {
    if (array.length == 2) {
      return parseInt(array[0].numero) + parseInt(array[1].numero);
    } else {
      let numbers = [];
      for (let card of array) {
        numbers.push(parseInt(card.numero));
      }
      let n1 = Math.max.apply(null, numbers); // get the max of the array
      numbers.splice(numbers.indexOf(n1), 1); // remove max from the array
      let n2 = Math.max.apply(null, numbers); // get the 2nd max
      return n1 + n2;
    }
  }
  scorePoints(roundwinner: number) {
    if (roundwinner != 0) {
      if (roundwinner == 1) {
        this.gameState.team1Points += this.gameState.trucValue;
      } else if (roundwinner == 2) {
        this.gameState.team2Points += this.gameState.trucValue;
      }
      if (this.envitTeamWinner == 1) {
        this.gameState.team1Points += this.gameState.envitValue;
      } else if (this.envitTeamWinner == 2) {
        this.gameState.team2Points += this.gameState.envitValue;
      }
      console.log(this.gameState.playerStartHand);
      const { playerNumber } = this.gameState.playerStartHand;
      let nextPlayer = playerNumber + 1;

      if (nextPlayer > 4) nextPlayer = 1;
      for (let p of this.cardsGame) {
        if (p.player.playerNumber == nextPlayer) {
          this.gameState.nameTurn = p.player.user;

          this.gameState.playerStartHand = p.player;
          break;
        }
      }
      this.player.turn =
        this.gameState.playerStartHand.id == this.player.id ? true : false;
      this.resetGame();
      if (this.player.owner)
        this.socketService.updateGame(
          this.gameState.team1Points,
          this.gameState.team2Points
        );
      if (this.player.turn == true) {
        this.draw();
      }
    }
  }

  trucar() {
    if (this.player.turn == true && !this.gameState.trucDiabled) {
      this.gameService.trucar(this.gameState.trucState, this.left, this.right);
      this.gameService.waitResponse(this.me, this.top);
    }
  }
  envidar() {
    console.log(this.player.turn, this.gameState.envitDisabled);

    if (this.player.turn == true && !this.gameState.envitDisabled) {
      this.gameState.isEnvidar = true;
      this.gameService.envidar(
        this.gameState.envitState,
        this.left,
        this.right
      );
      this.gameService.waitResponse(this.me, this.top);
    }
  }
  checkAction(
    playerActionNumber: number,
    state: string,
    value: number,
    states: {
      state: string;
      value: number;
    }[],
    gameState: string
  ) {
    const teamAction =
      playerActionNumber == 1 || playerActionNumber == 3 ? 1 : 2;
    //If both says no to truc
    let newValue = 0;
    let disabled = false;
    if (state == 'current') {
      if (value == 0) {
        if (playerActionNumber == 1 || playerActionNumber == 3) {
          return {
            status: 'score',
            payload: { team: 1, state, newValue, disabled, teamAction },
          };
        } else {
          return {
            status: 'score',
            payload: { team: 2, state, newValue, disabled, teamAction },
          };
        }
      } else {
        newValue = value;
        for (let i = 0; i < states.length; i++) {
          if (states[i].state == gameState) {
            let state = '';
            if (value >= 30) {
              state = states[i].state;
              disabled = true;
            } else {
              state = states[i + 1].state;
              disabled = teamAction == this.gameState.team ? true : false;
            }
            return {
              status: 'current',
              payload: { team: 0, state, newValue, disabled, teamAction },
            };
          }
        }
      }
    } else {
      return {
        status: 'next',
        payload: { team: 0, state, newValue, disabled, teamAction },
      };
    }

    return {
      status: 'undefind',
      payload: { team: 0, state, newValue, disabled, teamAction },
    };
  }
  resetGame() {
    this.me.cardPlayed = defaultCard;
    this.top.cardPlayed = defaultCard;
    this.left.cardPlayed = defaultCard;
    this.right.cardPlayed = defaultCard;
    this.gameService.trucResponsePlayers = { left: '', right: '' };
    this.gameService.envitResponsePlayers = { left: '', right: '' };
    const { team1Points, team2Points, team, playerStartHand } = this.gameState;
    this.gameState = {
      ...defaultGameState,
      team1Points,
      team2Points,
      team,
      playerStartHand,
    };
    if (this.gameState.team1Points >= 30 || this.gameState.team2Points >= 30) {
      const winner =
        this.gameState.team1Points > this.gameState.team2Points
          ? 'Equipo 1'
          : 'Equipo 2 ';
      this.gameState = { ...defaultGameState, end: true, winner };
    }
  }
}
