import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { products } from "@/data/products";
import { PricingSnapshot } from "@/components/pricing-snapshot";

export const metadata: Metadata = {
  title: "Pricing Report — Panel Sellera | FashionHero",
};

const SELLER_ID = "s1";
const SELLER_NAME = "UrbanEdge";
const SAMPLE_PRODUCT_IDS = ["1", "3", "9"];

const sellerProducts = SAMPLE_PRODUCT_IDS.map(
  (id) => products.find((p) => p.id === id && p.sellerId === SELLER_ID)!
);

export default function SellerPricingPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b border-border bg-charcoal text-white">
        <div className="mx-auto max-w-4xl px-6 py-3 flex items-center justify-between">
          <Link href="/" className="text-[11px] uppercase tracking-[0.8px] text-white/60 hover:text-white transition-colors">
            ← FashionHero
          </Link>
          <span className="text-[11px] uppercase tracking-[0.8px] text-white/60">
            Panel Sellera
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <p className="text-[11px] font-medium uppercase tracking-[1px] text-warm-gray mb-2">
            Panel Sellera · {SELLER_NAME}
          </p>
          <h1 className="text-3xl font-normal text-charcoal">
            Pricing Report
          </h1>
          <p className="mt-3 text-sm text-warm-gray max-w-xl leading-6">
            Sprawdź, jak ceny Twoich produktów wypadają na tle mediany podobnych ofert na platformie.
            Dane pomagają podjąć decyzję o korekcie ceny lub wzmocnieniu opisu.
          </p>

          {/* Demo banner */}
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-4 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            <span className="text-[11px] font-medium text-amber-800 uppercase tracking-[0.5px]">
              Dane przykładowe — MVP demo, nie dane live z rynku
            </span>
          </div>
        </div>

        {/* Products */}
        <div className="flex flex-col gap-10">
          {sellerProducts.map((product) => (
            <div key={product.id} className="border border-border bg-white">
              {/* Product header */}
              <div className="flex items-center gap-4 border-b border-border p-5">
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden bg-cream">
                  <Image
                    src={product.colors[0].image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${product.slug}`}
                    className="text-sm font-medium text-charcoal hover:underline"
                  >
                    {product.name}
                  </Link>
                  <p className="mt-0.5 text-[11px] text-warm-gray">
                    {product.price} zł · ID: {product.id} · {product.colors.length} kolor{product.colors.length > 1 ? "y" : ""}
                  </p>
                </div>
                <div className="hidden sm:block">
                  <span className="text-[10px] uppercase tracking-[0.6px] text-warm-gray">
                    {product.badge ?? "aktywny"}
                  </span>
                </div>
              </div>

              {/* Pricing Snapshot */}
              <div className="p-5">
                <PricingSnapshot product={product} />
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="mt-10 text-center text-[11px] text-warm-gray/70 leading-5">
          Pricing Snapshot to funkcja edukacyjna w ramach kursu AI Product Heroes.<br />
          W produkcyjnej wersji dane byłyby zasilane z prawdziwego feedu cenowego platformy.
        </p>
      </div>
    </main>
  );
}
