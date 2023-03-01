import {
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
  animation,
  useAnimation,
} from '@angular/animations';

const startStyle = animation([
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
]);

const animateStartStyle = animation([
  query(':enter', [style({ transform: 'translateX({{startingLeft}})' })]),
  query(':leave', animateChild()),
  group([
    query(':leave', [
      animate(
        '300ms ease-out',
        style({ transform: 'translateX({{leavingLeft}})' })
      ),
    ]),
    query(':enter', [
      animate('300ms ease-out', style({ transform: 'translateX(0)' })),
    ]),
  ]),
]);

export const slideInAnimation = trigger('routeAnimations', [
  transition('login => myList', [
    useAnimation(startStyle),

    useAnimation(animateStartStyle, {
      params: {
        startingLeft: '100%',
        leavingLeft: '-100%',
      },
    }),
  ]),
  transition('myList => login', [
    useAnimation(startStyle),

    useAnimation(animateStartStyle, {
      params: {
        startingLeft: '-100%',
        leavingLeft: '100%',
      },
    }),
  ]),
  transition('* <=> *', [
    useAnimation(startStyle),

    query(':enter', [style({ opacity: 0 })], { optional: true }),
    query(':leave', [animate('400ms ease-in-out', style({ opacity: 0 }))], {
      optional: true,
    }),
    query(':enter', [animate('400ms ease-in-out', style({ opacity: 1 }))], {
      optional: true,
    }),
    query('@*', animateChild(), {
      optional: true,
    }),
  ]),
]);

export const fadeInOut = trigger('fadeInOut', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('500ms', style({ opacity: 1 })),
  ]),
]);

export const slidingApparition = trigger('slidingApparition', [
  transition('* => *', [
    query(':enter', style({ opacity: 0 }), { optional: true }),

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

export const opacityTransition = trigger('opacityAnimation', [
  state(
    'visible',
    style({
      opacity: 1,
    })
  ),
  state(
    'invisible',
    style({
      opacity: 0,
    })
  ),
  transition('invisible <=> visible', [animate('0.3s')]),
]);

export const loginTransition = trigger('loginAnimation', [
  state(
    'visible',
    style({
      opacity: 1,
      width: '*',
      height: '*',
      padding: '*',
    })
  ),
  state(
    'invisible',
    style({
      opacity: 0,
      width: '0',
      height: '0',
      padding: '0',
    })
  ),
  transition('visible => invisible', [
    animate(
      '1s',
      keyframes([
        style({ opacity: 1 }),
        style({ opacity: 0 }),
        style({ width: '*', height: '*', padding: '*' }),
        style({ width: '0', height: '0', padding: '0' }),
      ])
    ),
  ]),
]);

export const tipsAnimation = trigger('tips', [
  state(
    'visible',
    style({
      opacity: 1,
      transform: 'translateY(0)',
    })
  ),
  state(
    'default',
    style({
      opacity: 0,
      transform: 'translateY(100%)',
    })
  ),
  transition('default => visible', [animate('0.5s')]),
]);

export const iconsCode = trigger('up', [
  transition('* => *', [
    query(':enter', style({ opacity: 0 }), { optional: true }),

    query(
      ':enter',
      stagger('200ms', [
        animate(
          '0.6s 0.5s ease-in-out',
          keyframes([
            style({ transform: 'translateY(50%)' }),
            style({ opacity: 1, transform: 'translateY(0)' }),
          ])
        ),
      ]),
      { optional: true }
    ),
  ]),
]);

export const selfPic = trigger('down', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(-20%)' }),
    animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
  ]),
]);

export const title = trigger('right', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateX(-30%)' }),
    animate(
      '0.6s 0.3s ease-out',
      style({ opacity: 1, transform: 'translateX(0)' })
    ),
  ]),
]);

export const itemsToExpire = trigger('expiration', [
  state(
    'visible',
    style({
      opacity: 1,
      transform: 'translateY(0)',
    })
  ),
  state(
    'default',
    style({
      opacity: 0,
      transform: 'translateY(-20%)',
    })
  ),
  transition('default => visible', [animate('0.5s ease-out')]),
]);
