import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayersComponent } from './players/players.component';
import { LobbyComponent } from './lobby/lobby.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [LobbyComponent, PlayersComponent],
  imports: [CommonModule, MatButtonModule, MatDialogModule, FlexLayoutModule],
})
export class LobbyModule {}
