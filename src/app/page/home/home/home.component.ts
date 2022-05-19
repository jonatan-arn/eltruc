import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Socket, io } from 'socket.io-client';
import { HelpDialogComponent } from 'src/app/global/components/help-dialog/help-dialog.component';
import { MediaSizeService } from 'src/app/service/media-size.service';
import { SocketService } from 'src/app/service/room.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  socket!: Socket;
  name: string = '';
  roomID: string = '';
  lobbyForm!: FormGroup;
  media: string = '';
  constructor(
    private socketService: SocketService,
    private route: Router,
    private dialog: MatDialog,
    private mediaSizeService: MediaSizeService,
    private snackBar: MatSnackBar
  ) {}
  ngOnInit(): void {
    //Emit socket connected
    this.mediaSizeService.getMedia().subscribe((res: any) => {
      this.media = res;
    });

    this.socketService.connectSocket();

    //Subscribe when connected to a room
    this.socketService.enterRoomEven.subscribe((data) => {
      //Add the new player to players array
      this.socketService.addPlayer({
        ...data,
        owner: this.socketService.owner,
        turn: this.socketService.owner,
      });
      this.route.navigate(['/lobby']);
    });

    //Subscribe to room full
    this.socketService.fullRoom.subscribe(() =>
      this.snackBar.open('sala llena')
    );

    //Subscribe to room undefined
    this.socketService.undefinedRoom.subscribe(() =>
      this.snackBar.open('no existe la sala introducida')
    );

    //Subscribe to nameInRoom
    this.socketService.nameInRoom.subscribe(() =>
      this.snackBar.open('ese nombre ya existe en la sala')
    );
  }
}
