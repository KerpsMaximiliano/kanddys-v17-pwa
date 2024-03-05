import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	OnDestroy,
	OnInit,
	ViewChild,
	ViewContainerRef,
	inject
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

// * Services.
import { CoreService } from '@core/services/core.service';

// * Material.
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	selector: 'app-dialog-resizable',
	templateUrl: './resize-dialog.component.html',
	styleUrl: './resize-dialog.component.scss'
})
export class ResizeDialogComponent implements OnInit, OnDestroy {
	@ViewChild('content', { read: ViewContainerRef }) public readonly content?: ViewContainerRef;
	@ViewChild('resizable', { static: false }) public readonly resizable?: ElementRef;

	public y: number = 0;
	public dy: number = 0;
	public canimation: boolean = false;
	public animation: boolean = false;

	private readonly _ref: MatDialogRef<ResizeDialogComponent> = inject(MatDialogRef);
	private readonly _data: { dialog: string; conf?: { option: number; logged?: boolean } } = inject(MAT_DIALOG_DATA);
	private readonly _core: CoreService = inject(CoreService);
	private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
	private _subscriptions$?: Subject<void>;

	// eslint-disable-next-line @typescript-eslint/member-ordering
	public height: number = this._height();
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public cHeight: number = this._height();

	public ngOnInit(): void {
		if (this._data.dialog) {
			this._subscriptions$ = new Subject<void>();

			// this._core.gHeight.pipe(takeUntil(this._subscriptions$)).subscribe((res) => {
			// 	if (res !== 0) {
			// 		this.height = res;
			// 		this._cdr.markForCheck();
			// 	}
			// });
			this._core.gHeight.pipe(takeUntil(this._subscriptions$)).subscribe((res) => {
				if (res !== 0) {
					this.resizable?.nativeElement.style.setProperty('--ht', `${this.height}px`);
					this.resizable?.nativeElement.style.setProperty('--nw', `${res}px`);
					this.animation = true;
					this.height = res;
					this._cdr.markForCheck();
				}
			});

			this._core
				.component(this._data.dialog)
				.pipe(takeUntil(this._subscriptions$))
				.subscribe({
					next: (res) => {
						if (this.content) {
							this.content.createComponent(res);
							this._cdr.markForCheck();
						}
					}
				});
		} else {
			this.close();
		}
	}

	public touchstart(event: TouchEvent): void {
		this.y = event.changedTouches[0].screenY;
	}

	public touchmove(event: TouchEvent): void {
		this.dy = event.changedTouches[0].screenY - this.y;
		this.y = event.changedTouches[0].screenY;
		this.height -= this.dy;
		if (this.height < this.cHeight - 40) {
			this.close();
		}
	}

	public close(): void {
		this.canimation = true;
		setTimeout(() => {
			this._ref.close();
		}, 400);
	}

	public ngOnDestroy(): void {
		if (this._subscriptions$) {
			this._subscriptions$.next();
			this._subscriptions$.complete();
		}
		this._core.height = 0;
		this.canimation = false;
	}

	private _height(): number {
		if (this._data.dialog) {
			switch (this._data.dialog) {
				case 'cart':
					if (this._data.conf) {
						switch (this._data.conf.option) {
							case 0:
								if (this._data.conf.logged) {
									return 172;
								} else {
									return 280;
								}
							case 1:
								if (this._data.conf.logged) {
									return 337;
								} else {
									return 354;
								}
							case 2:
								if (this._data.conf.logged) {
									return 427;
								} else {
									return 437;
								}
							case 3:
								if (this._data.conf.logged) {
									return 507;
								} else {
									return 521;
								}
							default:
								if (this._data.conf.logged) {
									return 587;
								} else {
									return 597;
								}
						}
					} else {
						return 0;
					}
				case 'maps':
					return window.innerHeight - 2;
				case 'share':
					return 200;
				case 'map':
					return window.innerHeight - 2;
				case 'voucher':
					return 430;
				default:
					return 0;
			}
		} else {
			return 0;
		}
	}
}
