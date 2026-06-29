import { useReducer, useEffect } from "react";
import { getMyBookmarks } from "@firebasegen/default-connector";
import { dataConnect } from "@/lib/dataconnect";

export interface BookMarks {
  verse: {
    id: number;
    reference: string;
    fullText: string;
  };
  createdAt: string;
}

type Data = {
  bookmarks: BookMarks[];
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

const initialState: State = { status: "loading" };

export function useBookmark() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchData = async () => {
    dispatch({ status: "loading" });

    try {
      const { data } = await getMyBookmarks(dataConnect, {
        fetchPolicy: "SERVER_ONLY",
      });
      dispatch({ status: "success", data: { bookmarks: data.bookmarks } });
    } catch {
      dispatch({ status: "error" });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleError = () => {
    dispatch({ status: "loading" });
    fetchData();
  };

  return { componentState: state, onError: handleError, onDelete: fetchData };
}
