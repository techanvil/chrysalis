"use client";

import { use, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useParams, useRouter } from "next/navigation";
import { getAllEpics } from "../_data/graph-data";

type EpicsPromise = ReturnType<typeof getAllEpics>;

export function EpicSelect({ epicsPromise }: { epicsPromise: EpicsPromise }) {
  return (
    <ErrorBoundary fallback={<p>⚠️ something went wrong</p>}>
      <Suspense fallback={<span>⏳ fetching epics...</span>}>
        <EpicSelectMain epicsPromise={epicsPromise} />
      </Suspense>
    </ErrorBoundary>
  );
}

function EpicSelectMain({ epicsPromise }: { epicsPromise: EpicsPromise }) {
  const { epic } = useParams<{ epic: string }>(); // `epic` is the epic issue number.

  const router = useRouter();
  const epics = use(epicsPromise);

  return (
    <select
      value={epic || ""}
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
