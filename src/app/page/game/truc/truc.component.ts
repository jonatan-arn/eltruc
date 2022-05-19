import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GameService } from 'src/app/service/game.service';

@Component({
  selector: 'app-truc',
  templateUrl: './truc.component.html',
  styleUrls: ['./truc.component.sass'],
})
export class TrucComponent implements OnInit {
  trucStates = ['truc', 'retruc', 'quatre val', 'joc fora'];
  nextTrucState!: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { trucState: string },
    private gameService: GameService,
    private dialogRef: MatDialogRef<TrucComponent>
  ) {}

  ngOnInit(): void {
    let indx = this.trucStates.indexOf(this.data.trucState);
    this.nextTrucState = this.trucStates[indx + 1];
  }
  truc(state: string) {
    this.gameService.trucResponse(state, this.data.trucState);
    this.dialogRef.close();
  }
}
