# Phase 6: Frontend UI with React - Implementation Plan

## Overview
Build the complete React frontend for PromptHub, creating a modern, responsive UI that integrates with all backend APIs built in previous phases.

---

## Part 1: Project Setup & Architecture

### Step 1: Install Additional Frontend Dependencies
Add to `package.json`:

1. **Routing**: `react-router-dom`
2. **State Management**: `zustand` or `@tanstack/react-query` (for server state)
3. **Forms**: `react-hook-form`, `zod` (validation)
4. **HTTP Client**: `axios` or `ky`
5. **UI Components**: Additional shadcn/ui components as needed
6. **Icons**: `lucide-react` (already included with shadcn)
7. **Rich Text Editor**: `@tiptap/react` or `react-quill`
8. **Markdown**: `react-markdown`, `remark-gfm`
9. **Date Handling**: `date-fns`
10. **Notifications**: `react-hot-toast` or `sonner`
11. **Animations**: `framer-motion` (optional)

Run: `npm install [package-names]`

### Step 2: Set Up Project Structure
Create the following directory structure in `app/frontend/`:

```
app/frontend/
├── components/
│   ├── auth/           # Authentication components
│   ├── prompts/        # Prompt-related components
│   ├── comments/       # Comment components
│   ├── organizations/  # Organization components
│   ├── teams/          # Team components
│   ├── ai/            # AI features
│   ├── layout/        # Layout components (navbar, sidebar, footer)
│   ├── shared/        # Shared/reusable components
│   └── ui/            # shadcn components
├── hooks/             # Custom React hooks
├── lib/               # Utilities and helpers
│   ├── api/          # API client functions
│   ├── auth/         # Auth helpers
│   └── utils.ts      # General utilities
├── stores/           # State management (Zustand stores)
├── types/            # TypeScript type definitions
├── contexts/         # React contexts
├── pages/            # Page components
└── styles/           # CSS files
```

### Step 3: Configure API Client
Create `app/frontend/lib/api/client.ts`:

1. Set up axios instance with:
   - Base URL pointing to `/api/v1`
   - CSRF token from Rails
   - Request/response interceptors
   - Error handling

2. Add helper methods:
   - `get(url, params)`
   - `post(url, data)`
   - `put(url, data)`
   - `patch(url, data)`
   - `delete(url)`

3. Handle authentication:
   - Include auth token in headers
   - Refresh token on 401 errors
   - Redirect to login on auth failure

---

## Part 2: Authentication & User Management

### Step 1: Create Auth Context
Create `app/frontend/contexts/AuthContext.tsx`:

1. Provide authentication state:
   - `user` - current user object
   - `isAuthenticated` - boolean
   - `isLoading` - loading state
   - `login(email, password)` - login function
   - `logout()` - logout function
   - `signup(email, password, name)` - signup function
   - `updateProfile(data)` - update user profile

2. Store auth token:
   - Use localStorage or sessionStorage
   - Include in API requests

### Step 2: Create Auth API Functions
Create `app/frontend/lib/api/auth.ts`:

1. API methods:
   - `login(email, password)` -> POST /users/sign_in
   - `logout()` -> DELETE /users/sign_out
   - `signup(data)` -> POST /users
   - `getCurrentUser()` -> GET /users/me
   - `updateProfile(data)` -> PATCH /users/me
   - `enable2FA()` -> POST /users/2fa/enable
   - `verify2FA(code)` -> POST /users/2fa/verify

### Step 3: Create Auth UI Components

**LoginForm** (`app/frontend/components/auth/LoginForm.tsx`):
- Email input
- Password input
- Remember me checkbox
- Submit button
- Link to signup/forgot password
- Error messages
- 2FA code input (if required)

**SignupForm** (`app/frontend/components/auth/SignupForm.tsx`):
- Name input
- Email input
- Username input
- Password input
- Password confirmation
- Terms acceptance checkbox
- Submit button
- Link to login

**ForgotPasswordForm**:
- Email input
- Submit button
- Success message

**ProfilePage**:
- Display user info
- Edit profile form
- Change password
- Enable/disable 2FA
- Avatar upload

### Step 4: Create Auth Pages
Create pages in `app/frontend/pages/auth/`:

