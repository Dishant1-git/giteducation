"use client";

import { FormEvent, useEffect, useState } from "react";

type Comment = {
  id: string;
  authorName: string;
  isStaff: boolean;
  body: string;
  createdAt: string;
  replies: Comment[];
};

function CommentThread({ comment }: { comment: Comment }) {
  return (
    <li className="rounded-card border border-border-subtle bg-surface-raised p-5">
      <p className="text-sm font-semibold">
        {comment.authorName}
        {comment.isStaff && <span className="ml-2 rounded-full bg-action/10 px-2 py-0.5 text-[10px] text-action">GIT Education</span>}
      </p>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-content-muted">{comment.body}</p>
      {comment.replies.length > 0 && (
        <ul className="mt-4 space-y-3 border-l-2 border-border-subtle pl-4">
          {comment.replies.map((reply) => <CommentThread key={reply.id} comment={reply} />)}
        </ul>
      )}
    </li>
  );
}

export function BlogComments({ slug }: { slug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadedSlug, setLoadedSlug] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [sending, setSending] = useState(false);

  const loading = loadedSlug !== slug;

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/blogs/${encodeURIComponent(slug)}/comments`, { signal: controller.signal })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Could not load comments.");
        return data.items ?? [];
      })
      .then((items: Comment[]) => {
        if (controller.signal.aborted) return;
        setComments(items);
        setError("");
        setLoadedSlug(slug);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Could not load comments.");
        setLoadedSlug(slug);
      });
    return () => controller.abort();
  }, [slug]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setSending(true);
    setNotice("");
    setError("");
    try {
      const response = await fetch(`/api/blogs/${encodeURIComponent(slug)}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName: data.get("authorName"),
          authorEmail: data.get("authorEmail"),
          body: data.get("body"),
          website: data.get("website"),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Could not submit your comment.");
      form.reset();
      setNotice("Thanks — your comment has been sent for review and will appear after approval.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit your comment.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section aria-labelledby="comments-title" className="mt-16 border-t border-border-subtle pt-10">
      <h2 id="comments-title" className="font-display text-2xl font-bold tracking-tight">Comments</h2>
      <p className="mt-2 text-sm text-content-muted">Comments are reviewed before they appear.</p>

      {loading ? (
        <p className="mt-6 text-sm text-content-muted">Loading comments…</p>
      ) : error ? (
        <p role="alert" className="mt-6 text-sm text-red-700">{error}</p>
      ) : comments.length > 0 ? (
        <ul className="mt-6 space-y-4">{comments.map((comment) => <CommentThread key={comment.id} comment={comment} />)}</ul>
      ) : (
        <p className="mt-6 text-sm text-content-muted">No comments yet. Be the first to share your thoughts.</p>
      )}

      <form onSubmit={submit} className="mt-8 grid gap-4 rounded-panel border border-border-subtle bg-surface-sunken p-5 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm font-medium">
          Your name
          <input name="authorName" required minLength={2} maxLength={80} autoComplete="name" className="h-11 rounded-control border border-border-strong bg-surface-raised px-3 outline-none focus:border-action" />
        </label>
        <label className="grid gap-1.5 text-sm font-medium">
          Email <span className="font-normal text-content-muted">(optional; never published)</span>
          <input name="authorEmail" type="email" maxLength={254} autoComplete="email" className="h-11 rounded-control border border-border-strong bg-surface-raised px-3 outline-none focus:border-action" />
        </label>
        <label className="grid gap-1.5 text-sm font-medium sm:col-span-2">
          Comment
          <textarea name="body" required minLength={2} maxLength={4000} rows={4} className="rounded-control border border-border-strong bg-surface-raised p-3 outline-none focus:border-action" />
        </label>
        <label aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          Leave this field blank
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
        <div className="sm:col-span-2">
          <button type="submit" disabled={sending} className="inline-flex h-11 items-center justify-center rounded-full bg-action px-6 text-sm font-semibold text-white transition-colors hover:bg-action-hover disabled:cursor-wait disabled:opacity-60">
            {sending ? "Sending…" : "Post comment"}
          </button>
          {notice && <p role="status" className="mt-3 text-sm text-emerald-700">{notice}</p>}
          {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
        </div>
      </form>
    </section>
  );
}
