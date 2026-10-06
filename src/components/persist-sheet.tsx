"use client";

import { createContext, useContext } from "react";

const PersistSheetContext = createContext<string | null>(null);

export function PersistSheetProvider({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  return (
    <PersistSheetContext.Provider value={slug}>
      {children}
    </PersistSheetContext.Provider>
  );
}

export function usePersistSheetSlug() {
  return useContext(PersistSheetContext);
}

export function persistStorageKey(slug: string, field: string) {
  return `bdc-printable:${slug}:${field}`;
}
