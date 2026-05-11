import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { PostType, SocialPlatformF06 } from "@/api/types";
import { trackingStrings } from "@/modules/monitoring/tracking/strings";
import {
  detectFromUrl,
  isSupportedPlatformUrl,
} from "@/modules/monitoring/tracking/utils/platformDetection";

const POST_TYPES: PostType[] = [
  "reel",
  "feed-post",
  "story",
  "tiktok-video",
  "facebook-post",
];

const schema = z.object({
  externalUrl: z
    .string()
    .url({ message: "invalid-url" })
    .refine(isSupportedPlatformUrl, { message: "invalid-domain" }),
  platform: z.enum(["instagram", "tiktok", "facebook"]),
  postType: z.enum(["reel", "feed-post", "story", "tiktok-video", "facebook-post"]),
  publishedAt: z.string().min(1),
});

export type ManualLinkFormValues = z.infer<typeof schema>;

interface ManualLinkFormProps {
  defaultValues?: Partial<ManualLinkFormValues>;
  onValidated: (values: ManualLinkFormValues) => void;
  onCancel: () => void;
}

export function ManualLinkForm({
  defaultValues,
  onValidated,
  onCancel,
}: ManualLinkFormProps) {
  const t = trackingStrings.manualLink;
  const form = useForm<ManualLinkFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      externalUrl: defaultValues?.externalUrl ?? "",
      platform: defaultValues?.platform ?? "instagram",
      postType: defaultValues?.postType ?? "reel",
      publishedAt:
        defaultValues?.publishedAt ?? new Date().toISOString().slice(0, 16),
    },
  });

  const url = form.watch("externalUrl");
  const [autoFilled, setAutoFilled] = useState(false);

  useEffect(() => {
    if (autoFilled || !url) return;
    const id = setTimeout(() => {
      const det = detectFromUrl(url);
      if (det.platform) form.setValue("platform", det.platform);
      if (det.postType) form.setValue("postType", det.postType);
      if (det.platform || det.postType) setAutoFilled(true);
    }, 300);
    return () => clearTimeout(id);
  }, [url, autoFilled, form]);

  const onSubmit = (vals: ManualLinkFormValues) => {
    const iso = new Date(vals.publishedAt).toISOString();
    onValidated({ ...vals, publishedAt: iso });
  };

  const urlError = form.formState.errors.externalUrl?.message;
  const urlErrorText =
    urlError === "invalid-url"
      ? t.fields.url.invalidUrl
      : urlError === "invalid-domain"
        ? t.fields.url.invalidDomain
        : null;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="ml-url">{t.fields.url.label}</Label>
        <Input
          id="ml-url"
          type="url"
          placeholder={t.fields.url.placeholder}
          {...form.register("externalUrl")}
        />
        {urlErrorText ? (
          <p className="text-xs text-destructive">{urlErrorText}</p>
        ) : (
          <p className="text-xs text-muted-foreground">{t.fields.url.help}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label>{t.fields.platform.label}</Label>
        <RadioGroup
          value={form.watch("platform")}
          onValueChange={(v) => form.setValue("platform", v as SocialPlatformF06)}
          className="flex gap-4"
        >
          {(["instagram", "tiktok", "facebook"] as SocialPlatformF06[]).map((p) => (
            <label key={p} className="flex cursor-pointer items-center gap-2 text-sm">
              <RadioGroupItem value={p} />
              {t.platformLabels[p]}
            </label>
          ))}
        </RadioGroup>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="ml-type">{t.fields.postType.label}</Label>
          <Select
            value={form.watch("postType")}
            onValueChange={(v) => form.setValue("postType", v as PostType)}
          >
            <SelectTrigger id="ml-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {POST_TYPES.map((pt) => (
                <SelectItem key={pt} value={pt}>
                  {t.postTypeLabels[pt]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="ml-date">{t.fields.publishedAt.label}</Label>
          <Input id="ml-date" type="datetime-local" {...form.register("publishedAt")} />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          {t.cancelBtn}
        </Button>
        <Button type="submit">{t.validateBtn}</Button>
      </div>
    </form>
  );
}
