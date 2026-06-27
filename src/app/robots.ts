import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mysteryscoop.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/api/",
        "/profile/",
        "/checkout/",
        "/wishlist",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
