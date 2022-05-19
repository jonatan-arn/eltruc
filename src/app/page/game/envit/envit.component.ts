import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GameService } from 'src/app/service/game.service';

@Component({
  selector: 'app-envit',
  templateUrl: './envit.component.html',
  styleUrls: ['./envit.component.sass'],
})
export class EnvitComponent implements OnInit {
  envitStates = ['envidar', 'torne', 'la falta'];
  nextEnvitState!: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { envitState: string },
    private gameService: GameService,
    private dialogRef: MatDialogRef<EnvitComponent>
  ) {}

  ngOnInit(): void {
    let indx = this.envitStates.indexOf(this.data.envitState);
    this.nextEnvitState = this.envitStates[indx + 1];
  }
  envit(state: string) {
    this.gameService.envitResponse(state, this.data.envitState);
    this.dialogRef.close();
  }
}
