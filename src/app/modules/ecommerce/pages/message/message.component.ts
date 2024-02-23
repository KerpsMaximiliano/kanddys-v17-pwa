import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-ecommerce-message',
	standalone: true,
	imports: [],
	templateUrl: './message.component.html',
	styleUrl: './message.component.scss'
})
export class MessageComponent {}
