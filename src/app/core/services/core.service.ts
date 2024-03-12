import { ComponentType } from '@angular/cdk/portal';
import { Location } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

// * Routing.
import { ActivatedRoute, Router } from '@angular/router';

// * Apollo.
import { Apollo, gql } from 'apollo-angular';

// * RxJS.
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, from, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IStateStatus } from '../interfaces/state.interface';

@Injectable({ providedIn: 'root' })
export class CoreService {
	private readonly _location: Location = inject(Location);
	private readonly _router: Router = inject(Router);
	private readonly _route: ActivatedRoute = inject(ActivatedRoute);
	private readonly _apollo: Apollo = inject(Apollo);
	private readonly _dialog: MatDialog = inject(MatDialog);
	private readonly _http: HttpClient = inject(HttpClient);
	private readonly _api: string = environment.api;

	private _user: number | undefined = localStorage.getItem('user') ? Number(localStorage.getItem('user')) : undefined;
	private _state: IStateStatus = { ecommerce: {} };
	private _height: BehaviorSubject<number> = new BehaviorSubject<number>(0);

	// eslint-disable-next-line @typescript-eslint/member-ordering
	public gHeight: Observable<number> = this._height.asObservable();

	public get height(): BehaviorSubject<number> {
		return this._height;
	}

	public get state(): IStateStatus {
		return this._state;
	}

	public set height(height: number) {
		this._height.next(height);
	}

	public set state(state: IStateStatus) {
		const user: number | undefined = state.ecommerce.user;
		if (user) {
			this._user = user;
			localStorage.setItem('user', user.toString());
		}
		this._state = state;
	}

	public back(): void {
		this._location.back();
	}

	public query<T>(request: string, variables?: Record<string, unknown>, cache?: boolean): Observable<T> {
		return this._apollo
			.query<T>({
				query: gql(`query ${request}`),
				variables,
				fetchPolicy: !cache ? 'cache-first' : 'no-cache'
			})
			.pipe(map((res) => res.data as T));
	}

	public mutation<T>(request: string, variables?: Record<string, unknown>): Observable<T> {
		return this._apollo
			.mutate<T>({
				mutation: gql(`mutation ${request}`),
				variables
			})
			.pipe(map((res) => res.data as T));
	}

	public post<T>(point: string, body: unknown): Observable<T> {
		return this._http.post<T>(`${this._api}${point}`, body, { headers: { accept: '*/*' } });
	}

	public put<T>(point: string, body: unknown): Observable<T> {
		return this._http.put<T>(`${this._api}${point}`, body, { headers: { accept: '*/*' } });
	}

	public redirect(url: string, id?: number | string): void {
		if (id) {
			void this._router.navigate([`${url}/${id}`], { relativeTo: this._route });
			return;
		} else {
			void this._router.navigate([url], { relativeTo: this._route });
			return;
		}
	}

	public open(dialog: string, conf?: { option?: number; logged: boolean }): Observable<MatDialogRef<unknown>> {
		return from(
			(async (): Promise<MatDialogRef<unknown>> => {
				const chunk = await import('@core/dialogs/resize/resize-dialog.component');
				const dialogComponent = Object.values(chunk)[0] as ComponentType<unknown>;
				return this._dialog.open(dialogComponent, {
					position: { bottom: '0' },
					// minHeight: '100%',
					width: '100%',
					maxWidth: '450px',
					height: '100%',
					maxHeight: '950px',
					// minWidth: '100vw',
					data: {
						dialog,
						conf
					}
				});
			})()
		);
	}

	public component(component: string): Observable<ComponentType<unknown>> {
		return from(
			(async (): Promise<ComponentType<unknown>> => {
				// eslint-disable-next-line @typescript-eslint/init-declarations, @typescript-eslint/no-explicit-any
				let chunk: any;
				switch (component) {
					case 'cart':
						chunk = await import('@core/dialogs/components/cart/cart.component');
						break;
					case 'maps':
						chunk = await import('@app/core/dialogs/components/maps/maps.component');
						break;
					case 'share':
						chunk = await import('@core/dialogs/components/share/share.component');
						break;
					case 'map':
						chunk = await import('@core/dialogs/components/map/map.component');
						break;
					case 'voucher':
						chunk = await import('@core/dialogs/components/voucher/voucher.component');
						break;
					case 'dmessage':
						chunk = await import('@core/dialogs/components/dedicationmessage/dedicationmessage.component');
						break;
				}
				const dialogComponent = Object.values(chunk)[0] as ComponentType<unknown>;
				return dialogComponent;
			})()
		);
	}
}
