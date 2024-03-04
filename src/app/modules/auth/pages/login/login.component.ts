import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, Signal, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, filter, takeUntil, tap } from 'rxjs';

// * Services.
import { CoreService } from '@core/services/core.service';

// * Interfaces.
import { ILoadableEntity, ILoading, IState, failed, loading } from '@core/interfaces/state.interface';
import { IUser } from '@ecommerce/interfaces/ecommerce.interface';

// * Actions.
import { USER_CHECK, USER_LOGIN, USER_RESTORE } from '@ecommerce/state/ecommerce.actions';

// * Selectors.
import { selectEcommerceUser } from '@ecommerce/state/ecommerce.selectors';

// * Forms.
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
	selector: 'app-auth-login',
	standalone: true,
	imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, ButtonComponent],
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {
	public form: UntypedFormGroup = this._setForm();
	public getErrorMessage = getErrorMessage;
	public loading: ILoading = loading;
	public failed: ILoading = failed;
	public error: boolean = false;

	// eslint-disable-next-line @ngrx/use-consistent-global-store-name
	private readonly _store: Store<IState> = inject(Store);
	private readonly _core: CoreService = inject(CoreService);
	private _unsubscribe: Subject<void> = new Subject<void>();

	private _change: string | undefined = undefined;

	// eslint-disable-next-line @typescript-eslint/member-ordering
	public user: Signal<ILoadableEntity<IUser>> = this._store.selectSignal(selectEcommerceUser);

	public ngOnInit(): void {
		if (this.user().data.id === 0) {
			this._core.redirect('');
			return;
		}

		this._store
			.select(selectEcommerceUser)
			.pipe(
				takeUntil(this._unsubscribe),
				tap((user) => {
					if (user.data.check === 0) {
						this._core.redirect('auth/first');
						return;
					}

					if (user.data.logged) {
						this._core.back();
						return;
					}

					if (user.status === loading) {
						this.form.get('mail')?.disable();
						this.form.get('password')?.disable();
						return;
					} else {
						this.form.get('mail')?.enable();
						this.form.get('password')?.enable();
					}

					if (user.status === failed) {
						this.form.get('password')?.setErrors({ invalid: true });
						this.error = true;

						setTimeout(() => {
							this.error = false;
						}, 3000);
					}
				})
			)
			.subscribe();

		this.form
			.get('mail')
			?.valueChanges.pipe(
				takeUntil(this._unsubscribe),
				filter((res) => res !== this._change)
			)
			.subscribe((res) => {
				if (this._change) {
					if (this._change !== res && this.user().data.check) {
						this._store.dispatch(USER_RESTORE());
					}
				}
				this._change = res;
			});
	}

	public login(type: 'CHECK' | 'LOGIN'): void {
		if (type === 'CHECK') {
			const email: string | undefined = this.form.get('mail')?.value;
			if (email && this.form.get('mail')?.valid) this._store.dispatch(USER_CHECK({ email: email }));
		} else {
			const email: string | undefined = this.form.get('mail')?.value;
			const password: string | undefined = this.form.get('password')?.value;
			const user: number | null = this.user().data.check;
			if (user && email && password && this.form.valid) this._store.dispatch(USER_LOGIN({ user, email, password }));
		}
	}

	public back(): void {
		if (this.user().status === loading) return;
		this._core.back();
	}

	public ngOnDestroy(): void {
		this._unsubscribe.next();
		this._unsubscribe.complete();
	}

	private _setForm(): UntypedFormGroup {
		return new UntypedFormGroup({
			mail: new UntypedFormControl(
				null,
				Validators.compose([Validators.required, Validators.minLength(3), Validators.email, notOnlySpaces()])
			),
			password: new UntypedFormControl(
				null,
				Validators.compose([Validators.required, Validators.minLength(6), notOnlySpaces()])
			)
		});
	}
}
