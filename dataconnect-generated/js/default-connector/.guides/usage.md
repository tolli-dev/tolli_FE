# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createUser, createStudyCompletion, addBookmark, deleteBookmark, updateNickname, deleteUser, getVerse, getMyCurrentVerse, getMyBookmarks, getMyCompletions } from '@firebasegen/default-connector';


// Operation CreateUser:  For variables, look at type CreateUserVars in ../index.d.ts
const { data } = await CreateUser(dataConnect, createUserVars);

// Operation CreateStudyCompletion:  For variables, look at type CreateStudyCompletionVars in ../index.d.ts
const { data } = await CreateStudyCompletion(dataConnect, createStudyCompletionVars);

// Operation AddBookmark:  For variables, look at type AddBookmarkVars in ../index.d.ts
const { data } = await AddBookmark(dataConnect, addBookmarkVars);

// Operation DeleteBookmark:  For variables, look at type DeleteBookmarkVars in ../index.d.ts
const { data } = await DeleteBookmark(dataConnect, deleteBookmarkVars);

// Operation UpdateNickname:  For variables, look at type UpdateNicknameVars in ../index.d.ts
const { data } = await UpdateNickname(dataConnect, updateNicknameVars);

// Operation DeleteUser: 
const { data } = await DeleteUser(dataConnect);

// Operation GetVerse:  For variables, look at type GetVerseVars in ../index.d.ts
const { data } = await GetVerse(dataConnect, getVerseVars);

// Operation GetMyCurrentVerse:  For variables, look at type GetMyCurrentVerseVars in ../index.d.ts
const { data } = await GetMyCurrentVerse(dataConnect, getMyCurrentVerseVars);

// Operation GetMyBookmarks: 
const { data } = await GetMyBookmarks(dataConnect);

// Operation GetMyCompletions: 
const { data } = await GetMyCompletions(dataConnect);


```