1. `LoginPage.tsx` - Login form with branding
2. `SignupPage.tsx` - Signup form
3. `ForgotPasswordPage.tsx` - Password reset
4. `ProfilePage.tsx` - User profile and settings

### Step 5: Protected Routes
Create `app/frontend/components/auth/ProtectedRoute.tsx`:

1. Check if user is authenticated
2. If not, redirect to login
3. Show loading state while checking
4. Render children if authenticated

---

## Part 3: Prompt Management UI

### Step 1: Create Prompt API Functions
Create `app/frontend/lib/api/prompts.ts`:

1. API methods:
   - `getPrompts(params)` -> GET /api/v1/prompts
   - `getPrompt(id)` -> GET /api/v1/prompts/:id
   - `createPrompt(data)` -> POST /api/v1/prompts
   - `updatePrompt(id, data)` -> PATCH /api/v1/prompts/:id
   - `deletePrompt(id)` -> DELETE /api/v1/prompts/:id
   - `getVersions(id)` -> GET /api/v1/prompts/:id/versions
   - `restoreVersion(id, versionId)` -> POST /api/v1/prompts/:id/restore_version
   - `duplicatePrompt(id)` -> POST /api/v1/prompts/:id/duplicate

### Step 2: Create Prompt Components

**PromptCard** (`app/frontend/components/prompts/PromptCard.tsx`):
- Display prompt title, description
- Show author, created date
- Show tags
- Show usage count, likes count
- Like button
- Bookmark button
- Share button
- Copy to clipboard button
- Actions menu (edit, delete, duplicate)

**PromptList** (`app/frontend/components/prompts/PromptList.tsx`):
- Grid or list view toggle
- Display array of PromptCards
- Pagination controls
- Empty state
- Loading skeleton

**PromptDetail** (`app/frontend/components/prompts/PromptDetail.tsx`):
- Full prompt display
- Author info
- Tags
- Attachments list with download buttons
- Like/bookmark buttons
- Usage count
- Comments section
- Version history link
- AI improvement button
- Share/export options

**PromptEditor** (`app/frontend/components/prompts/PromptEditor.tsx`):
- Form with react-hook-form:
  - Title input
  - Content textarea or rich text editor
  - Description textarea
  - Category select
  - Tags multiselect (with autocomplete)
  - AI provider select
  - Visibility select (private/public/team/org)
  - Team/org select (conditional)
  - File upload for attachments
- Save/cancel buttons
- Draft saving
- Preview mode

**PromptFilters** (`app/frontend/components/prompts/PromptFilters.tsx`):
- Search input
- Category filter
- Tag filter (multiselect)
- Visibility filter
- AI provider filter
- Sort options (recent, popular, alphabetical)
- Clear filters button

**VersionHistory** (`app/frontend/components/prompts/VersionHistory.tsx`):
- List of versions
- Show version number, date, changed by
- View diff button
- Restore button
- Compare versions

### Step 3: Create Prompt Pages

**PromptsIndexPage** (`app/frontend/pages/prompts/PromptsIndexPage.tsx`):
- Page header with "New Prompt" button
- PromptFilters
- PromptList
- Pagination

**PromptShowPage** (`app/frontend/pages/prompts/PromptShowPage.tsx`):
- PromptDetail component
- Comments section
- Related prompts sidebar

**PromptEditPage** (`app/frontend/pages/prompts/PromptEditPage.tsx`):
- PromptEditor with existing data
- Breadcrumbs
- Cancel/Save buttons

**PromptNewPage** (`app/frontend/pages/prompts/PromptNewPage.tsx`):
- PromptEditor (empty)
- Breadcrumbs

---

## Part 4: Comments & Social Features

### Step 1: Create Comment API Functions
Create `app/frontend/lib/api/comments.ts`:

1. API methods:
   - `createComment(promptId, content, parentId)` -> POST /api/v1/comments
   - `updateComment(id, content)` -> PATCH /api/v1/comments/:id
   - `deleteComment(id)` -> DELETE /api/v1/comments/:id
   - `likeComment(id)` -> POST /api/v1/comments/:id/like
   - `unlikeComment(id)` -> DELETE /api/v1/comments/:id/unlike

