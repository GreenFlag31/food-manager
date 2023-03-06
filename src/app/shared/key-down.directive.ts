import { Directive, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  combineLatest,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  merge,
  Observable,
  share,
} from 'rxjs';
import { AuthService } from '../login/auth.service';
import { Shortcut } from './IfoodObject';

@Directive({
  selector: '[appKeyDown]',
})
export class KeyDownDirective implements OnInit {
  keydown$ = fromEvent<KeyboardEvent>(document, 'keydown').pipe(share());
  keyup$ = fromEvent<KeyboardEvent>(document, 'keyup').pipe(share());

  constructor(private router: Router, private authService: AuthService) {}

  shortcuts: Shortcut[] = [
    {
      keys: ['Alt', 's'],
      cb: () => {
        this.router.navigate(['/getting-started']);
      },
    },
    {
      keys: ['Alt', 'l'],
      cb: () => {
        this.router.navigate(['/my-list']);
      },
    },
    {
      keys: ['Alt', 'n'],
      cb: () => {
        this.router.navigate(['/notifications']);
      },
    },
    {
      keys: ['Alt', 'c'],
      cb: () => {
        this.router.navigate(['/contact']);
      },
    },
    {
      keys: ['Alt', 'o'],
      cb: () => {
        this.authService.logOut();
      },
    },
  ];

  ngOnInit() {
    const specifyKeyEvent =
      (observable: Observable<KeyboardEvent>) => (key: string) =>
        observable.pipe(
          filter((e) => e.key.toLowerCase() === key.toLowerCase())
        );

    const [keydown$ForKey, keyup$ForKey] = [this.keydown$, this.keyup$].map(
      specifyKeyEvent
    );

    const keyState$ForKey = (key: string) =>
      merge(
        keydown$ForKey(key).pipe(map(() => true)),
        keyup$ForKey(key).pipe(map(() => false))
      );

    const keysState$ForKeys = (keys: string[]) =>
      combineLatest(keys.map(keyState$ForKey));

    const hotkeys = (shortcuts: Shortcut[], preventSeries = true) =>
      shortcuts.forEach(({ keys, cb }) =>
        keysState$ForKeys(keys)
          .pipe(
            //we use JSON.stringify here to assert content equality of two arrays
            distinctUntilChanged(
              (prev, cur) =>
                preventSeries && JSON.stringify(prev) === JSON.stringify(cur)
            ),
            filter((keysState) => keysState.every(Boolean))
          )
          .subscribe(cb)
      );

    hotkeys(this.shortcuts);
  }
}
