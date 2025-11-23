# Phase 3: Social Features - Implementation Plan

## Overview
Build social interaction features including comments, likes, bookmarks, and user following to create an engaging community around prompts.

---

## Part 1: Comments System

### Step 1: Create Comment Model
1. Generate the Comment model with these fields:
   - `content:text` (the comment text)
   - `user:references` (who wrote it)
   - `prompt:references` (which prompt)
   - `parent:references` (for nested/threaded comments)

2. Update the migration:
   - Make `content` NOT NULL
   - Add `parent_id` as a self-referential foreign key to comments table
   - Add indexes on `prompt_id`, `user_id`, `parent_id`, and `created_at`
   - Add a `likes_count` integer field (default: 0) for counter cache

3. Update Comment model:
   - Add associations: belongs_to user, belongs_to prompt, belongs_to parent (class_name: 'Comment', optional: true)
   - Add has_many :replies (class_name: 'Comment', foreign_key: :parent_id, dependent: :destroy)
   - Add validations: content presence, length (minimum: 1, maximum: 1000)
   - Add scope: `top_level` -> where(parent_id: nil)
   - Add scope: `recent` -> order(created_at: :desc)
   - Add method: `reply?` that returns true if parent_id.present?

4. Update User model:
   - Add `has_many :comments, dependent: :destroy`

5. Update Prompt model:
   - Add `has_many :comments, dependent: :destroy`
   - Add method `top_level_comments` that returns comments.top_level

### Step 2: Create Comments Controller
1. Generate controller: `app/controllers/api/v1/comments_controller.rb`

2. Implement actions:
   - **create**: Create a new comment on a prompt
     - Require authentication
     - Build comment for current_user
     - Support both top-level and reply comments (check for parent_id param)
     - Authorize with Pundit

   - **update**: Edit own comment
     - Only allow owner or admin
     - Authorize with Pundit

   - **destroy**: Delete own comment
     - Only allow owner or admin
     - Authorize with Pundit
     - Consider soft-deleting if it has replies

3. Add private methods:
   - `set_comment` - find comment by ID
   - `comment_params` - permit :content, :prompt_id, :parent_id

### Step 3: Create Comment Policy
1. Create `app/policies/comment_policy.rb`

