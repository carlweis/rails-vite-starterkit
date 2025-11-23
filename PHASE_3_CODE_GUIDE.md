# Phase 3: Social Features - Complete Code Guide

This guide provides all the code you need to type out to build Phase 3: Social Features for PromptHub.

---

## Overview

You'll build:
1. **Comments System** - Threaded comments on prompts
2. **Likes System** - Like prompts and comments
3. **Bookmarks** - Save prompts for later
4. **Following** - Follow other users
5. **Activity Feed** - Track user activities

---

## Part 1: Comments System

### Step 1.1: Generate Comment Model

```bash
bin/rails generate model Comment content:text user:references prompt:references parent:references likes_count:integer
```

### Step 1.2: Update Comment Migration

Open `db/migrate/XXXXXX_create_comments.rb`:

```ruby
class CreateComments < ActiveRecord::Migration[8.1]
  def change
    create_table :comments do |t|
      t.text :content, null: false
      t.references :user, null: false, foreign_key: true
      t.references :prompt, null: false, foreign_key: true
      t.references :parent, foreign_key: { to_table: :comments }, null: true
      t.integer :likes_count, default: 0, null: false

      t.timestamps
    end

    add_index :comments, :created_at
    add_index :comments, [:prompt_id, :created_at]
    add_index :comments, :parent_id
  end
end
```

### Step 1.3: Update Comment Model

Open `app/models/comment.rb`:

```ruby
class Comment < ApplicationRecord
  # Associations
  belongs_to :user
  belongs_to :prompt
  belongs_to :parent, class_name: 'Comment', optional: true
  has_many :replies, class_name: 'Comment', foreign_key: :parent_id, dependent: :destroy
  has_many :likes, as: :likeable, dependent: :destroy

  # Validations
  validates :content, presence: true, length: { minimum: 1, maximum: 1000 }

  # Scopes
  scope :top_level, -> { where(parent_id: nil) }
  scope :recent, -> { order(created_at: :desc) }
  scope :oldest_first, -> { order(created_at: :asc) }
  scope :most_liked, -> { order(likes_count: :desc) }

  # Instance methods
  def reply?
    parent_id.present?
  end

  def depth
    return 0 if parent_id.nil?
    1 + (parent&.depth || 0)
  end
end
```

### Step 1.4: Update Models with Comment Associations

Add to `app/models/user.rb`:

```ruby
has_many :comments, dependent: :destroy
```

Add to `app/models/prompt.rb`:

```ruby
has_many :comments, dependent: :destroy

# Add method for top-level comments
def top_level_comments
  comments.top_level
end
```

### Step 1.5: Create Comments Controller

Create `app/controllers/api/v1/comments_controller.rb`:

```ruby
module Api
  module V1
    class CommentsController < ApplicationController
      before_action :authenticate_user!
      before_action :set_comment, only: [:update, :destroy]

      # POST /api/v1/comments
      def create
        @comment = current_user.comments.build(comment_params)
        authorize @comment

        if @comment.save
          render json: @comment.as_json(include: { user: { only: [:id, :name, :username] } }), status: :created
        else
          render json: { errors: @comment.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PATCH /api/v1/comments/:id
      def update
        authorize @comment

        if @comment.update(comment_params)
          render json: @comment
        else
          render json: { errors: @comment.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/comments/:id
      def destroy
        authorize @comment
        @comment.destroy

        head :no_content
      end

      private

      def set_comment
        @comment = Comment.find(params[:id])
      end

      def comment_params
        params.require(:comment).permit(:content, :prompt_id, :parent_id)
      end
    end
  end
end
```

### Step 1.6: Create Comment Policy

Create `app/policies/comment_policy.rb`:

```ruby
class CommentPolicy < ApplicationPolicy
  def create?
    user.present?
  end

  def update?
    user.present? && (record.user_id == user.id || user.admin?)
  end

  def destroy?
    user.present? && (record.user_id == user.id || user.admin?)
  end

  class Scope < Scope
    def resolve
      scope.all
    end
  end
end
```

