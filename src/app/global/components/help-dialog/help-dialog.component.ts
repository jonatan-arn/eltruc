import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-help-dialog',
  templateUrl: './help-dialog.component.html',
  styleUrls: ['./help-dialog.component.sass'],
})
export class HelpDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { error: string }) {}

  ngOnInit(): void {}
}
