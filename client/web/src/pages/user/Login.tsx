import { gql } from "@/@generated";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation } from "@apollo/client";
import React from "react";
import { useForm } from "react-hook-form";

const USER_LOGIN = gql(`mutation userLogin($args: UserSessionCreateInput!) {
  userSessionCreate(args: $args) {
    userId
    sessionToken
  }
}`);

export const LoginPage: React.FC = () => {
  const form = useForm();

  const [mutationUserLogin] = useMutation(USER_LOGIN);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-80 rounded-sm bg-card shadow-lg md:w-[30rem]">
        <div className="p-4">
          <h1 className="mb-6 text-2xl font-extrabold">登录到 Mictory</h1>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => {
                console.log(data);
                mutationUserLogin({
                  variables: {
                    args: {
                      account: data.account,
                      password: data.password,
                    },
                  },
                });
              })}
            >
              <FormField
                control={form.control}
                name="account"
                render={({ field }) => (
                  <FormItem className="mb-2">
                    <FormLabel>账户</FormLabel>
                    <FormControl>
                      <Input placeholder="用户名" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>密码</FormLabel>
                    <FormControl>
                      <Input placeholder="密码" type="password" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="mt-8">
                <Button type="submit" className="w-full">
                  登录
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};
