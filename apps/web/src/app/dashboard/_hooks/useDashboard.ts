import { useReducer, useEffect } from "react";
import { getMe, getMyCurrentVerse } from "@firebasegen/default-connector";
import { onAuthStateChanged } from "firebase/auth";
import { QueryFetchPolicy } from "firebase/data-connect";
import { fireAuth } from "@/firebase/fireAuth";
import { dataConnect } from "@/lib/dataconnect";
import { getLocalMidnight } from "@/lib/date";
import { TodayVerse } from "../page";

export type Data = {
  nickname: string;
  todayVerse: TodayVerse;
  done: boolean;
};

type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "success"; data: Data };

type Action = State;

function reducer(_: State, action: Action): State {
  switch (action.status) {
    case "loading":
      return { status: "loading" };
    case "error":
      return { status: "error" };
    case "success":
      return { status: "success", data: action.data };
  }
}

export function useDashboard(initialData?: Data) {
  const [state, dispatch] = useReducer(
    reducer,
    initialData
      ? { status: "success" as const, data: initialData }
      : { status: "loading" as const },
  );

  const fetchData = () => {
    dispatch({ status: "loading" });

    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const today = getLocalMidnight(tz);

    Promise.all([
      getMe(dataConnect, { fetchPolicy: QueryFetchPolicy.SERVER_ONLY }),
      getMyCurrentVerse(dataConnect, { today: today.toISOString() }, {
        fetchPolicy: QueryFetchPolicy.SERVER_ONLY,
      }),
    ])
      .then(([meResult, verseResult]) => {
        const verse = verseResult.data.todayCompletion[0]?.verse ?? null;
        dispatch({
          status: "success",
          data: {
            nickname: meResult.data.user?.nickname ?? "",
            todayVerse: verse,
            done: verse !== null,
          },
        });
      })
      .catch(() => {
        dispatch({ status: "error" });
      });
  };

  useEffect(() => {
    if (initialData) return;
    if (fireAuth.currentUser) {
      fetchData();
      return;
    }
    const unsubscribe = onAuthStateChanged(fireAuth, (user) => {
      if (!user) return;
      fetchData();
    });
    return () => unsubscribe();
  }, []);

  const handleError = () => {
    dispatch({ status: "loading" });
    fetchData();
  };

  return { state, onError: handleError };
}
