import type { ReactNode } from "react";
import { FrostedHeader } from "@/shared/components/ds/FrostedHeader";
import { useHeadroom } from "@/shared/hooks";
import { AdminHeader } from "./AdminHeader";

interface AdminFrostedHeaderProps {
  children: ReactNode;
}

/**
 * Sticky frosted header for the Super Admin shell.
 *
 * Stacks the global breadcrumb (`<AdminHeader />`) on top of the page-specific
 * title block (`children`, typically `<AdminPageTitle />`) inside a single
 * `<FrostedHeader />`, so both move as a unit driven by `useHeadroom()` —
 * mirrors the recipe used by Dashboard v2, Catalog and the Licensing wizard.
 *
 * Edge-to-edge against `<BodyCard />` padding (`px-4 pt-14 pb-6 md:px-10 md:py-12`).
 */
export function AdminFrostedHeader({ children }: AdminFrostedHeaderProps) {
  const { isVisible } = useHeadroom();
  return (
    <FrostedHeader
      position="top"
      intensity="default"
      translateY={isVisible ? "0" : "-100%"}
      className="-mx-4 -mt-14 px-4 pb-3 pr-14 md:-mx-10 md:-mt-12 md:px-10 md:pt-12 md:pb-6 md:pr-10 pt-0"
    >
      <AdminHeader />
      {children}
    </FrostedHeader>
  );
}
