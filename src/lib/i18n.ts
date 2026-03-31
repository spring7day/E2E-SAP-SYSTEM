export type Locale = 'en' | 'ko';

export const DEFAULT_LOCALE: Locale = 'en';

const translations = {
  en: {
    // Header
    'header.brand': 'BikeStore',
    'header.brandSub': 'by SAP',
    'header.products': 'Products',
    'header.cart': 'Cart',
    'header.cartAriaLabel': 'Shopping cart with {count} items',

    // Home
    'home.title': 'Welcome to BikeStore',
    'home.subtitle': 'Discover our premium bikes. Powered by SAP S/4HANA.',
    'home.categoryAll': 'All',
    'home.loading': 'Loading products from SAP...',
    'home.noProducts': 'No products found in this category.',

    // Product Detail
    'product.id': 'Product ID',
    'product.quantity': 'Quantity',
    'product.addToCart': 'Add to Cart',
    'product.added': 'Added to Cart!',
    'product.per': 'per',
    'product.inStock': 'In Stock',
    'product.outOfStock': 'Out of Stock',
    'product.stockUnit': '{quantity} {unit} available',
    'product.lowStock': 'Low Stock',
    'product.insufficientStock': 'Insufficient stock. Only {available} available.',

    // Cart
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.continueShopping': 'Continue Shopping',
    'cart.product': 'Product',
    'cart.price': 'Price',
    'cart.quantity': 'Quantity',
    'cart.subtotal': 'Subtotal',
    'cart.summary': 'Order Summary',
    'cart.items': 'Items',
    'cart.total': 'Total',
    'cart.checkout': 'Proceed to Checkout',

    // Checkout
    'checkout.title': 'Checkout',
    'checkout.customerInfo': 'Customer Information',
    'checkout.fullName': 'Full Name',
    'checkout.email': 'Email Address',
    'checkout.phone': 'Phone Number',
    'checkout.orderSummary': 'Order Summary',
    'checkout.qty': 'Qty',
    'checkout.placeOrder': 'Place Order',
    'checkout.processing': 'Processing Order...',
    'checkout.emptyCart': 'Your cart is empty. Add some products first.',

    // Confirmation
    'confirmation.title': 'Order Confirmed!',
    'confirmation.thanks': 'Thank you for your order. Your order has been successfully placed.',
    'confirmation.sapOrderNumber': 'SAP Sales Order Number',
    'confirmation.fullRef': 'Full Reference',
    'confirmation.processing': 'Your order is now being processed in SAP S/4HANA. The Order-to-Cash process will handle delivery, billing, and accounting automatically.',
    'confirmation.backToShopping': 'Continue Shopping',

    // Order Tracking
    'header.tracking': 'Order Tracking',
    'tracking.title': 'Order Tracking',
    'tracking.subtitle': 'Enter your SAP Sales Order number to check the current status.',
    'tracking.inputLabel': 'Sales Order Number',
    'tracking.inputPlaceholder': 'e.g. 12345',
    'tracking.submit': 'Track Order',
    'tracking.searching': 'Searching...',
    'tracking.notFound': 'Order not found. Please check the order number and try again.',
    'tracking.error': 'Failed to retrieve order status. Please try again later.',
    'tracking.refresh': 'Refresh',
    'tracking.orderInfo': 'Order Information',
    'tracking.orderItems': 'Order Items',
    'tracking.deliveryDocs': 'Delivery Documents',
    'tracking.billingDocs': 'Billing Documents',
    'tracking.overallStatus': 'Overall Status',
    'tracking.trackAnother': 'Track Another Order',
    'tracking.step.orderCreated': 'Order Created',
    'tracking.step.deliveryCreated': 'Delivery Created',
    'tracking.step.goodsIssued': 'Goods Issued',
    'tracking.step.deliveryConfirmed': 'Delivery Confirmed',
    'tracking.step.billed': 'Billing Complete',
    'tracking.step.desc.orderCreated': 'Sales Order registered in SAP',
    'tracking.step.desc.deliveryCreated': 'Outbound delivery created (VL01N)',
    'tracking.step.desc.goodsIssued': 'Goods movement posted (VL02N)',
    'tracking.step.desc.deliveryConfirmed': 'Proof of delivery confirmed (VLPOD)',
    'tracking.step.desc.billed': 'Billing document created (VF01)',
    'tracking.status.notStarted': 'Not Started',
    'tracking.status.inProgress': 'In Progress',
    'tracking.status.complete': 'Complete',
    'tracking.dataSource.full': 'Live SAP data',
    'tracking.dataSource.salesOrderOnly': 'Derived from Sales Order status',
    'tracking.dataSource.mock': 'Demo data',
    'tracking.currentStatus': 'Status',
    'tracking.sapOrderNumber': 'SAP Sales Order',
    'tracking.creationDate': 'Created',
    'tracking.soldToParty': 'Customer',
    'tracking.material': 'Material',
    'tracking.quantity': 'Quantity',
    'tracking.trackOrder': 'Track Order',
    'tracking.documentNumber': 'Document',
    'confirmation.trackOrder': 'Track Order',

    // Footer
    'footer.powered': 'BikeStore Demo Portal \u2014 Powered by SAP S/4HANA',
    'footer.demo': 'This is a demo application for PerfecTwin ERP Edition E2E testing.',

    // Common
    'common.remove': 'Remove',
    'common.breadcrumb.products': 'Products',
    'common.breadcrumb.cart': 'Cart',
    'common.breadcrumb.checkout': 'Checkout',
    'common.error': 'An unexpected error occurred',
  },
  ko: {
    // Header
    'header.brand': 'BikeStore',
    'header.brandSub': 'by SAP',
    'header.products': '\uc0c1\ud488',
    'header.cart': '\uc7a5\ubc14\uad6c\ub2c8',
    'header.cartAriaLabel': '\uc7a5\ubc14\uad6c\ub2c8\uc5d0 {count}\uac1c \uc0c1\ud488',

    // Home
    'home.title': 'BikeStore\uc5d0 \uc624\uc2e0 \uac83\uc744 \ud658\uc601\ud569\ub2c8\ub2e4',
    'home.subtitle': '\ud504\ub9ac\ubbf8\uc5c4 \uc790\uc804\uac70\ub97c \ub9cc\ub098\ubcf4\uc138\uc694. SAP S/4HANA\ub85c \uc6b4\uc601\ub429\ub2c8\ub2e4.',
    'home.categoryAll': '\uc804\uccb4',
    'home.loading': 'SAP\uc5d0\uc11c \uc0c1\ud488\uc744 \ubd88\ub7ec\uc624\ub294 \uc911...',
    'home.noProducts': '\uc774 \uce74\ud14c\uace0\ub9ac\uc5d0 \uc0c1\ud488\uc774 \uc5c6\uc2b5\ub2c8\ub2e4.',

    // Product Detail
    'product.id': '\uc0c1\ud488 ID',
    'product.quantity': '\uc218\ub7c9',
    'product.addToCart': '\uc7a5\ubc14\uad6c\ub2c8\uc5d0 \ub2f4\uae30',
    'product.added': '\uc7a5\ubc14\uad6c\ub2c8\uc5d0 \ub2f4\uacbc\uc2b5\ub2c8\ub2e4!',
    'product.per': '\ub2f9',
    'product.inStock': '\uc7ac\uace0 \uc788\uc74c',
    'product.outOfStock': '\ud488\uc808',
    'product.stockUnit': '{quantity} {unit} \uac00\ub2a5',
    'product.lowStock': '\uc7ac\uace0 \ubd80\uc871',
    'product.insufficientStock': '\uc7ac\uace0\uac00 \ubd80\uc871\ud569\ub2c8\ub2e4. {available}\uac1c\ub9cc \uac00\ub2a5\ud569\ub2c8\ub2e4.',

    // Cart
    'cart.title': '\uc7a5\ubc14\uad6c\ub2c8',
    'cart.empty': '\uc7a5\ubc14\uad6c\ub2c8\uac00 \ube44\uc5b4 \uc788\uc2b5\ub2c8\ub2e4',
    'cart.continueShopping': '\uc1fc\ud551 \uacc4\uc18d\ud558\uae30',
    'cart.product': '\uc0c1\ud488',
    'cart.price': '\uac00\uaca9',
    'cart.quantity': '\uc218\ub7c9',
    'cart.subtotal': '\uc18c\uacc4',
    'cart.summary': '\uc8fc\ubb38 \uc694\uc57d',
    'cart.items': '\uc0c1\ud488 \uc218',
    'cart.total': '\ucd1d\uc561',
    'cart.checkout': '\uc8fc\ubb38\ud558\uae30',

    // Checkout
    'checkout.title': '\uc8fc\ubb38\uc11c \uc791\uc131',
    'checkout.customerInfo': '\uace0\uac1d \uc815\ubcf4',
    'checkout.fullName': '\uc131\uba85',
    'checkout.email': '\uc774\uba54\uc77c \uc8fc\uc18c',
    'checkout.phone': '\uc804\ud654\ubc88\ud638',
    'checkout.orderSummary': '\uc8fc\ubb38 \uc694\uc57d',
    'checkout.qty': '\uc218\ub7c9',
    'checkout.placeOrder': '\uc8fc\ubb38\ud558\uae30',
    'checkout.processing': '\uc8fc\ubb38 \ucc98\ub9ac \uc911...',
    'checkout.emptyCart': '\uc7a5\ubc14\uad6c\ub2c8\uac00 \ube44\uc5b4 \uc788\uc2b5\ub2c8\ub2e4. \uba3c\uc800 \uc0c1\ud488\uc744 \ucd94\uac00\ud574\uc8fc\uc138\uc694.',

    // Confirmation
    'confirmation.title': '\uc8fc\ubb38\uc774 \ud655\uc815\ub418\uc5c8\uc2b5\ub2c8\ub2e4!',
    'confirmation.thanks': '\uc8fc\ubb38\ud574 \uc8fc\uc154\uc11c \uac10\uc0ac\ud569\ub2c8\ub2e4. \uc8fc\ubb38\uc774 \uc131\uacf5\uc801\uc73c\ub85c \uc811\uc218\ub418\uc5c8\uc2b5\ub2c8\ub2e4.',
    'confirmation.sapOrderNumber': 'SAP \ud310\ub9e4 \uc624\ub354 \ubc88\ud638',
    'confirmation.fullRef': '\uc804\uccb4 \ucc38\uc870\ubc88\ud638',
    'confirmation.processing': '\uc8fc\ubb38\uc774 SAP S/4HANA\uc5d0\uc11c \ucc98\ub9ac \uc911\uc785\ub2c8\ub2e4. Order-to-Cash \ud504\ub85c\uc138\uc2a4\uac00 \ubc30\uc1a1, \uccad\uad6c, \ud68c\uacc4 \ucc98\ub9ac\ub97c \uc790\ub3d9\uc73c\ub85c \uc218\ud589\ud569\ub2c8\ub2e4.',
    'confirmation.backToShopping': '\uc1fc\ud551 \uacc4\uc18d\ud558\uae30',

    // Order Tracking
    'header.tracking': '\uc8fc\ubb38 \ucd94\uc801',
    'tracking.title': '\uc8fc\ubb38 \ucd94\uc801',
    'tracking.subtitle': 'SAP \ud310\ub9e4 \uc624\ub354 \ubc88\ud638\ub97c \uc785\ub825\ud558\uc5ec \ud604\uc7ac \uc0c1\ud0dc\ub97c \ud655\uc778\ud558\uc138\uc694.',
    'tracking.inputLabel': '\ud310\ub9e4 \uc624\ub354 \ubc88\ud638',
    'tracking.inputPlaceholder': '\uc608: 12345',
    'tracking.submit': '\uc8fc\ubb38 \ucd94\uc801',
    'tracking.searching': '\uc870\ud68c \uc911...',
    'tracking.notFound': '\uc8fc\ubb38\uc744 \ucc3e\uc744 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4. \uc8fc\ubb38 \ubc88\ud638\ub97c \ud655\uc778\ud558\uace0 \ub2e4\uc2dc \uc2dc\ub3c4\ud574 \uc8fc\uc138\uc694.',
    'tracking.error': '\uc8fc\ubb38 \uc0c1\ud0dc \uc870\ud68c\uc5d0 \uc2e4\ud328\ud588\uc2b5\ub2c8\ub2e4. \uc7a0\uc2dc \ud6c4 \ub2e4\uc2dc \uc2dc\ub3c4\ud574 \uc8fc\uc138\uc694.',
    'tracking.refresh': '\uc0c8\ub85c\uace0\uce68',
    'tracking.orderInfo': '\uc8fc\ubb38 \uc815\ubcf4',
    'tracking.orderItems': '\uc8fc\ubb38 \ud488\ubaa9',
    'tracking.deliveryDocs': '\ubc30\uc1a1 \ubb38\uc11c',
    'tracking.billingDocs': '\uccad\uad6c \ubb38\uc11c',
    'tracking.overallStatus': '\uc804\uccb4 \uc0c1\ud0dc',
    'tracking.trackAnother': '\ub2e4\ub978 \uc8fc\ubb38 \ucd94\uc801',
    'tracking.step.orderCreated': '\uc8fc\ubb38 \uc0dd\uc131',
    'tracking.step.deliveryCreated': '\ubc30\uc1a1 \uc0dd\uc131',
    'tracking.step.goodsIssued': '\ucd9c\uace0 \uc644\ub8cc',
    'tracking.step.deliveryConfirmed': '\ubc30\uc1a1 \ud655\uc778',
    'tracking.step.billed': '\uccad\uad6c \uc644\ub8cc',
    'tracking.step.desc.orderCreated': 'SAP\uc5d0 \ud310\ub9e4 \uc624\ub354 \ub4f1\ub85d\ub428',
    'tracking.step.desc.deliveryCreated': '\ucd9c\ud558 \ubc30\uc1a1 \ubb38\uc11c \uc0dd\uc131\ub428 (VL01N)',
    'tracking.step.desc.goodsIssued': '\ucd9c\uace0 \uc804\uae30 \uc644\ub8cc (VL02N)',
    'tracking.step.desc.deliveryConfirmed': '\ubc30\uc1a1 \uc99d\ube59 \ud655\uc778\ub428 (VLPOD)',
    'tracking.step.desc.billed': '\uccad\uad6c \ubb38\uc11c \uc0dd\uc131\ub428 (VF01)',
    'tracking.status.notStarted': '\ubbf8\uc2dc\uc791',
    'tracking.status.inProgress': '\uc9c4\ud589 \uc911',
    'tracking.status.complete': '\uc644\ub8cc',
    'tracking.dataSource.full': 'SAP \uc2e4\uc2dc\uac04 \ub370\uc774\ud130',
    'tracking.dataSource.salesOrderOnly': '\ud310\ub9e4 \uc624\ub354 \uc0c1\ud0dc\uc5d0\uc11c \ucd94\ub860',
    'tracking.dataSource.mock': '\ub370\ubaa8 \ub370\uc774\ud130',
    'tracking.currentStatus': '\uc8fc\ubb38 \uc0c1\ud0dc',
    'tracking.sapOrderNumber': 'SAP \ud310\ub9e4 \uc624\ub354',
    'tracking.creationDate': '\uc0dd\uc131\uc77c',
    'tracking.soldToParty': '\uace0\uac1d',
    'tracking.material': '\uc790\uc7ac',
    'tracking.quantity': '\uc218\ub7c9',
    'tracking.trackOrder': '\uc8fc\ubb38 \ucd94\uc801\ud558\uae30',
    'tracking.documentNumber': '\ubb38\uc11c\ubc88\ud638',
    'confirmation.trackOrder': '\uc8fc\ubb38 \ucd94\uc801\ud558\uae30',

    // Footer
    'footer.powered': 'BikeStore \ub370\ubaa8 \ud3ec\ud138 \u2014 SAP S/4HANA \uae30\ubc18',
    'footer.demo': 'PerfecTwin ERP Edition E2E \ud14c\uc2a4\ud2b8\uc6a9 \ub370\ubaa8 \uc5b4\ud50c\ub9ac\ucf00\uc774\uc158\uc785\ub2c8\ub2e4.',

    // Common
    'common.remove': '\uc0ad\uc81c',
    'common.breadcrumb.products': '\uc0c1\ud488',
    'common.breadcrumb.cart': '\uc7a5\ubc14\uad6c\ub2c8',
    'common.breadcrumb.checkout': '\uc8fc\ubb38\uc11c',
    'common.error': '\uc608\uc0c1\uce58 \ubabb\ud55c \uc624\ub958\uac00 \ubc1c\uc0dd\ud588\uc2b5\ub2c8\ub2e4',
  },
} as const;

type TranslationKey = keyof typeof translations.en;

export function t(locale: Locale, key: TranslationKey, params?: Record<string, string | number>): string {
  let text: string = translations[locale]?.[key] || translations.en[key] || key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(`{${k}}`, String(v));
    }
  }
  return text;
}
