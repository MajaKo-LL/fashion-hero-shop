import Link from "next/link";
import type { Product } from "@/types";

interface PricingSnapshotProps {
  product: Product;
}

type StatusKey = "below" | "normal" | "slightly_above" | "above";

interface SnapshotData {
  medianPrice: number;
  difference: number;
  differencePercent: number;
  statusKey: StatusKey;
  statusLabel: string;
  recommendation: string;
}

const STATUS_CONFIG: Record<StatusKey, { label: string; badgeClass: string }> = {
  below: {
    label: "Poniżej rynku",
    badgeClass: "bg-green-100 text-green-800",
  },
  normal: {
    label: "W normie",
    badgeClass: "bg-stone-100 text-charcoal",
  },
  slightly_above: {
    label: "Trochę powyżej",
    badgeClass: "bg-amber-100 text-amber-800",
  },
  above: {
    label: "Wyraźnie powyżej",
    badgeClass: "bg-red-100 text-red-800",
  },
};

function getPricingSnapshot(product: Product): SnapshotData {
  const productNumber = Number.parseInt(product.id, 10) || 1;
  const offsetPattern = [-12, -6, 0, 6, 12];
  const marketOffset = offsetPattern[productNumber % offsetPattern.length];
  const medianPrice = Math.max(49, Math.round(product.price * (1 - marketOffset / 100)));
  const difference = product.price - medianPrice;
  const differencePercent = Math.round((difference / medianPrice) * 100);

  let statusKey: StatusKey;
  let recommendation: string;

  if (differencePercent <= -8) {
    statusKey = "below";
    recommendation =
      "Cena jest atrakcyjna. Sprawdź, czy marża nadal się spina, zanim obniżysz ją bardziej.";
  } else if (differencePercent >= 15) {
    statusKey = "above";
    recommendation =
      "Cena jest wysoka. Uzasadnij ją mocnymi zdjęciami, opisem materiału i opinią sellera.";
  } else if (differencePercent > 7) {
    statusKey = "slightly_above";
    recommendation =
      "Cena jest trochę wyższa. Sprawdź, czy zdjęcia i opis uzasadniają wyższą cenę.";
  } else {
    statusKey = "normal";
    recommendation =
      "Cena wygląda zdrowo. Zadbaj o zdjęcia i opis, żeby utrzymać konwersję.";
  }

  return {
    medianPrice,
    difference,
    differencePercent,
    statusKey,
    statusLabel: STATUS_CONFIG[statusKey].label,
    recommendation,
  };
}

function getSimilarCollectionHref(product: Product): string {
  if (product.category === "women") return "/collections/womens";
  if (product.category === "men") return "/collections/mens";
  return "/collections/all";
}

export function PricingSnapshot({ product }: PricingSnapshotProps) {
  const snapshot = getPricingSnapshot(product);
  const { badgeClass } = STATUS_CONFIG[snapshot.statusKey];
  const differenceLabel = snapshot.difference >= 0 ? "powyżej" : "poniżej";
  const differenceColorClass =
    snapshot.statusKey === "below"
      ? "text-green-700"
      : snapshot.statusKey === "above"
      ? "text-red-700"
      : snapshot.statusKey === "slightly_above"
      ? "text-amber-700"
      : "text-charcoal";

  return (
    <section className="border border-border bg-stone-50/70 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.8px] text-warm-gray">
            Pricing Report
          </p>
          <h2 className="mt-1 text-sm font-medium text-charcoal">
            Czy ta cena ma sens?
          </h2>
        </div>
        <span
          className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.6px] ${badgeClass}`}
        >
          {snapshot.statusLabel}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        <div className="bg-white p-3">
          <p className="text-[10px] uppercase tracking-[0.6px] text-warm-gray">
            Twoja cena
          </p>
          <p className="mt-1 text-sm font-medium text-charcoal">
            {product.price} zł
          </p>
        </div>
        <div className="bg-white p-3">
          <p className="text-[10px] uppercase tracking-[0.6px] text-warm-gray">
            Mediana
          </p>
          <p className="mt-1 text-sm font-medium text-charcoal">
            {snapshot.medianPrice} zł
          </p>
        </div>
        <div className="bg-white p-3">
          <p className="text-[10px] uppercase tracking-[0.6px] text-warm-gray">
            Różnica
          </p>
          <p className={`mt-1 text-sm font-medium ${differenceColorClass}`}>
            {Math.abs(snapshot.differencePercent)}% {differenceLabel}
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs leading-5 text-charcoal">
        {snapshot.recommendation}
      </p>

      <div className="mt-4 border-t border-border pt-3 flex items-center justify-between">
        <p className="text-[10px] leading-4 text-warm-gray">
          Dane przykładowe — nie dane live z rynku.
        </p>
        <Link
          href={getSimilarCollectionHref(product)}
          className="text-[11px] font-medium text-charcoal underline underline-offset-2 hover:text-warm-gray transition-colors whitespace-nowrap"
        >
          Zobacz podobne produkty →
        </Link>
      </div>
    </section>
  );
}
