import {EntityTypeEnum} from '~/shared/constants/non-common-consts';
import {IFooterState, ItemFooterModel} from './footer-items.models';
import {MenuItems, entityTypeLabel} from '../items.utils';

export class ShowItemsFooterSelected extends ItemFooterModel {

  constructor(public entitiesType: EntityTypeEnum) {
    super();
    this.id = MenuItems.showAllItems;
    this.emit = true;
    this.class = 'show-all';

  }

  getItemState(state: IFooterState<{id: string}>) {
    return {
      title: state.showAllSelectedIsActive ?
        `显示全部${entityTypeLabel(this.entitiesType)}` :
        `显示已选的 ${state.selected.length} 个${entityTypeLabel(this.entitiesType)}`,
      emitValue: state.showAllSelectedIsActive,
      preventCurrentItem: false
    };
  }
}
