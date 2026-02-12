import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import AuthButton from "@/components/AuthButton";

export default async function LoginPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl p-8">
          {/* Logo / Branding */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 mb-4">
              <svg
                className="w-8 h-8 text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Smart Bookmark
            </h1>
            <p className="text-gray-400">
              Save, organize, and sync your bookmarks in real-time
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-8">
            {[
              "Real-time sync across all your tabs",
              "Private & secure — only you see your bookmarks",
              "Clean, fast, and distraction-free",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-gray-300">
                <svg
                  className="w-5 h-5 text-green-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {feature}
              </div>
            ))}
          </div>

          {/* Auth Button */}
          <AuthButton />

          <p className="text-center text-xs text-gray-500 mt-6">
            By signing in, you agree to our Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
}
