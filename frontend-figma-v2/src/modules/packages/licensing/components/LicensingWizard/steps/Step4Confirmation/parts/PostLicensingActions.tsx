import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { licensingStrings } from "@/modules/packages/licensing/strings";

interface Props {
  onLeave: () => void;
}

export function PostLicensingActions({ onLeave }: Props) {
  const navigate = useNavigate();
  const t = licensingStrings.step4.actions;

  const go = (path: string) => {
    onLeave();
    navigate(path);
  };

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <Button onClick={() => go("/licenses")} className="sm:w-auto">
        {t.viewLicenses}
      </Button>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          variant="outline"
          onClick={() => go("/catalog")}
          className="sm:w-auto"
        >
          {t.licenseAnother}
        </Button>
        <Button
          variant="ghost"
          onClick={() => go("/dashboard03")}
          className="sm:w-auto"
        >
          {t.goToDashboard}
        </Button>
      </div>
    </div>
  );
}