---

## Part 2: Likes System

### Step 2.1: Generate Like Model

```bash
bin/rails generate model Like user:references likeable:references{polymorphic}
```

### Step 2.2: Update Like Migration

Open `db/migrate/XXXXXX_create_likes.rb`:

```ruby
class CreateLikes < ActiveRecord::Migration[8.1]
  def change
    create_table :likes do |t|
      t.references :user, null: false, foreign_key: true
      t.references :likeable, polymorphic: true, null: false

      t.timestamps
    end

    add_index :likes, [:user_id, :likeable_type, :likeable_id], unique: true, name: 'index_likes_on_user_and_likeable'
  end
end
```

### Step 2.3: Update Like Model

Open `app/models/like.rb`:

```ruby
class Like < ApplicationRecord
  # Associations
  belongs_to :user
  belongs_to :likeable, polymorphic: true, counter_cache: :likes_count

  # Validations
  validates :user_id, uniqueness: { scope: [:likeable_type, :likeable_id] }

  # Scopes
  scope :for_prompts, -> { where(likeable_type: 'Prompt') }
  scope :for_comments, -> { where(likeable_type: 'Comment') }
end
```

### Step 2.4: Update Models for Likes

Add to `app/models/user.rb`:

```ruby
has_many :likes, dependent: :destroy

def liked?(likeable)
  likes.exists?(likeable: likeable)
end

def like!(likeable)
  likes.create!(likeable: likeable)
end

def unlike!(likeable)
  likes.find_by(likeable: likeable)&.destroy
end
```

Add to `app/models/prompt.rb`:

```ruby
has_many :likes, as: :likeable, dependent: :destroy
```

Note: Prompt already has `likes_count` field, but we need to rename it to work with counter_cache.

### Step 2.5: Create Migration to Rename like_count

```bash
bin/rails generate migration RenamePromptLikeCountToLikesCount
```

Open the migration file:

```ruby
class RenamePromptLikeCountToLikesCount < ActiveRecord::Migration[8.1]
  def change
    rename_column :prompts, :like_count, :likes_count
  end
end
```

### Step 2.6: Update Prompt Model

Remove these methods from `app/models/prompt.rb`:

```ruby
# DELETE these methods:
def increment_likes!
  increment!(:like_count)
end

def decrement_likes!
  decrement!(:like_count)
end
```

The counter_cache will handle this automatically.

### Step 2.7: Create Likes Controller

Create `app/controllers/api/v1/likes_controller.rb`:

```ruby
module Api
  module V1
    class LikesController < ApplicationController
      before_action :authenticate_user!

      # POST /api/v1/likes
      def create
        likeable = find_likeable

        begin
          current_user.like!(likeable)
          render json: {
            liked: true,
            likes_count: likeable.reload.likes_count
          }, status: :created
        rescue ActiveRecord::RecordInvalid
          render json: { error: 'Already liked' }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/likes/:id
      def destroy
        likeable = find_likeable
        current_user.unlike!(likeable)

        render json: {
          liked: false,
          likes_count: likeable.reload.likes_count
        }
      end

      private

      def find_likeable
        likeable_type = params[:likeable_type]
        likeable_id = params[:likeable_id] || params[:id]

        case likeable_type
        when 'Prompt'
          Prompt.find(likeable_id)
        when 'Comment'
          Comment.find(likeable_id)
        else
          raise ActiveRecord::RecordNotFound
        end
      end
    end
  end
end
```

---

## Part 3: Bookmarks System

### Step 3.1: Generate Bookmark Model

```bash
bin/rails generate model Bookmark user:references prompt:references notes:text
```

### Step 3.2: Update Bookmark Migration

Open `db/migrate/XXXXXX_create_bookmarks.rb`:

```ruby
class CreateBookmarks < ActiveRecord::Migration[8.1]
  def change
    create_table :bookmarks do |t|
      t.references :user, null: false, foreign_key: true
      t.references :prompt, null: false, foreign_key: true
      t.text :notes

      t.timestamps
    end

    add_index :bookmarks, [:user_id, :prompt_id], unique: true
    add_index :bookmarks, :created_at
  end
end
```

### Step 3.3: Update Bookmark Model

Open `app/models/bookmark.rb`:

```ruby
class Bookmark < ApplicationRecord
  # Associations
  belongs_to :user
  belongs_to :prompt, counter_cache: :bookmarks_count

  # Validations
  validates :prompt_id, uniqueness: { scope: :user_id }
  validates :notes, length: { maximum: 500 }, allow_blank: true

  # Scopes
  scope :recent, -> { order(created_at: :desc) }
end
```

### Step 3.4: Add Bookmarks Count to Prompts

```bash
bin/rails generate migration AddBookmarksCountToPrompts bookmarks_count:integer
```

Open the migration:

```ruby
class AddBookmarksCountToPrompts < ActiveRecord::Migration[8.1]
  def change
    add_column :prompts, :bookmarks_count, :integer, default: 0, null: false
  end
end
```

### Step 3.5: Update Models for Bookmarks

Add to `app/models/user.rb`:

```ruby
has_many :bookmarks, dependent: :destroy
has_many :bookmarked_prompts, through: :bookmarks, source: :prompt

def bookmarked?(prompt)
  bookmarks.exists?(prompt: prompt)
end

def bookmark!(prompt, notes: nil)
  bookmarks.create!(prompt: prompt, notes: notes)
end

def unbookmark!(prompt)
  bookmarks.find_by(prompt: prompt)&.destroy
end
```

Add to `app/models/prompt.rb`:

```ruby
has_many :bookmarks, dependent: :destroy
```

### Step 3.6: Create Bookmarks Controller

Create `app/controllers/api/v1/bookmarks_controller.rb`:

```ruby
module Api
  module V1
    class BookmarksController < ApplicationController
      before_action :authenticate_user!
      before_action :set_bookmark, only: [:update, :destroy]

      # GET /api/v1/bookmarks
      def index
        @bookmarks = current_user.bookmarks
          .includes(:prompt)
          .recent
          .page(params[:page])
          .per(params[:per_page] || 20)

        render json: {
          bookmarks: @bookmarks.as_json(
            include: {
              prompt: {
                include: {
                  user: { only: [:id, :name, :username] },
                  tags: { only: [:id, :name, :slug] }
                }
              }
            }
          ),
          meta: {
            current_page: @bookmarks.current_page,
            total_pages: @bookmarks.total_pages,
            total_count: @bookmarks.total_count
          }
        }
      end

      # POST /api/v1/bookmarks
      def create
        prompt = Prompt.find(params[:prompt_id])

        begin
          @bookmark = current_user.bookmark!(prompt, notes: params[:notes])
          render json: @bookmark, status: :created
        rescue ActiveRecord::RecordInvalid
          render json: { error: 'Already bookmarked' }, status: :unprocessable_entity
        end
      end

      # PATCH /api/v1/bookmarks/:id
      def update
        if @bookmark.update(bookmark_params)
          render json: @bookmark
        else
          render json: { errors: @bookmark.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/bookmarks/:id
      def destroy
        @bookmark.destroy
        head :no_content
      end

      private

      def set_bookmark
        @bookmark = current_user.bookmarks.find(params[:id])
      end

      def bookmark_params
        params.require(:bookmark).permit(:notes)
      end
    end
  end
end
```

---

## Part 4: User Following System

### Step 4.1: Generate Follow Model

```bash
bin/rails generate model Follow follower_id:integer followed_id:integer
```

### Step 4.2: Update Follow Migration

