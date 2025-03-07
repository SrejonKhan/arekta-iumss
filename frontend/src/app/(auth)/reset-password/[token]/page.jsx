import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage({ params }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Set New Password
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Choose a strong password for your account
          </p>
        </div>
        <ResetPasswordForm token={params.token} />
      </div>
    </div>
  );
}
