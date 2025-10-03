"use client";

import { Form, Button } from "antd";

import { FormInput } from "../formsComponent";
import { useForm } from "react-hook-form";
import { useTranslationCustom } from "@/utils/hooks/useTranslationCustom";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { APIS } from "@/lib/apis";
import { CustomerFormValues, customerSchema } from "@/utils/schemas/customer";

interface CustomerFormProps {
  refetch: () => void;
}
function CustomerForm({ refetch }: CustomerFormProps) {
  const { t } = useTranslationCustom();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormValues>({
    resolver: yupResolver(customerSchema),
    defaultValues: {
      customer_name: "",
    },
  });

  const onSubmit = async (data: CustomerFormValues) => {
    await toast.promise(APIS.customer.create(data), {
      loading: t.toast.loading,
      success: () => {
        refetch();
        return t.toast.successed;
      },
      error: (err) => {
        return err instanceof Error
          ? `${t.toast.err} ${err.message}`
          : t.toast.failed;
      },
    });
  };
  //
  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
      <FormInput
        control={control}
        name="customer_name"
        label={t.fabric_scan.cus_name}
        size="large"
        error={errors.customer_name?.message}
      />

      <Button
        htmlType="submit"
        loading={isSubmitting}
        variant="solid"
        type="primary"
        className="w-full mt-4 !text-primary"
        size="large"
      >
        {t.fabric_scan.save}
      </Button>
    </Form>
  );
}

export default CustomerForm;
