// All prices are in euros — single source of money formatting so every page
// (shop card, product detail, cart, checkout) renders currency identically.
export const formatPrice = (amount) => `€${Number(amount).toFixed(2)}`
