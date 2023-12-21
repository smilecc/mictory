/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { createNodeHOC, createNodesHOC, usePlaceholderState } from "@udecode/plate-common";
import type { CreateHOCOptions, PlaceholderProps, PlateRenderElementProps, Value } from "@udecode/plate-common";
import { ELEMENT_H1 } from "@udecode/plate-heading";
import { ELEMENT_PARAGRAPH } from "@udecode/plate-paragraph";

import { cn } from "@/lib/utils";

export const Placeholder = (props: PlaceholderProps) => {
  const { children, placeholder, nodeProps } = props;

  const { enabled } = usePlaceholderState(props);

  return React.Children.map(children, (child) => {
    return React.cloneElement(child, {
      className: child.props.className,
      nodeProps: {
        ...nodeProps,
        className: cn(
          enabled && "before:absolute before:cursor-text before:opacity-30 before:content-[attr(placeholder)]",
        ),
        placeholder,
      },
    });
  });
};

// eslint-disable-next-line react-refresh/only-export-components
export const withPlaceholder: (
  Component: any,
  props: PlaceholderProps,
) => (childrenProps: PlateRenderElementProps<Value>) => React.JSX.Element = createNodeHOC(Placeholder);

// eslint-disable-next-line react-refresh/only-export-components
export const withPlaceholdersPrimitive: (
  components: any,
  options: CreateHOCOptions<PlaceholderProps> | CreateHOCOptions<PlaceholderProps>[],
) => any = createNodesHOC(Placeholder);

// eslint-disable-next-line react-refresh/only-export-components
export const withPlaceholders = (components: any) =>
  withPlaceholdersPrimitive(components, [
    {
      key: ELEMENT_PARAGRAPH,
      placeholder: "发消息",
      hideOnBlur: false,
      query: {
        maxLevel: 1,
      },
    },
    {
      key: ELEMENT_H1,
      placeholder: "Untitled",
      hideOnBlur: false,
    },
  ]);
