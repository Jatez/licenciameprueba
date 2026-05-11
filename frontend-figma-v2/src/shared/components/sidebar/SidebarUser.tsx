import { LogOut, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar } from "@/shared/components/ds/Avatar";
import { useAuthStore } from "@/stores/authStore";
import { useOnboardingTourStore } from "@/modules/packages/onboarding/tour";
import { onboardingStrings } from "@/modules/packages/onboarding/strings";

interface SidebarUserProps {
  initials: string;
  name: string;
  role: string;
}

/** Avatar + name + dropdown with the onboarding-tour replay action and Sign out. */
export function SidebarUser({ initials, name, role }: SidebarUserProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const logout = useAuthStore((s) => s.logout);
  const restartTour = useOnboardingTourStore((s) => s.restart);

  const handleLogout = () => {
    logout();
    queryClient.clear();
    navigate("/", { replace: true });
  };

  const handleReplayTour = () => {
    restartTour();
  };

  return (
    <div className="px-5 pb-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-md px-1 py-1 text-left transition-colors hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`Cuenta de ${name}`}
          >
            <Avatar initials={initials} tone="primary" size="md" aria-label={name} />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{name}</p>
              <p className="truncate text-xs text-muted-foreground">{role}</p>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="top" className="w-56">
          <DropdownMenuLabel>
            <span className="block text-sm font-medium text-foreground">{name}</span>
            <span className="block text-xs font-normal text-muted-foreground">{role}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={handleReplayTour}>
            <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
            <span>{onboardingStrings.reengage.label}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
            <span>Cerrar sesión</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
