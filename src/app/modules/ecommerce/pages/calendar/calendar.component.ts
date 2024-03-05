import { ChangeDetectionStrategy, Component, OnInit, Signal, inject } from '@angular/core';
import { Store } from '@ngrx/store';

// * Services.
import { CoreService } from '@core/services/core.service';
import { EcommerceService } from '@ecommerce/services/ecommerce.service';

// * Interfaces.
import { IDays, ILoadableEntities, ILoadableEntity, IState, complete, loading } from '@core/interfaces/state.interface';
import { IBatch, ICalendar } from '@ecommerce/interfaces/ecommerce.interface';

// * Actions.
import { LOAD_ECOMMERCE_BATCHES, UPDATE_ECOMMERCE_ORDER_CALENDAR } from '@ecommerce/state/ecommerce.actions';

// * Selectors.
import { selectEcommerceBatches, selectEcommerceCalendar } from '@ecommerce/state/ecommerce.selectors';

// * Components.
import { CalendarHeaderComponent } from './calendar-header';

// * Material.
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

// * Shared.
import { ButtonComponent } from '@core/components/button/button.component';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-ecommerce-calendar',
	standalone: true,
	imports: [CalendarHeaderComponent, MatDatepickerModule, MatNativeDateModule, ButtonComponent],
	templateUrl: './calendar.component.html',
	styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit {
	public calendarHeader = CalendarHeaderComponent;

	public readonly loading = loading;
	public readonly complete = complete;

	public selected: Date | null = null;
	public minDate: Date = new Date();
	public maxDate: Date = new Date();
	public index: number = 0;
	public select: { id: number; from: string; to: string } | undefined = undefined;

	private _days: IDays[] = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
	private _day?: Date;

	// eslint-disable-next-line @ngrx/use-consistent-global-store-name
	private readonly _store: Store<IState> = inject(Store);
	private readonly _core: CoreService = inject(CoreService);
	private readonly _ecommerce: EcommerceService = inject(EcommerceService);

	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly calendar: Signal<ILoadableEntity<ICalendar>> = this._store.selectSignal(selectEcommerceCalendar);
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly batches: Signal<ILoadableEntities<IBatch>> = this._store.selectSignal(selectEcommerceBatches);

	public ngOnInit(): void {
		if (this.calendar().status === loading) {
			this._ecommerce.redirect('order', this._core.state.ecommerce.invoice);
			return;
		}
		this.minDate.setHours(0, 0, 0, 0);
		this.maxDate.setFullYear(this.maxDate.getFullYear() + 1);
	}

	public filter = (date: Date | null): boolean => {
		if (date) {
			const day: number = date.getDay();
			const sDate: string = date.toISOString().split('T')[0];
			let active: boolean = false;

			if (this.calendar().data.days.includes(this._days[day])) {
				active = true;
			}

			if (this.calendar().data.exceptions.includes(sDate)) {
				active = true;
			}

			if (this.calendar().data.disabled.includes(sDate)) {
				active = false;
			}

			return active;
		}

		return false;
	};

	public onDateChange(event: Date | null): void {
		if (event) {
			this.select = undefined;
			this._day = event;
			const days: string[] = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
			const day: string = days[event.getDay()];
			const date: string = event.toISOString().split('T')[0];
			this._store.dispatch(LOAD_ECOMMERCE_BATCHES({ calendar: this.calendar().data.id, day, date }));
		}
	}

	public save(): void {
		if (this.select && this._day) {
			const conf: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
			this._store.dispatch(
				UPDATE_ECOMMERCE_ORDER_CALENDAR({
					batch: this.select.id,
					date: `${this._day.toLocaleDateString('es-ES', conf)} de ${this.select.from} a ${this.select.to} hs.`
				})
			);
			this.back();
		}
	}

	public redirect(route: string, id?: number | string): void {
		this._ecommerce.redirect(route, id);
	}

	public back(): void {
		this._core.back();
	}
}
