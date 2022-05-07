import { Component } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { MediaSizeService } from './service/media-size.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  mediaSub!: Subscription;
  media: string = '';
  title = 'truc';
  constructor(
    private mediaObserver: MediaObserver,
    private mediaSizeService: MediaSizeService
  ) {}
  ngOnInit(): void {
    this.mediaSub = this.mediaObserver.media$.subscribe((res: MediaChange) => {
      this.mediaSizeService.setMedia(res.mqAlias);
    });
  }
}
