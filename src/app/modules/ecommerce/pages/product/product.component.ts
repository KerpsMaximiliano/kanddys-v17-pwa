import { state, style, trigger } from '@angular/animations';
import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	OnDestroy,
	OnInit,
	Signal,
	ViewChild,
	inject
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

// * Services.
import { CoreService } from '@core/services/core.service';
import { EcommerceService } from '@ecommerce/services/ecommerce.service';

// * Interfaces.
import { ILoadableEntity, IState, complete, loaded, loading } from '@core/interfaces/state.interface';
import { IEcommerce, IProduct } from '@ecommerce/interfaces/ecommerce.interface';

// * Actions.
import {
	ADD_ECOMMERCE_CART_PRODUCT,
	LOAD_ECOMMERCE_PAGE_PRODUCT,
	LOAD_ECOMMERCE_PRODUCT
} from '@ecommerce/state/ecommerce.actions';

// * Selectors.
import {
	selectEcommerceCartInfo,
	selectEcommerceInfo,
	selectEcommerceProduct,
	selectEcommerceUserLogin
} from '@ecommerce/state/ecommerce.selectors';

// * Material.
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

// * Util.
import { currency } from '@core/util/currency.pipe';
import { date } from '@core/util/date.pipe';

// * Shared.
import { ButtonComponent } from '@core/components/button/button.component';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-ecommerce-product',
	standalone: true,
	imports: [MatExpansionModule, MatIconModule, ButtonComponent],
	templateUrl: './product.component.html',
	styleUrl: './product.component.scss',
	animations: [
		trigger('openClose', [
			state(
				'open',
				style({
					transition: 'transform 0.5s',
					transform: 'rotate(0deg)'
				})
			),
			state(
				'closed',
				style({
					transition: 'transform 0.5s',
					transform: 'rotate(-180deg)'
				})
			)
		])
	]
})
export class ProductComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild('carousel', { static: false }) public carousel?: ElementRef;

	public product?: Signal<ILoadableEntity<IProduct>>;

	public readonly date = date;
	public readonly currency = currency;
	public readonly complete = complete;
	public readonly loading = loading;

	public index: number = 0;
	public panelOpenState: boolean = true;

	// eslint-disable-next-line @ngrx/use-consistent-global-store-name
	private readonly _store: Store<IState> = inject(Store);
	private readonly _core: CoreService = inject(CoreService);
	private readonly _ecommerce: EcommerceService = inject(EcommerceService);
	private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
	private readonly _route: ActivatedRoute = inject(ActivatedRoute);

	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly cart: Signal<{ id: number; count: number }> = this._store.selectSignal(selectEcommerceCartInfo);
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly info: Signal<IEcommerce['info']> = this._store.selectSignal(selectEcommerceInfo);
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly user: Signal<{ id: number; logged: boolean }> = this._store.selectSignal(selectEcommerceUserLogin);

	private _elements: NodeListOf<HTMLElement> | undefined = undefined;
	private _listener: (() => void) | undefined;
	private _rendered: boolean = false;
	private _product: number = 0;

	public ngOnInit(): void {
		this._route.params.subscribe((params) => {
			if (params['id']) {
				if (params['id'] !== this._product) {
					if (!isNaN(Number(params['id']))) {
						this._product = Number(params['id']);
						this.product = this._store.selectSignal(selectEcommerceProduct(this._product));
						if (this.product().status === loaded) {
							this._store.dispatch(
								LOAD_ECOMMERCE_PRODUCT({
									product: this.product().data.id,
									order: this.cart().count === 0 ? undefined : this.cart().id
								})
							);
						} else {
							const slug: string | undefined = this._ecommerce.slug();
							if (slug) {
								if (this.product().status === loading)
									this._store.dispatch(LOAD_ECOMMERCE_PAGE_PRODUCT({ product: this._product, slug }));
							} else {
								this.redirect('shop');
							}
						}
						this._cdr.markForCheck();
					} else {
						this.redirect('shop');
					}
				}
			}
		});
	}

	public ngAfterViewInit(): void {
		if (!this._product) return;
		this._listen();
	}

	public scrollToImage(index: number): void {
		if (!this._elements) return;
		if (!this._rendered) this._listen();
		this._elements[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
	}

	public open(dialog: string): void {
		this._core.open(dialog, { option: this.cart().count, logged: this.user().logged });
	}

	public redirect(route: string, id?: number | string): void {
		this._ecommerce.redirect(route, id);
	}

	public add(): void {
		if (this.product && this.product().status === complete && this.product().data.check === 0) {
			this._store.dispatch(ADD_ECOMMERCE_CART_PRODUCT({ product: this.product().data }));
		} else {
			this.open('cart');
		}
	}

	public back(): void {
		this._core.back();
	}

	public login(): void {
		this._core.redirect('auth');
	}

	public ngOnDestroy(): void {
		if (this._listener) this.carousel?.nativeElement.removeEventListener('scroll', this._listener);
	}

	private _scroll(): void {
		const scrollLeft = this.carousel?.nativeElement.scrollLeft || 0;
		const itemWidth = this._elements?.[0]?.offsetWidth || 0;
		if (this.index !== Math.round(scrollLeft / itemWidth)) this.index = Math.round(scrollLeft / itemWidth);
		this._cdr.markForCheck();
	}

	private _listen(): void {
		if (this._rendered) return;
		if (!this.carousel) return;
		if (this._listener) {
			this.carousel.nativeElement.removeEventListener('scroll', this._listener);
		}
		this._elements = this.carousel.nativeElement.children;
		if (this._elements?.length === 1) return;
		this._listener = this._scroll.bind(this);
		this.carousel.nativeElement.addEventListener('scroll', this._listener);
		this._rendered = true;
	}
}
