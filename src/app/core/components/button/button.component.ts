import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

// * Material.
import { MatIconModule } from '@angular/material/icon';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-button',
	standalone: true,
	imports: [MatIconModule],
	templateUrl: './button.component.html',
	styleUrl: './button.component.scss'
})
export class ButtonComponent {
	@Input() public type?: Type;
	@Input() public icon?: Icon;
	@Input() public label?: string;
	@Input() public color?: string;
	@Input() public background?: string;
}

type Type = 'ICON' | 'MINI' | 'XR';
type Icon =
	| 'arrow_back_ios'
	| 'arrow_forward_ios'
	| 'close'
	| 'done'
	| 'info'
	| 'local_shipping'
	| 'location_on'
	| 'more_vert'
	| 'person'
	| 'shopping_cart'
	| 'store';
