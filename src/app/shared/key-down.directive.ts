import { Directive, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  combineLatest,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  mapTo,
  merge,
  Observable,
  share,
  tap,
} from 'rxjs';
import { Shortcut } from './IfoodObject';

@Directive({
  selector: '[appKeyDown]',
})
export class KeyDownDirective implements OnInit {
  keydown$ = fromEvent<KeyboardEvent>(document, 'keydown').pipe(share());
  keyup$ = fromEvent<KeyboardEvent>(document, 'keyup').pipe(share());

  shortcuts: Shortcut[] = [
    {
      keys: ['Shift', 'r', 'x'], //shortcut keys in format how they will be exposed in e.key
      //callback to call when keys are pressed
      cb: () => {
        console.log('RxJS is cool!');
      },
    },
    {
      keys: ['Shift', 't', 's'],
      cb: () => {
        console.log('TS is awesome!');
      },
    },
  ];

  //   this.router.navigate(['/getting-started']);

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
        keydown$ForKey(key).pipe(mapTo(true)),
        keyup$ForKey(key).pipe(mapTo(false))
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

  constructor(private router: Router) {}
}
