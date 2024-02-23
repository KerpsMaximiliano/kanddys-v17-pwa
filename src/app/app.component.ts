import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet],
	template: '<router-outlet />'
})
export class AppComponent implements OnInit {
	public ngOnInit(): void {
		window.addEventListener('resize', () => {
			this._viewport();
		});
		this._viewport();
	}

	private _viewport(): void {
		document.documentElement.style.setProperty('--vh', `${window.innerHeight}px`);
	}
}
