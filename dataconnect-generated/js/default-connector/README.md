# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `default`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetVerse*](#getverse)
  - [*GetMyCurrentVerse*](#getmycurrentverse)
  - [*GetMyBookmarks*](#getmybookmarks)
  - [*GetMyCompletions*](#getmycompletions)
  - [*GetTodayCompletionCount*](#gettodaycompletioncount)
  - [*GetMe*](#getme)
- [**Mutations**](#mutations)
  - [*CreateUser*](#createuser)
  - [*CreateStudyCompletion*](#createstudycompletion)
  - [*AddBookmark*](#addbookmark)
  - [*DeleteBookmark*](#deletebookmark)
  - [*UpdateNickname*](#updatenickname)
  - [*DeleteUser*](#deleteuser)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `default`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@firebasegen/default-connector` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@firebasegen/default-connector';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@firebasegen/default-connector';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `default` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetVerse
You can execute the `GetVerse` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```typescript
getVerse(vars: GetVerseVariables, options?: ExecuteQueryOptions): QueryPromise<GetVerseData, GetVerseVariables>;

interface GetVerseRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetVerseVariables): QueryRef<GetVerseData, GetVerseVariables>;
}
export const getVerseRef: GetVerseRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getVerse(dc: DataConnect, vars: GetVerseVariables, options?: ExecuteQueryOptions): QueryPromise<GetVerseData, GetVerseVariables>;

interface GetVerseRef {
  ...
  (dc: DataConnect, vars: GetVerseVariables): QueryRef<GetVerseData, GetVerseVariables>;
}
export const getVerseRef: GetVerseRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getVerseRef:
```typescript
const name = getVerseRef.operationName;
console.log(name);
```

### Variables
The `GetVerse` query requires an argument of type `GetVerseVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetVerseVariables {
  id: number;
}
```
### Return Type
Recall that executing the `GetVerse` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetVerseData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetVerse`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getVerse, GetVerseVariables } from '@firebasegen/default-connector';

// The `GetVerse` query requires an argument of type `GetVerseVariables`:
const getVerseVars: GetVerseVariables = {
  id: ..., 
};

// Call the `getVerse()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getVerse(getVerseVars);
// Variables can be defined inline as well.
const { data } = await getVerse({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getVerse(dataConnect, getVerseVars);

console.log(data.verse);

// Or, you can use the `Promise` API.
getVerse(getVerseVars).then((response) => {
  const data = response.data;
  console.log(data.verse);
});
```

### Using `GetVerse`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getVerseRef, GetVerseVariables } from '@firebasegen/default-connector';

// The `GetVerse` query requires an argument of type `GetVerseVariables`:
const getVerseVars: GetVerseVariables = {
  id: ..., 
};

// Call the `getVerseRef()` function to get a reference to the query.
const ref = getVerseRef(getVerseVars);
// Variables can be defined inline as well.
const ref = getVerseRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getVerseRef(dataConnect, getVerseVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.verse);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.verse);
});
```

## GetMyCurrentVerse
You can execute the `GetMyCurrentVerse` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```typescript
getMyCurrentVerse(vars?: GetMyCurrentVerseVariables, options?: ExecuteQueryOptions): QueryPromise<GetMyCurrentVerseData, GetMyCurrentVerseVariables>;

interface GetMyCurrentVerseRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: GetMyCurrentVerseVariables): QueryRef<GetMyCurrentVerseData, GetMyCurrentVerseVariables>;
}
export const getMyCurrentVerseRef: GetMyCurrentVerseRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMyCurrentVerse(dc: DataConnect, vars?: GetMyCurrentVerseVariables, options?: ExecuteQueryOptions): QueryPromise<GetMyCurrentVerseData, GetMyCurrentVerseVariables>;

interface GetMyCurrentVerseRef {
  ...
  (dc: DataConnect, vars?: GetMyCurrentVerseVariables): QueryRef<GetMyCurrentVerseData, GetMyCurrentVerseVariables>;
}
export const getMyCurrentVerseRef: GetMyCurrentVerseRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMyCurrentVerseRef:
```typescript
const name = getMyCurrentVerseRef.operationName;
console.log(name);
```

### Variables
The `GetMyCurrentVerse` query has an optional argument of type `GetMyCurrentVerseVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetMyCurrentVerseVariables {
  today?: TimestampString | null;
}
```
### Return Type
Recall that executing the `GetMyCurrentVerse` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMyCurrentVerseData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetMyCurrentVerseData {
  todayCompletion: ({
    verse: {
      id: number;
      reference: string;
      fullText: string;
    } & Verse_Key;
  })[];
    lastCompletion: ({
      verse: {
        id: number;
      } & Verse_Key;
    })[];
}
```
### Using `GetMyCurrentVerse`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMyCurrentVerse, GetMyCurrentVerseVariables } from '@firebasegen/default-connector';

// The `GetMyCurrentVerse` query has an optional argument of type `GetMyCurrentVerseVariables`:
const getMyCurrentVerseVars: GetMyCurrentVerseVariables = {
  today: ..., // optional
};

// Call the `getMyCurrentVerse()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMyCurrentVerse(getMyCurrentVerseVars);
// Variables can be defined inline as well.
const { data } = await getMyCurrentVerse({ today: ..., });
// Since all variables are optional for this query, you can omit the `GetMyCurrentVerseVariables` argument.
const { data } = await getMyCurrentVerse();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMyCurrentVerse(dataConnect, getMyCurrentVerseVars);

console.log(data.todayCompletion);
console.log(data.lastCompletion);

// Or, you can use the `Promise` API.
getMyCurrentVerse(getMyCurrentVerseVars).then((response) => {
  const data = response.data;
  console.log(data.todayCompletion);
  console.log(data.lastCompletion);
});
```

### Using `GetMyCurrentVerse`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMyCurrentVerseRef, GetMyCurrentVerseVariables } from '@firebasegen/default-connector';

// The `GetMyCurrentVerse` query has an optional argument of type `GetMyCurrentVerseVariables`:
const getMyCurrentVerseVars: GetMyCurrentVerseVariables = {
  today: ..., // optional
};

// Call the `getMyCurrentVerseRef()` function to get a reference to the query.
const ref = getMyCurrentVerseRef(getMyCurrentVerseVars);
// Variables can be defined inline as well.
const ref = getMyCurrentVerseRef({ today: ..., });
// Since all variables are optional for this query, you can omit the `GetMyCurrentVerseVariables` argument.
const ref = getMyCurrentVerseRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMyCurrentVerseRef(dataConnect, getMyCurrentVerseVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.todayCompletion);
console.log(data.lastCompletion);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.todayCompletion);
  console.log(data.lastCompletion);
});
```

## GetMyBookmarks
You can execute the `GetMyBookmarks` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```typescript
getMyBookmarks(options?: ExecuteQueryOptions): QueryPromise<GetMyBookmarksData, undefined>;

interface GetMyBookmarksRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyBookmarksData, undefined>;
}
export const getMyBookmarksRef: GetMyBookmarksRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMyBookmarks(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMyBookmarksData, undefined>;

interface GetMyBookmarksRef {
  ...
  (dc: DataConnect): QueryRef<GetMyBookmarksData, undefined>;
}
export const getMyBookmarksRef: GetMyBookmarksRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMyBookmarksRef:
```typescript
const name = getMyBookmarksRef.operationName;
console.log(name);
```

### Variables
The `GetMyBookmarks` query has no variables.
### Return Type
Recall that executing the `GetMyBookmarks` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMyBookmarksData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetMyBookmarks`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMyBookmarks } from '@firebasegen/default-connector';


// Call the `getMyBookmarks()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMyBookmarks();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMyBookmarks(dataConnect);

console.log(data.bookmarks);

// Or, you can use the `Promise` API.
getMyBookmarks().then((response) => {
  const data = response.data;
  console.log(data.bookmarks);
});
```

### Using `GetMyBookmarks`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMyBookmarksRef } from '@firebasegen/default-connector';


// Call the `getMyBookmarksRef()` function to get a reference to the query.
const ref = getMyBookmarksRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMyBookmarksRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.bookmarks);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.bookmarks);
});
```

## GetMyCompletions
You can execute the `GetMyCompletions` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```typescript
getMyCompletions(options?: ExecuteQueryOptions): QueryPromise<GetMyCompletionsData, undefined>;

interface GetMyCompletionsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyCompletionsData, undefined>;
}
export const getMyCompletionsRef: GetMyCompletionsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMyCompletions(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMyCompletionsData, undefined>;

interface GetMyCompletionsRef {
  ...
  (dc: DataConnect): QueryRef<GetMyCompletionsData, undefined>;
}
export const getMyCompletionsRef: GetMyCompletionsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMyCompletionsRef:
```typescript
const name = getMyCompletionsRef.operationName;
console.log(name);
```

### Variables
The `GetMyCompletions` query has no variables.
### Return Type
Recall that executing the `GetMyCompletions` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMyCompletionsData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetMyCompletions`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMyCompletions } from '@firebasegen/default-connector';


// Call the `getMyCompletions()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMyCompletions();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMyCompletions(dataConnect);

console.log(data.studyCompletions);

// Or, you can use the `Promise` API.
getMyCompletions().then((response) => {
  const data = response.data;
  console.log(data.studyCompletions);
});
```

### Using `GetMyCompletions`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMyCompletionsRef } from '@firebasegen/default-connector';


// Call the `getMyCompletionsRef()` function to get a reference to the query.
const ref = getMyCompletionsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMyCompletionsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.studyCompletions);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.studyCompletions);
});
```

## GetTodayCompletionCount
You can execute the `GetTodayCompletionCount` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```typescript
getTodayCompletionCount(vars: GetTodayCompletionCountVariables, options?: ExecuteQueryOptions): QueryPromise<GetTodayCompletionCountData, GetTodayCompletionCountVariables>;

interface GetTodayCompletionCountRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetTodayCompletionCountVariables): QueryRef<GetTodayCompletionCountData, GetTodayCompletionCountVariables>;
}
export const getTodayCompletionCountRef: GetTodayCompletionCountRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getTodayCompletionCount(dc: DataConnect, vars: GetTodayCompletionCountVariables, options?: ExecuteQueryOptions): QueryPromise<GetTodayCompletionCountData, GetTodayCompletionCountVariables>;

interface GetTodayCompletionCountRef {
  ...
  (dc: DataConnect, vars: GetTodayCompletionCountVariables): QueryRef<GetTodayCompletionCountData, GetTodayCompletionCountVariables>;
}
export const getTodayCompletionCountRef: GetTodayCompletionCountRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getTodayCompletionCountRef:
```typescript
const name = getTodayCompletionCountRef.operationName;
console.log(name);
```

### Variables
The `GetTodayCompletionCount` query requires an argument of type `GetTodayCompletionCountVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetTodayCompletionCountVariables {
  today: TimestampString;
}
```
### Return Type
Recall that executing the `GetTodayCompletionCount` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetTodayCompletionCountData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetTodayCompletionCountData {
  studyCompletions: ({
    id: UUIDString;
  } & StudyCompletion_Key)[];
}
```
### Using `GetTodayCompletionCount`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getTodayCompletionCount, GetTodayCompletionCountVariables } from '@firebasegen/default-connector';

// The `GetTodayCompletionCount` query requires an argument of type `GetTodayCompletionCountVariables`:
const getTodayCompletionCountVars: GetTodayCompletionCountVariables = {
  today: ..., 
};

// Call the `getTodayCompletionCount()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getTodayCompletionCount(getTodayCompletionCountVars);
// Variables can be defined inline as well.
const { data } = await getTodayCompletionCount({ today: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getTodayCompletionCount(dataConnect, getTodayCompletionCountVars);

console.log(data.studyCompletions);

// Or, you can use the `Promise` API.
getTodayCompletionCount(getTodayCompletionCountVars).then((response) => {
  const data = response.data;
  console.log(data.studyCompletions);
});
```

### Using `GetTodayCompletionCount`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getTodayCompletionCountRef, GetTodayCompletionCountVariables } from '@firebasegen/default-connector';

// The `GetTodayCompletionCount` query requires an argument of type `GetTodayCompletionCountVariables`:
const getTodayCompletionCountVars: GetTodayCompletionCountVariables = {
  today: ..., 
};

// Call the `getTodayCompletionCountRef()` function to get a reference to the query.
const ref = getTodayCompletionCountRef(getTodayCompletionCountVars);
// Variables can be defined inline as well.
const ref = getTodayCompletionCountRef({ today: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getTodayCompletionCountRef(dataConnect, getTodayCompletionCountVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.studyCompletions);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.studyCompletions);
});
```

## GetMe
You can execute the `GetMe` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```typescript
getMe(options?: ExecuteQueryOptions): QueryPromise<GetMeData, undefined>;

interface GetMeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMeData, undefined>;
}
export const getMeRef: GetMeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMe(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMeData, undefined>;

interface GetMeRef {
  ...
  (dc: DataConnect): QueryRef<GetMeData, undefined>;
}
export const getMeRef: GetMeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMeRef:
```typescript
const name = getMeRef.operationName;
console.log(name);
```

### Variables
The `GetMe` query has no variables.
### Return Type
Recall that executing the `GetMe` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMeData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetMeData {
  user?: {
    nickname: string;
  };
}
```
### Using `GetMe`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMe } from '@firebasegen/default-connector';


// Call the `getMe()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMe();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMe(dataConnect);

console.log(data.user);

// Or, you can use the `Promise` API.
getMe().then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetMe`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMeRef } from '@firebasegen/default-connector';


// Call the `getMeRef()` function to get a reference to the query.
const ref = getMeRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMeRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `default` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateUser
You can execute the `CreateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```typescript
createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createUserRef:
```typescript
const name = createUserRef.operationName;
console.log(name);
```

### Variables
The `CreateUser` mutation requires an argument of type `CreateUserVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateUserVariables {
  nickname: string;
  termsAgreedAt: TimestampString;
  privacyAgreedAt: TimestampString;
  emailMarketingAgreed: boolean;
  emailMarketingAgreedAt?: TimestampString | null;
}
```
### Return Type
Recall that executing the `CreateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateUserData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateUserData {
  user_insert: User_Key;
}
```
### Using `CreateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createUser, CreateUserVariables } from '@firebasegen/default-connector';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  nickname: ..., 
  termsAgreedAt: ..., 
  privacyAgreedAt: ..., 
  emailMarketingAgreed: ..., 
  emailMarketingAgreedAt: ..., // optional
};

// Call the `createUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createUser(createUserVars);
// Variables can be defined inline as well.
const { data } = await createUser({ nickname: ..., termsAgreedAt: ..., privacyAgreedAt: ..., emailMarketingAgreed: ..., emailMarketingAgreedAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createUser(dataConnect, createUserVars);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
createUser(createUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

### Using `CreateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createUserRef, CreateUserVariables } from '@firebasegen/default-connector';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  nickname: ..., 
  termsAgreedAt: ..., 
  privacyAgreedAt: ..., 
  emailMarketingAgreed: ..., 
  emailMarketingAgreedAt: ..., // optional
};

// Call the `createUserRef()` function to get a reference to the mutation.
const ref = createUserRef(createUserVars);
// Variables can be defined inline as well.
const ref = createUserRef({ nickname: ..., termsAgreedAt: ..., privacyAgreedAt: ..., emailMarketingAgreed: ..., emailMarketingAgreedAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createUserRef(dataConnect, createUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

## CreateStudyCompletion
You can execute the `CreateStudyCompletion` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```typescript
createStudyCompletion(vars: CreateStudyCompletionVariables): MutationPromise<CreateStudyCompletionData, CreateStudyCompletionVariables>;

interface CreateStudyCompletionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateStudyCompletionVariables): MutationRef<CreateStudyCompletionData, CreateStudyCompletionVariables>;
}
export const createStudyCompletionRef: CreateStudyCompletionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createStudyCompletion(dc: DataConnect, vars: CreateStudyCompletionVariables): MutationPromise<CreateStudyCompletionData, CreateStudyCompletionVariables>;

interface CreateStudyCompletionRef {
  ...
  (dc: DataConnect, vars: CreateStudyCompletionVariables): MutationRef<CreateStudyCompletionData, CreateStudyCompletionVariables>;
}
export const createStudyCompletionRef: CreateStudyCompletionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createStudyCompletionRef:
```typescript
const name = createStudyCompletionRef.operationName;
console.log(name);
```

### Variables
The `CreateStudyCompletion` mutation requires an argument of type `CreateStudyCompletionVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateStudyCompletionVariables {
  verseId: number;
}
```
### Return Type
Recall that executing the `CreateStudyCompletion` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateStudyCompletionData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateStudyCompletionData {
  studyCompletion_insert: StudyCompletion_Key;
}
```
### Using `CreateStudyCompletion`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createStudyCompletion, CreateStudyCompletionVariables } from '@firebasegen/default-connector';

// The `CreateStudyCompletion` mutation requires an argument of type `CreateStudyCompletionVariables`:
const createStudyCompletionVars: CreateStudyCompletionVariables = {
  verseId: ..., 
};

// Call the `createStudyCompletion()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createStudyCompletion(createStudyCompletionVars);
// Variables can be defined inline as well.
const { data } = await createStudyCompletion({ verseId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createStudyCompletion(dataConnect, createStudyCompletionVars);

console.log(data.studyCompletion_insert);

// Or, you can use the `Promise` API.
createStudyCompletion(createStudyCompletionVars).then((response) => {
  const data = response.data;
  console.log(data.studyCompletion_insert);
});
```

### Using `CreateStudyCompletion`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createStudyCompletionRef, CreateStudyCompletionVariables } from '@firebasegen/default-connector';

// The `CreateStudyCompletion` mutation requires an argument of type `CreateStudyCompletionVariables`:
const createStudyCompletionVars: CreateStudyCompletionVariables = {
  verseId: ..., 
};

// Call the `createStudyCompletionRef()` function to get a reference to the mutation.
const ref = createStudyCompletionRef(createStudyCompletionVars);
// Variables can be defined inline as well.
const ref = createStudyCompletionRef({ verseId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createStudyCompletionRef(dataConnect, createStudyCompletionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.studyCompletion_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.studyCompletion_insert);
});
```

## AddBookmark
You can execute the `AddBookmark` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```typescript
addBookmark(vars: AddBookmarkVariables): MutationPromise<AddBookmarkData, AddBookmarkVariables>;

interface AddBookmarkRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddBookmarkVariables): MutationRef<AddBookmarkData, AddBookmarkVariables>;
}
export const addBookmarkRef: AddBookmarkRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addBookmark(dc: DataConnect, vars: AddBookmarkVariables): MutationPromise<AddBookmarkData, AddBookmarkVariables>;

interface AddBookmarkRef {
  ...
  (dc: DataConnect, vars: AddBookmarkVariables): MutationRef<AddBookmarkData, AddBookmarkVariables>;
}
export const addBookmarkRef: AddBookmarkRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addBookmarkRef:
```typescript
const name = addBookmarkRef.operationName;
console.log(name);
```

### Variables
The `AddBookmark` mutation requires an argument of type `AddBookmarkVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddBookmarkVariables {
  verseId: number;
}
```
### Return Type
Recall that executing the `AddBookmark` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddBookmarkData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddBookmarkData {
  bookmark_insert: Bookmark_Key;
}
```
### Using `AddBookmark`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addBookmark, AddBookmarkVariables } from '@firebasegen/default-connector';

// The `AddBookmark` mutation requires an argument of type `AddBookmarkVariables`:
const addBookmarkVars: AddBookmarkVariables = {
  verseId: ..., 
};

// Call the `addBookmark()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addBookmark(addBookmarkVars);
// Variables can be defined inline as well.
const { data } = await addBookmark({ verseId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addBookmark(dataConnect, addBookmarkVars);

console.log(data.bookmark_insert);

// Or, you can use the `Promise` API.
addBookmark(addBookmarkVars).then((response) => {
  const data = response.data;
  console.log(data.bookmark_insert);
});
```

### Using `AddBookmark`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addBookmarkRef, AddBookmarkVariables } from '@firebasegen/default-connector';

// The `AddBookmark` mutation requires an argument of type `AddBookmarkVariables`:
const addBookmarkVars: AddBookmarkVariables = {
  verseId: ..., 
};

// Call the `addBookmarkRef()` function to get a reference to the mutation.
const ref = addBookmarkRef(addBookmarkVars);
// Variables can be defined inline as well.
const ref = addBookmarkRef({ verseId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addBookmarkRef(dataConnect, addBookmarkVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.bookmark_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.bookmark_insert);
});
```

## DeleteBookmark
You can execute the `DeleteBookmark` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```typescript
deleteBookmark(vars: DeleteBookmarkVariables): MutationPromise<DeleteBookmarkData, DeleteBookmarkVariables>;

interface DeleteBookmarkRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteBookmarkVariables): MutationRef<DeleteBookmarkData, DeleteBookmarkVariables>;
}
export const deleteBookmarkRef: DeleteBookmarkRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteBookmark(dc: DataConnect, vars: DeleteBookmarkVariables): MutationPromise<DeleteBookmarkData, DeleteBookmarkVariables>;

interface DeleteBookmarkRef {
  ...
  (dc: DataConnect, vars: DeleteBookmarkVariables): MutationRef<DeleteBookmarkData, DeleteBookmarkVariables>;
}
export const deleteBookmarkRef: DeleteBookmarkRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteBookmarkRef:
```typescript
const name = deleteBookmarkRef.operationName;
console.log(name);
```

### Variables
The `DeleteBookmark` mutation requires an argument of type `DeleteBookmarkVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteBookmarkVariables {
  verseId: number;
}
```
### Return Type
Recall that executing the `DeleteBookmark` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteBookmarkData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteBookmarkData {
  bookmark_delete?: Bookmark_Key | null;
}
```
### Using `DeleteBookmark`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteBookmark, DeleteBookmarkVariables } from '@firebasegen/default-connector';

// The `DeleteBookmark` mutation requires an argument of type `DeleteBookmarkVariables`:
const deleteBookmarkVars: DeleteBookmarkVariables = {
  verseId: ..., 
};

// Call the `deleteBookmark()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteBookmark(deleteBookmarkVars);
// Variables can be defined inline as well.
const { data } = await deleteBookmark({ verseId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteBookmark(dataConnect, deleteBookmarkVars);

console.log(data.bookmark_delete);

// Or, you can use the `Promise` API.
deleteBookmark(deleteBookmarkVars).then((response) => {
  const data = response.data;
  console.log(data.bookmark_delete);
});
```

### Using `DeleteBookmark`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteBookmarkRef, DeleteBookmarkVariables } from '@firebasegen/default-connector';

// The `DeleteBookmark` mutation requires an argument of type `DeleteBookmarkVariables`:
const deleteBookmarkVars: DeleteBookmarkVariables = {
  verseId: ..., 
};

// Call the `deleteBookmarkRef()` function to get a reference to the mutation.
const ref = deleteBookmarkRef(deleteBookmarkVars);
// Variables can be defined inline as well.
const ref = deleteBookmarkRef({ verseId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteBookmarkRef(dataConnect, deleteBookmarkVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.bookmark_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.bookmark_delete);
});
```

## UpdateNickname
You can execute the `UpdateNickname` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```typescript
updateNickname(vars: UpdateNicknameVariables): MutationPromise<UpdateNicknameData, UpdateNicknameVariables>;

interface UpdateNicknameRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateNicknameVariables): MutationRef<UpdateNicknameData, UpdateNicknameVariables>;
}
export const updateNicknameRef: UpdateNicknameRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateNickname(dc: DataConnect, vars: UpdateNicknameVariables): MutationPromise<UpdateNicknameData, UpdateNicknameVariables>;

interface UpdateNicknameRef {
  ...
  (dc: DataConnect, vars: UpdateNicknameVariables): MutationRef<UpdateNicknameData, UpdateNicknameVariables>;
}
export const updateNicknameRef: UpdateNicknameRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateNicknameRef:
```typescript
const name = updateNicknameRef.operationName;
console.log(name);
```

### Variables
The `UpdateNickname` mutation requires an argument of type `UpdateNicknameVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateNicknameVariables {
  nickname: string;
}
```
### Return Type
Recall that executing the `UpdateNickname` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateNicknameData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateNicknameData {
  user_update?: User_Key | null;
}
```
### Using `UpdateNickname`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateNickname, UpdateNicknameVariables } from '@firebasegen/default-connector';

// The `UpdateNickname` mutation requires an argument of type `UpdateNicknameVariables`:
const updateNicknameVars: UpdateNicknameVariables = {
  nickname: ..., 
};

// Call the `updateNickname()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateNickname(updateNicknameVars);
// Variables can be defined inline as well.
const { data } = await updateNickname({ nickname: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateNickname(dataConnect, updateNicknameVars);

console.log(data.user_update);

// Or, you can use the `Promise` API.
updateNickname(updateNicknameVars).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

### Using `UpdateNickname`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateNicknameRef, UpdateNicknameVariables } from '@firebasegen/default-connector';

// The `UpdateNickname` mutation requires an argument of type `UpdateNicknameVariables`:
const updateNicknameVars: UpdateNicknameVariables = {
  nickname: ..., 
};

// Call the `updateNicknameRef()` function to get a reference to the mutation.
const ref = updateNicknameRef(updateNicknameVars);
// Variables can be defined inline as well.
const ref = updateNicknameRef({ nickname: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateNicknameRef(dataConnect, updateNicknameVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

## DeleteUser
You can execute the `DeleteUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```typescript
deleteUser(): MutationPromise<DeleteUserData, undefined>;

interface DeleteUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<DeleteUserData, undefined>;
}
export const deleteUserRef: DeleteUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteUser(dc: DataConnect): MutationPromise<DeleteUserData, undefined>;

interface DeleteUserRef {
  ...
  (dc: DataConnect): MutationRef<DeleteUserData, undefined>;
}
export const deleteUserRef: DeleteUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteUserRef:
```typescript
const name = deleteUserRef.operationName;
console.log(name);
```

### Variables
The `DeleteUser` mutation has no variables.
### Return Type
Recall that executing the `DeleteUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteUserData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteUserData {
  user_delete?: User_Key | null;
}
```
### Using `DeleteUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteUser } from '@firebasegen/default-connector';


// Call the `deleteUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteUser(dataConnect);

console.log(data.user_delete);

// Or, you can use the `Promise` API.
deleteUser().then((response) => {
  const data = response.data;
  console.log(data.user_delete);
});
```

### Using `DeleteUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteUserRef } from '@firebasegen/default-connector';


// Call the `deleteUserRef()` function to get a reference to the mutation.
const ref = deleteUserRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteUserRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_delete);
});
```

