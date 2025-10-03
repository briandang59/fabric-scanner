import * as yup from "yup";

export const customerSchema = yup.object({
  customer_name: yup.string().required("customer_name là bắt buộc"),
});

export type CustomerFormValues = yup.InferType<typeof customerSchema>;
