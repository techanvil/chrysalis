"use client";

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
  const epics = use(epicsPromise);

  return (
    <select>
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
