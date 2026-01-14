"use client";

import { useState } from "react";
import {
  LayoutGrid,
  List as ListIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BlockProps } from "@/components/registry";
import { AgendaProps } from ".";
import { ImageClient } from "@/components/registry/items/image/ImageClient";

/**
 * This is the client-side component that will be rendered in the application.
 */
export function AgendaClient({ data }: BlockProps<AgendaProps>) {
  const [layout, setLayout] = useState<"standard" | "list">(
    data.layout || "standard"
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;
  const sessions = data.items.filter((item) => item.type === "session");
  const maxIndex = Math.max(0, sessions.length - itemsPerPage);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  return (
    <section className="w-full py-20 px-4 md:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Toggle Switch */}
        <div className="flex justify-start mb-12">
          <div className="inline-flex p-1 rounded-md border border-brand-purple-200">
            <button
              onClick={() => setLayout("standard")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-sm transition-all text-sm font-semibold uppercase tracking-wider",
                layout === "standard"
                  ? "bg-brand-purple-400 text-brand-grey-100 shadow-sm"
                  : "bg-transparent text-brand-purple-400 hover:bg-brand-purple-100"
              )}
            >
              <LayoutGrid size={16} />
              <span>Standard</span>
            </button>
            <button
              onClick={() => setLayout("list")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-sm transition-all text-sm font-semibold uppercase tracking-wider",
                layout === "list"
                  ? "bg-brand-purple-400 text-brand-grey-100 shadow-sm"
                  : "bg-transparent text-brand-purple-400 hover:bg-brand-purple-100"
              )}
            >
              <ListIcon size={16} />
              <span>Lista</span>
            </button>
          </div>
        </div>

        {layout === "standard" ? (
          <div className="relative">
            <div className="overflow-visible relative">
              <div
                className="flex transition-transform duration-500 ease-in-out gap-12"
                style={{
                  transform: `translateX(calc(-${currentIndex * (100 / itemsPerPage)}% - ${currentIndex * (48 / itemsPerPage)}px))`,
                }}
              >
                {sessions.map((item, index) => (
                  <div
                    key={index}
                    className="shrink-0 w-[calc((100%-96px)/3)] flex flex-col group"
                  >
                    {/* Time*/}
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-3 w-full font-medium whitespace-nowrap">
                        <span className="text-[26px] text-brand-grey-100 tracking-tight leading-none">
                          {item.startTime}
                        </span>
                        <div className="h-px w-full min-w-[30px] bg-brand-grey-100 relative">
                          <div className="absolute -left-[3px] -top-[2.5px] size-1.5 rounded-full bg-brand-grey-300"></div>
                          <div className="absolute -right-[3px] -top-[2.5px] size-1.5 rounded-full bg-brand-grey-300"></div>
                        </div>
                        <span className="text-[16px] text-brand-grey-300 leading-none">
                          {item.endTime}
                        </span>
                      </div>
                    </div>

                    {/* Tag */}
                    <div className="flex justify-end mb-4">
                      <span className="text-brand-purple-100 uppercase text-[12px] ">
                        {item.tag}
                      </span>
                    </div>

                    {/* Title and Subtitle */}
                    <p className="text-[26px] font-bold text-brand-grey-100 mb-2 leading-tight group-hover:text-brand-purple-300 transition-colors">
                      {item.title}
                    </p>
                    <p className="text-brand-grey-300 mb-11 text-[14px">
                      {item.subtitle}
                    </p>

                    {/* Image */}
                    <div className="w-full overflow-hidden mb-8 group-hover:shadow-xl transition-shadow duration-500">
                      {item.mediaId ? (
                        <div className="w-full scale-100 group-hover:scale-105 transition-transform duration-700">
                          <ImageClient
                            id={item.mediaId}
                            data={{ mediaId: item.mediaId }}
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-brand-grey-300 italic">
                          Insert Session Image
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-[14px] text-brand-grey-400 mb-4 italic">
                      {item.description}
                    </p>

                    {/* Location */}
                    <p className="text-[14px] font-bold text-brand-grey-300 mb-11">
                      {item.location}
                    </p>

                    {/* Speakers */}
                    <div className="flex justify-between text-[14px">
                      <div className="font-black text-brand-grey-100 uppercase mb-4">
                        PROWADZĄCY
                      </div>
                      <div className="space-y-4">
                        {item.speakers.map((speaker, sIdx) => (
                          <div key={sIdx} className="flex flex-col items-start">
                            <span className="text-brand-grey-100 tracking-tight">
                              {speaker.name}
                            </span>
                            <span className=" text-brand-grey-400">
                              {speaker.role}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Standard Nav */}
            <div className="flex justify-end gap-1 mt-12">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className={cn(
                  "p-4 transition-colors",
                  currentIndex === 0
                    ? "bg-brand-grey-200 text-brand-grey-300"
                    : "bg-brand-grey-200 text-brand-grey-400 hover:bg-brand-grey-300"
                )}
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex >= maxIndex}
                className={cn(
                  "p-4 transition-colors",
                  currentIndex >= maxIndex
                    ? "bg-brand-purple-100 text-brand-purple-200"
                    : "bg-brand-purple-300 text-white hover:bg-brand-purple-400"
                )}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-0 border-b border-brand-grey-300">
            {data.items.map((item, index) => (
              <div key={index}>
                {item.type === "break" ? (
                  <div className="w-full border-x border-t border-brand-grey-300 bg-brand-grey-200/40 py-3 text-center transition-colors hover:bg-brand-grey-200/60">
                    <span className="text-[10px] font-black text-brand-grey-500 tracking-[0.4em] uppercase">
                      {item.breakLabel}
                    </span>
                  </div>
                ) : (
                  <div className="grid grid-cols-[100px_1.5fr_1fr_1fr_1.5fr] gap-x-12 py-10 border-t border-brand-grey-300 group hover:bg-white transition-all duration-300 px-4 -mx-4">
                    {/* Time Column with vertical line and dots */}
                    <div className="flex flex-col items-start relative pl-6">
                      {/* Vertical Line with Dots */}
                      <div className="absolute left-1 top-1 bottom-1 w-[1.5px] bg-brand-grey-200">
                        <div className="absolute -top-1 -left-[2.5px] size-[6px] rounded-full bg-brand-grey-300"></div>
                        <div className="absolute -bottom-1 -left-[2.5px] size-[6px] rounded-full bg-brand-grey-300"></div>
                      </div>

                      <span className="text-sm font-bold text-brand-grey-400 leading-none mb-auto">
                        {item.startTime}
                      </span>
                      <span className="text-sm font-bold text-brand-grey-300 leading-none mt-auto">
                        {item.endTime}
                      </span>
                    </div>

                    {/* Title & Sub */}
                    <div>
                      <h3 className="text-4xl font-bold text-brand-grey-600 mb-2 leading-tight group-hover:text-brand-purple-300 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-brand-grey-400 font-medium">
                        {item.subtitle}
                      </p>
                    </div>

                    {/* Speakers */}
                    <div>
                      <div className="text-[9px] font-black text-brand-grey-300 uppercase tracking-[0.2em] mb-4">
                        Prowadzący
                      </div>
                      <div className="space-y-4">
                        {item.speakers.map((s, i) => (
                          <div key={i}>
                            <p className="text-xs font-bold text-brand-grey-500 uppercase">
                              {s.name}
                            </p>
                            <p className="text-[10px] text-brand-grey-400 font-medium italic">
                              {s.role}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <div className="text-[9px] font-black text-brand-grey-300 uppercase tracking-[0.2em] mb-4">
                        Miejsce
                      </div>
                      <p className="text-xs font-bold text-brand-grey-500">
                        {item.location}
                      </p>
                    </div>

                    {/* Description & Tag */}
                    <div className="relative flex flex-col pt-6">
                      <span className="absolute top-0 right-0 text-brand-purple-200 uppercase text-[10px] font-black tracking-[0.3em]">
                        {item.tag}
                      </span>
                      <p className="text-[13px] text-brand-grey-500 leading-relaxed italic">
                        {item.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
