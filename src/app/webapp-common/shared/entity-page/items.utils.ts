import {TaskStatusEnum} from '~/business-logic/model/tasks/taskStatusEnum';
import {ModelsArchiveManyResponse} from '~/business-logic/model/models/modelsArchiveManyResponse';
import {TasksArchiveManyResponse} from '~/business-logic/model/tasks/tasksArchiveManyResponse';
import {ENTITY_TYPE_LABELS, EntityTypeEnum} from '~/shared/constants/non-common-consts';
import {addMessage} from '@common/core/actions/layout.actions';
import {openMoreInfoPopup} from '@common/core/actions/projects.actions';
import {TaskTypeEnum} from '~/business-logic/model/tasks/taskTypeEnum';
import {Task} from '~/business-logic/model/tasks/task';
import {TASKS_STATUS} from '@common/tasks/tasks.constants';
import {TASK_TYPES} from '~/app.constants';
import {isReadOnly} from '@common/shared/utils/is-read-only';

export interface CountAvailableAndIsDisable {
  available: number;
  disable: boolean;
}

export interface CountAvailableAndIsDisableSelectedFiltered extends CountAvailableAndIsDisable {
  selectedFiltered: any[];
}

export const countAvailableAndIsDisable = (selectedFiltered: any[]) => ({
  available: selectedFiltered.length,
  disable: selectedFiltered.length === 0
});

export const selectionHasExample = (selectedElements: any[]) => selectedElements.some((exp => isReadOnly(exp)));
export const selectionAllHasExample = (selectedElements: any[]) => selectedElements.every((exp => isReadOnly(exp)));
export const selectionAllIsArchive = (selectedElements: any[]) => selectedElements.every(s => s?.system_tags?.includes('archived'));
export const selectionIsArchive = (selectedElements: any) => selectedElements?.system_tags?.includes('archived');
export const selectionExamplesCount = (selectedElements: any) => selectedElements.filter((exp => isReadOnly(exp)));
export const canEnqueue = (task: Task): boolean =>
  !!(task && (TASKS_STATUS.CREATED === task.status || TASKS_STATUS.STOPPED === task.status) && task.type !== TASK_TYPES.MANUAL_ANNOTATION);

export const canRetry = (task: Task): boolean =>
  !!(task && TASKS_STATUS.FAILED === task.status && task.type !== TASK_TYPES.MANUAL_ANNOTATION);
export const canChangeVersion = (task: Task): boolean =>
  !!(task && TASKS_STATUS.PUBLISHED !== task.status && task.type !== TASK_TYPES.MANUAL_ANNOTATION);

export const canDequeue = (task: Task): boolean =>
  !!(task && TASKS_STATUS.QUEUED === task.status);

export const canContinue = (task: Task): boolean =>
  !!(task && [TASKS_STATUS.CREATED, TASKS_STATUS.STOPPED].includes(task.status) && task.type !== TASK_TYPES.MANUAL_ANNOTATION) && !!task.execution?.queue;

export const selectionDisabledAbort = (selectedElements: any[]) => {
  const selectedFiltered = selectedElements.filter((_selected) => [TaskStatusEnum.Queued, TaskStatusEnum.InProgress].includes(_selected?.status) && !isReadOnly(_selected));
  return {selectedFiltered, ...countAvailableAndIsDisable(selectedFiltered)};
};
export const selectionDisabledPublishExperiments = (selectedElements: any[]) => {
  const selectedFiltered = selectedElements.filter(_selected => ([TaskStatusEnum.Stopped, TaskStatusEnum.Closed, 'completed', TaskStatusEnum.Failed].includes(_selected?.status) && !isReadOnly(_selected)));
  return {selectedFiltered, ...countAvailableAndIsDisable(selectedFiltered)};
};
export const selectionDisabledPublishModels = (selectedElements: any[]) => {
  const selectedFiltered = selectedElements.filter(_selected => (!isReadOnly(_selected) && !_selected?.ready));
  return {selectedFiltered, ...countAvailableAndIsDisable(selectedFiltered)};
};

