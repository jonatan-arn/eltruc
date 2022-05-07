import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameComponent } from './game/game.component';
import { MatButtonModule } from '@angular/material/button';
import { TrucComponent } from './truc/truc.component';
import { EnvitComponent } from './envit/envit.component';

@NgModule({
  declarations: [GameComponent, TrucComponent, EnvitComponent],
  imports: [CommonModule, MatButtonModule],
})
export class GameModule {}
