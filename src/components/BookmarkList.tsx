"use client";

import { createClient } from "@/lib/supabase-browser";
import { useEffect, useState } from "react";
import { Trash2, ExternalLink, Clock, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Bookmark {
  id: string;
  title: string;
  url: string;
  user_id: string;
  created_at: string;
}

interface BookmarkListProps {
  userId: string;
  initialBookmarks: Bookmark[];
}

export default function BookmarkList({ userId, initialBookmarks }: BookmarkListProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    // Subscribe to realtime changes
    const channel = supabase
      .channel("bookmarks-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newBookmark = payload.new as Bookmark;
          setBookmarks((prev) => {
            // Avoid duplicates
            if (prev.some((b) => b.id === newBookmark.id)) return prev;
            return [newBookmark, ...prev];
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const deletedBookmark = payload.old as Bookmark;
          setBookmarks((prev) =>
            prev.filter((b) => b.id !== deletedBookmark.id)
          );
        }
      )
      .subscribe();

    // Cleanup on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, supabase]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);

    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id)
      .eq("user_id", userId); // Extra safety: ensure user owns it

    if (error) {
      console.error("Delete error:", error.message);
    }

    setDeletingId(null);
  };

  if (bookmarks.length === 0) {
    return (
      <div className="bg-gray-900/60 backdrop-blur border border-gray-800 rounded-xl p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
          <svg
            className="w-8 h-8 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-300 mb-1">No bookmarks yet</h3>
        <p className="text-gray-500">Add your first bookmark above to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-white flex items-center gap-2">
        Your Bookmarks
        <span className="text-sm font-normal text-gray-500">
          ({bookmarks.length})
        </span>
        <span className="ml-auto flex items-center gap-1.5 text-xs text-green-400">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Live
        </span>
      </h2>

      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          className="group bg-gray-900/60 backdrop-blur border border-gray-800 rounded-xl p-4 
                     hover:border-gray-700 transition-all duration-200"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="text-white font-medium truncate mb-1">
                {bookmark.title}
              </h3>
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 text-sm truncate 
                           flex items-center gap-1 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{bookmark.url}</span>
              </a>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500">
                <Clock className="w-3.5 h-3.5" />
                {formatDistanceToNow(new Date(bookmark.created_at), {
                  addSuffix: true,
                })}
              </div>
            </div>

            <button
              onClick={() => handleDelete(bookmark.id)}
              disabled={deletingId === bookmark.id}
              className="flex-shrink-0 p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 
                         rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100
                         disabled:opacity-50"
              title="Delete bookmark"
            >
              {deletingId === bookmark.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
