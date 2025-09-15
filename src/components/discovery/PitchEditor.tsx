import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import type { Pitch } from "./PitchCard";

const STORAGE_KEY = "ares_pitches";

const schema = z
  .object({
    id: z.string().optional(),
    name: z.string().min(2, "Name is too short"),
    bio: z.string().min(10, "Bio must be at least 10 characters"),
    sample: z.string().optional(),
    tags: z.string().optional(), // comma separated
    photo: z.string().url().optional().or(z.literal("")),
    video: z.string().url().optional().or(z.literal("")),
    poster: z.string().url().optional().or(z.literal("")),
    audio: z.string().url().optional().or(z.literal("")),
  })
  .refine((d) => !!(d.photo || d.video || d.audio), {
    message: "Provide at least one media URL (photo, video, or audio)",
    path: ["photo"],
  });

type FormValues = z.infer<typeof schema>;

const loadAll = (): Pitch[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Pitch[]) : [];
  } catch {
    return [];
  }
};

const saveAll = (items: Pitch[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

const PitchEditor = () => {
  const [items, setItems] = useState<Pitch[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      bio: "",
      sample: "",
      tags: "",
      photo: "",
      video: "",
      poster: "",
      audio: "",
    },
  });

  useEffect(() => {
    setItems(loadAll());
  }, []);

  const onSubmit = (values: FormValues) => {
    const tags = (values.tags || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const pitch: Pitch = {
      id: editingId ?? Math.random().toString(36).slice(2),
      name: values.name,
      bio: values.bio,
      sample: values.sample,
      tags,
      photo: values.photo || undefined,
      video: values.video || undefined,
      poster: values.poster || undefined,
      audio: values.audio || undefined,
    };

    const existingIndex = items.findIndex((p) => p.id === pitch.id);
    let next: Pitch[];
    if (existingIndex >= 0) {
      next = [...items];
      next[existingIndex] = pitch;
      toast({ title: "Pitch updated" });
    } else {
      next = [pitch, ...items];
      toast({ title: "Pitch created" });
    }
    setItems(next);
    saveAll(next);
    setEditingId(pitch.id);
  };

  const edit = (p: Pitch) => {
    setEditingId(p.id);
    form.reset({
      id: p.id,
      name: p.name,
      bio: p.bio,
      sample: p.sample,
      tags: (p.tags || []).join(", "),
      photo: p.photo || "",
      video: p.video || "",
      poster: p.poster || "",
      audio: p.audio || "",
    });
  };

  const del = (id: string) => {
    const next = items.filter((p) => p.id !== id);
    setItems(next);
    saveAll(next);
    if (editingId === id) {
      setEditingId(null);
      form.reset({ name: "", bio: "", sample: "", tags: "", photo: "", video: "", poster: "", audio: "" });
    }
    toast({ title: "Pitch deleted" });
  };

  return (
    <Card className="bg-card/90 backdrop-blur border border-white/10">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-2">Create or edit your pitch</h2>
        <p className="text-sm text-muted-foreground mb-6">Add your pitch info, tags, and media URLs. Saved locally and used in Discovery.</p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Creator or channel name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Tech, Productivity" {...field} />
                  </FormControl>
                  <FormDescription>Comma-separated. Used for discovery search.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="Short description of what you do" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sample"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Sample blurb</FormLabel>
                  <FormControl>
                    <Textarea rows={2} placeholder="Example of your content in a sentence" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="photo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Photo URL</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="/media/your-photo.jpg or https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="video"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video URL</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="/media/your-video.mp4 or https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="poster"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video poster URL</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="Optional thumbnail for your video" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="audio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Audio URL</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="/media/your-audio.mp3 or https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="md:col-span-2 flex items-center gap-3">
              <Button type="submit">{editingId ? "Save changes" : "Create pitch"}</Button>
              {editingId && (
                <Button type="button" variant="secondary" onClick={() => { setEditingId(null); form.reset({ name: "", bio: "", sample: "", tags: "", photo: "", video: "", poster: "", audio: "" }); }}>New</Button>
              )}
            </div>
          </form>
        </Form>

        <div className="mt-8">
          <h3 className="text-sm font-medium mb-3">Your pitches</h3>
          {items.length ? (
            <ul className="divide-y divide-border">
              {items.map((p) => (
                <li key={p.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{(p.tags || []).join(", ") || "No tags"}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => edit(p)}>Edit</Button>
                    <Button size="sm" variant="secondary" onClick={() => del(p.id)}>Delete</Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No pitches yet. Create your first one above.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PitchEditor;