### Step 2: Create Comment Components

**CommentItem** (`app/frontend/components/comments/CommentItem.tsx`):
- Display comment content
- Author avatar and name
- Date
- Like button with count
- Reply button
- Edit/delete buttons (if owner)
- Nested replies
- Markdown rendering

**CommentForm** (`app/frontend/components/comments/CommentForm.tsx`):
- Textarea for comment content
- Submit button
- Cancel button (for replies/edits)
- Character counter
- Markdown preview

**CommentList** (`app/frontend/components/comments/CommentList.tsx`):
- Thread of comments
- Threaded/nested display
- Load more replies
- Sort options (newest, oldest, most liked)

### Step 3: Create Like/Bookmark Components

**LikeButton** (`app/frontend/components/shared/LikeButton.tsx`):
- Heart icon (filled if liked)
- Like count
- onClick: toggle like
- Animate on like

**BookmarkButton** (`app/frontend/components/shared/BookmarkButton.tsx`):
- Bookmark icon
- onClick: toggle bookmark
- Show saved state

---

## Part 5: AI Integration UI

### Step 1: Create AI API Functions
Create `app/frontend/lib/api/ai.ts`:

1. API methods:
   - `improvePrompt(promptId, provider, instructions)` -> POST /api/v1/ai/improve
   - `analyzePrompt(promptId, provider)` -> POST /api/v1/ai/analyze
   - `generateVariations(promptId, count, provider)` -> POST /api/v1/ai/variations
   - `compareProviders(promptId)` -> POST /api/v1/ai/compare
   - `getSuggestions(promptId)` -> GET /api/v1/ai/suggestions
   - `applySuggestion(suggestionId)` -> POST /api/v1/ai/suggestions/:id/apply

### Step 2: Create AI Components

**AIImproveButton** (`app/frontend/components/ai/AIImproveButton.tsx`):
- Button to trigger AI improvement
- Provider select dropdown (OpenAI, Anthropic, Both)
- Instructions textarea (optional)
- Submit button
- Loading state

**AISuggestionCard** (`app/frontend/components/ai/AISuggestionCard.tsx`):
- Display suggestion
- Show provider
- Show explanation
- Apply button
- Dismiss button
- Side-by-side diff view

**AIAnalysisDisplay** (`app/frontend/components/ai/AIAnalysisDisplay.tsx`):
- Show quality scores (clarity, specificity)
- Show suggestions
- Visual indicators (score bars)
- Detailed feedback

**AIComparisonView** (`app/frontend/components/ai/AIComparisonView.tsx`):
- Two-column layout
- OpenAI result on left
- Anthropic result on right
- Highlight differences
- Vote for better option

**AIUsageStats** (`app/frontend/components/ai/AIUsageStats.tsx`):
- Show tokens used
- Show requests made
- Show quota remaining
- Show cost estimate
- Progress bar for quota

### Step 3: Create AI Modal/Dialog
Create `app/frontend/components/ai/AIDialog.tsx`:

1. Modal with tabs:
   - Improve tab
   - Analyze tab
   - Variations tab
   - Compare tab

2. Show results in modal
3. Allow applying suggestions directly

---

## Part 6: Organization & Team UI

### Step 1: Create Organization API Functions
Create `app/frontend/lib/api/organizations.ts`:

1. API methods:
   - `getOrganizations()` -> GET /api/v1/organizations
   - `getOrganization(id)` -> GET /api/v1/organizations/:id
   - `createOrganization(data)` -> POST /api/v1/organizations
   - `updateOrganization(id, data)` -> PATCH /api/v1/organizations/:id
   - `deleteOrganization(id)` -> DELETE /api/v1/organizations/:id
   - `getMembers(orgId)` -> GET /api/v1/organizations/:id/members
   - `inviteMember(orgId, email, role)` -> POST /api/v1/organizations/:id/memberships
   - `removeMember(membershipId)` -> DELETE /api/v1/memberships/:id
   - `getTeams(orgId)` -> GET /api/v1/organizations/:id/teams

### Step 2: Create Organization Components

**OrganizationCard** (`app/frontend/components/organizations/OrganizationCard.tsx`):
- Org name and avatar
- Description
- Member count
- Prompt count
- Team count
- View button

