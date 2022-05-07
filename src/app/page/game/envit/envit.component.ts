import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-envit',
  templateUrl: './envit.component.html',
  styleUrls: ['./envit.component.sass'],
})
export class EnvitComponent implements OnInit {
  envitStates = ['envide', 'torne', 'la falta'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: { envitState: string }) {}

  ngOnInit(): void {}
  envit(state: string) {}
}
