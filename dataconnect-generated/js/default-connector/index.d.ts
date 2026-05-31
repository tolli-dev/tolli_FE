import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AddBookmarkData {
  bookmark_insert: Bookmark_Key;
}

export interface AddBookmarkVariables {
  verseId: number;
}

export interface Bookmark_Key {
  userId: string;
  verseId: number;
  __typename?: 'Bookmark_Key';
}

export interface CreateStudyCompletionData {
  studyCompletion_insert: StudyCompletion_Key;
}

export interface CreateStudyCompletionVariables {
  verseId: number;
}

export interface CreateUserData {
  user_insert: User_Key;
}

export interface CreateUserVariables {
  nickname: string;
  termsAgreedAt: TimestampString;
  privacyAgreedAt: TimestampString;
  emailMarketingAgreed: boolean;
  emailMarketingAgreedAt?: TimestampString | null;
}

export interface DeleteBookmarkData {
  bookmark_delete?: Bookmark_Key | null;
}

export interface DeleteBookmarkVariables {
  verseId: number;
}

export interface DeleteUserData {
  user_delete?: User_Key | null;
}

export interface GetMeData {
  user?: {
    nickname: string;
  };
}

export interface GetMyBookmarksData {
  bookmarks: ({
    verse: {
      id: number;
      reference: string;
      fullText: string;
    } & Verse_Key;
      createdAt: TimestampString;
  })[];
}

export interface GetMyCompletionsData {
  studyCompletions: ({
    id: UUIDString;
    verse: {
      id: number;
      reference: string;
    } & Verse_Key;
      completedAt: TimestampString;
  } & StudyCompletion_Key)[];
}

export interface GetMyCurrentVerseData {
  studyCompletions: ({
    verse: {
      id: number;
    } & Verse_Key;
  })[];
}

export interface GetVerseData {
  verse?: {
    id: number;
    reference: string;
    fullText: string;
    words: unknown;
    maskedStep2: number[];
    maskedStep3: number[];
    maskedStep4: number[];
  } & Verse_Key;
}

export interface GetVerseVariables {
  id: number;
}

export interface StudyCompletion_Key {
  id: UUIDString;
  __typename?: 'StudyCompletion_Key';
}

export interface UpdateNicknameData {
  user_update?: User_Key | null;
}

export interface UpdateNicknameVariables {
  nickname: string;
}

export interface User_Key {
  id: string;
  __typename?: 'User_Key';
}

export interface Verse_Key {
  id: number;
  __typename?: 'Verse_Key';
}

interface GetVerseRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetVerseVariables): QueryRef<GetVerseData, GetVerseVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetVerseVariables): QueryRef<GetVerseData, GetVerseVariables>;
  operationName: string;
}
export const getVerseRef: GetVerseRef;

export function getVerse(vars: GetVerseVariables, options?: ExecuteQueryOptions): QueryPromise<GetVerseData, GetVerseVariables>;
export function getVerse(dc: DataConnect, vars: GetVerseVariables, options?: ExecuteQueryOptions): QueryPromise<GetVerseData, GetVerseVariables>;

interface GetMyCurrentVerseRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyCurrentVerseData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMyCurrentVerseData, undefined>;
  operationName: string;
}
export const getMyCurrentVerseRef: GetMyCurrentVerseRef;

export function getMyCurrentVerse(options?: ExecuteQueryOptions): QueryPromise<GetMyCurrentVerseData, undefined>;
export function getMyCurrentVerse(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMyCurrentVerseData, undefined>;

interface GetMyBookmarksRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyBookmarksData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMyBookmarksData, undefined>;
  operationName: string;
}
export const getMyBookmarksRef: GetMyBookmarksRef;

export function getMyBookmarks(options?: ExecuteQueryOptions): QueryPromise<GetMyBookmarksData, undefined>;
export function getMyBookmarks(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMyBookmarksData, undefined>;

interface GetMyCompletionsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyCompletionsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMyCompletionsData, undefined>;
  operationName: string;
}
export const getMyCompletionsRef: GetMyCompletionsRef;

export function getMyCompletions(options?: ExecuteQueryOptions): QueryPromise<GetMyCompletionsData, undefined>;
export function getMyCompletions(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMyCompletionsData, undefined>;

interface GetMeRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMeData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMeData, undefined>;
  operationName: string;
}
export const getMeRef: GetMeRef;

export function getMe(options?: ExecuteQueryOptions): QueryPromise<GetMeData, undefined>;
export function getMe(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMeData, undefined>;

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;
export function createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateStudyCompletionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateStudyCompletionVariables): MutationRef<CreateStudyCompletionData, CreateStudyCompletionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateStudyCompletionVariables): MutationRef<CreateStudyCompletionData, CreateStudyCompletionVariables>;
  operationName: string;
}
export const createStudyCompletionRef: CreateStudyCompletionRef;

export function createStudyCompletion(vars: CreateStudyCompletionVariables): MutationPromise<CreateStudyCompletionData, CreateStudyCompletionVariables>;
export function createStudyCompletion(dc: DataConnect, vars: CreateStudyCompletionVariables): MutationPromise<CreateStudyCompletionData, CreateStudyCompletionVariables>;

interface AddBookmarkRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddBookmarkVariables): MutationRef<AddBookmarkData, AddBookmarkVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddBookmarkVariables): MutationRef<AddBookmarkData, AddBookmarkVariables>;
  operationName: string;
}
export const addBookmarkRef: AddBookmarkRef;

export function addBookmark(vars: AddBookmarkVariables): MutationPromise<AddBookmarkData, AddBookmarkVariables>;
export function addBookmark(dc: DataConnect, vars: AddBookmarkVariables): MutationPromise<AddBookmarkData, AddBookmarkVariables>;

interface DeleteBookmarkRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteBookmarkVariables): MutationRef<DeleteBookmarkData, DeleteBookmarkVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteBookmarkVariables): MutationRef<DeleteBookmarkData, DeleteBookmarkVariables>;
  operationName: string;
}
export const deleteBookmarkRef: DeleteBookmarkRef;

export function deleteBookmark(vars: DeleteBookmarkVariables): MutationPromise<DeleteBookmarkData, DeleteBookmarkVariables>;
export function deleteBookmark(dc: DataConnect, vars: DeleteBookmarkVariables): MutationPromise<DeleteBookmarkData, DeleteBookmarkVariables>;

interface UpdateNicknameRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateNicknameVariables): MutationRef<UpdateNicknameData, UpdateNicknameVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateNicknameVariables): MutationRef<UpdateNicknameData, UpdateNicknameVariables>;
  operationName: string;
}
export const updateNicknameRef: UpdateNicknameRef;

export function updateNickname(vars: UpdateNicknameVariables): MutationPromise<UpdateNicknameData, UpdateNicknameVariables>;
export function updateNickname(dc: DataConnect, vars: UpdateNicknameVariables): MutationPromise<UpdateNicknameData, UpdateNicknameVariables>;

interface DeleteUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<DeleteUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<DeleteUserData, undefined>;
  operationName: string;
}
export const deleteUserRef: DeleteUserRef;

export function deleteUser(): MutationPromise<DeleteUserData, undefined>;
export function deleteUser(dc: DataConnect): MutationPromise<DeleteUserData, undefined>;

