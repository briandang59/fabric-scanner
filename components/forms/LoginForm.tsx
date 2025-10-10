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
import CryptoJS from "crypto-js";
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
    try {
      const secretKey = process.env.NEXT_PUBLIC_AUTH_KEY!;
      const key = CryptoJS.enc.Base64.parse(secretKey);
      const iv = CryptoJS.lib.WordArray.random(16);

      const encrypted = CryptoJS.AES.encrypt(data.password, key, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      const encryptedPassword = iv
        .concat(encrypted.ciphertext)
        .toString(CryptoJS.enc.Base64);

      const formData = new FormData();
      formData.append("account", data.account);
      formData.append("password", encryptedPassword);

      const result = await loginAction({}, formData);

      if ("error" in result) {
        toast.error(result.error);
        return;
      }

      useAuthStore.getState().login(result.token, result.cardNumber);
      toast.success(t.toast.loggin_succesed);
      router.push(paths.HOME);
    } catch (error) {
      console.error("Encryption error:", error);
    }
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
