"use client";

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useBookmark } from "../../_hooks/useBookmark";
import BookmarkHeader from "./BookmarkHeader";
import BookmarkEmpty from "./BookmarkEmpty";
import BookmarkList from "./BookmarkList";
import FetchError from "../../_components/FetchError";

export default function Bookmark({ nickname }: { nickname: string }) {
  const { componentState, onError, onDelete } = useBookmark();
  const data =
    componentState.status === "success" ? componentState.data.bookmarks : [];

  return (
    <div className="flex flex-1 flex-col items-center w-full min-h-0">
      <BookmarkHeader nickname={nickname} />

      {componentState.status === "success" &&
        (data.length === 0 ? (
          <BookmarkEmpty />
        ) : (
          <BookmarkList data={data} onDelete={onDelete} />
        ))}

      {componentState.status === "error" && <FetchError onError={onError} />}
      {componentState.status === "loading" && <LoadingSpinner />}
    </div>
  );
}
