# NovaWear — Brand Store

Static, responsive storefront with product grid, search/filters, cart (localStorage), and a simple checkout confirmation.

## Run locally

- Prerequisite: Python 3 is available on most systems.
- Start a local server from this folder:

```bash
cd /workspace/brand-store
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Customize

- Branding: update `assets/logo.svg`, the `<title>` in `index.html`, copy in the hero section, and colors in `styles.css`.
- Products: edit `products.json` (id must be numeric and unique; `price` is a number; `category` is a short slug).
- Images: use your own CDN or upload assets; product images accept any HTTPS URL.

## Notes

- Cart persists via `localStorage` under `novawear_cart`.
- Checkout is a demo-only flow that displays a confirmation and clears the cart; integrate a backend + payment processor for production.

