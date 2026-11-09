export interface ProductCopy { benefits: string[]; ingredients: string; story: string }

export const productCopy: Record<string, ProductCopy> = {
  "shampoo-250": {
    story: "A gentle, sulfate-free wash that cleans like the mountain air: soft on the scalp, generous on shine.",
    benefits: ["Nourishes dry and brittle hair", "Calms the scalp without stripping it", "Leaves hair soft, shiny and easy to comb"],
    ingredients: "Pure argan oil, aloe vera, glycerin, plant-derived cleansers, natural fragrance.",
  },
  "serum-30": {
    story: "Our daily face serum: a few golden drops that melt in and leave skin supple, never greasy.",
    benefits: ["Deep, lasting hydration", "Softens the look of fine lines", "Evens tone and restores glow"],
    ingredients: "100% pure cold-pressed argan oil, vitamin E.",
  },
  "serum-60": {
    story: "The same pure face serum in the family size: a full season of glow, with better value per drop.",
    benefits: ["Deep, lasting hydration", "Softens the look of fine lines", "Best value for daily use"],
    ingredients: "100% pure cold-pressed argan oil, vitamin E.",
  },
}
