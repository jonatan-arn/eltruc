import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Socket } from 'socket.io-client';
import { SocketService } from 'src/app/service/room.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  constructor(
    private socketService: SocketService,
    private formBuilder: FormBuilder
  ) {
    //Form group
    this.lobbyForm = this.formBuilder.group({
      create: this.formBuilder.group({
        user: ['', [Validators.required]],
      }),
      join: this.formBuilder.group({
        room: ['', [Validators.required]],
      }),
    });
  }
  socket!: Socket;
  name: string = '';
  roomID: string = '';
  lobbyForm!: FormGroup;
  ngOnInit(): void {}
  //Create a room
  createRoom() {
    const { user } = this.lobbyForm.controls['create'].value;
    this.socketService.owner = true;
    if (user != '') this.socketService.createRoom(user);
  }

  //Join a room
  joinRoom() {
    const { user } = this.lobbyForm.controls['create'].value;
    const { room } = this.lobbyForm.controls['join'].value;
    if (room != '' && user != '') this.socketService.joinRoom(user, room);
  }
}
