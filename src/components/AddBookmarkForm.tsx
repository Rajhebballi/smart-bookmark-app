"use client";

import { createClient } from "@/lib/supabase-browser";
import { useState, FormEvent } from "react";
import { Plus, Link, Type } from "lucide-react";

interface AddBookmarkFormProps {
  userId: string;
}

export default function AddBookmarkForm({ userId }: AddBookmarkFormProps) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const supabase = createClient();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Basic validation
    if (!title.trim() || !url.trim()) {
      setError("Both title and URL are required.");
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      setError("Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    setLoading(true);

    const { error: insertError } = await supabase.from("bookmarks").insert({
      title: title.trim(),
      url: url.trim(),
      user_id: userId,
    });

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    // Clear form on success
    setTitle("");
    setUrl("");
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900/60 backdrop-blur border border-gray-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Plus className="w-5 h-5 text-indigo-400" />
        Add New Bookmark
      </h2>

      <div className="space-y-4">
        {/* Title Input */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-1.5">
            Title
          </label>
          <div className="relative">
            <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My awesome website"
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 
                         text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                         focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* URL Input */}
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-400 mb-1.5">
            URL
          </label>
          <div className="relative">
            <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 
                         text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                         focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
            <p className="text-sm text-green-400">Bookmark added successfully!</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-4 
                     rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                     active:scale-[0.98] shadow-lg shadow-indigo-500/25"
        >
          {loading ? "Adding..." : "Add Bookmark"}
        </button>
      </div>
    </form>
  );
}
