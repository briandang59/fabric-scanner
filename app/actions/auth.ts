"use server";

import { cookies } from "next/headers";
import { fetchServer } from "@/lib/fetcher.server";
import { BaseResponse } from "@/types/responses/base";
import { LoginResponseType } from "@/types/responses/auth";
import { LoginRequestType } from "@/types/requests/auth";
import { urls } from "@/utils/constants/urls";

type LoginActionReturn =
  | { error: string }
  | { success: true; token: string; cardNumber: string };

export async function loginAction(
  _prevState: unknown,
  formData: FormData
): Promise<LoginActionReturn> {
  const account = formData.get("account") as string;
  const password = formData.get("password") as string;

  console.log("Login attempt:", {
    account: account.toUpperCase(),
    hasPassword: !!password,
  });

  if (!account || !password) {
    return { error: "Vui lòng nhập đầy đủ thông tin." };
  }

  const payload: LoginRequestType = {
    cardNumber: account.toUpperCase(),
    password,
  };
  console.log("payload", payload);

  console.log("Calling fetchServer to:", `/${urls.ACCOUNT}/${urls.LOGIN}`);

  let response: BaseResponse<LoginResponseType>;

  try {
    response = await fetchServer<BaseResponse<LoginResponseType>>(
      `/${urls.ACCOUNT}/${urls.LOGIN}`,
      {
        method: "POST",
        body: JSON.stringify(payload),
        requireAuth: false,
      }
    );

    console.log("API Response:", response);
  } catch (error) {
    console.error("Fetch error details:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }
    return { error: "Có lỗi xảy ra khi gọi API. Vui lòng thử lại." };
  }

  if (!response.data?.token) {
    return { error: "Đăng nhập thất bại. Vui lòng thử lại." };
  }

  const cookieStore = await cookies();
  cookieStore.set("token", response.data.token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
  });
  const cardNumber = response.data.account || account.toUpperCase();
  if (!response.data.account) {
    console.log("Fallback cardNumber to input:", cardNumber);
  }
  cookieStore.set("card_number", cardNumber, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
  });

  console.log("Cookies set successfully, returning data to client...");

  return {
    success: true,
    token: response.data.token,
    cardNumber,
  };
}
