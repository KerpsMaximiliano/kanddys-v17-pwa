import { ChangeDetectionStrategy, Component, OnInit, Signal, inject } from '@angular/core';
import { Store } from '@ngrx/store';

// * Services.
import { CoreService } from '@core/services/core.service';

// * Interfaces.
import { ILoadableEntity, IState } from '@core/interfaces/state.interface';
import { IUser } from '@ecommerce/interfaces/ecommerce.interface';

// * Forms.
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

// * Validators.
import { getErrorMessage, isNumeric, notOnlySpaces } from '@core/validators/character.validators';

// * Actions.
import { USER_INFO } from '@ecommerce/state/ecommerce.actions';

// * Selectors.
import { selectEcommerceUser } from '@ecommerce/state/ecommerce.selectors';

// * Material.
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

// * Shared.
import { ButtonComponent } from '@core/components/button/button.component';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-auth-first',
	standalone: true,
	imports: [MatFormFieldModule, ReactiveFormsModule, MatInputModule, ButtonComponent],
	templateUrl: './first.component.html',
	styleUrl: './first.component.scss'
})
export class FirstComponent implements OnInit {
	public readonly getErrorMessage = getErrorMessage;
	public readonly form = this._setForm();

	// eslint-disable-next-line @ngrx/use-consistent-global-store-name
	private readonly _store: Store<IState> = inject(Store);
	private readonly _core: CoreService = inject(CoreService);

	// eslint-disable-next-line @typescript-eslint/member-ordering
	public user: Signal<ILoadableEntity<IUser>> = this._store.selectSignal(selectEcommerceUser);

	public ngOnInit(): void {
		if (!this.user().data.logged || this.user().data.check === 0 || this.user().data.check === null) {
			this._core.redirect('');
		}
	}

	public back(): void {
		this._core.redirect('');
	}

	public save(): void {
		if (this.form.valid) {
			if (
				this.form.get('name')?.value ||
				this.form.get('surname')?.value ||
				this.form.get('phone')?.value ||
				this.form.get('password')?.value
			) {
				this._store.dispatch(
					USER_INFO({
						name: this.form.get('name')?.value,
						surname: this.form.get('surname')?.value,
						phone: this.form.get('phone')?.value
					})
				);
				this.back();
			}
		}
	}

	private _setForm(): UntypedFormGroup {
		return new UntypedFormGroup({
			name: new UntypedFormControl(null, Validators.compose([Validators.minLength(1), notOnlySpaces])),
			surname: new UntypedFormControl(null, Validators.compose([Validators.minLength(1), notOnlySpaces])),
			phone: new UntypedFormControl(null, Validators.compose([Validators.minLength(6), isNumeric()])),
			password: new UntypedFormControl(null, Validators.compose([Validators.minLength(6), notOnlySpaces]))
		});
	}
}
