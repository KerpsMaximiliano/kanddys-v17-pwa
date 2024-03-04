import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// * Services.
import { EcommerceService } from './services/ecommerce.service';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-ecommerce',
	standalone: true,
	imports: [RouterOutlet],
	template: '<router-outlet/>',
	providers: [EcommerceService]
})
export class EcommerceComponent {}
