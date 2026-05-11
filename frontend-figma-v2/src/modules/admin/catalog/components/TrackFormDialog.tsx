import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { catalogStrings } from "../strings";
import { adminCatalogGenres } from "../mocks";
import type { AdminTrack, AdminTrackStatus } from "../types";

interface TrackFormDialogProps {
  open: boolean;
  mode: "create" | "edit";
  track: AdminTrack | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (track: AdminTrack) => void;
}

const STATUS_OPTIONS: AdminTrackStatus[] = [
  "active",
  "hidden",
  "legal_review",
  "unavailable",
  "pending_metadata",
];

const empty = (): AdminTrack => ({
  id: `trk_${Date.now()}`,
  isrc: `COLM${Math.floor(Math.random() * 100000000).toString().padStart(8, "0")}`,
  title: "",
  artist: "",
  genre: adminCatalogGenres[0],
  mood: "",
  durationSeconds: 180,
  creditsRequired: 10,
  status: "active",
  activeLicenses: 0,
  uploadedAt: new Date().toISOString().slice(0, 10),
  updatedAt: new Date().toISOString().slice(0, 10),
  recommendedUse: "",
  legalNotes: "",
  tags: [],
  hasCompleteMetadata: true,
  licensees: [],
});

export function TrackFormDialog({ open, mode, track, onOpenChange, onSubmit }: TrackFormDialogProps) {
  const t = catalogStrings.form;
  const [draft, setDraft] = useState<AdminTrack>(track ?? empty());

  useEffect(() => {
    if (open) setDraft(track ?? empty());
  }, [open, track]);

  const set = <K extends keyof AdminTrack>(k: K, v: AdminTrack[K]) =>
    setDraft((prev) => ({ ...prev, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...draft, updatedAt: new Date().toISOString().slice(0, 10) });
    toast.success(mode === "create" ? t.toastCreated : t.toastSaved);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? t.addTitle : t.editTitle}</DialogTitle>
          <DialogDescription>{t.description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="track-title">{t.fields.title}</Label>
              <Input id="track-title" value={draft.title} onChange={(e) => set("title", e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="track-artist">{t.fields.artist}</Label>
              <Input id="track-artist" value={draft.artist} onChange={(e) => set("artist", e.target.value)} required />
            </div>

            <div className="space-y-1.5">
              <Label>{t.fields.genre}</Label>
              <Select value={draft.genre} onValueChange={(v) => set("genre", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {adminCatalogGenres.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="track-mood">{t.fields.mood}</Label>
              <Input id="track-mood" value={draft.mood} onChange={(e) => set("mood", e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="track-duration">{t.fields.duration}</Label>
              <Input
                id="track-duration"
                type="number"
                min={1}
                value={draft.durationSeconds}
                onChange={(e) => set("durationSeconds", Number(e.target.value))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="track-credits">{t.fields.credits}</Label>
              <Input
                id="track-credits"
                type="number"
                min={0}
                value={draft.creditsRequired}
                onChange={(e) => set("creditsRequired", Number(e.target.value))}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label>{t.fields.status}</Label>
              <Select value={draft.status} onValueChange={(v) => set("status", v as AdminTrackStatus)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>{catalogStrings.status[s]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="track-tags">{t.fields.tags}</Label>
              <Input
                id="track-tags"
                value={draft.tags.join(", ")}
                onChange={(e) => set("tags", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="track-legal">{t.fields.legalNotes}</Label>
              <Textarea
                id="track-legal"
                rows={3}
                value={draft.legalNotes}
                onChange={(e) => set("legalNotes", e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>{t.fields.audioFile}</Label>
              <Input type="file" accept="audio/*" disabled aria-describedby="audio-hint" />
              <p id="audio-hint" className="text-xs text-muted-foreground">{t.fields.audioHint}</p>
            </div>
            <div className="space-y-1.5">
              <Label>{t.fields.coverImage}</Label>
              <Input type="file" accept="image/*" disabled />
              <p className="text-xs text-muted-foreground">{t.fields.audioHint}</p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              {t.cancel}
            </Button>
            <Button type="submit">{mode === "create" ? t.create : t.save}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
