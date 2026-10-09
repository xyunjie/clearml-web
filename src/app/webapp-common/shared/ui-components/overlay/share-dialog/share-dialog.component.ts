import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogRef} from '@angular/material/dialog';
import {IShareDialogConfig} from './share-dialog.model';
import {addMessage} from '@common/core/actions/layout.actions';
import {Store} from '@ngrx/store';
import {shareSelectedExperiments} from '@common/experiments/actions/common-experiments-menu.actions';
import {MESSAGES_SEVERITY} from '@common/constants';
import {DialogTemplateComponent} from '@common/shared/ui-components/overlay/dialog-template/dialog-template.component';
import {ClipboardModule} from 'ngx-clipboard';
import {ClickStopPropagationDirective} from '@common/shared/ui-components/directives/click-stop-propagation.directive';
import {SaferPipe} from '@common/shared/pipes/safe.pipe';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';


@Component({
  selector: 'sm-share-dialog',
  templateUrl: './share-dialog.component.html',
  styleUrls: ['./share-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DialogTemplateComponent,
    ClipboardModule,
    ClickStopPropagationDirective,
    SaferPipe,
    MatIcon,
    MatButton,
    MatDialogActions
  ]
})
export class ShareDialogComponent {
  protected data = inject<IShareDialogConfig>(MAT_DIALOG_DATA);
  protected dialogRef = inject(MatDialogRef<ShareDialogComponent>);
  private store = inject(Store);

  protected title = this.data.title || '';
  protected sharedSubtitle =`<b>任何持有此链接的注册用户</b>都可以只读访问此任务及其全部内容（产物、结果等）`;
  protected privateSubtitle =  `创建分享链接，向你提供此链接的<b>任何注册用户</b>授予只读访问权限。`;
  protected task = this.data.task;

  protected link = this.data.link || '';
  protected shared = signal(!!this.data.alreadyShared);

  closeDialog(isConfirmed) {
    this.dialogRef.close({isConfirmed, shared: this.shared()});
  }

  copyToClipboardSuccess() {
    this.store.dispatch(addMessage(MESSAGES_SEVERITY.SUCCESS, 'URL 已复制'));
  }

  createLink() {
    this.store.dispatch(shareSelectedExperiments({share: !this.shared(), task: this.task}));
    this.shared.update(shared => !shared);
  }
}
