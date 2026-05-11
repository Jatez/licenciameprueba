import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { catalogStrings } from "@/modules/tracks/strings";

export function BackButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    // Prefer going back — the catalog URL already contains all filters.
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0;
    if (idx > 0) navigate(-1);
    else navigate("/catalog");
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleClick} className="gap-2">
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      {catalogStrings.trackDetail.backToCatalog}
    </Button>
  );
}
