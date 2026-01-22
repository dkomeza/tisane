"use client";
import { createPortal } from "react-dom";

import {
  AdminBlockProps,
  Block,
  COMPONENT_REGISTRY,
  ComponentType,
} from "@/components/registry";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MenuProps } from ".";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { nanoid } from "nanoid";

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import React from "react";

const VALID_CHILDREN: ComponentType[] = [
  "cms-link",
  "button",
  "imageComponent",
  "typography",
  "icon",
  "row",
  "column",
];

/**
 * This is the admin component used to edit the component's data in the CMS.
 */
export function MenuAdmin({ id, useStore }: AdminBlockProps<MenuProps>) {
  const { getBlock, moveBlock } = useStore();
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const block = getBlock(id) as Block<"menu">;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  if (!block) return null;

  const data = block.data;

  function findContainer(id: string) {
    if (["left", "center", "right"].includes(id)) {
      return id as "left" | "center" | "right";
    }

    return Object.keys(data).find((key) =>
      data[key as "left" | "center" | "right"].find(
        (item) => (item as Block).id === id,
      ),
    ) as "left" | "center" | "right" | undefined;
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    moveBlock(id, activeContainer, overContainer, activeId, overId);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    const activeId = active.id as string;
    const overId = over ? (over.id as string) : null;
    setActiveId(null);

    if (!over) return;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId!); // Safe because checked above

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer !== overContainer
    ) {
      return;
    }

    const activeIndex = data[activeContainer].findIndex(
      (item) => (item as Block).id === activeId,
    );
    const overIndex = data[overContainer].findIndex(
      (item) => (item as Block).id === overId,
    );

    if (activeIndex !== overIndex) {
      moveBlock(id, activeContainer, overContainer, activeId, overId);
    }
  }

  return (
    <Tabs defaultValue="desktop">
      <TabsList className="mb-4">
        <TabsTrigger value="desktop">Desktop</TabsTrigger>
        <TabsTrigger value="mobile">Mobile</TabsTrigger>
      </TabsList>
      <TabsContent value="desktop">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDragStart={handleDragStart}
        >
          <div className="flex flex-row justify-between bg-secondary/10 p-4 rounded-lg gap-2">
            {(["left", "center", "right"] as const).map((side) => (
              <MenuContainer
                key={side}
                id={id}
                side={side}
                data={data}
                useStore={useStore}
                activeId={activeId}
              />
            ))}
          </div>
          <Portal>
            <DragOverlay dropAnimation={null} zIndex={1000}>
              {activeId ? (
                <OverlayItem
                  activeId={activeId}
                  data={data}
                  useStore={useStore}
                />
              ) : null}
            </DragOverlay>
          </Portal>
        </DndContext>
      </TabsContent>
      <TabsContent value="mobile"></TabsContent>
    </Tabs>
  );
}

function MenuContainer({
  id,
  side,
  data,
  useStore,
  activeId,
}: {
  id: string;
  side: "left" | "center" | "right";
  data: MenuProps;
  useStore: AdminBlockProps<MenuProps>["useStore"];
  activeId: string | null;
}) {
  const { addBlock } = useStore();
  const items = data[side].map((block) => (block as Block).id);
  const isDragTarget = activeId ? items.includes(activeId) : false;

  const { setNodeRef } = useDroppable({
    id: side,
  });

  return (
    <SortableContext items={items} strategy={horizontalListSortingStrategy}>
      <div
        ref={setNodeRef}
        className={`flex flex-row items-center gap-2 min-h-[50px] p-2 rounded-md border transition-all duration-200 ${
          isDragTarget ? "border-border" : "border-transparent"
        }`}
      >
        {data[side].length > 0 && (
          <>
            {data[side].map((childBlock) => {
              const Component = COMPONENT_REGISTRY[childBlock.type]
                .AdminComponent as React.FC<
                AdminBlockProps<typeof childBlock.data>
              >;

              const childId = (childBlock as Block).id;
              return (
                <React.Fragment key={childId}>
                  <SortableMenuItem id={childId}>
                    <Component
                      id={childId}
                      data={childBlock.data}
                      useStore={useStore}
                    />
                  </SortableMenuItem>
                </React.Fragment>
              );
            })}
          </>
        )}
        <NewItemPopover
          onSelect={(type) => {
            addBlock(
              {
                type,
                id: nanoid(),
                data: COMPONENT_REGISTRY[type].Schema.parse({}),
              },
              id,
              side,
            );
          }}
        >
          <button
            type="button"
            className="px-4 py-4 border-dashed border-2 rounded-lg hover:border-muted-foreground/50 hover:bg-muted/5 transition-colors text-sm text-muted-foreground"
          >
            + Add item
          </button>
        </NewItemPopover>
      </div>
    </SortableContext>
  );
}

function NewItemPopover({
  onSelect,
  children,
}: {
  onSelect: (type: ComponentType) => void;
  children: React.ReactNode;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent align="start">
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(COMPONENT_REGISTRY).map(([key, component]) => {
            if (!VALID_CHILDREN.includes(component.id)) return null;
            return (
              <button
                key={key}
                type="button"
                className="text-left text-sm hover:bg-accent/10 rounded-md px-2 py-1"
                onClick={() => onSelect(component.id)}
              >
                <component.PreviewComponent />
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function SortableMenuItem({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="flex items-stretch rounded-md border bg-card hover:bg-accent/5 transition-colors group touch-none overflow-hidden shadow-sm"
    >
      <button
        {...listeners}
        type="button"
        className="flex w-5 shrink-0 items-center justify-center border-r bg-muted/30 hover:bg-muted/80 transition-colors cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="size-3.5 text-muted-foreground/50 group-hover:text-foreground transition-colors" />
      </button>
      <div className="flex min-w-0 items-center justify-center">{children}</div>
    </div>
  );
}
const OverlayItem = ({
  activeId,
  data,
  useStore,
}: {
  activeId: string;
  data: MenuProps;
  useStore: AdminBlockProps<MenuProps>["useStore"];
}) => {
  const findSide = () => {
    return Object.keys(data).find((key) =>
      data[key as "left" | "center" | "right"].find(
        (item) => (item as Block).id === activeId,
      ),
    ) as "left" | "center" | "right" | undefined;
  };

  const side = findSide();
  if (!side) return null;

  const block = data[side]?.find((b) => (b as Block).id === activeId);

  if (!block) return null;

  const Component = COMPONENT_REGISTRY[block.type].AdminComponent as React.FC<
    AdminBlockProps<typeof block.data>
  >;

  return (
    <div className="flex items-stretch rounded-md border bg-card shadow-md opacity-90 scale-105 overflow-hidden cursor-grabbing h-hull pointer-events-none">
      <button
        type="button"
        className="flex w-5 shrink-0 items-center justify-center border-r bg-muted transition-colors cursor-grabbing"
      >
        <GripVertical className="size-3.5 text-foreground" />
      </button>
      <div className="flex min-w-0 items-center justify-center">
        <Component id={activeId} data={block.data} useStore={useStore} />
      </div>
    </div>
  );
};

function Portal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(children, document.body);
}
