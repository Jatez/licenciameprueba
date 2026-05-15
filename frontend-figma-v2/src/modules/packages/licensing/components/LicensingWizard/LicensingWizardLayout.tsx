import { useEffect, useRef, type ReactNode } from "react";
import { HelpCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FrostedHeader } from "@/shared/components/ds/FrostedHeader";
import {
  PAGE_HEADER_EDGE_TO_EDGE,
  PAGE_HEADER_HIDDEN_TRANSLATE,
  PAGE_HEADER_STACK_WRAPPER,
} from "@/shared/components/layout/AppPageHeader";
import { useHeadroom } from "@/shared/hooks";
import { licensingStrings } from "@/modules/packages/licensing/strings";
import { LicensingWizardStepper } from "./LicensingWizardStepper";
import { LicensingWizardBreadcrumb } from "./LicensingWizardBreadcrumb";
import type { WizardStep } from "@/stores/licensingWizardStore";

interface Props {
  currentStep: WizardStep;
  trackId: string;
  trackTitle?: string;
  onCancelClick: () => void;
  body: ReactNode;
  footer?: ReactNode;
}

/**
 * Wizard shell — breadcrumb "Volver al track" + header (Cancel · Title · Help)
 * + stepper, todo apilado en un único contenedor sticky con headroom unificado.
 * Footer sticky abajo (siempre visible — sin headroom).
 *
 * Ambas barras van **edge-to-edge del BodyCard** (los negative margins
 * `-mx-4 -mt-14 / -mx-10 -mt-12` cancelan exactamente el padding del
 * BodyCard `px-4 pt-14 / md:px-10 md:py-12`). El contenido interno se
 * mantiene en `max-w-3xl` para preservar la silueta legible del wizard.
 */
export function LicensingWizardLayout({
  currentStep,
  trackId,
  trackTitle,
  onCancelClick,
  body,
  footer,
}: Props) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { isVisible: isHeaderVisible } = useHeadroom();

  useEffect(() => {
    const scrollContainer = sectionRef.current?.closest("main");
    scrollContainer?.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  return (
    <section
      ref={sectionRef}
      role="region"
      aria-label={`${licensingStrings.wizard.title} — ${licensingStrings.wizard.steps[currentStep]}`}
      className="flex w-full flex-col"
    >
      {/* Sticky stack: breadcrumb + frosted header (headroom unificado). */}
      <div
        className={`${PAGE_HEADER_STACK_WRAPPER} -mt-14`}
        style={{ transform: `translateY(${isHeaderVisible ? "0" : PAGE_HEADER_HIDDEN_TRANSLATE})` }}
      >
        <FrostedHeader
          sticky={false}
          position="top"
          intensity="default"
          className="pt-14 md:pt-12"
        >
          <LicensingWizardBreadcrumb trackId={trackId} trackTitle={trackTitle} />
        </FrostedHeader>
        <FrostedHeader
          sticky={false}
          position="top"
          intensity="default"
          className={`${PAGE_HEADER_EDGE_TO_EDGE} pb-3 md:pb-4`}
        >
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
            <header className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancelClick}
                aria-label={licensingStrings.wizard.cancel}
              >
                <X className="h-4 w-4" />
                <span className="hidden sm:inline">{licensingStrings.wizard.cancel}</span>
              </Button>
              <h1 className="text-base font-semibold text-foreground sm:text-lg">
                {licensingStrings.wizard.title}
              </h1>
              <Button
                variant="ghost"
                size="sm"
                aria-label={licensingStrings.wizard.help}
                onClick={() => undefined}
              >
                <HelpCircle className="h-4 w-4" />
                <span className="hidden sm:inline">{licensingStrings.wizard.help}</span>
              </Button>
            </header>
            <LicensingWizardStepper currentStep={currentStep} />
          </div>
        </FrostedHeader>
      </div>

      {/* Body: ancho legible + padding-bottom para que el footer sticky no tape el último item. */}
      <div className="mx-auto w-full max-w-3xl px-4 py-4 pb-44 md:px-0 md:py-5 md:pb-48">{body}</div>

      {/* Frosted bottom: footer de acciones siempre visible. */}
      {footer ? (
        <FrostedHeader
          position="bottom"
          intensity="subtle"
          className={`${PAGE_HEADER_EDGE_TO_EDGE} -mb-6 border-t border-black/5 pt-2 pb-3 shadow-[0_-18px_40px_rgba(15,23,42,0.08)] md:-mb-12 md:pt-3 md:pb-4`}
        >
          <div className="mx-auto w-full max-w-3xl">{footer}</div>
        </FrostedHeader>
      ) : null}
    </section>
  );
}
