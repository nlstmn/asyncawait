// All prices are in euros — single source of money formatting so every page
// (shop card, product detail, cart, checkout) renders currency identically.
// European decimal separator: comma, not dot (e.g. €14,99).
export const formatPrice = (amount) => `€${Number(amount).toFixed(2).replace('.', ',')}`
