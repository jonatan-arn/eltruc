import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayersComponent } from './players/players.component';
import { LobbyComponent } from './lobby/lobby.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { GlobalModule } from 'src/app/global/global.module';

@NgModule({
  declarations: [LobbyComponent, PlayersComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    FlexLayoutModule,
    ClipboardModule,
    GlobalModule,
  ],
})
export class LobbyModule {}
