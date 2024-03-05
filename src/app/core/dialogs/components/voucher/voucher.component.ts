import { ChangeDetectionStrategy, Component, ElementRef, OnInit, Signal, ViewChild, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';

// * Interfaces.
import { ILoading, IState, complete, loading } from '@core/interfaces/state.interface';

// * Actions.
import { UPDATE_ECOMMERCE_INVOICE_VOUCHER } from '@ecommerce/state/ecommerce.actions';

// * Selectors.
import { selectEcommerceInvoiceID, selectEcommerceInvoiceVoucher } from '@ecommerce/state/ecommerce.selectors';

// * Material.
import { MatDialogRef } from '@angular/material/dialog';

// * Shared.
import { ButtonComponent } from '@core/components/button/button.component';
import { LoadingComponent } from '@core/components/loading/loading.component';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-dialog-content-voucher',
	standalone: true,
	imports: [ButtonComponent, LoadingComponent],
	templateUrl: './voucher.component.html',
	styleUrl: './voucher.component.scss'
})
export class VoucherComponent implements OnInit {
	@ViewChild('fileInput') public input?: ElementRef<HTMLInputElement>;

	public readonly complete = complete;
	public readonly loading = loading;
	public image: string | undefined = undefined;
	public imageChanged: boolean = false;
	public request: boolean = false;

	// eslint-disable-next-line @ngrx/use-consistent-global-store-name
	private readonly _store: Store<IState> = inject(Store);
	private readonly _subscriptions$: Subject<void> = new Subject<void>();
	private readonly _ref: MatDialogRef<VoucherComponent> = inject(MatDialogRef);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private _blob: any;

	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly invoice: Signal<{ id: number; status: ILoading }> =
		this._store.selectSignal(selectEcommerceInvoiceID);
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly voucher: Signal<string> = this._store.selectSignal(selectEcommerceInvoiceVoucher);

	public ngOnInit(): void {
		this.image = this.voucher();
		this._store
			.select(selectEcommerceInvoiceID)
			.pipe(takeUntil(this._subscriptions$))
			.subscribe((invoice) => {
				if (invoice.status === complete && this._blob) {
					this._ref.close();
					return;
				}

				if (invoice.status === this.loading) {
					this.imageChanged = false;
					return;
				}
			});
	}

	public onClickInput(): void {
		if (this.request) return;
		this.input?.nativeElement.click();
	}

	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
	public onFileSelected(event: any): void {
		if (this.request) return;
		const input = event.target;
		if (input.files && input.files.length > 0) {
			const file: File = input.files[0];
			if (file.type.match('image.*')) {
				this.image = URL.createObjectURL(file);
				this._blob = file;
			} else {
				alert('Por favor selecciona una imagen.');
			}
		}
	}

	public reset(): void {
		if (this.request) return;
		this.image = undefined;
		this._blob = undefined;
		this.imageChanged = true;
		if (this.input) this.input.nativeElement.value = '';
	}

	public save(): void {
		if (this.request) return;
		if (this._blob) {
			this.request = true;
			this._store.dispatch(UPDATE_ECOMMERCE_INVOICE_VOUCHER({ invoice: this.invoice().id, voucher: this._blob }));
		}
	}
}
