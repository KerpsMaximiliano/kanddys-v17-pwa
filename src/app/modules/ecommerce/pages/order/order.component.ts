import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

// * Services.
import { CoreService } from '@core/services/core.service';

// * Material.
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

// * Shared.
import { ButtonComponent } from '@core/components/button/button.component';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-ecommerce-order',
	standalone: true,
	imports: [MatFormFieldModule, MatInputModule, MatSelectModule, ButtonComponent],
	templateUrl: './order.component.html',
	styleUrl: './order.component.scss'
})
export class OrderComponent {
	public count: number[] = [2, 3, 4, 5, 10, 15, 20, 25];

	private _core: CoreService = inject(CoreService);

	public back(): void {
		this._core.back();
	}
}
