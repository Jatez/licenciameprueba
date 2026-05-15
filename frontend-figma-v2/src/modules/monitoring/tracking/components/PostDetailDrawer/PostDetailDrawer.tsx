import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Music, Heart, Eye, MessageCircle, Share2, Clock } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/api";
import type { DetectedPost, AudioDetectionItem } from "@/api/types";
import { MatchStatusBadge } from "../shared/MatchStatusBadge";
import { PlatformIcon } from "../shared/PlatformIcon";
import { formatRelativeFromNow } from "../../utils/relativeTime";

interface PostDetailDrawerProps {
  postId: string | null;
  open: boolean;
  onClose: () => void;
}

function formatNum(n: number | null | undefined): string {
  if (n == null) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function MetricChip({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-lg bg-foreground/[0.04] px-4 py-3 min-w-[72px]">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-sm font-semibold text-foreground">{value}</span>
      <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</span>
    </div>
  );
}

function DetectionRow({ det }: { det: AudioDetectionItem }) {
  const pct = det.confidence_score != null ? Math.round(det.confidence_score * 100) : null;
  const hasMatch = !!det.matched_title || !!det.matched_artist;
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border p-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Music size={14} />
      </div>
      <div className="min-w-0 flex-1">
        {hasMatch ? (
          <>
            <p className="truncate text-sm font-medium text-foreground">
              {det.matched_title ?? "—"}
            </p>
            <p className="truncate text-xs text-muted-foreground">{det.matched_artist ?? "—"}</p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Sin coincidencia</p>
        )}
        {det.detector_provider && (
          <p className="mt-0.5 text-[10px] text-muted-foreground uppercase tracking-wide">
            {det.detector_provider}
          </p>
        )}
      </div>
      {pct != null && (
        <Badge variant={pct >= 70 ? "default" : "secondary"} className="shrink-0 text-xs">
          {pct}%
        </Badge>
      )}
    </div>
  );
}

export function PostDetailDrawer({ postId, open, onClose }: PostDetailDrawerProps) {
  const query = useQuery<DetectedPost>({
    queryKey: ["post-detail", postId],
    queryFn: () => api.tracking.getPostById(postId!),
    enabled: !!postId && open,
    staleTime: 60_000,
  });

  const post = query.data;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full max-w-lg p-0 sm:max-w-xl" side="right">
        <SheetHeader className="border-b border-border px-6 py-4">
          <div className="flex items-center gap-2">
            {post && <PlatformIcon platform={post.platform} size={18} />}
            <SheetTitle className="text-base">Detalle del post</SheetTitle>
          </div>
          <SheetDescription className="sr-only">
            Información completa del post detectado
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-73px)]">
          <div className="space-y-6 px-6 py-5">
            {query.isLoading && (
              <div className="space-y-4">
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            )}

            {query.isError && (
              <p className="text-sm text-destructive">Error cargando el post.</p>
            )}

            {post && (
              <>
                {/* Thumbnail */}
                {post.thumbnailUrl && (
                  <div className="overflow-hidden rounded-xl border border-border">
                    <img
                      src={post.thumbnailUrl}
                      alt=""
                      className="w-full object-cover"
                      style={{ maxHeight: 280 }}
                    />
                  </div>
                )}

                {/* Badges row */}
                <div className="flex flex-wrap items-center gap-2">
                  <PlatformIcon platform={post.platform} size={14} />
                  <span className="rounded-md bg-foreground/[0.04] px-2 py-0.5 text-xs font-medium text-foreground capitalize">
                    {post.contentType ?? post.postType}
                  </span>
                  <MatchStatusBadge status={post.matchStatus} />
                  {post.publishedAt && (
                    <span className="ml-auto text-xs text-muted-foreground">
                      {formatRelativeFromNow(post.publishedAt)}
                    </span>
                  )}
                </div>

                {/* Caption */}
                {post.caption && (
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Descripción
                    </p>
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                      {post.caption}
                    </p>
                  </div>
                )}

                {/* Author */}
                {post.authorName && (
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Autor
                    </p>
                    <p className="text-sm text-foreground">@{post.authorName}</p>
                  </div>
                )}

                {/* Metrics */}
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Métricas
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <MetricChip icon={<Heart size={14} />} value={formatNum(post.likeCount)} label="Likes" />
                    <MetricChip icon={<Eye size={14} />} value={formatNum(post.viewCount)} label="Vistas" />
                    <MetricChip icon={<MessageCircle size={14} />} value={formatNum(post.commentCount)} label="Comentarios" />
                    {post.duration && (
                      <MetricChip
                        icon={<Clock size={14} />}
                        value={post.duration >= 60 ? `${Math.floor(post.duration / 60)}m ${post.duration % 60}s` : `${post.duration}s`}
                        label="Duración"
                      />
                    )}
                  </div>
                </div>

                {/* Audio Detections */}
                {post.detections && post.detections.length > 0 && (
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Detecciones de audio ({post.detections.length})
                    </p>
                    <div className="space-y-2">
                      {post.detections.map((det) => (
                        <DetectionRow key={det.id} det={det} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Link to original */}
                {post.externalUrl && (
                  <a
                    href={post.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary underline-offset-4 hover:underline"
                  >
                    <ExternalLink size={14} />
                    Ver post original
                  </a>
                )}
              </>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
