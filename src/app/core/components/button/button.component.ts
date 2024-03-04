import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

// * Material.
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';

// * Shared.
import { LoadingComponent } from '@core/components/loading/loading.component';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-button',
	standalone: true,
	imports: [MatBadgeModule, MatIconModule, LoadingComponent],
	templateUrl: './button.component.html',
	styleUrl: './button.component.scss'
})
export class ButtonComponent {
	@Input() public type?: Type;
	@Input() public icon?: Icon;
	@Input() public label?: string;
	@Input() public color?: string;
	@Input() public background?: string;
	@Input() public badge?: number;
	@Input() public suffix: boolean = false;
	@Input() public loading: boolean = false;
	@Input() public disabled: boolean = false;
}

type Type = 'ICON' | 'MINI' | 'XR';
type Icon =
	| 'add'
	| 'arrow_back_ios'
	| 'arrow_circle_right'
	| 'arrow_forward_ios'
	| 'close'
	| 'delete'
	| 'done_all'
	| 'done'
	| 'edit'
	| 'image'
	| 'info'
	| 'link'
	| 'local_shipping'
	| 'location_on'
	| 'lock_open'
	| 'logout'
	| 'more_vert'
	| 'open_in_new'
	| 'person'
	| 'qr_code'
	| 'remove'
	| 'settings'
	| 'share'
	| 'shopping_cart'
	| 'store';
