import ResetPasswordForm from "./ResetPasswordForm";

export default async function ResetPasswordPage({ searchParams }) {
  const params = await searchParams;
  const token = Array.isArray(params?.token) ? params.token[0] : params?.token || "";

  return <ResetPasswordForm token={token} />;
}
