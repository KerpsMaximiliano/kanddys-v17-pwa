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

// * Interfaces.
import { IState } from '@core/interfaces/state.interface';
import { IProduct } from '@ecommerce/interfaces/ecommerce.interface';

// * Actions.
import {
	LOAD_ECOMMERCE_PRODUCT,
	LOAD_ECOMMERCE_PRODUCT_DETAIL,
	LOAD_ECOMMERCE_PRODUCT_INFO
} from '@ecommerce/state/ecommerce.actions';

// * Selectors.
import { selectEcommerceProduct } from '@ecommerce/state/ecommerce.selectors';

// * Material.
import { MatExpansionModule } from '@angular/material/expansion';

// * Util.
import { currency } from '@core/util/currency.pipe';

// * Shared.
import { ButtonComponent } from '@core/components/button/button.component';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-ecommerce-product',
	standalone: true,
	imports: [MatExpansionModule, ButtonComponent],
	templateUrl: './product.component.html',
	styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild('carousel', { static: false }) public carousel?: ElementRef;

	public currency = currency;
	public index: number = 0;

	// eslint-disable-next-line @ngrx/use-consistent-global-store-name
	private readonly _store: Store<IState> = inject(Store);
	private readonly _route: ActivatedRoute = inject(ActivatedRoute);
	private readonly _core: CoreService = inject(CoreService);
	private readonly _id: number = this._route.snapshot.params['id'] ? parseInt(this._route.snapshot.params['id']) : 0;
	private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
	private _elements: NodeListOf<HTMLElement> | undefined = undefined;
	private _listener: (() => void) | undefined;
	private _rendered: boolean = false;

	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly product: Signal<IProduct> = this._store.selectSignal(selectEcommerceProduct(this._id));

	public ngOnInit(): void {
		if (this._id === 0) {
			this._core.back();
		} else {
			if (this.product().id === 0) {
				this._store.dispatch(LOAD_ECOMMERCE_PRODUCT({ id: this._id }));
			} else {
				this._store.dispatch(LOAD_ECOMMERCE_PRODUCT_INFO({ id: this._id }));
			}
		}
	}

	public ngAfterViewInit(): void {
		if (this.product().id !== 0) {
			this._store.dispatch(LOAD_ECOMMERCE_PRODUCT_DETAIL({ id: this._id }));
			this._listen();
		}
	}

	public scrollToImage(index: number): void {
		if (!this._elements) return;
		if (!this._rendered) this._listen();
		this._elements[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
	}

	public back(): void {
		this._core.back();
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
