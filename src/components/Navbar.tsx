"use client";

import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { LogOut, Bookmark } from "lucide-react";

interface NavbarProps {
  user: User;
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const avatarUrl = user.user_metadata?.avatar_url;
  const fullName = user.user_metadata?.full_name || user.email;

  return (
    <nav className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-indigo-400" />
            <span className="text-lg font-bold text-white">
              Smart Bookmark
            </span>
          </div>

          {/* User Info & Sign Out */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3">
              {avatarUrl && (
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full border-2 border-indigo-500/50"
                  referrerPolicy="no-referrer"
                />
              )}
              <span className="text-sm text-gray-300 max-w-[200px] truncate">
                {fullName}
              </span>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white 
                         bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
