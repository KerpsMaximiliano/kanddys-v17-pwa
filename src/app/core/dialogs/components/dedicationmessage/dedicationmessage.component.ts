import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-dedication-message',
	standalone: true,
	imports: [],
	templateUrl: './dedicationmessage.component.html',
	styleUrl: './dedicationmessage.component.scss'
})
export class DedicationMessageComponent {}
