import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-truc',
  templateUrl: './truc.component.html',
  styleUrls: ['./truc.component.sass'],
})
export class TrucComponent implements OnInit {
  trucStates = ['truc', 'rectruc', '4 val', 'la partida'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: { trucState: string }) {}

  ngOnInit(): void {}
  truc(state: string) {}
}
