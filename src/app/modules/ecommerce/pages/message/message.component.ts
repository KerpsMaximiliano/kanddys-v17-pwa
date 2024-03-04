import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	NgZone,
	Signal,
	ViewChild,
	inject
} from '@angular/core';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';

// * CDK.
import { CdkTextareaAutosize, TextFieldModule } from '@angular/cdk/text-field';

// * Services.
import { CoreService } from '@core/services/core.service';
import { EcommerceService } from '@ecommerce/services/ecommerce.service';

// * Interfaces.
import { IState } from '@core/interfaces/state.interface';
import { IMessage } from '@ecommerce/interfaces/ecommerce.interface';

// * Actions.
import { UPDATE_ECOMMERCE_ORDER_MESSAGE } from '@ecommerce/state/ecommerce.actions';

// * Selectors.
import { selectEcommerceMessage } from '@ecommerce/state/ecommerce.selectors';

// * Form.
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

// * Validators.
import { getErrorMessage, notOnlySpaces } from '@core/validators/character.validators';

// * Material.
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

// * Shared.
import { ButtonComponent } from '@core/components/button/button.component';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-ecommerce-message',
	standalone: true,
	imports: [TextFieldModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, ButtonComponent],
	templateUrl: './message.component.html',
	styleUrl: './message.component.scss'
})
export class MessageComponent implements AfterViewInit {
	@ViewChild('autosize') public autosize?: CdkTextareaAutosize;

	public readonly form: UntypedFormGroup = this._setUpForm();
	public readonly getErrorMessage = getErrorMessage;

	// eslint-disable-next-line @ngrx/use-consistent-global-store-name
	private readonly _store: Store<IState> = inject(Store);
	private readonly _core: CoreService = inject(CoreService);
	private readonly _ecommerce: EcommerceService = inject(EcommerceService);
	private readonly _zone: NgZone = inject(NgZone);
	private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly message: Signal<IMessage> = this._store.selectSignal(selectEcommerceMessage);

	public ngAfterViewInit(): void {
		this._resize();
		this.form.controls['textarea'].setValue(this.message().message.data);
		this._cdr.detectChanges();
	}

	public back(): void {
		this._core.back();
	}

	public save(): void {
		const message: string | undefined = this.form.controls['textarea'].value;
		if (!message) return;
		this._store.dispatch(UPDATE_ECOMMERCE_ORDER_MESSAGE({ order: this.message().order.id, message }));
		this._ecommerce.redirect('order', this.message().order.id);
	}

	private _resize(): void {
		this.form.controls['textarea'].valueChanges.subscribe(() => {
			this._zone.onStable.pipe(take(1)).subscribe(() => this.autosize?.resizeToFitContent(true));
		});
	}

	private _setUpForm(): UntypedFormGroup {
		return new UntypedFormGroup({
			textarea: new UntypedFormControl(
				null,
				Validators.compose([Validators.minLength(3), Validators.maxLength(255), notOnlySpaces()])
			)
		});
	}
}
