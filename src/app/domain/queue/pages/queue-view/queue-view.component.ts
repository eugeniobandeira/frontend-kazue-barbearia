import { ChangeDetectionStrategy, Component } from '@angular/core';
import { QueueFormComponent } from '../../components/queue-form/queue-form.component';

const COMPONENTS = [QueueFormComponent];

@Component({
  selector: 'app-queue-view',
  imports: [...COMPONENTS],
  templateUrl: './queue-view.component.html',
  styleUrl: './queue-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class QueueViewComponent {}
