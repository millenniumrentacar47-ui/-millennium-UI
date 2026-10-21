// Populate only with URLs supplied by the business owner.
export const business = {
  name: "Millennium Group Rent A Car",
  email: "info@millennium.com",
  phone: "+919947000500",
  reviewUrl: import.meta.env.VITE_GOOGLE_REVIEW_URL || "",
};

export const socialLinks = [
  { name: "Facebook", url: import.meta.env.VITE_FACEBOOK_URL },
  { name: "Instagram", url: import.meta.env.VITE_INSTAGRAM_URL },
].filter(({ url }) => /^https:\/\//.test(url || ""));
