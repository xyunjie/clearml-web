import {ItemFooterModel, IFooterState} from './footer-items.models';
import {IconNames, ICONS} from '@common/constants';
import {MenuItems, selectionDisabledAbort, entityTypeLabel} from '../items.utils';
import {EntityTypeEnum} from '~/shared/constants/non-common-consts';

export class AbortFooterItem extends ItemFooterModel {

  constructor(public entitiesType: EntityTypeEnum) {
    super();
    this.id = MenuItems.abort;
    this.emit = true;
    this.icon = ICONS.STOPPED as Partial<IconNames>;
  }
  getItemState(state: IFooterState<{id: string}>) {
    const {available, disable} = selectionDisabledAbort(state.selected);
    return {
      disable,
      description: `中止（${available} 项）`,
      disableDescription: state.selectionIsOnlyExamples ? '中止' : `只能中止状态为“运行中”的${entityTypeLabel(this.entitiesType)}`
    };
  }
}