**OrganizationSidebar** (`app/frontend/components/organizations/OrganizationSidebar.tsx`):
- Organization switcher
- Navigation links:
  - Dashboard
  - Prompts
  - Teams
  - Members
  - Settings

**MemberList** (`app/frontend/components/organizations/MemberList.tsx`):
- Table of members
- Columns: avatar, name, email, role, joined date
- Actions: change role, remove
- Invite button

**InviteMemberDialog** (`app/frontend/components/organizations/InviteMemberDialog.tsx`):
- Email input
- Role select
- Send invite button

**OrganizationSettings** (`app/frontend/components/organizations/OrganizationSettings.tsx`):
- General settings form
- Branding settings
- Feature toggles
- Danger zone (delete org)

### Step 3: Create Team Components

**TeamCard** (`app/frontend/components/teams/TeamCard.tsx`):
- Team name
- Description
- Member count
- Prompt count
- View button

**TeamMemberList** (`app/frontend/components/teams/TeamMemberList.tsx`):
- List of team members
- Add member button
- Remove member button

**CreateTeamDialog** (`app/frontend/components/teams/CreateTeamDialog.tsx`):
- Team name input
- Description input
- Create button

### Step 4: Create Organization Pages

**OrganizationDashboard** (`app/frontend/pages/organizations/DashboardPage.tsx`):
- Stats cards (members, prompts, teams)
- Activity feed
- Recent prompts
- Top contributors

**OrganizationPromptsPage** (`app/frontend/pages/organizations/PromptsPage.tsx`):
- Filter by team
- PromptList

**OrganizationTeamsPage** (`app/frontend/pages/organizations/TeamsPage.tsx`):
- List of teams
- Create team button

**OrganizationMembersPage** (`app/frontend/pages/organizations/MembersPage.tsx`):
- MemberList
- Invite member button

**OrganizationSettingsPage** (`app/frontend/pages/organizations/SettingsPage.tsx`):
- OrganizationSettings component
- Tabs for different setting sections

---

## Part 7: Layout & Navigation

### Step 1: Create Layout Components

**Navbar** (`app/frontend/components/layout/Navbar.tsx`):
- Logo/brand
- Search bar
- Navigation links:
  - Explore
  - My Prompts
  - Organizations
- User menu dropdown:
  - Profile
  - Settings
  - Logout
- Notifications icon with badge

**Sidebar** (`app/frontend/components/layout/Sidebar.tsx`):
- Navigation links
- Quick filters
- Organization switcher
- Collapsible

**Footer** (`app/frontend/components/layout/Footer.tsx`):
- Links (About, Privacy, Terms, Help)
- Social media links
- Copyright

**MainLayout** (`app/frontend/components/layout/MainLayout.tsx`):
- Navbar
- Sidebar (optional)
- Main content area
- Footer

**AuthLayout** (`app/frontend/components/layout/AuthLayout.tsx`):
- Centered content
- Branding
- No navbar/sidebar

### Step 2: Create Search Component
**GlobalSearch** (`app/frontend/components/shared/GlobalSearch.tsx`):
- Search input
- Dropdown with results:
  - Prompts
  - Users
  - Organizations
  - Tags
- Keyboard navigation (arrow keys, Enter)
- Recent searches

---

## Part 8: User Dashboard & Profile

### Step 1: Create Dashboard Page
**DashboardPage** (`app/frontend/pages/DashboardPage.tsx`):

1. Sections:
   - My recent prompts
   - Bookmarked prompts
   - Activity feed (from followed users)
   - Trending prompts
   - Recommended prompts (based on tags)

2. Quick stats:
   - Total prompts created
   - Total likes received
   - Total bookmarks

### Step 2: Create User Profile Page
**UserProfilePage** (`app/frontend/pages/users/UserProfilePage.tsx`):

1. User info:
   - Avatar
   - Name, username
   - Bio
   - Joined date
   - Follower/following counts
   - Follow button (if not self)

