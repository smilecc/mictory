import { AppShell, createStyles, Group, Navbar, Text } from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import { useCommonStore } from "@renderer/stores";
import { IconDashboard } from "@tabler/icons-react";
import React, { useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { SettingIndexPage } from "./setting/Index";

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef("icon");
  return {
    header: {
      paddingBottom: theme.spacing.md,
      marginBottom: theme.spacing.md * 1.5,
      borderBottom: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]}`,
    },

    footer: {
      paddingTop: theme.spacing.md,
      marginTop: theme.spacing.md,
      borderTop: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]}`,
    },

    link: {
      ...theme.fn.focusStyles(),
      display: "flex",
      alignItems: "center",
      textDecoration: "none",
      fontSize: theme.fontSizes.sm,
      color: theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.colors.gray[7],
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      fontWeight: 500,

      "&:hover": {
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
        color: theme.colorScheme === "dark" ? theme.white : theme.black,

        [`& .${icon}`]: {
          color: theme.colorScheme === "dark" ? theme.white : theme.black,
        },
      },
    },

    linkIcon: {
      ref: icon,
      color: theme.colorScheme === "dark" ? theme.colors.dark[2] : theme.colors.gray[6],
      marginRight: theme.spacing.sm,
    },

    linkActive: {
      "&, &:hover": {
        backgroundColor: theme.colorScheme === "dark" ? theme.fn.rgba(theme.colors[theme.primaryColor][8], 0.25) : theme.colors[theme.primaryColor][0],
        color: theme.colorScheme === "dark" ? theme.white : theme.colors[theme.primaryColor][7],
        [`& .${icon}`]: {
          color: theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 5 : 7],
        },
      },
    },
  };
});

const LINKS = [{ link: "/", label: "首页", icon: IconDashboard }];

export const SettingPage: React.FC = () => {
  const { classes, cx } = useStyles();
  const navigate = useNavigate();
  const [active, setActive] = useState("首页");
  const commonStore = useCommonStore();

  const links = LINKS.map((item) => (
    <a
      className={cx(classes.link, {
        [classes.linkActive]: item.label === active,
      })}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        navigate(item.link);
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} />
      <span>{item.label}</span>
    </a>
  ));

  const openLogoutModal = () =>
    openConfirmModal({
      title: "提示",
      children: <Text>是否确认要退出登录？</Text>,
      labels: { confirm: "退出登录", cancel: "取消" },
      onConfirm: () => {
        commonStore.logout();
        navigate("/user/login");
      },
    });

  return (
    <AppShell
      styles={{
        root: {
          height: "100%",
        },
        body: {
          height: "100%",
        },
        main: {
          minHeight: "auto",
          padding: "16px",
        },
      }}
      navbar={
        <Navbar width={{ sm: 240 }} p="md" style={{ position: "relative", height: "100%" }}>
          <Navbar.Section grow>
            <Group className={classes.header} position="apart">
              <div className="select-none font-bold">Settings</div>
            </Group>
            {links}
          </Navbar.Section>

          <Navbar.Section className={classes.footer}>
            <a className={`${classes.link} text-red-600`} onClick={openLogoutModal}>
              <span>退出登录</span>
            </a>
            <a
              href="#"
              className={classes.link}
              onClick={() => {
                navigate(-1);
              }}
            >
              <span>返回房间</span>
            </a>
          </Navbar.Section>
        </Navbar>
      }
    >
      <Routes>
        <Route path="/" element={<Navigate to="/setting/index" replace />} />
        <Route path="/index" element={<SettingIndexPage />} />
      </Routes>
    </AppShell>
  );
};
