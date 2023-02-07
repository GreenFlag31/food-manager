import {
  animation,
  trigger,
  animateChild,
  group,
  transition,
  animate,
  style,
  query,
  state,
  stagger,
  keyframes,
} from '@angular/animations';

export const slideInAnimation = trigger('routeAnimations', [
  transition('started => login', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
      }),
    ]),
    query(':enter', [style({ left: '100%' })]),
    query(':leave', animateChild()),
    group([
      query(':leave', [animate('300ms ease-out', style({ left: '-100%' }))]),
      query(':enter', [animate('300ms ease-out', style({ left: '0%' }))]),
    ]),
  ]),
  transition('login => started', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
      }),
    ]),
    query(':enter', [style({ left: '-100%' })]),
    query(':leave', animateChild()),
    group([
      query(':leave', [animate('300ms ease-out', style({ left: '100%' }))]),
      query(':enter', [animate('300ms ease-out', style({ left: '0%' }))]),
    ]),
  ]),
  transition('* <=> *', [
    style({ position: 'relative' }),
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
        }),
      ],
      { optional: true }
    ),
    query(':enter', [style({ opacity: 0 })], { optional: true }),
    query(':leave', [animate('400ms ease-in-out', style({ opacity: 0 }))], {
      optional: true,
    }),
    query(':enter', [animate('400ms ease-in-out', style({ opacity: 1 }))], {
      optional: true,
    }),
  ]),
]);

export const fadeInOut = trigger('fadeInOut', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('400ms', style({ opacity: 1 })),
  ]),
]);

export const slidingApparition = trigger('slidingApparition', [
  transition('* => *', [
    // Initially the all cards are not visible
    query(':enter', style({ opacity: 0 }), { optional: true }),

    // Each card will appear sequentially with the delay of 300ms
    query(
      ':enter',
      stagger('200ms', [
        animate(
          '.5s ease-in',
          keyframes([
            style({ transform: 'translateY(10px)' }),

            style({ opacity: 1, transform: 'translateY(0)' }),
          ])
        ),
      ]),
      { optional: true }
    ),
  ]),
]);
