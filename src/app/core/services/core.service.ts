import { ComponentType } from '@angular/cdk/portal';
import { Location } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

// * Routing.
import { ActivatedRoute, Router } from '@angular/router';

// * Apollo.
import { Apollo, gql } from 'apollo-angular';

// * RxJS.
import { Observable, from, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CoreService {
	private readonly _location: Location = inject(Location);
	private readonly _router: Router = inject(Router);
	private readonly _route: ActivatedRoute = inject(ActivatedRoute);
	private readonly _apollo: Apollo = inject(Apollo);
	private readonly _dialog: MatDialog = inject(MatDialog);

	private _merchant: { id: number | undefined; slug: string | undefined } = {
		slug: undefined,
		id: undefined
	};
	private _local: number = Number(localStorage.getItem('h')) || 0;

	public get merchant(): number | undefined {
		return this._merchant.id;
	}

	public get local(): number | undefined {
		return this._local;
	}

	public get slug(): string | undefined {
		return this._merchant.slug;
	}

	public set merchant(id: number) {
		this._merchant.id = id;
	}

	public set local(local: number) {
		this._local = local;
		localStorage.setItem('h', local.toString());
	}

	public set slug(slug: string) {
		this._merchant.slug = slug;
	}

	public back(): void {
		this._location.back();
	}

	public query<T>(request: string, variables?: Record<string, unknown>): Observable<T> {
		return this._apollo
			.watchQuery<T>({
				query: gql(`query ${request}`),
				variables
			})
			.valueChanges.pipe(map((res) => res.data));
	}

	public mutation<T>(request: string, variables?: Record<string, unknown>): Observable<T> {
		return this._apollo
			.mutate<T>({
				mutation: gql(request),
				variables
			})
			.pipe(map((res) => res.data as T));
	}

	public redirect(url: string, id?: string): void {
		if (id) {
			void this._router.navigate([`${url}/${id}`], { relativeTo: this._route });
			return;
		} else {
			void this._router.navigate([url], { relativeTo: this._route });
			return;
		}
	}

	public open(dialog: string, config?: MatDialogConfig<unknown>): Observable<MatDialogRef<unknown>> {
		return from(
			(async (): Promise<MatDialogRef<unknown>> => {
				// eslint-disable-next-line @typescript-eslint/init-declarations, @typescript-eslint/no-explicit-any
				let chunk: any;
				switch (dialog) {
					case 'resize':
						chunk = await import('../dialogs/resize/resize-dialog.component');
						break;
				}
				const dialogComponent = Object.values(chunk)[0] as ComponentType<unknown>;
				return this._dialog.open(dialogComponent, config);
			})()
		);
	}
}