2. Define authorization rules:
   - `create?` - user must be authenticated
   - `update?` - user must be owner or admin
   - `destroy?` - user must be owner or admin
   - `Scope` - return all comments (they're public by association with prompts)

### Step 4: Update Routes
Routes are already set up, just verify:
- `POST /api/v1/comments` - create
- `PATCH /api/v1/comments/:id` - update
- `DELETE /api/v1/comments/:id` - destroy

---

## Part 2: Likes System

### Step 1: Create Like Model (Polymorphic)
1. Generate Like model:
   - `user:references` (who liked)
   - `likeable:references{polymorphic}` (what was liked - prompt or comment)

2. Update migration:
   - Add compound unique index on [:user_id, :likeable_type, :likeable_id]
   - This prevents duplicate likes

3. Update Like model:
   - Add belongs_to :user
   - Add belongs_to :likeable, polymorphic: true, counter_cache: :likes_count
   - Add validation: uniqueness of user_id scoped to likeable_type and likeable_id
   - Add scope: `for_prompts` -> where(likeable_type: 'Prompt')
   - Add scope: `for_comments` -> where(likeable_type: 'Comment')

### Step 2: Update Models for Likes
1. Update User model:
   - Add `has_many :likes, dependent: :destroy`
   - Add method `liked?(likeable)` that checks if user has liked the object
   - Add method `like!(likeable)` that creates a like
   - Add method `unlike!(likeable)` that destroys the like

2. Update Prompt model:
   - Add `has_many :likes, as: :likeable, dependent: :destroy`
   - Change existing `like_count` to `likes_count` for counter_cache consistency
   - Remove the increment_likes/decrement_likes methods (counter_cache handles it)

3. Update Comment model:
   - Add `has_many :likes, as: :likeable, dependent: :destroy`

### Step 3: Create Likes Controller
1. Generate controller: `app/controllers/api/v1/likes_controller.rb`

2. Implement actions:
   - **create**: Like a prompt or comment
     - Require authentication
     - Accept params: likeable_type, likeable_id
     - Use user.like!(likeable) method
     - Return the updated likeable with new likes_count

   - **destroy**: Unlike a prompt or comment
     - Require authentication
     - Find like by likeable_type and likeable_id for current_user
     - Destroy it
     - Return success status

3. Add private methods:
   - `set_likeable` - find the likeable object (Prompt or Comment)
   - `like_params` - permit :likeable_type, :likeable_id

### Step 4: Update Routes
Add to routes.rb under `api/v1`:
```
resources :likes, only: [:create, :destroy]
```

Or add custom routes:
```
post 'prompts/:id/like', to: 'prompts#like'
delete 'prompts/:id/unlike', to: 'prompts#unlike'
post 'comments/:id/like', to: 'comments#like'
delete 'comments/:id/unlike', to: 'comments#unlike'
```

---

## Part 3: Bookmarks/Favorites System

### Step 1: Create Bookmark Model
1. Generate Bookmark model:
   - `user:references` (who bookmarked)
   - `prompt:references` (what was bookmarked)

2. Update migration:
   - Add compound unique index on [:user_id, :prompt_id]
   - Add index on created_at for sorting
   - Add optional `notes:text` field for personal notes

3. Update Bookmark model:
   - Add belongs_to :user
   - Add belongs_to :prompt, counter_cache: :bookmarks_count
   - Add validation: uniqueness of prompt_id scoped to user_id
   - Add validation: notes length (max 500) if present
   - Add scope: `recent` -> order(created_at: :desc)

### Step 2: Update Models for Bookmarks
1. Update User model:
   - Add `has_many :bookmarks, dependent: :destroy`
   - Add `has_many :bookmarked_prompts, through: :bookmarks, source: :prompt`
   - Add method `bookmarked?(prompt)` - check if user bookmarked it
   - Add method `bookmark!(prompt, notes: nil)` - create bookmark
   - Add method `unbookmark!(prompt)` - destroy bookmark

2. Update Prompt model:
   - Add `has_many :bookmarks, dependent: :destroy`
   - Add `bookmarks_count:integer` field via migration (default: 0)

### Step 3: Add Bookmarks Count to Prompts
1. Generate migration: `AddBookmarksCountToPrompts`
2. Add column: `bookmarks_count:integer, default: 0, null: false`
3. Run migration

### Step 4: Create Bookmarks Controller
1. Generate controller: `app/controllers/api/v1/bookmarks_controller.rb`

2. Implement actions:
   - **index**: Get user's bookmarks
     - Require authentication
     - Return current_user.bookmarks with associated prompts
     - Support pagination

   - **create**: Bookmark a prompt
     - Require authentication
     - Accept prompt_id and optional notes
     - Use current_user.bookmark!(prompt, notes: params[:notes])

   - **update**: Update bookmark notes
     - Only for own bookmarks

   - **destroy**: Remove bookmark
     - Require authentication
     - Find and destroy user's bookmark

3. Add private methods:
   - `set_bookmark` - find bookmark by ID
   - `bookmark_params` - permit :prompt_id, :notes

### Step 5: Update Routes
Add to routes.rb under `api/v1`:
```
resources :bookmarks, only: [:index, :create, :update, :destroy]
```

---

## Part 4: User Following System

### Step 1: Create Follow Model (Self-Join)
1. Generate Follow model:
   - `follower_id:integer` (user who follows)
   - `followed_id:integer` (user being followed)

2. Update migration:
   - Add foreign keys to users table for both follower_id and followed_id
   - Add compound unique index on [:follower_id, :followed_id]
   - Add index on created_at

3. Update Follow model:
   - Add belongs_to :follower, class_name: 'User'
   - Add belongs_to :followed, class_name: 'User'
   - Add validation: uniqueness of followed_id scoped to follower_id
   - Add validation: cannot follow yourself (follower_id != followed_id)
   - Add scope: `recent` -> order(created_at: :desc)

### Step 2: Update User Model for Following
1. Add associations:
   - `has_many :active_follows, class_name: 'Follow', foreign_key: :follower_id, dependent: :destroy`
   - `has_many :passive_follows, class_name: 'Follow', foreign_key: :followed_id, dependent: :destroy`
   - `has_many :following, through: :active_follows, source: :followed`
   - `has_many :followers, through: :passive_follows, source: :follower`

2. Add counter cache columns via migration:
   - `followers_count:integer` (default: 0)
   - `following_count:integer` (default: 0)

3. Add methods:
   - `follow!(other_user)` - create follow relationship
   - `unfollow!(other_user)` - destroy follow relationship
   - `following?(other_user)` - check if following
   - `followed_by?(other_user)` - check if followed by

### Step 3: Generate Migration for Follow Counts
1. Create migration: `AddFollowCountsToUsers`
2. Add columns: followers_count and following_count
3. Update Follow model to use counter_cache for both associations

### Step 4: Create Follows Controller
1. Generate controller: `app/controllers/api/v1/follows_controller.rb`

2. Implement actions:
   - **create**: Follow a user
     - Require authentication
     - Accept user_id (user to follow)
     - Use current_user.follow!(user)
     - Return success with updated counts

   - **destroy**: Unfollow a user
     - Require authentication
     - Accept user_id (user to unfollow)
     - Use current_user.unfollow!(user)

   - **followers**: Get user's followers list
     - Support pagination
     - Return user info for each follower

   - **following**: Get users that user is following
     - Support pagination

3. Add private methods:
   - `set_user` - find user to follow/unfollow

### Step 5: Update Routes
Add to routes.rb under `api/v1`:
```
resources :users, only: [:show] do
  member do
    post :follow
    delete :unfollow
    get :followers
    get :following
  end
end
```

---

## Part 5: Activity Feed

### Step 1: Create Activity Model (Optional)
This is for tracking user activities for a feed.

1. Generate Activity model:
   - `user:references` (who did the action)
   - `action:string` (created, liked, commented, etc.)
   - `trackable:references{polymorphic}` (what was affected)

2. Update migration:
   - Add index on [:user_id, :created_at]
   - Add index on [:trackable_type, :trackable_id]

3. Update Activity model:
   - belongs_to :user
   - belongs_to :trackable, polymorphic: true
   - Validation: action presence, inclusion in allowed actions
   - Scope: `recent` -> order(created_at: :desc)
   - Scope: `for_user` -> where(user_id: user_id)

### Step 2: Add Activity Tracking
1. Use Rails callbacks or service objects to create activities:
   - When a user creates a prompt -> Activity.create(user: user, action: 'created', trackable: prompt)
   - When a user likes a prompt -> Activity.create(...)
   - When a user comments -> Activity.create(...)
   - When a user follows someone -> Activity.create(...)

2. Alternative: Use the `public_activity` gem for automatic tracking

### Step 3: Create Feed Controller
1. Generate controller: `app/controllers/api/v1/feed_controller.rb`

2. Implement actions:
   - **index**: Get activity feed
     - Require authentication
     - Show activities from users the current_user follows
     - Show current_user's own activities
     - Sort by recent
     - Paginate results

---

## Part 6: Notifications (Optional)

### Step 1: Create Notification Model
1. Generate Notification model:
   - `user:references` (recipient)
   - `actor:references` (who triggered it, polymorphic to User)
   - `notifiable:references{polymorphic}` (what it's about)
   - `notification_type:string` (comment, like, follow, mention)
   - `read:boolean` (default: false)

2. Update migration:
   - Add indexes on [:user_id, :read, :created_at]
   - Add index on [:notifiable_type, :notifiable_id]

### Step 2: Add Notification Triggers
Create service objects or use callbacks to generate notifications:
- When someone comments on your prompt
- When someone likes your prompt/comment
- When someone follows you
- When someone replies to your comment
- When someone mentions you (@username)

### Step 3: Create Notifications Controller
1. Generate controller: `app/controllers/api/v1/notifications_controller.rb`

2. Implement actions:
   - **index**: Get user's notifications (paginated, filter by read/unread)
   - **update**: Mark notification as read
   - **mark_all_read**: Mark all as read

---

## Part 7: Testing

### Database Migrations
1. Run all migrations: `rails db:migrate`
2. Check schema.rb to verify all tables and indexes

### Model Testing
1. Test Comment model:
   - Create comments on prompts
   - Create threaded/nested comments (replies)
   - Test validations

2. Test Like model:
   - Like prompts and comments
   - Test uniqueness (can't like twice)
   - Test counter cache

3. Test Bookmark model:
   - Bookmark prompts
   - Test uniqueness

4. Test Follow model:
   - Follow/unfollow users
   - Test counter cache
   - Test cannot follow self

### API Testing
Test all endpoints with tools like Postman or cURL:
- Create/update/delete comments
- Like/unlike prompts and comments
- Bookmark/unbookmark prompts
- Follow/unfollow users
- Get followers/following lists
- Get activity feed

---

## Part 8: JSON Response Helpers

### Update Controllers to Include Related Data
For better API responses, include relevant associations:

1. **Prompts**: Include comment count, likes_count, bookmarks_count, user has_liked, user has_bookmarked

2. **Comments**: Include user info, replies, likes_count, user has_liked

3. **Users**: Include followers_count, following_count, prompt_count

---

## Completion Checklist

- [ ] Comment model and controller created
- [ ] Threaded comments working
- [ ] Like system for prompts and comments
- [ ] Bookmark system for prompts
- [ ] User following system
- [ ] Counter caches working correctly
- [ ] All policies implemented
- [ ] All routes configured
- [ ] Migrations run successfully
- [ ] API endpoints tested
- [ ] JSON responses include proper associations
- [ ] Activity feed (optional) working
- [ ] Notifications (optional) working

---

## Next Steps
After completing Phase 3, you'll have a fully social PromptHub! Next phases:
- **Phase 4**: AI Integration (OpenAI & Anthropic)
- **Phase 5**: Team Management & Organizations
- **Phase 6**: Frontend UI with React
