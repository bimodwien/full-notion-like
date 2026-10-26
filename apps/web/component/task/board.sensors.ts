'use client';

import { MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { MouseEvent, TouchEvent } from 'react';

// The detail and delete dialogs render inside the card, so pressing there
// (e.g. selecting text in a field) must not pick the card up.
function outsideDialog(event: Event) {
  return !(event.target as Element).closest('dialog');
}

class CardMouseSensor extends MouseSensor {
  static activators = [
    {
      eventName: 'onMouseDown' as const,
      handler: ({ nativeEvent }: MouseEvent) =>
        nativeEvent.button === 0 && outsideDialog(nativeEvent),
    },
  ];
}

class CardTouchSensor extends TouchSensor {
  static activators = [
    {
      eventName: 'onTouchStart' as const,
      handler: ({ nativeEvent }: TouchEvent) => outsideDialog(nativeEvent),
    },
  ];
}

// Mouse drags start after a short move so clicks still open the card;
// touch waits for a press-and-hold so the page can still scroll.
export function useBoardSensors() {
  return useSensors(
    useSensor(CardMouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(CardTouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
  );
}
