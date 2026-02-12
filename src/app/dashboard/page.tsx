import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import Navbar from "@/components/Navbar";
import AddBookmarkForm from "@/components/AddBookmarkForm";
import BookmarkList from "@/components/BookmarkList";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch bookmarks server-side for initial render
  const { data: bookmarks, error } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching bookmarks:", error.message);
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar user={user} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Add Bookmark Form */}
          <AddBookmarkForm userId={user.id} />

          {/* Bookmark List with Realtime */}
          <BookmarkList
            userId={user.id}
            initialBookmarks={bookmarks ?? []}
          />
        </div>
      </main>
    </div>
  );
}
