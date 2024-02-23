import { ChangeDetectionStrategy, Component } from '@angular/core';

// * Shared.
import { ButtonComponent } from '@core/components/button/button.component';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-ecommerce-invoice',
	standalone: true,
	imports: [ButtonComponent],
	templateUrl: './invoice.component.html',
	styleUrl: './invoice.component.scss'
})
export class InvoiceComponent {}