export const selectionDisabledReset = (selectedElements: any[]) => {
  const selectedFiltered = selectedElements.filter(_selected => ![TaskStatusEnum.Created, TaskStatusEnum.Published, TaskStatusEnum.Publishing].includes(_selected?.status) && !isReadOnly(_selected));
  return {selectedFiltered, ...countAvailableAndIsDisable(selectedFiltered)};
};

export const selectionDisabledAbortAllChildren = (selectedElements: any[]) => {
  const selectedFiltered = selectedElements.filter(_selected => [TaskTypeEnum.Controller, TaskTypeEnum.Optimizer].includes(_selected?.type) && !isReadOnly(_selected));
  return {selectedFiltered, ...countAvailableAndIsDisable(selectedFiltered)};
};
export const selectionDisabledDelete = (selectedElements: any[]) => {
  const selectedFiltered = selectedElements.filter(_selected => selectionIsArchive(_selected) && !isReadOnly(_selected));
  return {selectedFiltered, ...countAvailableAndIsDisable(selectedFiltered)};
};
export const selectionDisabledMoveTo = (selectedElements: any[]) => {
  const selectedFiltered = selectedElements.filter(_selected => !isReadOnly(_selected));
  return {selectedFiltered, ...countAvailableAndIsDisable(selectedFiltered)};
};
export const selectionDisabledQueue = (selectedElements: { id?: string; status?: string }[]) => {
  if (selectedElements.length > 1) {
    return {selectedFiltered: [], disable: true, available: 0};
  }
  const selectedFiltered = selectedElements.filter(_selected => _selected?.status === TaskStatusEnum.Queued && !isReadOnly(_selected));
  return {selectedFiltered, ...countAvailableAndIsDisable(selectedFiltered)};
};
export const selectionDisabledViewWorker = (selectedElements: any[]) => {
  if (selectedElements.length > 1) {
    return {selectedFiltered: [], disable: true, available: 0};
  }
  const selectedFiltered = selectedElements.filter(_selected => _selected?.status === TaskStatusEnum.InProgress && !isReadOnly(_selected));
  return {selectedFiltered, ...countAvailableAndIsDisable(selectedFiltered)};
};
export const selectionDisabledContinue = (selectedElements: any[]) => {
  const selectedFiltered = selectedElements.filter(_selected => canContinue(_selected) && !isReadOnly(_selected));
  return {selectedFiltered, ...countAvailableAndIsDisable(selectedFiltered)};
};
export const selectionDisabledEnqueue = (selectedElements: any[]) => {
  const selectedFiltered = selectedElements.filter(_selected => canEnqueue(_selected) && !isReadOnly(_selected));
  return {selectedFiltered, ...countAvailableAndIsDisable(selectedFiltered)};
};
export const selectionDisabledPipelineRun = (selectedElements: any[]) => {
  const selectedFiltered = selectedElements.filter(_selected => !isReadOnly(_selected));
  return {selectedFiltered, ...countAvailableAndIsDisable(selectedFiltered)};
};

export const selectionDisabledChangeVersion = (selectedElements: any[]) => {
  const selectedFiltered = selectedElements.filter(_selected => canChangeVersion(_selected) && !isReadOnly(_selected));
  return {selectedFiltered, ...countAvailableAndIsDisable(selectedFiltered)};
};
export const selectionDisabledRetry = (selectedElements: any[]) => {
  const selectedFiltered = selectedElements.filter(_selected => canRetry(_selected) && !isReadOnly(_selected));
  return {selectedFiltered, ...countAvailableAndIsDisable(selectedFiltered)};
};
export const selectionDisabledDequeue = (selectedElements: any[]) => {
  const selectedFiltered = selectedElements.filter(_selected => canDequeue(_selected) && !isReadOnly(_selected));
  return {selectedFiltered, ...countAvailableAndIsDisable(selectedFiltered)};
};
export const selectionDisabledArchive = (selectedElements: any[]) => {
  const selectedFiltered = selectedElements.filter(_selected => !isReadOnly(_selected));
  return {selectedFiltered, ...countAvailableAndIsDisable(selectedFiltered)};
};
export const selectionDisabledTags = (selectedElements: any[]) => {
  const selectedFiltered = selectedElements.filter(_selected => !isReadOnly(_selected));
  return {selectedFiltered, ...countAvailableAndIsDisable(selectedFiltered)};
};

