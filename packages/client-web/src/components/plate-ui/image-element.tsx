import { PlateElement, PlateElementProps, Value } from "@udecode/plate-common";
import { ELEMENT_IMAGE, Image, TImageElement, useMediaState } from "@udecode/plate-media";

import { cn } from "@/lib/utils";

import { MediaPopover } from "./media-popover";

function ImageElement({ className, children, nodeProps, ...props }: PlateElementProps<Value, TImageElement>) {
  const { focused, selected } = useMediaState();

  return (
    <MediaPopover pluginKey={ELEMENT_IMAGE}>
      <PlateElement className={cn("py-2.5", className)} {...props}>
        <figure className="group relative m-0" contentEditable={false}>
          <Image
            className={cn(
              "block max-h-[300px] w-full max-w-full cursor-pointer object-cover px-0",
              "rounded-sm",
              focused && selected && "ring-2 ring-ring ring-offset-2",
            )}
            alt=""
            {...nodeProps}
          />
        </figure>

        {children}
      </PlateElement>
    </MediaPopover>
  );
}

ImageElement.displayName = "ImageElement";

export { ImageElement };
