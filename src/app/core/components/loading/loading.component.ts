import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-loading',
	standalone: true,
	imports: [],
	templateUrl: './loading.component.html',
	styleUrl: './loading.component.scss'
})
export class LoadingComponent {
	/**
	 * XS: 16px;
	 * S: 24px;
	 * M: 32px;
	 * L: 48px;
	 * XL: 64px;
	 * XR: 96px;
	 */
	@Input() public transform?: string = '1';
}