export const selectionTags = <T extends { tags?: string[] }>(selectedElements: T[]): string[] => {
  const _selectedTags = {};
  selectedElements.forEach(_selected => {
    _selected?.tags?.forEach(tag => {
      if (!_selectedTags[tag]) {
        _selectedTags[tag] = 1;
      } else {
        _selectedTags[tag]++;
      }
    });
  });
  return Object.entries(_selectedTags)
    .filter(([, amount]) => amount === selectedElements.length)
    .map(([tag]) => tag);
};

export enum MenuItems {
  abort = 'abort',
  abortAllChildren = 'abortAllChildren',
  run = 'runPipeline',
  archive = 'archive',
  compare = 'compare',
  delete = 'delete',
  enqueue = 'enqueue',
  dequeue = 'dequeue',
  queue = 'queue',
  moveTo = 'moveTo',
  publish = 'publish',
  reset = 'reset',
  viewWorker = 'viewWorker',
  tags = 'tags',
  showAllItems = 'showAllItems',
  continue = 'continue',
  retry = 'retry',
  changeVersion = 'changeVersion',
}

export enum MoreMenuItems {
  restore = 'restore'
}

export type AllMenuItems = MenuItems | MoreMenuItems;

export const MENU_ITEM_LABELS: Record<string, string> = {
  [MenuItems.abort]: '中止',
  [MenuItems.abortAllChildren]: '中止所有子任务',
  [MenuItems.run]: '运行',
  [MenuItems.archive]: '归档',
  [MenuItems.compare]: '对比',
  [MenuItems.delete]: '删除',
  [MenuItems.enqueue]: '入队',
  [MenuItems.dequeue]: '出队',
  [MenuItems.queue]: '入队',
  [MenuItems.moveTo]: '移动',
  [MenuItems.publish]: '发布',
  [MenuItems.reset]: '重置',
  [MenuItems.viewWorker]: '查看工作节点',
  [MenuItems.tags]: '标签',
  [MenuItems.showAllItems]: '显示全部',
  [MenuItems.continue]: '继续',
  [MenuItems.retry]: '重试',
  [MenuItems.changeVersion]: '更改版本',
  [MoreMenuItems.restore]: '恢复'
};

export const menuItemLabel = (item: string): string => MENU_ITEM_LABELS[item] ?? item;
export const entityTypeLabel = (entityType: string): string => ENTITY_TYPE_LABELS[entityType] ?? entityType;

export const getNotificationAction = (res: ModelsArchiveManyResponse | TasksArchiveManyResponse, action, operationName: AllMenuItems, entityType: EntityTypeEnum, notificationActions = []) => {
  const totalNum = res.failed.length + res.succeeded.length;
  const allFailed = res.succeeded.length === 0;

  const entity = entityTypeLabel(entityType);
  const operation = menuItemLabel(operationName);
  const message = allFailed ? `${totalNum === 1 ? '' : `${totalNum} 个`}${entity}${operation}失败` :
    `${totalNum === 1 ? '' : totalNum > res.succeeded.length ? `${res.succeeded.length}/${totalNum} 个` : `${res.succeeded.length} 个`}${entity}已成功${operation}`;

  return addMessage(res.failed.length > 0 ? 'error' : 'success', message, [
    res.failed.length > 0 ? {actions: [openMoreInfoPopup({parentAction: action, operationName, res, entityType: EntityTypeEnum[entityType]})], name: '详细信息'} : null,
    ...notificationActions
  ].filter(a => a));
};
