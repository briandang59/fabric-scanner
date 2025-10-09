"use client";

import { Form, Button } from "antd";
import { FormInput } from "../formsComponent";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useTranslationCustom } from "@/utils/hooks/useTranslationCustom";
import { LoginFormValues, loginSchema } from "@/utils/schemas/login";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { loginAction } from "@/app/actions/auth";
import { useAuthStore } from "@/stores/useAuthStore";
import { paths } from "@/utils/constants/paths";

function LoginForm() {
  const router = useRouter();
  const { t } = useTranslationCustom();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      account: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    const formData = new FormData();
    formData.append("account", data.account);
    formData.append("password", data.password);

    const result = await loginAction({}, formData);

    if ("error" in result) {
      toast.error(result.error);
      return;
    }

    useAuthStore.getState().login(result.token, result.cardNumber);
    toast.success(t.toast.loggin_succesed);
    router.push(paths.HOME);
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
        type="primary"
        className="w-full mt-4 !text-primary"
        size="large"
        loading={false}
      >
        {t.common.login}
      </Button>
    </Form>
  );
}

export default LoginForm;
