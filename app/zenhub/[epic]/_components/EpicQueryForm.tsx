"use client";

import { useParams } from "next/navigation";

export function EpicQueryForm({
  submitEpicQuery,
}: {
  submitEpicQuery: (formData: FormData) => Promise<void>;
}) {
  const { epic } = useParams<{ epic: string }>(); // `epic` is the epic issue number.

  return (
    <section>
      <form action={submitEpicQuery}>
        <input type="hidden" name="epic" value={epic} />
        <textarea name="query"></textarea>
        <button type="submit">Send</button>
      </form>
    </section>
  );
}
