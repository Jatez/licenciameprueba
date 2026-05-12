import { useNavigate } from "react-router-dom";
import { Music, Radar, History } from "lucide-react";

import { AppPageHeader } from "@/shared/components/layout/AppPageHeader";
import {
  MatchExplanationCard,
  MatchMetricsGrid,
  MatchSourceCard,
  MockIntegrationStatus,
  RecentMatchHistory,
  matchTracksStrings as s,
} from "@/modules/monitoring/match-tracks";

export default function MatchTracksHub() {
  const navigate = useNavigate();
  const t = s.hub;

  return (
    <>
      <AppPageHeader title={t.title} description={t.subtitle} liftStickyDesktop />

      <section className="mb-8">
        <MatchMetricsGrid />
      </section>

      <section className="mb-8 grid gap-4 md:grid-cols-3">
        <MatchSourceCard
          icon={Music}
          title={t.sources.spotify.title}
          description={t.sources.spotify.description}
          cta={t.sources.spotify.cta}
          onClick={() => navigate("/match-tracks/spotify")}
          highlighted
        />
        <MatchSourceCard
          icon={Radar}
          title={t.sources.social.title}
          description={t.sources.social.description}
          cta={t.sources.social.cta}
          onClick={() => navigate("/match-tracks/social")}
        />
        <MatchSourceCard
          icon={History}
          title={t.sources.history.title}
          description={t.sources.history.description}
          cta={t.sources.history.cta}
          onClick={() => navigate("/match-tracks/results")}
        />
      </section>

      <section className="mb-8 grid gap-4 lg:grid-cols-2">
        <MatchExplanationCard />
        <MockIntegrationStatus />
      </section>

      <section>
        <RecentMatchHistory />
      </section>
    </>
  );
}