Open `db/migrate/XXXXXX_create_follows.rb`:

```ruby
class CreateFollows < ActiveRecord::Migration[8.1]
  def change
    create_table :follows do |t|
      t.integer :follower_id, null: false
      t.integer :followed_id, null: false

      t.timestamps
    end

    add_foreign_key :follows, :users, column: :follower_id
    add_foreign_key :follows, :users, column: :followed_id

    add_index :follows, [:follower_id, :followed_id], unique: true
    add_index :follows, :follower_id
    add_index :follows, :followed_id
    add_index :follows, :created_at
  end
end
```

### Step 4.3: Update Follow Model

Open `app/models/follow.rb`:

```ruby
class Follow < ApplicationRecord
  # Associations
  belongs_to :follower, class_name: 'User', counter_cache: :following_count
  belongs_to :followed, class_name: 'User', counter_cache: :followers_count

  # Validations
  validates :followed_id, uniqueness: { scope: :follower_id }
  validate :cannot_follow_self

  # Scopes
  scope :recent, -> { order(created_at: :desc) }

  private

  def cannot_follow_self
    errors.add(:base, "You can't follow yourself") if follower_id == followed_id
  end
end
```

### Step 4.4: Add Follow Counts to Users

```bash
bin/rails generate migration AddFollowCountsToUsers followers_count:integer following_count:integer
```

Open the migration:

```ruby
class AddFollowCountsToUsers < ActiveRecord::Migration[8.1]
  def change
    add_column :users, :followers_count, :integer, default: 0, null: false
    add_column :users, :following_count, :integer, default: 0, null: false

    add_index :users, :followers_count
    add_index :users, :following_count
  end
end
```

### Step 4.5: Update User Model for Following

Add to `app/models/user.rb`:

```ruby
# Following relationships
has_many :active_follows, class_name: 'Follow', foreign_key: :follower_id, dependent: :destroy
has_many :passive_follows, class_name: 'Follow', foreign_key: :followed_id, dependent: :destroy
has_many :following, through: :active_follows, source: :followed
has_many :followers, through: :passive_follows, source: :follower

def follow!(other_user)
  return if self == other_user
  active_follows.create!(followed: other_user)
end

def unfollow!(other_user)
  active_follows.find_by(followed: other_user)&.destroy
end

def following?(other_user)
  following.include?(other_user)
end

def followed_by?(other_user)
  followers.include?(other_user)
end
```

### Step 4.6: Create Follows Controller

Create `app/controllers/api/v1/follows_controller.rb`:

```ruby
module Api
  module V1
    class FollowsController < ApplicationController
      before_action :authenticate_user!

      # POST /api/v1/users/:user_id/follow
      def create
        @user = User.find(params[:user_id])

        begin
          current_user.follow!(@user)
          render json: {
            following: true,
            followers_count: @user.reload.followers_count,
            following_count: current_user.reload.following_count
          }, status: :created
        rescue ActiveRecord::RecordInvalid => e
          render json: { error: e.message }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/users/:user_id/unfollow
      def destroy
        @user = User.find(params[:user_id])
        current_user.unfollow!(@user)

        render json: {
          following: false,
          followers_count: @user.reload.followers_count,
          following_count: current_user.reload.following_count
        }
      end

      # GET /api/v1/users/:user_id/followers
      def followers
        @user = User.find(params[:user_id])
        @followers = @user.followers
          .page(params[:page])
          .per(params[:per_page] || 20)

        render json: {
          users: @followers.as_json(only: [:id, :name, :username, :email], methods: [:display_name]),
          meta: {
            current_page: @followers.current_page,
            total_pages: @followers.total_pages,
            total_count: @followers.total_count
          }
        }
      end

      # GET /api/v1/users/:user_id/following
      def following
        @user = User.find(params[:user_id])
        @following = @user.following
          .page(params[:page])
          .per(params[:per_page] || 20)

        render json: {
          users: @following.as_json(only: [:id, :name, :username, :email], methods: [:display_name]),
          meta: {
            current_page: @following.current_page,
            total_pages: @following.total_pages,
            total_count: @following.total_count
          }
        }
      end
    end
  end
end
```

