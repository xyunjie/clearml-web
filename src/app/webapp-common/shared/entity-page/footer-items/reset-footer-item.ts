import {ItemFooterModel, IFooterState} from './footer-items.models';
import {TaskStatusEnum} from '~/business-logic/model/tasks/taskStatusEnum';
import {MenuItems, entityTypeLabel} from '../items.utils';
import {EntityTypeEnum} from '~/shared/constants/non-common-consts';
import {IconNames, ICONS} from '@common/constants';

export class ResetFooterItem<T extends {status: TaskStatusEnum}> extends ItemFooterModel {

  constructor(public entitiesType: EntityTypeEnum) {
    super();
    this.id = MenuItems.reset;
    this.emit = true;
    this.icon = ICONS.RESET as Partial<IconNames>;
  }

  getItemState(state: IFooterState<{id: string}>): { icon?: IconNames; title?: string; description?: string; disable?: boolean; disableDescription?: string; emit?: boolean; emitValue?: boolean; preventCurrentItem?: boolean; class?: string; wrapperClass?: string } {
    return {
      disable: state.data[this.id]?.disable,
      description: this.menuItemText.transform(state.data[this.id]?.available, '重置'),
      disableDescription: state.selectionIsOnlyExamples ? '重置' : `只能重置非草稿、未发布的${entityTypeLabel(this.entitiesType)}`
    };
  }
}
