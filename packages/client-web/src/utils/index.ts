import { ApolloError } from "@apollo/client";
import { notifications } from "@mantine/notifications";

export function NoticeErrorHandler(e: ApolloError) {
  console.log(JSON.stringify(e));
  if (e.graphQLErrors) {
    notifications.show({
      color: "red",
      title: "抱歉，出错啦",
      message: e.message || "服务器响应异常",
    });
  }
}