---

## Part 5: Update Routes

### Step 5.1: Update config/routes.rb

Open `config/routes.rb` and update the API section:

```ruby
# API routes
namespace :api do
  namespace :v1 do
    resources :prompts do
      member do
        get :versions
        post :restore_version
        post :duplicate
        post :increment_usage
      end
    end

    resources :tags, only: [:index, :create, :show]
    resources :comments, only: [:create, :update, :destroy]
    resources :likes, only: [:create, :destroy]
    resources :bookmarks, only: [:index, :create, :update, :destroy]

    resources :users, only: [:show] do
      member do
        post :follow
        delete :unfollow
        get :followers
        get :following
      end
    end
  end
end
```

---

## Part 6: Run Migrations

```bash
bin/rails db:migrate
```

---

## Part 7: Test in Rails Console

### Step 7.1: Open Console

```bash
bin/rails console
```

### Step 7.2: Test Comments

```ruby
user = User.first
prompt = Prompt.first

# Create a comment
comment = prompt.comments.create!(
  user: user,
  content: 'This is a great prompt!'
)

# Create a reply
reply = prompt.comments.create!(
  user: User.second,
  content: 'I agree!',
  parent: comment
)

# Check replies
comment.replies.count
# Should be 1

# Check if it's a reply
reply.reply?
# Should be true
```

### Step 7.3: Test Likes

```ruby
user = User.first
prompt = Prompt.first

# Like a prompt
user.like!(prompt)

# Check if liked
user.liked?(prompt)
# Should be true

# Check likes count
prompt.likes_count
# Should be 1

# Unlike
user.unlike!(prompt)
```

### Step 7.4: Test Bookmarks

```ruby
user = User.first
prompt = Prompt.first

# Bookmark a prompt
bookmark = user.bookmark!(prompt, notes: 'Need to try this')

# Check if bookmarked
user.bookmarked?(prompt)
# Should be true

# Get all bookmarks
user.bookmarked_prompts
```

### Step 7.5: Test Following

```ruby
user1 = User.first
user2 = User.second

# Follow user
user1.follow!(user2)

# Check if following
user1.following?(user2)
# Should be true

# Check followers
user2.followers.include?(user1)
# Should be true

# Check counts
user1.following_count
# Should be 1

user2.followers_count
# Should be 1
```

---

## Part 8: Update Seed Data

Add to `db/seeds.rb`:

```ruby
puts "Creating comments..."
5.times do |i|
  Prompt.all.sample(3).each do |prompt|
    comment = prompt.comments.create!(
      user: User.all.sample,
      content: "Great prompt! This is comment #{i + 1}."
    )

    # Add some replies
    if rand < 0.5
      comment.replies.create!(
        prompt: prompt,
        user: User.all.sample,
        content: "Thanks for the feedback!"
      )
    end
  end
end

puts "Creating likes..."
User.all.each do |user|
  Prompt.public_prompts.sample(rand(1..3)).each do |prompt|
    user.like!(prompt) rescue nil
  end

  Comment.all.sample(rand(1..3)).each do |comment|
    user.like!(comment) rescue nil
  end
end

puts "Creating bookmarks..."
User.all.each do |user|
  Prompt.public_prompts.sample(rand(1..2)).each do |prompt|
    user.bookmark!(prompt, notes: ['Want to try this', 'Good example', 'Reference'].sample) rescue nil
  end
end

puts "Creating follows..."
users = User.all.to_a
users.each do |user|
  other_users = users - [user]
  other_users.sample(rand(1..2)).each do |other_user|
    user.follow!(other_user) rescue nil
  end
end

puts "Social features seeded!"
puts "#{Comment.count} comments"
puts "#{Like.count} likes"
puts "#{Bookmark.count} bookmarks"
puts "#{Follow.count} follows"
```

