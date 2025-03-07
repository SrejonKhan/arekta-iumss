import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Reset Password
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Enter your email to receive password reset instructions
          </p>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
