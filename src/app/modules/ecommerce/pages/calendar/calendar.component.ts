import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

// * Components.
import { CalendarHeaderComponent } from './calendar-header';

// * Material.
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

// * Shared.
import { ButtonComponent } from '@core/components/button/button.component';
import { CoreService } from '../../../../core/services/core.service';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-ecommerce-calendar',
	standalone: true,
	imports: [CalendarHeaderComponent, MatDatepickerModule, MatNativeDateModule, ButtonComponent],
	templateUrl: './calendar.component.html',
	styleUrl: './calendar.component.scss'
})
export class CalendarComponent {
	public calendarHeader = CalendarHeaderComponent;
	public selected: Date | null = null;
	public minDate: Date = new Date();
	public maxDate: Date = new Date();
	public index: number = 0;

	private _core: CoreService = inject(CoreService);

	public filter = (date: Date | null): boolean => {
		if (date) {
			const day = date.getDay();
			const dateString = date.toISOString().split('T')[0];
			console.log(day, dateString);
			// return date >= this.minDate && day !== 0 && !this.disabled?.includes(dateString);
		}
		return false;
	};

	public onDateChange(event: Date | null): void {
		console.log(event);
	}

	public back(): void {
		this._core.back();
	}
}