Run seeds:

```bash
bin/rails db:seed
```

---

## Part 9: Test API Endpoints

### Test Comments

```bash
# Create a comment (needs authentication - test with Postman)
curl -X POST http://localhost:3000/api/v1/comments \
  -H "Content-Type: application/json" \
  -d '{"comment": {"prompt_id": 1, "content": "Great prompt!"}}'
```

### Test Likes

```bash
# Like a prompt
curl -X POST http://localhost:3000/api/v1/likes \
  -H "Content-Type: application/json" \
  -d '{"likeable_type": "Prompt", "likeable_id": 1}'

# Unlike
curl -X DELETE http://localhost:3000/api/v1/likes/1
```

### Test Bookmarks

```bash
# Get bookmarks
curl http://localhost:3000/api/v1/bookmarks

# Create bookmark
curl -X POST http://localhost:3000/api/v1/bookmarks \
  -H "Content-Type: application/json" \
  -d '{"prompt_id": 1, "notes": "Try this later"}'
```

### Test Following

```bash
# Follow user
curl -X POST http://localhost:3000/api/v1/users/2/follow

# Get followers
curl http://localhost:3000/api/v1/users/2/followers

# Get following
curl http://localhost:3000/api/v1/users/1/following
```

---

## Part 10: Update Prompts API to Include Social Data

Update `app/controllers/api/v1/prompts_controller.rb`:

Add this method before `private`:

```ruby
# GET /api/v1/prompts/:id
def show
  authorize @prompt

  render json: @prompt.as_json(
    include: {
      user: { only: [:id, :name, :username, :email] },
      tags: { only: [:id, :name, :slug] },
      prompt_versions: { only: [:id, :version_number, :created_at, :change_description] },
      comments: {
        only: [:id, :content, :created_at, :likes_count, :parent_id],
        include: {
          user: { only: [:id, :name, :username] }
        },
        methods: []
      }
    },
    methods: [:attachment_urls]
  ).merge({
    user_has_liked: current_user ? current_user.liked?(@prompt) : false,
    user_has_bookmarked: current_user ? current_user.bookmarked?(@prompt) : false,
    comments_count: @prompt.comments.count
  })
end
```

---

## Testing Checklist

- [ ] Can create top-level comments
- [ ] Can create reply comments
- [ ] Can edit own comments
- [ ] Can delete own comments
- [ ] Can like prompts
- [ ] Can unlike prompts
- [ ] Can like comments
- [ ] Counter cache updates on likes
- [ ] Can't like same thing twice
- [ ] Can bookmark prompts
- [ ] Can add notes to bookmarks
- [ ] Can view all bookmarks
- [ ] Can follow users
- [ ] Can unfollow users
- [ ] Can't follow self
- [ ] Follower/following counts update
- [ ] Can view followers list
- [ ] Can view following list

---

## Commit Your Work

```bash
git add -A
git commit -m "Phase 3: Social Features

Implemented comprehensive social interaction features:

- Comment system with threaded replies
- Polymorphic likes for prompts and comments
- Bookmarks with personal notes
- User following system
- Counter caches for performance
- Full API endpoints for all features
- Seed data for testing

Features:
- Create/edit/delete comments
- Reply to comments (nested)
- Like/unlike prompts and comments
- Bookmark prompts
- Follow/unfollow users
- View followers and following
"

git push
```

---

## What You Built

✅ **Comments**: Threaded discussions on prompts
✅ **Likes**: Social validation for content
✅ **Bookmarks**: Save prompts for later
✅ **Following**: Build your network
✅ **Counter Caches**: Optimized performance

---

## Next: Phase 4 - AI Integration

You're ready to integrate OpenAI and Anthropic APIs!
