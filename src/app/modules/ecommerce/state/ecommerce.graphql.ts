// ! ------------------------------ QUERIES ------------------------------

// * USER CHECK.
export const QUERY_USER_CHECK: string = `CUserE($user: Int!, $email: String!){cUserE(userId: $user, email: $email)}`;

// * USER LOGIN.
export const QUERY_USER_LOGIN: string = `LUser($user: Int!, $email: String!, $password: String!){lUser(userId: $user, email: $email, password: $password){name phone image first operationStatus}}`;

// * USER ADDRESS.
export const QUERY_USER_ADDRESSES: string = `GAddressUId($user: Int!, $page: Int!){gAddressUId(userId: $user, page: $page){id lng lat direction}}`;

// * MERCHANT ADDRESS.
export const QUERY_MERCHANT_ADDRESS: string = `MerchantId($merchant: Int!){merchantId(merchantId: $merchant){address}}`;

// * PAGE: SHOP.
export const QUERY_PAGE_SHOP: string = `CombinedShop($slug: String!, $user: Int){combinedShop(slug: $slug, userId: $user){merchantId merchantTitle invoiceId invoiceCount userId products {id title price frontPage} batchId batchFrom batchTo firstShippingDate}}`;

// * PAGE: PRODUCT
export const QUERY_PAGE_PRODUCT: string = `CombinedProduct($product: Int!, $slug: String!, $user: Int){combinedProduct(productId: $product, slug: $slug, userId: $user){merchantId merchantTitle productId productTitle productFrontPage productPrice productStock invoiceId invoiceCount userId images{url} details{title description url} check merchantDirection firstShippingDate batchId batchFrom batchTo}}`;

// * PRODUCTS.
export const QUERY_PRODUCTS: string = `Products($page: Int!, $merchant: Int!){products(page: $page, merchantId: $merchant, status: 1){id title price frontPage}}`;

// * PRODUCT.
export const QUERY_PRODUCT: string = `RProduct($product: Int!, $merchant: Int!, $invoice: Int!){rProduct(productId: $product, merchantId: $merchant, invoiceId: $invoice){stock check merchantDirection firstShippingDate images{url} details{title description url} batchId batchFrom batchTo}}`;

// * CART.
export const QUERY_CART: string = `GIProducts($invoice: Int!, $page: Int!){gIProducts(invoiceId: $invoice, page: $page){quantity product {id title price stock frontPage}}}`;

// * ORDER.
export const QUERY_ORDER: string = `GInvoice($invoice: Int!){gInvoice(invoiceId: $invoice){reservation total message batchId addressDirection addressLat addressLng addressNumber type merchantLat merchantLng merchantDirection}}`;

// * CALENDAR.
export const QUERY_CALENDAR: string = `GCalendar($year: Int!, $month: Int!, $day: Int!, $merchant: Int!, $details: Boolean!){gCalendar(year: $year, month: $month, day: $day, merchantId: $merchant){calendarId @include(if: $details) delay @include(if: $details) typeDelay @include(if: $details) workingDays @include(if: $details) disabledDates exceptionsDates}}`;

// * BATCHES.
export const QUERY_BATCHES: string = `GBatches($calendar: Int!, $day: String!, $date: String!, $exception: Int){gBatches(calendarId: $calendar, day: $day, date: $date, exceptionalDate: $exception){id title from to}}`;

// * PAYMENT.
export const QUERY_PAYMENTS: string = `Payments($page: Int!, $merchant: Int!){payments(page: $page, merchantId: $merchant, status: 1){id typePayment title cvu}}`;

// * INVOICE.
export const QUERY_INVOICE: string = `GOrder($order: Int!){gOrder(orderId: $order){merchantId userId code reservation total message status voucher note addressLat addressLng addressDirection products{quantity product{title price frontPage}}}}`;

// ! ------------------------------ MUTATIONS ------------------------------

// * USER INFO.
export const MUTATION_USER_INFO: string = `UUser($user: Int, $name: String, $surname: String, phone: Number){uUser(userId: $user, lastName: $surname, name: $name, phone: $phone, password: $password)}`;

// * USER ADD ADDRESS.
export const MUTATION_USER_ADD_ADDRESS: string = `AAddress($user: Int!, $lng: String!, $lat: String!, $direction: String!){aAddress(userId: $user, lng: $lng, lat: $lat, direction: $direction)}`;

// * ADD PRODUCT CART.
export const MUTATION_ORDER_ADD_PRODUCT: string = `AProductI($invoice: Int!, $product: Int!){aProductI(invoiceId: $invoice, productId: $product)}`;

// * UPDATE ORDER CART.
export const MUTATION_ORDER_CART: string = `UProductI($invoice: Int!, $list: [InvoiceProductInputDTO!]!){uProductI(invoiceId: $invoice, listInvoiceProducts: $list)}`;

// * UPDATE ORDER MESSAGE.
export const MUTATION_ORDER_MESSAGE: string = `UInvoiceM($invoice: Int!, $message: String!){uInvoiceM(invoiceId: $invoice, message: $message)}`;

// * UPDATE ORDER CALENDAR.
export const MUTATION_ORDER_CALENDAR: string = `UInvoiceR($invoice: Int!, $batch: Int!, $date: String!){uInvoiceR(invoiceId: $invoice, batchId: $batch, date: $date)}`;

// * UPDATE ORDER ADDRESS.
export const MUTATION_ORDER_ADDRESS: string = `UInvoiceA($invoice: Int!, $direction: String!, $lat: String!, $lng: String!, $type: String!, $id: Int!){uInvoiceA(invoiceId: $invoice direction: $direction lat: $lat lng: $lng type: $type addressNumber: $id)}`;

// * UPDATE INVOICE NOTE.
export const MUTATION_INVOICE_NOTE: string = `UOrderS($order: Int!, $note: String!){uOrderN(orderId: $order, note: $note)}`;
