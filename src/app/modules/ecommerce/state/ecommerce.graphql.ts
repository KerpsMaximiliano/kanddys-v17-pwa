export const QUERY_MERCHANT: string = `MerchantS($slug: String!){merchantS(slug: $slug){id}}`;
export const QUERY_PRODUCTS: string = `Products($page: Int!, $merchant: Int!){products(page: $page, merchantId: $merchant, status: 1){id title price frontPage}}`;
export const QUERY_PRODUCT: string = `ProductDId($product: Int!){productId(productId: $product){id title price frontPage}}`;
export const QUERY_PRODUCT_INFO: string = `ProductDSId($product: Int!){productDSId(productId: $product){stock images{url}}}`;
export const QUERY_PRODUCT_DETAIL: string = `ProductDId($product: Int!){productDId(productId: $product){title description url}}`;

export const QUERY_INVOICE: string = `
GInvoice($user: Int!, $merchant: Int!, $status: InvoiceStatus!) {
  gInvoice(userId: $user, merchantId: $merchant, status: $status) {
      id
      merchantId
      userId
      paymentId
      code
      shoppingCartId
      reservation
      total
      message
      status
      voucher
      note
      count
  }
}
`;

export const CREATE_INVOICE: string = `
mutation CInvoice($merchant: Int!) {
  cInvoice(merchantId: $merchant) {
      id
      userId
  }
}
`;
