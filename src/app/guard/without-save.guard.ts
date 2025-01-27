import { CanDeactivateFn } from '@angular/router';

export const withoutSaveGuard: CanDeactivateFn<unknown> = (component, currentRoute, currentState, nextState) => {
  return true;
};
