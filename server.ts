import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { processTriageRequest } from "./server/triage.ts";
import { CatalogService } from "./server/catalog/catalogService.ts";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const catalogService = new CatalogService();

  // AI Triage Endpoint
  app.post("/api/triage", async (req, res) => {
    try {
      const { messages, petProfile, previousUrgencies } = req.body;
      
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Gemini API key is not configured." });
      }

      const response = await processTriageRequest(messages, petProfile, previousUrgencies || []);
      res.json(response);
    } catch (error: any) {
      console.error("Error in AI triage:", error);
      res.status(500).json({ error: error.message || "Failed to generate response." });
    }
  });

  // Comparative Shop Catalog APIs
  app.get("/api/catalog/products", async (req, res) => {
    try {
      const { query, category, species, minPrice, maxPrice, sortBy, onlyFavorites, favoriteProductIds } = req.query;
      
      const parsedMin = minPrice ? parseInt(minPrice as string) : undefined;
      const parsedMax = maxPrice ? parseInt(maxPrice as string) : undefined;
      const favoritesList = typeof favoriteProductIds === 'string' ? favoriteProductIds.split(',') : (Array.isArray(favoriteProductIds) ? favoriteProductIds as string[] : undefined);

      const result = await catalogService.search({
        query: query as string,
        category: category as any,
        species: species as any,
        minPrice: parsedMin,
        maxPrice: parsedMax,
        sortBy: sortBy as any,
        onlyFavorites: onlyFavorites === 'true',
        favoriteProductIds: favoritesList
      });
      res.json(result);
    } catch (error: any) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: error.message || "Failed to query products." });
    }
  });

  app.get("/api/catalog/products/:slug", async (req, res) => {
    try {
      const result = await catalogService.getProductBySlug(req.params.slug);
      if (!result) {
        return res.status(404).json({ error: "Product not found." });
      }
      res.json(result);
    } catch (error: any) {
      console.error("Error fetching product detail:", error);
      res.status(500).json({ error: error.message || "Failed to fetch product details." });
    }
  });

  app.get("/api/catalog/categories", (req, res) => {
    res.json([
      { value: 'all', label: 'همه' },
      { value: 'food', label: 'غذا' },
      { value: 'treat', label: 'تشویقی' },
      { value: 'supplement', label: 'مکمل' },
      { value: 'toy', label: 'بازی' },
      { value: 'hygiene', label: 'بهداشت' },
      { value: 'grooming', label: 'آرایش' },
      { value: 'accessory', label: 'لوازم' },
      { value: 'bed', label: 'جای خواب' },
      { value: 'carrier', label: 'باکس و حمل' }
    ]);
  });

  // Outbound Affiliate Redirect Proxy
  app.get("/api/outbound/:offerId", (req, res) => {
    try {
      const redirectResult = catalogService.getOfferRedirect(req.params.offerId);
      if (!redirectResult) {
        return res.status(404).send("<h2>پیشنهاد مورد نظر یافت نشد یا غیرفعال است.</h2>");
      }
      
      // Perform HTTP 302 Redirect
      res.redirect(302, redirectResult.url);
    } catch (error: any) {
      console.error("Outbound redirect failed:", error);
      res.status(500).send("<h2>خطای سیستمی در هدایت به فروشگاه همکار.</h2>");
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
