import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-name',
  templateUrl: './name.component.html',
  styleUrls: ['./name.component.scss'],
})
export class NameComponent implements OnInit {
  @Input() name: string = '';
  @Input() side: boolean = false;
  @Input() margin_bottom: boolean = false;

  constructor() {}

  ngOnInit(): void {}
}
