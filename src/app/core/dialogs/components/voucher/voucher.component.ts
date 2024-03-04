import { ChangeDetectionStrategy, Component, ElementRef, Signal, ViewChild, inject } from '@angular/core';
import { Store } from '@ngrx/store';

// * Interfaces.
import { IState } from '@core/interfaces/state.interface';

// * Actions.

// * Selectors.
import { selectEcommerceInvoiceID } from '@ecommerce/state/ecommerce.selectors';

// * Shared.
import { ButtonComponent } from '@core/components/button/button.component';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-dialog-content-voucher',
	standalone: true,
	imports: [ButtonComponent],
	templateUrl: './voucher.component.html',
	styleUrl: './voucher.component.scss'
})
export class VoucherComponent {
	@ViewChild('fileInput') public input?: ElementRef<HTMLInputElement>;

	public image: string | undefined = undefined;
	public request: boolean = false;

	// eslint-disable-next-line @ngrx/use-consistent-global-store-name
	private _store: Store<IState> = inject(Store);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private _blob: any;

	// eslint-disable-next-line @typescript-eslint/member-ordering
	public invoice: Signal<number> = this._store.selectSignal(selectEcommerceInvoiceID);

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
		if (this.input) this.input.nativeElement.value = '';
	}

	public save(): void {
		if (this.request) return;
		if (this._blob) {
			// this._store.dispatch(UPLOAD_ECOMMERCE_PAYMENT({ file: this._blob }));
		}
	}
}
