import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Component, computed, effect, inject, linkedSignal, signal, untracked} from '@angular/core';
import {Store} from '@ngrx/store';
import {
  selectEntitiesFailedToDelete,
  selectFilesFailedToDelete,
  selectNumberOfSourcesToDelete
} from './common-delete-dialog.reducer';
import {deleteEntities, resetDeleteState} from './common-delete-dialog.actions';
import {getDeleteProjectPopupStatsBreakdown} from '~/features/projects/projects-page.utils';
import {ENTITY_TYPE_LABELS, EntityTypeEnum, hideDeleteArtifactsEntities} from '~/shared/constants/non-common-consts';
import {CommonReadyForDeletion} from '@common/projects/common-projects.reducer';
import DOMPurify from 'dompurify';
import {DialogTemplateComponent} from '@common/shared/ui-components/overlay/dialog-template/dialog-template.component';
import {CopyClipboardComponent} from '@common/shared/ui-components/indicators/copy-clipboard/copy-clipboard.component';
import {MatIcon} from '@angular/material/icon';
import {MatProgressBar} from '@angular/material/progress-bar';
import {MatCheckbox} from '@angular/material/checkbox';
import {ShowTooltipIfEllipsisDirective} from '@common/shared/ui-components/indicators/tooltip/show-tooltip-if-ellipsis.directive';
import {TooltipDirective} from '@common/shared/ui-components/indicators/tooltip/tooltip.directive';
import {FormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {SlicePipe} from '@angular/common';

export interface DeleteData {
  numSelected: number;
  entity: { id: string; name?: string };
  entityType: EntityTypeEnum;
  projectStats?: CommonReadyForDeletion;
  useCurrentEntity?: boolean;
  includeChildren?: boolean;
  resetMode?: boolean;
  devWarning?: boolean;
}

@Component({
  selector: 'sm-delete-dialog',
  templateUrl: './common-delete-dialog.component.html',
  styleUrls: ['./common-delete-dialog.component.scss'],
  imports: [
    DialogTemplateComponent,
    CopyClipboardComponent,
    MatIcon,
    MatProgressBar,
    MatCheckbox,
    ShowTooltipIfEllipsisDirective,
    TooltipDirective,
    FormsModule,
    MatButton,
    SlicePipe
  ]
})
export class CommonDeleteDialogComponent {
  protected data = inject<DeleteData>(MAT_DIALOG_DATA);
  protected dialogRef = inject(MatDialogRef<CommonDeleteDialogComponent>);
  private store = inject(Store);

  protected readonly entityName: string;
  protected readonly resetMode = this.data.resetMode;
  protected readonly devWarning = this.data.devWarning;
  protected readonly entityType = this.data.entityType;
  protected readonly entityTypeLabel = ENTITY_TYPE_LABELS[this.data.entityType] ?? this.data.entityType;
  protected readonly numSelected = this.data.numSelected;
  protected readonly header = `${this.data.resetMode ? '重置' : '删除'}${ENTITY_TYPE_LABELS[this.data.entityType] ?? this.data.entityType}`;
  protected readonly bodyMessage = this.getMessageByEntity(this.data.entityType, this.data.projectStats);
  protected readonly useCurrentEntity = this.data.useCurrentEntity;
  protected readonly entity = this.data.entity;
  protected readonly includeChildren = this.data.includeChildren;
  protected readonly hideDeleteArtifacts = hideDeleteArtifactsEntities.includes(this.data.entityType);
  protected inProgress = signal(false);
  protected totalFilesNumber = signal(null);
  protected showFinishMessage = signal(false);
  protected deleteArtifacts = signal(true);

  protected filesNumber = this.store.selectSignal(selectNumberOfSourcesToDelete);
  protected failedFiles = this.store.selectSignal(selectFilesFailedToDelete);
  protected failedEntities = this.store.selectSignal(selectEntitiesFailedToDelete)

  protected isOpen = linkedSignal(() => !!this.failedFiles().length);
  protected noFilesToDelete = computed(() => Number.isInteger(this.totalFilesNumber()) && this.totalFilesNumber() === 0);
  protected progressPercent = computed(() => this.noFilesToDelete() ? 100 :
    Math.round((this.totalFilesNumber() - this.filesNumber()) / this.totalFilesNumber() * 100) || 0
  );
  protected isOpenEntities = linkedSignal(() => !!this.failedEntities().length);


  constructor() {
    const name = DOMPurify.sanitize(this.data.entity?.name);
    this.entityName = this.data.numSelected === 1 ?
      this.data.entityType === EntityTypeEnum.project ? name.split('/').pop() : name :
      `${this.data.numSelected} 个${ENTITY_TYPE_LABELS[this.data.entityType] ?? this.data.entityType}`;

    const firstTimeEffect = effect(() => {
      if (this.firstTime(this.filesNumber())) {
        this.totalFilesNumber.set(this.filesNumber());
        firstTimeEffect.destroy();
      }
    });

    effect(() => {
      if (this.progressPercent() > 99) {
        untracked(() => {
          if (this.failedFiles()?.length > 0 || this.isOpenEntities()) {
            window.setTimeout(() => this.showFinishMessage.set(true), 1000);
          } else {
            this.closeDialog(true);
          }
        })
      }
    });
  }

  closeDialog(isConfirmed) {
    if (isConfirmed) {
      this.store.dispatch(resetDeleteState());
      this.dialogRef.close(true);
    } else {
      this.dialogRef.close(null);
    }
  }

  delete() {
    this.inProgress.set(true);
    this.store.dispatch(deleteEntities({
      entityType: this.entityType,
      entity: this.useCurrentEntity && this.entity,
      includeChildren: this.includeChildren,
      deleteArtifacts: this.deleteArtifacts(),
      resetMode: this.resetMode
    }));
  }

  openToggle() {
    this.isOpen.update(open => !open);
  }

  openToggleEntities() {
    this.isOpenEntities.update(open => !open);
  }

  getMessageByEntity(entityType: EntityTypeEnum, stats?: CommonReadyForDeletion) {
    switch (entityType) {
      case EntityTypeEnum.controller:
      case EntityTypeEnum.experiment:
        return '这还将删除所有已采集的日志、结果、产物和调试样本。';
      case EntityTypeEnum.model:
        return '这还将删除模型权重文件。注意：使用已删除模型的任务将无法再运行。';
      case EntityTypeEnum.project:
        // eslint-disable-next-line no-case-declarations
        const entitiesBreakDown = getDeleteProjectPopupStatsBreakdown(stats, 'total', 'task');
        return entitiesBreakDown.trim().length > 0 ? `将删除${entitiesBreakDown}及其产物，这可能需要几分钟。` : '';
      case EntityTypeEnum.openDataset: {
        const entitiesBreakDown2 = getDeleteProjectPopupStatsBreakdown(stats, 'total', `version`);
        const single = Object.values(stats).reduce((a, b) => a + (b.total || 0), 0) == 1;
        return entitiesBreakDown2.trim().length > 0 ? `将删除${entitiesBreakDown2}及其数据，这可能需要几分钟。` : '';
      }
    }
    return '';
  }

  private firstTime(filesNumber: number) {
    return !this.totalFilesNumber() && Number.isInteger(filesNumber);
  }
}