2. Tabs:
   - Prompts (user's public prompts)
   - Liked prompts
   - Activity

---

## Part 9: Notifications & Real-time Features

### Step 1: Create Notifications Component
**NotificationBell** (`app/frontend/components/notifications/NotificationBell.tsx`):
- Bell icon with badge (unread count)
- Dropdown with notifications list
- Mark as read
- Mark all as read
- View all link

**NotificationItem** (`app/frontend/components/notifications/NotificationItem.tsx`):
- Icon based on type
- Message
- Time ago
- Link to related item
- Read/unread indicator

### Step 2: Set Up ActionCable (Optional)
Create `app/frontend/lib/cable.ts`:

1. Connect to ActionCable
2. Subscribe to channels:
   - NotificationsChannel
   - CommentsChannel (for real-time comments)
   - PromptUpdatesChannel

3. Handle incoming messages
4. Update UI in real-time

---

## Part 10: Forms & Validation

### Step 1: Set Up Validation Schemas
Create `app/frontend/lib/validations/`:

1. **promptSchema.ts**:
   - Use Zod to define prompt validation
   - Title: min 3, max 200
   - Content: min 10, max 10000
   - Description: max 500

2. **userSchema.ts**:
   - Email validation
   - Password strength
   - Name length

3. **organizationSchema.ts**:
   - Name validation
   - Description length

### Step 2: Create Reusable Form Components
**FormField** (`app/frontend/components/shared/FormField.tsx`):
- Label
- Input/textarea/select
- Error message
- Help text

**FormSelect** - Select dropdown with react-hook-form
**FormTextarea** - Textarea with character counter
**FormFileUpload** - File upload with preview

---

## Part 11: State Management

### Step 1: Create Zustand Stores
Create stores in `app/frontend/stores/`:

1. **authStore.ts**:
   - Current user
   - Auth state
   - Login/logout actions

2. **promptsStore.ts** (optional if using React Query):
   - Prompts list
   - Filters
   - Selected prompt

3. **uiStore.ts**:
   - Sidebar collapsed state
   - Theme preference
   - Modal state

### Step 2: Use React Query for Server State
Create `app/frontend/lib/queries/`:

1. **usePrompts.ts**:
   - Query hook for fetching prompts
   - Infinite scroll support
   - Caching

2. **usePrompt.ts**:
   - Query hook for single prompt
   - Refetch on window focus

3. **useCreatePrompt.ts**:
   - Mutation hook for creating prompt
   - Optimistic updates
   - Cache invalidation

4. Create similar hooks for:
   - Comments
   - Organizations
   - Users
   - AI suggestions

---

## Part 12: Routing

### Step 1: Set Up React Router
Create `app/frontend/App.tsx`:

1. Configure routes:
   ```
   /                        -> Home/Explore
   /login                   -> Login
   /signup                  -> Signup
   /prompts                 -> Prompts list
   /prompts/new             -> New prompt
   /prompts/:id             -> Prompt detail
   /prompts/:id/edit        -> Edit prompt
   /prompts/:id/versions    -> Version history
   /dashboard               -> User dashboard
   /profile                 -> User profile
   /users/:id               -> Public user profile
   /organizations           -> Organizations list
   /organizations/new       -> New organization
   /organizations/:id       -> Org dashboard
   /organizations/:id/prompts -> Org prompts
   /organizations/:id/teams   -> Org teams
   /organizations/:id/members -> Org members
   /organizations/:id/settings -> Org settings
   /teams/:id               -> Team detail
   /bookmarks               -> User's bookmarks
   /settings                -> User settings
   ```

2. Use ProtectedRoute wrapper for authenticated routes

3. Add NotFound page (404)

---

## Part 13: Styling & Theming

### Step 1: Customize Tailwind Theme
Update `tailwind.config.ts`:

1. Add custom colors for branding
2. Add custom fonts
3. Add animations
4. Add custom spacing

### Step 2: Create Global Styles
Update `app/frontend/styles/application.css`:

1. Add CSS variables for theming
2. Add custom utility classes
3. Add animations

### Step 3: Add shadcn/ui Components
Install additional shadcn components as needed:

```bash
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add select
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add card
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add toast
```

---

## Part 14: Error Handling & Loading States

### Step 1: Create Error Boundary
**ErrorBoundary** (`app/frontend/components/shared/ErrorBoundary.tsx`):
- Catch React errors
- Display fallback UI
- Log errors to service (optional)

### Step 2: Create Loading Components
**LoadingSpinner** - Centered spinner
**SkeletonCard** - Skeleton for prompt cards
**SkeletonList** - Skeleton for lists
**PageLoader** - Full page loading state

### Step 3: Create Empty States
**EmptyState** (`app/frontend/components/shared/EmptyState.tsx`):
- Icon
- Title
- Description
- Call-to-action button

---

## Part 15: Accessibility & SEO

### Step 1: Add Accessibility Features
1. Use semantic HTML
2. Add ARIA labels
3. Ensure keyboard navigation
4. Add focus indicators
5. Test with screen reader

### Step 2: Add SEO Meta Tags
Create `app/frontend/components/shared/SEO.tsx`:
- Update page title
- Add meta description
- Add Open Graph tags
- Add Twitter card tags

---

## Part 16: Testing & Quality

### Step 1: Set Up Testing Framework
Install:
- `vitest`
- `@testing-library/react`
- `@testing-library/user-event`
- `@testing-library/jest-dom`

### Step 2: Write Component Tests
Test critical components:
- PromptCard
- PromptEditor
- CommentForm
- AuthForms

### Step 3: E2E Tests (Optional)
Use Playwright or Cypress:
- Test full user flows
- Test authentication
- Test creating/editing prompts

---

## Part 17: Performance Optimization

### Step 1: Code Splitting
1. Use React.lazy() for route-based splitting
2. Split heavy components (rich text editor, etc.)

### Step 2: Optimize Images
1. Use WebP format
2. Lazy load images
3. Add image optimization pipeline

### Step 3: Optimize Bundle Size
1. Analyze bundle with `npm run build -- --analyze`
2. Remove unused dependencies
3. Tree-shake libraries

### Step 4: Add Service Worker (Optional)
1. Cache API responses
2. Offline support
3. Background sync

---

## Part 18: Deployment Preparation

### Step 1: Environment Configuration
Create `.env.production`:
- API_URL
- WebSocket URL
- Feature flags

### Step 2: Build for Production
1. Run `npm run build`
2. Test production build locally
3. Verify all features work

### Step 3: Configure Rails for SPA
1. Serve index.html for all routes (catch-all)
2. Configure CORS if needed
3. Set up proper caching headers

---

## Completion Checklist

- [ ] All dependencies installed
- [ ] Project structure created
- [ ] API client configured
- [ ] Authentication flow complete
- [ ] Prompt CRUD UI complete
- [ ] Comments UI complete
- [ ] Social features (likes, bookmarks) working
- [ ] AI integration UI complete
- [ ] Organization management UI complete
- [ ] Team management UI complete
- [ ] Layout and navigation complete
- [ ] Search functionality working
- [ ] Notifications working
- [ ] Forms with validation
- [ ] State management set up
- [ ] Routing configured
- [ ] Styling and theming complete
- [ ] Error handling implemented
- [ ] Loading states everywhere
- [ ] Accessibility checked
- [ ] Tests written
- [ ] Performance optimized
- [ ] Production build working

---

## Final Steps

Congratulations! You now have a complete, full-stack PromptHub application:

1. **Backend**: Rails API with authentication, authorization, versioning, AI integration, and team management
2. **Frontend**: Modern React UI with all features

### Next Actions:
1. Deploy to production (Heroku, Render, Railway, etc.)
2. Set up CI/CD pipeline
3. Monitor with error tracking (Sentry, Rollbar)
4. Gather user feedback
5. Iterate and improve!

---

## Bonus Features to Consider

- **Search with Elasticsearch**: Full-text search
- **Analytics Dashboard**: Track usage metrics
- **API Documentation**: Swagger/OpenAPI docs
- **Public API**: Allow external integrations
- **Mobile App**: React Native version
- **Browser Extension**: Save prompts from anywhere
- **Slack/Discord Integration**: Share prompts in team chat
- **Prompt Marketplace**: Buy/sell premium prompts
- **AI Model Playground**: Test prompts with different models
- **Prompt Chaining**: Combine multiple prompts
- **Scheduled Prompts**: Run prompts on schedule
- **Webhooks**: Notify external services
- **Import/Export**: Bulk operations
- **Templates**: Pre-built prompt templates
