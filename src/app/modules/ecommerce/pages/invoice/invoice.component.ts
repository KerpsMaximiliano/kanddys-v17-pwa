import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

// * Shared.
import { ButtonComponent } from '@core/components/button/button.component';
import { CoreService } from '@core/services/core.service';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-ecommerce-invoice',
	standalone: true,
	imports: [ButtonComponent],
	templateUrl: './invoice.component.html',
	styleUrl: './invoice.component.scss'
})
export class InvoiceComponent implements AfterViewInit {
	public products: { article: string; precio: string }[] = [
		{
			article: 'ArticuloID',
			precio: 'precioID'
		},
		{
			article: 'ArticuloID',
			precio: 'precioID'
		},
		{
			article: 'ArticuloID',
			precio: 'precioID'
		}
	];

	private readonly _core: CoreService = inject(CoreService);
	private readonly _http: HttpClient = inject(HttpClient);

	private readonly _subscriptions: Subject<void> = new Subject<void>();

	public ngAfterViewInit(): void {
		this._http
			.jsonp(
				'https://maps.googleapis.com/maps/api/js?key=AIzaSyCqV0YIFADudJeeRE4KjZYosxW4usy5Wfg&libraries=places',
				'callback'
			)
			.pipe(takeUntil(this._subscriptions))
			.subscribe();
	}

	public open(dialog: string): void {
		this._core.open(dialog);
	}

	public back(): void {
		this._core.back();
	}
}
