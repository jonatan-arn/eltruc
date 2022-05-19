import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { defautlEnvitStates, defautlTrucStates } from 'src/app/interfaze/game';
import { GameService } from 'src/app/service/game.service';

@Component({
  selector: 'app-wait',
  templateUrl: './wait.component.html',
  styleUrls: ['./wait.component.sass'],
})
export class WaitComponent implements OnInit {
  constructor(
    private gameService: GameService,
    private dialogRef: MatDialogRef<WaitComponent>
  ) {}
  trucStates = defautlTrucStates;
  trucStatesNames: string[] = ['truc', 'retruc', 'quatre val', 'joc fora'];
  envitStates = defautlEnvitStates;
  envitStatesNames = ['envide', 'torne', 'la falta'];

  subscription!: Subscription;
  ngOnInit(): void {
    this.subscription = this.gameService.awaitResponseEndEve.subscribe(
      (data) => {
        const { state, oldState, id, type } = data;
        let left,
          right = '';
        if (id == this.gameService.left.player.id) {
          if (type == 'truc') {
            this.gameService.trucResponsePlayers.left = state;
          } else this.gameService.envitResponsePlayers.left = state;
        } else {
          if (type == 'truc')
            this.gameService.trucResponsePlayers.right = state;
          else this.gameService.envitResponsePlayers.right = state;
        }

        left =
          type == 'truc'
            ? this.gameService.trucResponsePlayers.left
            : this.gameService.envitResponsePlayers.left;
        right =
          type == 'truc'
            ? this.gameService.trucResponsePlayers.right
            : this.gameService.envitResponsePlayers.right;

        if (left != '' && right != '') {
          let res;
          if (type == 'truc') {
            res = this.search(
              this.trucStatesNames,
              this.trucStates,
              left,
              right
            );
          } else {
            res = this.search(
              this.envitStatesNames,
              this.envitStates,
              left,
              right
            );
          }
          if (res != null) {
            const { state, value } = res;
            this.dialogRef.close({ state, value, type });
          } else if (left == 'true' || right == 'true') {
            let value =
              type == 'truc'
                ? this.trucStates.find((s) => s.state == oldState)?.value
                : this.envitStates.find((s) => s.state == oldState)?.value;

            this.dialogRef.close({
              state: 'current',
              value,
              type,
            });
          } else {
            //Se a retrucat
            this.dialogRef.close({ state: 'current', value: 0, type });
          }
          this.gameService.trucResponsePlayers = { left: '', right: '' };
          this.gameService.envitResponsePlayers = { left: '', right: '' };
        }
      }
    );
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscription.unsubscribe();
  }
  search(
    names: string[],
    states: {
      state: string;
      value: number;
    }[],
    left: string,
    right: string
  ) {
    if (names.includes(left) || names.includes(right)) {
      for (let i = 0; i < states.length; i++) {
        //More than yes
        let { state, value } = states[i];
        if (state == left || state == right) {
          return { state, value };
        }
      }
    }
    return null;
  }

  //       if (left != '' && right != '') {
  //         if (
  //           this.trucStatesNames.includes(left) ||
  //           this.trucStatesNames.includes(right)
  //         ) {
  //           for (let i = 0; i < this.trucStates.length; i++) {
  //             //More than yes
  //             let { state, trucValue } = this.trucStates[i];

  //             if (state == left || state == right) {
  //               this.dialogRef.close({ state, trucValue });
  //               break;
  //             }
  //           }
  //         } else if (left == 'true' || right == 'true') {
  //           let v = this.trucStates.find((s) => s.state == oldState)?.trucValue;

  //           this.dialogRef.close({
  //             state: 'current',
  //             trucValue: v,
  //           });
  //         } else {
  //           //Se a retrucat
  //           this.dialogRef.close({ state: 'current', trucValue: 0 });
  //         }
  //         this.gameService.trucResponsePlayers = { left: '', right: '' };
  //         this.gameService.envitResponsePlayers = { left: '', right: '' };
  //       }
  //     }
  //   );
  // }
}
