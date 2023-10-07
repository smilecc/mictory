import { Switch, SwitchProps, rem, useMantineTheme } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import React from "react";

export const IconSwtich: React.FC<SwitchProps> = (props) => {
  const theme = useMantineTheme();

  return (
    <Switch
      color="teal"
      size="md"
      thumbIcon={
        props.checked ? (
          <IconCheck style={{ width: rem(12), height: rem(12) }} color={theme.colors.teal[6]} stroke={3} />
        ) : (
          <IconX style={{ width: rem(12), height: rem(12) }} color={theme.colors.red[6]} stroke={3} />
        )
      }
      {...props}
    />
  );
};
