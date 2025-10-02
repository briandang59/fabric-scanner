"use client";

import { Form, Button } from "antd";

import { FormInput } from "../formsComponent";
// import Link from "next/link";
import { useForm } from "react-hook-form";
// import toast from "react-hot-toast";
// import { useRouter } from "next/navigation";
import { useTranslationCustom } from "@/utils/hooks/useTranslationCustom";
import { LoginFormValues, loginSchema } from "@/utils/schemas/login";
import { yupResolver } from "@hookform/resolvers/yup";

function LoginForm() {
  //   const router = useRouter();
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

  const onSubmit = async () => {
    // await toast.promise(APIS.auth.login(data), {
    //   loading: "Đang đăng nhập...",
    //   success: (res) => {
    //     if (res.data?.token) {
    //       setAuth(res.data.token, res.data.user);
    //       router.push(paths.home);
    //     }
    //     return "Đăng nhập thành công ";
    //   },
    //   error: (err) => {
    //     return err instanceof Error
    //       ? `Lỗi: ${err.message}`
    //       : "Đăng nhập thất bại!";
    //   },
    // });
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
