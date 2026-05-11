import { Link } from "react-router-dom";
import {
  Music,
  Upload,
  PackagePlus,
  Building2,
  FileText,
  ShieldCheck,
  type LucideIcon,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { adminStrings } from "../strings";
import type { AdminQuickActionKey, AdminQuickActionMock } from "../mocks/adminMocks";

const ICONS: Record<AdminQuickActionKey, LucideIcon> = {
  addTrack: Music,
  importCsv: Upload,
  createPackage: PackagePlus,
  viewCompanies: Building2,
  reviewLicenses: FileText,
  auditActivity: ShieldCheck,
};

interface AdminQuickActionCardProps {
  action: AdminQuickActionMock;
}

export function AdminQuickActionCard({ action }: AdminQuickActionCardProps) {
  const Icon = ICONS[action.key];
  const copy = adminStrings.quickActions[action.key];

  return (
    <Card className="group transition-all hover:shadow-md">
      <Link
        to={action.href}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-card"
      >
        <CardContent className="flex items-start gap-4 p-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-foreground">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">{copy.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{copy.caption}</p>
          </div>
          <ArrowUpRight
            className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </CardContent>
      </Link>
    </Card>
  );
}
