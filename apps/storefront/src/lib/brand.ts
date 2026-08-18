// JerseyWersey central brand configuration.
// Values here are public storefront content only. Do not place secrets here.

export const BRAND = {
  name: "JerseyWersey",
  wordmark: "JERSEYWERSEY",
  tagline: "Wear the game.",
  description:
    "India-first football jersey store for club kits, national team jerseys, retro shirts, and matchday essentials.",
  supportEmail: "support@jerseywersey.com",
  supportPhone: "+91 98765 43210",
  city: "Aligarh, Uttar Pradesh",
  addressLine:
    "JerseyWersey, Aligarh, Uttar Pradesh, India",
  copyright: `Copyright ${new Date().getFullYear()} JerseyWersey. All rights reserved.`,
} as const

export const SEO = {
  title: "JerseyWersey | Football Jerseys in India",
  description:
    "Shop football jerseys in India from top clubs and national teams. Premium kits, retro classics, fast India delivery, and secure INR checkout.",
  keywords: [
    "football jerseys India",
    "soccer jerseys India",
    "club football kits",
    "national team jerseys",
    "retro football shirts",
    "JerseyWersey",
  ] as string[],
  openGraph: {
    title: "JerseyWersey | Football Jerseys in India",
    description:
      "Premium football jerseys for Indian fans, shipped across India with secure INR checkout.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JerseyWersey | Football Jerseys in India",
    description:
      "Premium club, national team, and retro football jerseys for Indian fans.",
  },
} as const

export const NAV_LINKS = [
  { label: "Shop All", href: "/store" },
  { label: "New Arrivals", href: "/store?sortBy=created_at" },
  { label: "Best Sellers", href: "/store?sortBy=price_asc" },
] as const

export const FOOTER = {
  shopLinks: [
    { label: "Shop All", href: "/store" },
    { label: "New Arrivals", href: "/store?sortBy=created_at" },
    { label: "Club Jerseys", href: "/store?q=club" },
    { label: "National Teams", href: "/store?q=national" },
  ],
  customerService: [
    { label: "Contact", href: "/contact" },
    { label: "FAQ", href: "/faq" },
    { label: "Shipping & Delivery", href: "/shipping-delivery" },
    { label: "Returns & Refunds", href: "/returns-refunds" },
    { label: "Size Guide", href: "/size-guide" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Account", href: "/account" },
    { label: "Orders", href: "/account/orders" },
  ],
  policies: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms-conditions" },
  ],
  socials: [] as { label: string; href: string; icon?: string }[],
} as const

export const HERO = {
  headlineTop: "Football jerseys",
  headlineAccent: "for Indian fans.",
  eyebrow: "New season kits now live",
  subheadline:
    "Shop club, national team, and retro football jerseys with INR pricing, India delivery, and a checkout built for Indian addresses.",
  primaryCta: { label: "Shop Jerseys", href: "/store" },
  secondaryCta: { label: "New Arrivals", href: "/store?sortBy=created_at" },
  trustItems: [
    { label: "India Delivery", description: "Trackable shipping nationwide" },
    { label: "INR Checkout", description: "Clear prices in rupees" },
    { label: "Secure Payments", description: "Protected checkout flow" },
  ],
} as const

export const HOMEPAGE = {
  featuredCategoriesTitle: "Shop by football obsession",
  featuredCategoriesSubtitle: "Club loyalties, national pride, and retro icons.",
  featuredProductsTitle: "Featured jerseys",
  featuredProductsSubtitle: "Real products from the JerseyWersey catalogue.",
  newArrivalsTitle: "New arrivals",
  newArrivalsSubtitle: "Fresh drops ready for matchday.",
  editorial: {
    eyebrow: "Built for Indian football culture",
    headline: "From watch parties to weekend turf.",
    body: "JerseyWersey is for fans who wear the badge beyond the 90 minutes. We focus on football jerseys that feel premium, photograph well, and arrive reliably across India.",
    cta: { label: "Explore Jerseys", href: "/store" },
  },
  trustTitle: "Why shop with JerseyWersey",
  newsletter: {
    title: "Join the squad",
    subtitle: "Get restock alerts, launch notes, and early access to limited drops.",
    cta: "Subscribe",
    successMessage: "You are on the list. Watch your inbox.",
    placeholder: "Enter your email",
  },
} as const

export const CART = {
  emptyTitle: "Your cart is empty",
  emptySubtitle:
    "Find a football jersey for your next matchday, watch party, or turf session.",
  emptyCta: "Shop Jerseys",
  checkoutCta: "Checkout",
  viewCartCta: "View Cart",
  subtotalLabel: "Subtotal",
  subtotalNote: "Shipping and taxes calculated at checkout.",
} as const

export const CHECKOUT = {
  wordmark: "JERSEYWERSEY",
  backToCart: "Back to cart",
  back: "Back",
  inYourCart: "In your cart",
  termsNote:
    "By placing your order, you agree to JerseyWersey's Terms & Conditions and Returns & Refunds policy.",
} as const

export const ACCOUNT = {
  loginTitle: "Welcome back",
  loginSubtitle: "Sign in to view orders, saved addresses, and account details.",
  registerTitle: "Join JerseyWersey",
  registerSubtitle: "Create an account for faster checkout and order tracking.",
  overviewTitle: "Overview",
  profileTitle: "Profile",
  addressesTitle: "Addresses",
  ordersTitle: "Orders",
  logoutLabel: "Log out",
  helloPrefix: "Hello",
} as const

export const EMPTY_STATES = {
  noProducts: {
    title: "No jerseys found",
    subtitle: "Try another search, category, or sort option.",
    cta: "Clear filters",
  },
  noSearchResults: {
    title: "No results found",
    subtitle: "Try searching for a club, country, colour, or player name.",
  },
  noOrders: {
    title: "No orders yet",
    subtitle: "When you place an order, it will show up here.",
    cta: "Shop Jerseys",
  },
} as const

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
] as const
