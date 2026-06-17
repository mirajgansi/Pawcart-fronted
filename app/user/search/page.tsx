// app/user/search/page.tsx

import SearchResults from "./SearchResutls";


type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function Search({ searchParams }: Props) {
  const { q } = await searchParams;
  return <SearchResults query={q ?? ""} />;
}