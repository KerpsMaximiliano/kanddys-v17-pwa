import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

// * Services.
import { CoreService } from '@core/services/core.service';

// * Shared.
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ButtonComponent } from '@core/components/button/button.component';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-auth',
	standalone: true,
	imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, ButtonComponent],
	templateUrl: './auth.component.html',
	styleUrl: './auth.component.scss'
})
export class AuthComponent {
	public hide: boolean = true;

	private _core: CoreService = inject(CoreService);

	public back(): void {
		this._core.back();
	}
}
