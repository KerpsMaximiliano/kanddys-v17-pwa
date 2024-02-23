export const QUERY_MERCHANT: string = `query MerchantS($slug: String!){merchantS(slug: $slug){id}}`;
export const QUERY_PRODUCTS: string = `query Products($page: Int!, $merchant: Int!){products(page: $page, merchantId: $merchant, status: 1){id title price frontPage}}`;
export const QUERY_PRODUCT: string = `query ProductDId($product: Int!){productId(productId: $product){id title price frontPage}}`;
export const QUERY_PRODUCT_DETAIL: string = `query ProductDId($product: Int!){productDId(productId: $product){title description url}}`;
export const QUERY_PRODUCT_INFO: string = `query ProductDSId($product: Int!){productDSId(productId: $product){stock images{url}}}`;
