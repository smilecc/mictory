import { ApolloError } from "@apollo/client";
import { notifications } from "@mantine/notifications";
import { i18n } from "@/i18n";

export function NoticeErrorHandler(e: ApolloError) {
  console.error(JSON.stringify(e));
  if (e.graphQLErrors) {
    notifications.show({
      color: "red",
      title: "抱歉，出错啦",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      message: i18n.t(`errors.${e.message}` as any) || "服务器响应异常",
    });
  }
}

export function sleep(time: number) {
  return new Promise<void>((r) => setTimeout(r, time));
}
