import * as yup from "yup";

export const loginSchema = yup.object({
  account: yup.string().required("Account là bắt buộc"),
  password: yup.string().required("Mật khẩu là bắt buộc"),
});

export type LoginFormValues = yup.InferType<typeof loginSchema>;
