import { Construction } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminPageTitle } from "./AdminPageTitle";
import { adminStrings } from "../strings";

interface AdminPagePlaceholderProps {
  title: string;
  description: string;
}

/**
 * Generic placeholder used by admin sub-routes that will be built in
 * subsequent prompts. Keeps the shell navigable from day one.
 */
export function AdminPagePlaceholder({ title, description }: AdminPagePlaceholderProps) {
  const t = adminStrings.placeholders;
  return (
    <>
      <AdminPageTitle title={title} subtitle={description} />
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Construction className="h-5 w-5" aria-hidden="true" />
          </span>
          <Badge variant="secondary">{t.soon}</Badge>
          <p className="max-w-md text-sm text-muted-foreground">{t.note}</p>
        </CardContent>
      </Card>
    </>
  );
}
