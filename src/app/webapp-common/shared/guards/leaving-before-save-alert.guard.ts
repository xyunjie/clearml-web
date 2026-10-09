import {inject} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanDeactivateFn,
  RouterStateSnapshot
} from '@angular/router';
import {of, switchMap} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../ui-components/overlay/confirm-dialog/confirm-dialog.component';
import {MemoizedSelector, Store} from '@ngrx/store';
import {debounceTime, map} from 'rxjs/operators';


export const leavingBeforeSaveAlertGuard = (inEditSelector: MemoizedSelector<any, boolean>): CanDeactivateFn<any>  =>
  (component, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState: RouterStateSnapshot) => {
    const store = inject(Store);
    const dialog = inject(MatDialog);
    return store.select(inEditSelector)
      .pipe(
        debounceTime(0),
        switchMap(inEditMode => {
          const unGuard = nextState?.root?.queryParams?.unGuard;
          if (unGuard === 'true' || !inEditMode) {
            return of(true);
          }

          return dialog.open(ConfirmDialogComponent, {
            data: {
              title    : '注意',
              body     : '有未保存的更改。要留在此页面，还是不保存直接离开？',
              yes      : '离开',
              no       : '留下',
              iconClass: 'al-ico-alert',
              iconColor: 'var(--color-warning)',
            },
            panelClass: 'dialog-sm'
          }).afterClosed().pipe(map((leave)=> !!leave));
        }),
      );
  };
