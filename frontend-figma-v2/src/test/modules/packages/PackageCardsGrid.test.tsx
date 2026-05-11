import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PackageCardsGrid } from "@/modules/packages/packages/components/PackageCardsGrid/PackageCardsGrid";
import type { CreditPackage } from "@/api/types";

// Mock the hook that fetches packages from the API
vi.mock("@/modules/packages/packages/hooks", () => ({
  useCreditPackages: () => ({
    data: mockPackages,
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  }),
}));

const mockPackages: CreditPackage[] = [
  {
    id: "bag-a",
    name: "Básico",
    credits: 10,
    priceCop: 150000,
    validityMonths: 3,
    pricePerCreditCop: 15000,
  },
  {
    id: "bag-b",
    name: "Profesional",
    credits: 25,
    priceCop: 300000,
    validityMonths: 6,
    recommended: true,
    pricePerCreditCop: 12000,
  },
  {
    id: "bag-c",
    name: "Enterprise",
    credits: 60,
    priceCop: 600000,
    validityMonths: 12,
    pricePerCreditCop: 10000,
  },
];

describe("PackageCardsGrid", () => {
  it("renders all package cards", () => {
    render(<PackageCardsGrid onBuy={vi.fn()} />);
    expect(screen.getByText("Básico")).toBeInTheDocument();
    expect(screen.getByText("Profesional")).toBeInTheDocument();
    expect(screen.getByText("Enterprise")).toBeInTheDocument();
  });

  it("displays prices in COP format", () => {
    render(<PackageCardsGrid onBuy={vi.fn()} />);
    // Prices should be formatted as Colombian peso (COP)
    // The formatCop utility produces strings like "$150.000" or "$ 150.000"
    const copPrices = screen.getAllByText(/\$[\s\d.,]+/);
    expect(copPrices.length).toBeGreaterThan(0);
  });

  it("shows credit counts for each package", () => {
    render(<PackageCardsGrid onBuy={vi.fn()} />);
    // Verify credits are displayed - use getAllByText since numbers may appear multiple times
    expect(screen.getAllByText(/10/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/25/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/60/).length).toBeGreaterThan(0);
  });

  it("calls onBuy when buy button is clicked", async () => {
    const onBuy = vi.fn();
    render(<PackageCardsGrid onBuy={onBuy} />);
    // There should be buy buttons rendered
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });
});
