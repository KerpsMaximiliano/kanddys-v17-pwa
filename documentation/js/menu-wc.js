'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">laia documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#components-links"' :
                            'data-bs-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/AddressComponent.html" data-type="entity-link" >AddressComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AppComponent.html" data-type="entity-link" >AppComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ButtonComponent.html" data-type="entity-link" >ButtonComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CalendarComponent.html" data-type="entity-link" >CalendarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CalendarHeaderComponent.html" data-type="entity-link" >CalendarHeaderComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CartComponent.html" data-type="entity-link" >CartComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DedicationMessageComponent.html" data-type="entity-link" >DedicationMessageComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EcommerceComponent.html" data-type="entity-link" >EcommerceComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FirstComponent.html" data-type="entity-link" >FirstComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/InfoComponent.html" data-type="entity-link" >InfoComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/InvoiceComponent.html" data-type="entity-link" >InvoiceComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LoadingComponent.html" data-type="entity-link" >LoadingComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LoginComponent.html" data-type="entity-link" >LoginComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MapComponent.html" data-type="entity-link" >MapComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MapsComponent.html" data-type="entity-link" >MapsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MessageComponent.html" data-type="entity-link" >MessageComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/OrderComponent.html" data-type="entity-link" >OrderComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PaymentComponent.html" data-type="entity-link" >PaymentComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ProductComponent.html" data-type="entity-link" >ProductComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ResizeDialogComponent.html" data-type="entity-link" >ResizeDialogComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ShareComponent.html" data-type="entity-link" >ShareComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ShopComponent.html" data-type="entity-link" >ShopComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/VoucherComponent.html" data-type="entity-link" >VoucherComponent</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/CoreService.html" data-type="entity-link" >CoreService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EcommerceEffects.html" data-type="entity-link" >EcommerceEffects</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EcommerceService.html" data-type="entity-link" >EcommerceService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/IAddress.html" data-type="entity-link" >IAddress</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IBatch.html" data-type="entity-link" >IBatch</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IBatch-1.html" data-type="entity-link" >IBatch</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ICalendar.html" data-type="entity-link" >ICalendar</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ICalendar-1.html" data-type="entity-link" >ICalendar</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ICart.html" data-type="entity-link" >ICart</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ICart-1.html" data-type="entity-link" >ICart</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IDetail.html" data-type="entity-link" >IDetail</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IEcommerce.html" data-type="entity-link" >IEcommerce</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IInfo.html" data-type="entity-link" >IInfo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IInvoice.html" data-type="entity-link" >IInvoice</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IInvoice-1.html" data-type="entity-link" >IInvoice</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IInvoiceUpdateResponse.html" data-type="entity-link" >IInvoiceUpdateResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ILoadableEntities.html" data-type="entity-link" >ILoadableEntities</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ILoadableEntity.html" data-type="entity-link" >ILoadableEntity</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IMap.html" data-type="entity-link" >IMap</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IMap-1.html" data-type="entity-link" >IMap</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IMerchant.html" data-type="entity-link" >IMerchant</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IMerchantAddress.html" data-type="entity-link" >IMerchantAddress</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IMessage.html" data-type="entity-link" >IMessage</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IOrder.html" data-type="entity-link" >IOrder</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IOrder-1.html" data-type="entity-link" >IOrder</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IOrderProduct.html" data-type="entity-link" >IOrderProduct</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IOrderRequest.html" data-type="entity-link" >IOrderRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPageProduct.html" data-type="entity-link" >IPageProduct</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPageShop.html" data-type="entity-link" >IPageShop</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPayment.html" data-type="entity-link" >IPayment</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPayment-1.html" data-type="entity-link" >IPayment</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPrediction.html" data-type="entity-link" >IPrediction</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IProduct.html" data-type="entity-link" >IProduct</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IProduct-1.html" data-type="entity-link" >IProduct</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IProducts.html" data-type="entity-link" >IProducts</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IResponse.html" data-type="entity-link" >IResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IState.html" data-type="entity-link" >IState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IStateStatus.html" data-type="entity-link" >IStateStatus</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IUser.html" data-type="entity-link" >IUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IUser-1.html" data-type="entity-link" >IUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IUserAddress.html" data-type="entity-link" >IUserAddress</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IUserLogin.html" data-type="entity-link" >IUserLogin</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});