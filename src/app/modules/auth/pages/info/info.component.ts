import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

// * Services.
import { CoreService } from '@core/services/core.service';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-auth-info',
	standalone: true,
	imports: [],
	templateUrl: './info.component.html',
	styleUrl: './info.component.scss'
})
export class InfoComponent {
	private readonly _core: CoreService = inject(CoreService);

	public clear(): void {
		localStorage.clear();
	}

	public redirect(): void {
		this._core.redirect('');
	}
}
