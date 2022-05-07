import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { SocketService } from '../service/room.service';

@Injectable({
  providedIn: 'root',
})
export class LobbyGuard implements CanActivate {
  constructor(private socketService: SocketService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.socketService.players.length == 0) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
