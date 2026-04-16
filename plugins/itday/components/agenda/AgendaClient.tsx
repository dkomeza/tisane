"use client";

import { useState } from "react";

import { IconComponent } from "@/components/registry/items/icon";
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
    <section className="w-full py-10 px-4 md:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto text-brand-purple-300">
        <div className="border-b border-brand-purple-300 mb-6 text-right text-2xl">
          Agenda
        </div>

        {/* Toggle Switch */}
        <div className="flex justify-start mb-12">
          <div className="inline-flex p-1 rounded-md border border-brand-purple-200">
            <button
              type="button"
              onClick={() => setLayout("standard")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-sm transition-all text-sm font-semibold uppercase tracking-wider",
                layout === "standard"
                  ? "bg-brand-purple-400 text-brand-grey-100 shadow-sm"
                  : "bg-transparent text-brand-purple-400 hover:bg-brand-purple-100"
              )}
            >
              <IconComponent name="cards" size={16} />
              <span>Standard</span>
            </button>
            <button
              type="button"
              onClick={() => setLayout("list")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-sm transition-all text-sm font-semibold uppercase tracking-wider",
                layout === "list"
                  ? "bg-brand-purple-400 text-brand-grey-100 shadow-sm"
                  : "bg-transparent text-brand-purple-400 hover:bg-brand-purple-100"
              )}
            >
              <IconComponent name="listAlt" size={16} />
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
                type="button"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className={cn(
                  "p-4 transition-colors",
                  currentIndex === 0
                    ? "bg-brand-grey-200 text-brand-grey-300"
                    : "bg-brand-grey-200 text-brand-grey-400 hover:bg-brand-grey-300"
                )}
              >
                <IconComponent name="chevronLeft" size={24} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={currentIndex >= maxIndex}
                className={cn(
                  "p-4 transition-colors",
                  currentIndex >= maxIndex
                    ? "bg-brand-purple-100 text-brand-purple-200"
                    : "bg-brand-purple-300 text-white hover:bg-brand-purple-400"
                )}
              >
                <IconComponent name="chevronRight" size={24} />
              </button>
            </div>
          </div>
        ) : (
          <div className="">
            {data.items.map((item, index) => (
              <div key={index}>
                {item.type === "break" ? (
                  <div className="w-full border border-brand-grey-500py-3 text-center transition-colors">
                    <span className="text-xs font-black text-brand-grey-500 uppercase">
                      {item.breakLabel}
                    </span>
                  </div>
                ) : (
                  <div className="grid grid-cols-[100px_1.5fr_1fr_1fr_1.5fr] gap-x-12 py-10 transition-all duration-300 px-4 -mx-4">
                    {/* time and line with dots */}
                    <div className="flex flex-col items-start relative pl-6">
                      <span className="text-[14px] text-brand-grey-300 leading-none mb-auto">
                        {item.startTime}
                      </span>
                      <span className="text-[14px] text-brand-grey-300 leading-none mt-auto">
                        {item.endTime}
                      </span>

                      <div className="absolute right-1 top-1 bottom-1 w-[1.5px] bg-brand-grey-200">
                        <div className="absolute -top-1 -left-[2.5px] size-1.5 rounded-full bg-brand-grey-300"></div>
                        <div className="absolute -bottom-1 -left-[2.5px] size-1.5 rounded-full bg-brand-grey-300"></div>
                      </div>
                    </div>

                    {/* Title & Sub */}
                    <div>
                      <h3 className="text-[26px] text-brand-grey-100 mb-1 leading-tight group-hover:text-brand-purple-300 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-[14px] text-brand-grey-400">
                        {item.subtitle}
                      </p>
                    </div>

                    {/* Speakers */}
                    <div className="flex flex-col gap-2">
                      <div className="text-[14px] text-brand-grey-100 tracking-[0.2em] font-medium">
                        Prowadzący
                      </div>
                      {item.speakers.map((s, i) => (
                        <div key={i}>
                          <p className="text-brand-grey-400 font-medium mb-2">
                            {s.name}
                          </p>
                          <p className="text-brand-grey-400 font-light">
                            {s.role}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Location */}
                    <div>
                      <div className="text-[14px] text-brand-grey-100 mb-2 font-medium">
                        Miejsce
                      </div>
                      <p className="text-[14px] font-light text-brand-grey-400">
                        {item.location}
                      </p>
                    </div>

                    {/* Description & Tag */}
                    <div className="flex flex-col text-[14px] gap-2">
                      <span className="text-right text-brand-purple-100 uppercase font-medium">
                        {item.tag}
                      </span>
                      <p className=" text-brand-grey-400 leading-relaxed italic">
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
