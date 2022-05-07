import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LobbyModule } from './page/lobby/lobby.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeModule } from './page/home/home.module';
import { GameModule } from './page/game/game.module';
import { GlobalModule } from './global/global.module';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HomeModule,
    LobbyModule,
    GameModule,
    BrowserAnimationsModule,
    GlobalModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
