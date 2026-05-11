import { Eye, Shield, Unplug } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { socialStrings } from "@/modules/social/strings";

const SECTIONS = [
  { key: "permissions", icon: Shield },
  { key: "neverDo", icon: Eye },
  { key: "disconnect", icon: Unplug },
] as const;

export function WhyConnectAccordion() {
  return (
    <Card className="p-2">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="why-connect" className="border-0">
          <AccordionTrigger className="px-4 py-3 hover:no-underline text-base">
            {socialStrings.whyConnect.title}
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <ul className="space-y-5">
              {SECTIONS.map(({ key, icon: Icon }) => {
                const section = socialStrings.whyConnect.sections[key];
                return (
                  <li key={key} className="flex gap-3">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-lm-gray-100">
                      <Icon size={18} aria-hidden="true" className="text-foreground" />
                    </span>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-foreground">{section.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{section.body}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
