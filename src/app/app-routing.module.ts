import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './page/game/game/game.component';
import { LobbyGuard } from './guards/lobby.guard';
import { HomeComponent } from './page/home/home/home.component';
import { LobbyComponent } from './page/lobby/lobby/lobby.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  { path: 'home', component: HomeComponent },
  { path: 'lobby', component: LobbyComponent, canActivate: [LobbyGuard] },
  { path: 'game', component: GameComponent, canActivate: [LobbyGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
