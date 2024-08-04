"use client";

import { useParams } from "next/navigation";
import { useFormStatus } from "react-dom";

export function EpicQueryForm({
  submitEpicQuery,
}: {
  submitEpicQuery: (epic: string, formData: FormData) => Promise<void>;
}) {
  const { epic } = useParams<{ epic: string }>(); // `epic` is the epic issue number.

  const submitQueryForEpic = submitEpicQuery.bind(null, epic);

  return (
    <section>
      <form action={submitQueryForEpic}>
        <input type="hidden" name="epic" value={epic} />
        <textarea name="query"></textarea>
        <SubmitButton>Send</SubmitButton>
      </form>
    </section>
  );
}

function SubmitButton({ children }: { children: React.ReactNode }) {
  const {
    pending,
    // data, method, action
  } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {children}
    </button>
  );
}
