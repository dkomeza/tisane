"use client";

import { AdminBlockProps, Block } from "@/components/registry";
import { cn } from "@/lib/utils";
import { AgendaProps, AgendaItemSchemaValue } from ".";
import { useEffect, useState } from "react";
import { MediaSelector } from "@/components/registry/items/image/MediaSelector";
import { getMedia } from "@/app/actions/media/view-action";
import { Media } from "@/lib/prisma";
import Image from "next/image";
import { ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * This is the admin component used to edit the component's data in the CMS.
 */
export function AgendaAdmin({ id, useStore }: AdminBlockProps<AgendaProps>) {
  const { getBlock, updateBlock } = useStore();
  const block = getBlock(id) as Block<"agenda"> | null;

  if (!block) return null;

  const addItem = () => {
    const newItem: AgendaItemSchemaValue = {
      startTime: "08:30",
      endTime: "09:30",
      tag: "#PRELEKCJA",
      title: "New Session",
      subtitle: "Session Subtitle",
      description: "Session Description",
      speakers: [{ name: "New Speaker", role: "Speaker Role" }],
      location: "Room 101",
      type: "session",
      breakLabel: "PRZERWA",
    };
    updateBlock(id, { items: [...block.data.items, newItem] });
  };

  const removeItem = (index: number) => {
    const newItems = [...block.data.items];
    newItems.splice(index, 1);
    updateBlock(id, { items: newItems });
  };

  const updateItem = (
    index: number,
    updates: Partial<AgendaItemSchemaValue>
  ) => {
    const newItems = [...block.data.items];
    newItems[index] = { ...newItems[index], ...updates };
    updateBlock(id, { items: newItems });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <label className="text-xs font-black text-zinc-500 uppercase tracking-widest">
            Agenda Items ({block.data.items.length})
          </label>
        </div>

        <div className="space-y-3">
          {block.data.items.map((item, index) => (
            <AgendaItemAdmin
              key={index}
              item={item}
              index={index}
              onUpdate={(updates) => updateItem(index, updates)}
              onRemove={() => removeItem(index)}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={addItem}
          className="w-full py-3 border-2 border-dashed border-zinc-800 rounded-xl text-zinc-500 hover:text-brand-purple-300 hover:border-brand-purple-300/50 transition-all text-[10px] font-black uppercase tracking-widest"
        >
          + Add New Agenda Entry
        </button>
      </div>
    </div>
  );
}

function AgendaItemAdmin({
  item,
  index,
  onUpdate,
  onRemove,
}: {
  item: AgendaItemSchemaValue;
  index: number;
  onUpdate: (updates: Partial<AgendaItemSchemaValue>) => void;
  onRemove: () => void;
}) {
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item.mediaId) {
      setLoading(true);
      getMedia(item.mediaId)
        .then((media) => {
          setSelectedMedia(media);
        })
        .catch((err) => {
          console.error("Failed to fetch media", err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setSelectedMedia(null);
    }
  }, [item.mediaId]);

  const handleSelectMedia = (media: Media) => {
    onUpdate({ mediaId: media.id });
    setSelectedMedia(media);
  };

  const handleRemoveMedia = () => {
    onUpdate({ mediaId: "" });
    setSelectedMedia(null);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden group w-full">
      <div className="bg-zinc-800/50 px-4 py-2 flex justify-between items-center border-b border-zinc-800">
        <span className="text-[10px] font-black text-zinc-500 uppercase">
          Item #{index + 1} - {item.type}
        </span>
        <button
          onClick={onRemove}
          className="text-zinc-600 hover:text-red-500 transition-colors"
        >
          <span className="text-lg">&times;</span>
        </button>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-zinc-500 uppercase">
              Type
            </label>
            <select
              value={item.type}
              onChange={(e) => onUpdate({ type: e.target.value as any })}
              className="w-full bg-zinc-800 text-white border border-zinc-700 rounded-lg px-3 py-2 text-xs outline-none focus:border-brand-purple-300"
            >
              <option value="session">Session</option>
              <option value="break">Break</option>
            </select>
          </div>

          {item.type === "session" ? (
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-zinc-500 uppercase">
                Tag
              </label>
              <input
                type="text"
                value={item.tag}
                onChange={(e) => onUpdate({ tag: e.target.value })}
                className="w-full bg-zinc-800 text-white border border-zinc-700 rounded-lg px-3 py-2 text-xs outline-none focus:border-brand-purple-300"
              />
            </div>
          ) : (
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-zinc-500 uppercase">
                Label
              </label>
              <input
                type="text"
                value={item.breakLabel}
                onChange={(e) => onUpdate({ breakLabel: e.target.value })}
                className="w-full bg-zinc-800 text-white border border-zinc-700 rounded-lg px-3 py-2 text-xs outline-none focus:border-brand-purple-300"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-zinc-500 uppercase">
              Start
            </label>
            <input
              type="text"
              value={item.startTime}
              onChange={(e) => onUpdate({ startTime: e.target.value })}
              className="w-full bg-zinc-800 text-white border border-zinc-700 rounded-lg px-3 py-2 text-xs outline-none focus:border-brand-purple-300"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-zinc-500 uppercase">
              End
            </label>
            <input
              type="text"
              value={item.endTime}
              onChange={(e) => onUpdate({ endTime: e.target.value })}
              className="w-full bg-zinc-800 text-white border border-zinc-700 rounded-lg px-3 py-2 text-xs outline-none focus:border-brand-purple-300"
            />
          </div>
        </div>

        {item.type === "session" && (
          <div className="space-y-3 pt-2 border-t border-zinc-800">
            {/* Image Selection - Similar to UnderlinedCard */}
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-zinc-500 uppercase">
                Session Image
              </label>
              {item.mediaId && selectedMedia ? (
                <div className="relative group/img rounded-md overflow-hidden border border-zinc-700 max-w-[200px]">
                  <div className="aspect-video relative">
                    <Image
                      src={selectedMedia.url || ""}
                      alt="Selected image"
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover/img:opacity-100 transition-opacity">
                    <MediaSelector
                      trigger={
                        <Button
                          type="button"
                          size="icon"
                          variant="secondary"
                          className="size-6"
                        >
                          <ImageIcon className="size-3" />
                        </Button>
                      }
                      onSelect={handleSelectMedia}
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="size-6"
                      onClick={handleRemoveMedia}
                    >
                      <X className="size-3" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border border-zinc-700 border-dashed rounded-lg p-4 text-center transition-colors max-w-[200px] bg-zinc-800/30">
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-2 bg-zinc-800 rounded-full shadow-sm">
                      <ImageIcon className="w-4 h-4 text-zinc-500" />
                    </div>
                    <MediaSelector
                      trigger={
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 text-[10px] bg-zinc-900 border-zinc-700 text-zinc-400"
                        >
                          Select Image
                        </Button>
                      }
                      onSelect={handleSelectMedia}
                    />
                  </div>
                </div>
              )}
              {loading && (
                <div className="text-[9px] text-zinc-500 animate-pulse font-medium">
                  Loading image...
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-zinc-500 uppercase">
                Title
              </label>
              <input
                type="text"
                value={item.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
                className="w-full bg-zinc-800 text-white border border-zinc-700 rounded-lg px-3 py-2 text-xs outline-none focus:border-brand-purple-300"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-zinc-500 uppercase">
                Subtitle
              </label>
              <input
                type="text"
                value={item.subtitle}
                onChange={(e) => onUpdate({ subtitle: e.target.value })}
                className="w-full bg-zinc-800 text-white border border-zinc-700 rounded-lg px-3 py-2 text-xs outline-none focus:border-brand-purple-300"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-zinc-500 uppercase">
                Location
              </label>
              <input
                type="text"
                value={item.location}
                onChange={(e) => onUpdate({ location: e.target.value })}
                className="w-full bg-zinc-800 text-white border border-zinc-700 rounded-lg px-3 py-2 text-xs outline-none focus:border-brand-purple-300"
              />
            </div>
            {/* Speakers Management */}
            <div className="space-y-3 pt-4 border-t border-zinc-800">
              <div className="flex justify-between items-center">
                <label className="text-[9px] font-bold text-zinc-500 uppercase">
                  Prowadzący
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const newSpeakers = [
                      ...item.speakers,
                      { name: "", role: "" },
                    ];
                    onUpdate({ speakers: newSpeakers });
                  }}
                  className="text-[9px] font-bold text-brand-purple-300 hover:text-brand-purple-400 uppercase"
                >
                  + Dodaj prowadzącego
                </button>
              </div>

              <div className="space-y-3">
                {item.speakers.map((speaker, sIdx) => (
                  <div
                    key={sIdx}
                    className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700 space-y-2 relative group/speaker"
                  >
                    <button
                      onClick={() => {
                        const newSpeakers = [...item.speakers];
                        newSpeakers.splice(sIdx, 1);
                        onUpdate({ speakers: newSpeakers });
                      }}
                      className="absolute top-2 right-2 text-zinc-600 hover:text-red-500 opacity-0 group-hover/speaker:opacity-100 transition-opacity"
                    >
                      <X className="size-3" />
                    </button>

                    <div className="space-y-1">
                      <label className="text-[8px] font-bold text-zinc-500 uppercase">
                        Imię i Nazwisko
                      </label>
                      <input
                        type="text"
                        value={speaker.name}
                        onChange={(e) => {
                          const newSpeakers = [...item.speakers];
                          newSpeakers[sIdx] = {
                            ...newSpeakers[sIdx],
                            name: e.target.value,
                          };
                          onUpdate({ speakers: newSpeakers });
                        }}
                        className="w-full bg-zinc-900 text-white border border-zinc-700 rounded px-2 py-1 text-[11px] outline-none focus:border-brand-purple-300"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold text-zinc-500 uppercase">
                        Stanowisko (kim jest)
                      </label>
                      <input
                        type="text"
                        value={speaker.role}
                        onChange={(e) => {
                          const newSpeakers = [...item.speakers];
                          newSpeakers[sIdx] = {
                            ...newSpeakers[sIdx],
                            role: e.target.value,
                          };
                          onUpdate({ speakers: newSpeakers });
                        }}
                        className="w-full bg-zinc-900 text-white border border-zinc-700 rounded px-2 py-1 text-[11px] outline-none focus:border-brand-purple-300"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-zinc-500 uppercase">
                Description
              </label>
              <textarea
                value={item.description}
                onChange={(e) => onUpdate({ description: e.target.value })}
                rows={2}
                className="w-full bg-zinc-800 text-white border border-zinc-700 rounded-lg px-3 py-2 text-xs outline-none focus:border-brand-purple-300 resize-none"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
