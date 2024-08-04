"use client";

import { useRouter } from "next/navigation";
import { use, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export function EpicSelect({ epicsPromise }) {
  return (
    <ErrorBoundary fallback={<p>⚠️ something went wrong</p>}>
      <Suspense fallback={<span>⏳ fetching epics...</span>}>
        <EpicSelectMain epicsPromise={epicsPromise} />
      </Suspense>
    </ErrorBoundary>
  );
}

function EpicSelectMain({ epicsPromise }) {
  const router = useRouter();
  const epics = use(epicsPromise);

  return (
    <select
      onChange={(event) => {
        router.push(`/zenhub/${event.target.value}`);
      }}
    >
      <option value="">choose an epic</option>
      {epics
        .sort((a, b) => {
          if (a.title < b.title) return -1;
          if (a.title > b.title) return 1;
          return 0;
        })
        .map(({ number, title }) => (
          <option key={number} value={number}>
            {title}
          </option>
        ))}
    </select>
  );
}
