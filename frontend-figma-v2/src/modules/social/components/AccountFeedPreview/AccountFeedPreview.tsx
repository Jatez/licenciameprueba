import { ExternalLink, ImageIcon } from "lucide-react";
import { useAccountFeed } from "@/modules/social/hooks/useAccountFeed";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import type { SocialAccount } from "@/api/types";

interface Props {
  account: SocialAccount;
}

export function AccountFeedPreview({ account }: Props) {
  const { data: posts, isLoading } = useAccountFeed(account.id, 6);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
          Últimos posts — {account.platform}
        </p>
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
        Sin posts recientes en {account.platform}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
        Últimos posts — {account.platform}
      </p>
      <div className="grid grid-cols-3 gap-2">
        {posts.slice(0, 6).map((post) => (
          <a
            key={post.id}
            href={post.permalink ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square overflow-hidden rounded-md bg-muted"
          >
            {post.thumbnailUrl || post.mediaUrl ? (
              <img
                src={post.thumbnailUrl ?? post.mediaUrl ?? ""}
                alt={post.caption ?? "Post"}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white truncate">
                  {post.likesCount != null ? `♥ ${post.likesCount}` : ""}
                </span>
                <ExternalLink className="h-3 w-3 text-white flex-shrink-0" />
              </div>
            </div>
          </a>
        ))}
      </div>
      {posts.length > 0 && (
        <p className="text-[11px] text-muted-foreground">
          Mostrando {Math.min(posts.length, 6)} de {posts.length} posts recientes
        </p>
      )}
    </div>
  );
}
