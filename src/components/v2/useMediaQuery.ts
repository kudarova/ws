import { useEffect, useState } from "react";

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    const updateMatches = () => {
      const nextMatches = mediaQuery.matches;
      setMatches((currentMatches) => (
        currentMatches === nextMatches ? currentMatches : nextMatches
      ));
    };

    updateMatches();
    mediaQuery.addEventListener("change", updateMatches);

    return () => {
      mediaQuery.removeEventListener("change", updateMatches);
    };
  }, [query]);

  return matches;
}

export default useMediaQuery;
