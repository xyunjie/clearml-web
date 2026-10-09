import {inject, Signal} from '@angular/core';
import {CanDeactivateFn} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../ui-components/overlay/confirm-dialog/confirm-dialog.component';
import {map} from 'rxjs/operators';

export interface DirtyState {
  isDirty: Signal<boolean>;
  onLeaveConfirmed?(): void;
}


export const generalLeavingBeforeSaveAlertGuard: CanDeactivateFn<DirtyState> = (component) => {
  const dialog = inject(MatDialog);

  if (!component.isDirty()) {
    return true;
  }

  return dialog.open(ConfirmDialogComponent, {
    data: {
      title: '注意',
      body: '有未保存的更改。要留在此页面，还是不保存直接离开？',
      yes: '离开',
      no: '留下',
      iconClass: 'al-ico-alert',
      iconColor: 'var(--color-warning)',
      centerText: true,
    },
    panelClass: 'dialog-md'
  }).afterClosed()
    .pipe(map(leave => {
      if (leave) {
        component.onLeaveConfirmed?.();
      }
      return !!leave;
    }));
};
