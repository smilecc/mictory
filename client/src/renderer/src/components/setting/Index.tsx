import { Avatar, Group, SimpleGrid, UnstyledButton, Text, Menu } from "@mantine/core";
import { useCommonStore } from "@renderer/stores";
import { IconTrash } from "@tabler/icons-react";
import { Observer } from "mobx-react-lite";
import React from "react";

export const SettingServer: React.FC = () => {
  const commonStore = useCommonStore();
  return (
    <div>
      <Observer>
        {() => (
          <SimpleGrid cols={2}>
            {commonStore.connectServers.map((server) => (
              <Menu shadow="md" width={200} key={server.host}>
                <Menu.Target>
                  <UnstyledButton className="rounded-lg bg-zinc-800/60 p-3 transition-all hover:bg-zinc-700">
                    <Group>
                      <Avatar size={40} color="blue">
                        {server.nickname?.[0]}
                      </Avatar>
                      <div>
                        <Text>{server.nickname}</Text>
                        <Text size="xs" color="dimmed">
                          {server.host}
                        </Text>
                      </div>
                    </Group>
                  </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>管理</Menu.Label>
                  <Menu.Item
                    color="red"
                    icon={<IconTrash size={14} />}
                    onClick={() => {
                      commonStore.removeConnectServer(server);
                    }}
                  >
                    删除服务器
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ))}
          </SimpleGrid>
        )}
      </Observer>
    </div>
  );
};
