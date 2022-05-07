import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MediaSizeService {
  private mediaSubject = new Subject<string>();
  constructor() {}
  setMedia(media: string) {
    this.mediaSubject.next(media);
  }
  getMedia(): Subject<string> {
    return this.mediaSubject;
  }
}
