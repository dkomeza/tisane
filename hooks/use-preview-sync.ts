import { useEffect, useState } from "react";
import { DBComponent } from "@/components/registry/types";

export const PREVIEW_CHANNEL_NAME = "page-form-preview";

export type PreviewMessage = {
  type: "UPDATE_CONTENT";
  blocks: DBComponent[];
};

export function usePreviewBroadcaster(
  channelName: string = PREVIEW_CHANNEL_NAME
) {
  const [channel, setChannel] = useState<BroadcastChannel | null>(null);

  useEffect(() => {
    const bc = new BroadcastChannel(channelName);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChannel(bc);
    return () => bc.close();
  }, [channelName]);

  const broadcast = (blocks: DBComponent[], attempts = 0) => {
    if (attempts > 5) return;

    if (channel) {
      try {
        channel.postMessage({
          type: "UPDATE_CONTENT",
          blocks,
        } as PreviewMessage);
      } catch {
        setTimeout(() => {
          broadcast(blocks, attempts + 1);
        }, 100);
      }
    }
  };

  return { broadcast };
}

export function usePreviewReceiver(channelName: string = PREVIEW_CHANNEL_NAME) {
  const [blocks, setBlocks] = useState<DBComponent[] | null>(null);

  useEffect(() => {
    const bc = new BroadcastChannel(channelName);

    bc.onmessage = (event: MessageEvent<PreviewMessage>) => {
      if (event.data.type === "UPDATE_CONTENT") {
        setBlocks(event.data.blocks);
      }
    };

    return () => bc.close();
  }, [channelName]);

  return { blocks };
}
