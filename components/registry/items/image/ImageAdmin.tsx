/**
 * This is the admin component used to edit the component's data in the CMS.
 */
import {
  AdminBlockProps,
  Block,
  BlockProps,
  CMSComponent,
} from "@/components/registry";
import { ImageProps } from ".";
import {
  getPresignedUploadUrl,
  registerMediaInDb,
} from "@/app/actions/media/media";
import { useState } from "react";

export function ImageAdmin({ id, useStore }: AdminBlockProps<ImageProps>) {
  return <></>;
}
