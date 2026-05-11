import { Plus, Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminPageTitle } from "../../components/AdminPageTitle";
import { catalogStrings } from "../strings";

interface CatalogHeaderProps {
  onAddTrack: () => void;
  onImportCsv: () => void;
  onExportCsv: () => void;
}

export function CatalogHeader({ onAddTrack, onImportCsv, onExportCsv }: CatalogHeaderProps) {
  const t = catalogStrings.page;
  return (
    <AdminPageTitle
      title={t.title}
      subtitle={t.subtitle}
      actions={
        <>
          <Button variant="ghost" onClick={onExportCsv}>
            <Download className="h-4 w-4" aria-hidden="true" />
            {t.exportCsv}
          </Button>
          <Button variant="secondary" onClick={onImportCsv}>
            <Upload className="h-4 w-4" aria-hidden="true" />
            {t.importCsv}
          </Button>
          <Button onClick={onAddTrack}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            {t.addTrack}
          </Button>
        </>
      }
    />
  );
}
