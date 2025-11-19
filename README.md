# Lowther Loudspeakers Website

A production-ready website for Lowther Loudspeakers built with Next.js 14, TypeScript, and Tailwind CSS. This project recreates the current brand aesthetic while improving performance and developer ergonomics.

## Features

- **Next.js 14** with App Router for optimal performance
- **TypeScript** for type safety and better developer experience
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** components for consistent UI
- **SEO optimized** with next-seo, sitemap, and structured data
- **A/B testing** framework for landing page experiments
- **Feature flags** for ambassador and wallet functionality
- **Blockchain verification** stub for future NFT integration
- **Shopify integration** ready for e-commerce
- **Responsive design** with mobile-first approach
- **Accessibility** compliant with semantic HTML and ARIA labels

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Fonts**: Sarabun (Google Fonts), HV Muse (local)
- **Analytics**: Vercel Analytics
- **SEO**: next-seo
- **State Management**: Zustand (ready for implementation)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   ├── category/          # Category pages
│   ├── speakers/          # Speaker detail pages
│   ├── blog/              # Blog system
│   ├── brand/             # Brand pages
│   ├── landings/          # A/B test landing pages
│   ├── labs/              # Hidden wallet connect
│   ├── ambassador/        # Gated ambassador area
│   └── verify/            # Blockchain verification
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── header.tsx        # Site header
│   ├── footer.tsx        # Site footer
│   ├── hero.tsx          # Hero section
│   ├── grid.tsx          # Product grid
│   └── product-card.tsx  # Product card component
├── lib/                  # Utilities and data
│   ├── data/            # JSON data files
│   ├── fonts.ts         # Font configuration
│   ├── seo.ts           # SEO utilities
│   ├── ab.ts            # A/B testing utilities
│   ├── shopify.ts       # Shopify integration
│   └── mockChain.ts     # Blockchain verification mock
└── public/              # Static assets
    ├── fonts/           # Local font files
    └── images/          # Image assets
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd lowther-loudspeakers
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.local.sample .env.local
```

4. Update environment variables in `.env.local`:
```bash
NEXT_PUBLIC_SITE_URL=https://lowtherloudspeakers.com
NEXT_PUBLIC_SHOP_URL=https://shop.lowtherloudspeakers.com
NEXT_PUBLIC_SHOP_DOMAIN=shop.lowtherloudspeakers.com
NEXT_PUBLIC_FEATURE_AMBASSADOR=false
NEXT_PUBLIC_FEATURE_WALLET=false
```

5. Add HV Muse font files to `public/fonts/hvmuse/`:
   - `HVMuse-Regular.woff2`
   - `HVMuse-Medium.woff2`
   - `HVMuse-Bold.woff2`

6. Add placeholder images to `public/images/` (see image requirements below)

7. Start the development server:
```bash
npm run dev
```

8. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Image Requirements

Add the following images to `public/images/`:

### Home Page
- `hero-home.jpg` - Home page hero background
- `diy-workshop.jpg` - DIY workshop image

### Category Images
- `collections/philharmonic.jpg`
- `collections/grand-opera.jpg`
- `collections/cottage.jpg`
- `collections/quarter-wave.jpg`
- `collections/drive-units.jpg`
- `collections/cables.jpg`

### Product Images
- `philharmonic-iii-1.jpg`, `philharmonic-iii-2.jpg`, `philharmonic-iii-3.jpg`
- `grand-opera-1.jpg`, `grand-opera-2.jpg`, `grand-opera-3.jpg`
- `cottage-1.jpg`, `cottage-2.jpg`
- `quarter-wave-1.jpg`, `quarter-wave-2.jpg`

### Drive Unit Images
- `drive-units/dx3.jpg`
- `drive-units/pm6c.jpg`
- `drive-units/pm2a.jpg`
- `drive-units/pm4a.jpg`

### Cable Images
- `cables/reference.jpg`
- `cables/studio.jpg`
- `cables/essential.jpg`

### Blog Images
- `blog/building-quarter-wave.jpg`
- `blog/choosing-amp.jpg`
- `blog/room-acoustics.jpg`
- `blog/history-lowther.jpg`

### Brand Images
- `craftsmanship/driver-selection.jpg`
- `craftsmanship/cabinet-construction.jpg`
- `craftsmanship/veneer-application.jpg`
- `craftsmanship/final-assembly.jpg`
- `legacy/built-to-last.jpg`
- `legacy/sustainable-craft.jpg`
- `legacy/timeless-design.jpg`

### History Images
- `history/1945-founding.jpg`
- `history/1950s-innovation.jpg`
- `history/1960s-expansion.jpg`
- `history/1980s-family.jpg`
- `history/2000s-modern.jpg`
- `history/today-craftsmanship.jpg`

### Landing Page Images
- `quarter-wave-hero.jpg`
- `quarter-wave-workshop.jpg`
- `quarter-wave-detail.jpg`
- `workshop-build.jpg`
- `kit-contents.jpg`

## Features

### A/B Testing
- Landing page variants at `/landings/qw-a` and `/landings/qw-b`
- URL parameter support: `?v=a` or `?v=b`
- Cookie-based variant persistence

### Feature Flags
- Ambassador programme: `NEXT_PUBLIC_FEATURE_AMBASSADOR`
- Wallet connect: `NEXT_PUBLIC_FEATURE_WALLET`

### Hidden Features
- Wallet connect: `/labs/wallet` (keyboard shortcut: G + W)
- Blockchain verification: `/verify/[serial]`
- Ambassador area: `/ambassador`

### SEO Features
- Automatic sitemap generation
- Robots.txt configuration
- Structured data for products and articles
- Open Graph and Twitter Card support
- Meta tags optimization

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

**Note:** If deployments aren't triggering automatically, check the GitHub-Vercel integration in Vercel dashboard under Settings > Git.

### Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_SITE_URL` | Site URL for SEO | `https://lowtherloudspeakers.com` |
| `NEXT_PUBLIC_SHOP_URL` | Shopify store URL | `https://shop.lowtherloudspeakers.com` |
| `NEXT_PUBLIC_SHOP_DOMAIN` | Shopify domain | `shop.lowtherloudspeakers.com` |
| `NEXT_PUBLIC_FEATURE_AMBASSADOR` | Enable ambassador programme | `false` |
| `NEXT_PUBLIC_FEATURE_WALLET` | Enable wallet connect | `false` |

## Development

### Code Style
- ESLint for code linting
- Prettier for code formatting
- TypeScript for type checking

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is proprietary software owned by Lowther Loudspeakers Ltd.

## Support

For technical support or questions about the website, please contact the development team.