import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {TaskTypeEnum} from '~/business-logic/model/tasks/taskTypeEnum';
import {EXPERIMENTS_TYPE_LABELS} from '~/shared/constants/non-common-consts';
import {NoUnderscorePipe} from '@common/shared/pipes/no-underscore.pipe';
import { TitleCasePipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';


@Component({
    selector: 'sm-experiment-type-icon-label',
    templateUrl: './experiment-type-icon-label.component.html',
    styleUrls: ['./experiment-type-icon-label.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        NoUnderscorePipe,
        TitleCasePipe,
        MatIcon
    ]
})
export class ExperimentTypeIconLabelComponent{
  @Input() type: TaskTypeEnum;
  protected readonly typeLabels: Record<string, string> = EXPERIMENTS_TYPE_LABELS;
  @Input() iconClass = '';
  @Input() showLabel = true;
}
