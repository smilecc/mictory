import { useLinkToolbarButton, useLinkToolbarButtonState } from "@udecode/plate-link";

import { Icons } from "@/components/icons";

import { ToolbarButton } from "./toolbar";

export function LinkToolbarButton() {
  const state = useLinkToolbarButtonState();
  const { props } = useLinkToolbarButton(state);

  return (
    <ToolbarButton tooltip="链接" {...props}>
      <Icons.link />
    </ToolbarButton>
  );
}
