"use client";

import { Form, Button } from "antd";

import { FormInput } from "../formsComponent";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useTranslationCustom } from "@/utils/hooks/useTranslationCustom";
import { LoginFormValues, loginSchema } from "@/utils/schemas/login";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { APIS } from "@/lib/apis";
import { LoginRequestType } from "@/types/requests/auth";
import { paths } from "@/utils/constants/paths";
import { useAuthStore } from "@/stores/useAuthStore";
function LoginForm() {
  const router = useRouter();
  const { t } = useTranslationCustom();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      account: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    const payload: LoginRequestType = {
      cardNumber: data.account.toUpperCase(),
      password: data.password,
    };
    await toast.promise(APIS.auth.login(payload), {
      loading: t.toast.loggining,
      success: (res) => {
        if (res.data?.token) {
          useAuthStore.getState().login(res.data.token, res.data.account);
          router.push(paths.HOME);
        }
        return t.toast.loggin_succesed;
      },
      error: (err) => {
        return err instanceof Error
          ? `${t.toast.err} ${err.message}`
          : t.toast.loggin_failed;
      },
    });
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
      <FormInput
        control={control}
        name="account"
        label={t.login.account}
        size="large"
        error={errors.account?.message}
      />
      <FormInput
        control={control}
        name="password"
        label={t.login.password}
        type="password"
        size="large"
        error={errors.password?.message}
      />

      <Button
        htmlType="submit"
        loading={isSubmitting}
        variant="solid"
        type="primary"
        className="w-full mt-4 !text-primary"
        size="large"
      >
        {t.common.login}
      </Button>
    </Form>
  );
}

export default LoginForm;
