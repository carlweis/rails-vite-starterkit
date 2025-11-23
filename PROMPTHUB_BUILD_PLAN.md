# PromptHub - Complete Build Plan

## Overview
PromptHub is a collaborative platform for teams to create, share, and optimize AI prompts. Think of it as "GitHub for Prompts" - a social network and knowledge base where teams can manage their prompt libraries, collaborate with AI assistance, and share best practices.

---

## Project Vision

### Core Features
- **Prompt Management**: Create, edit, version, and organize prompts
- **Social Features**: Like, comment, bookmark, and share prompts
- **AI Integration**: Improve prompts with OpenAI and Anthropic
- **Team Collaboration**: Organizations and teams for knowledge sharing
- **Version Control**: Track all changes with full history
- **File Attachments**: Include images, PDFs, and documents
- **Tagging System**: Organize and discover prompts easily

### Tech Stack
- **Backend**: Ruby on Rails 8.1 + PostgreSQL
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Shadcn UI
- **Authentication**: Devise + 2FA
- **Authorization**: Pundit
- **File Storage**: ActiveStorage
- **Background Jobs**: Sidekiq (optional)
- **AI APIs**: OpenAI, Anthropic

---

## Build Phases

### ✅ Phase 1: Foundation & Authentication (COMPLETED)
**Status**: Done ✓
**Branch**: `claude/build-theme-switcher-016FUo4a1Ad2yzL6RJy5N1vJ`

**What was built**:
- PostgreSQL database configuration
- Devise authentication with 2FA support
- Pundit authorization with role-based access
- User model with roles (user, admin)
- OTP encryption for 2FA
- Base policies and security

**Files Changed**:
- `app/models/user.rb`
- `app/policies/user_policy.rb`
- `app/policies/application_policy.rb`
- `app/controllers/application_controller.rb`
- `config/database.yml`
- `Gemfile` (added devise, pundit, bcrypt, etc.)

---

### ✅ Phase 2: Core Prompt Management (COMPLETED)
**Status**: Done ✓
**Branch**: `claude/build-theme-switcher-016FUo4a1Ad2yzL6RJy5N1vJ`

**What was built**:
- Prompt model with full CRUD
- Custom versioning system (PromptVersion)
- Tagging system (Tag, PromptTag)
- ActiveStorage for file attachments
- Visibility controls (private, public, team, org)
- AI provider tracking
- Prompt policy for authorization
- API endpoints with pagination
- Slug generation for SEO

**Files Created**:
- `app/models/prompt.rb`
- `app/models/prompt_version.rb`
- `app/models/tag.rb`
- `app/models/prompt_tag.rb`
- `app/policies/prompt_policy.rb`
- `app/controllers/api/v1/prompts_controller.rb`
- Migrations for all tables

**API Endpoints**:
- `GET /api/v1/prompts` - List prompts
- `POST /api/v1/prompts` - Create prompt
- `GET /api/v1/prompts/:id` - Show prompt
- `PATCH /api/v1/prompts/:id` - Update prompt
- `DELETE /api/v1/prompts/:id` - Delete prompt
- `GET /api/v1/prompts/:id/versions` - Version history
- `POST /api/v1/prompts/:id/restore_version` - Restore version

---

### 📋 Phase 3: Social Features (TO DO)
**Estimated Time**: 2-3 days
**Document**: `PHASE_3_SOCIAL_FEATURES.md`

**What to build**:
1. **Comments System**
   - Threaded comments on prompts
   - Edit/delete your own comments
   - Markdown support
   - Reply to comments

2. **Likes System**
   - Like prompts and comments
   - Counter cache for performance
   - Unlike functionality
   - Show who liked

3. **Bookmarks**
   - Bookmark prompts for later
   - Personal notes on bookmarks
   - Organize saved prompts

4. **User Following**
   - Follow/unfollow users
   - See followed users' activity
   - Follower/following counts

5. **Activity Feed**
   - Recent activity from followed users
   - Organization activity
   - Personal activity log

6. **Notifications** (Optional)
   - Comment notifications
   - Like notifications
   - Follow notifications
   - Mention notifications

**Key Models**:
- Comment
- Like (polymorphic)
- Bookmark
- Follow
- Activity
- Notification

---

### 📋 Phase 4: AI Integration (TO DO)
**Estimated Time**: 3-4 days
**Document**: `PHASE_4_AI_INTEGRATION.md`

**What to build**:
1. **OpenAI Integration**
   - Improve prompts with GPT-4
   - Analyze prompt quality
   - Generate variations
   - Auto-suggest tags

2. **Anthropic Integration**
   - Same features with Claude
   - Compare both providers
   - Side-by-side results

3. **AI Services**
   - Service layer for AI calls
   - Background job processing
   - Error handling and retries
   - Cost tracking

4. **Usage Limits**
   - Token quotas per user
   - Rate limiting
   - Usage dashboard
   - Cost calculation

5. **Caching**
   - Cache AI responses
   - Reduce API costs
   - Smart cache invalidation

**Key Features**:
- Prompt improvement
- Quality analysis
- Variation generation
- Provider comparison
- Auto-tagging
- Usage tracking

---

### 📋 Phase 5: Team Management (TO DO)
**Estimated Time**: 3-4 days
**Document**: `PHASE_5_TEAM_MANAGEMENT.md`

**What to build**:
1. **Organizations**
   - Create organizations
   - Organization settings
   - Branding (logo, colors)
   - Plan tiers (free, pro, enterprise)

2. **Memberships**
   - Invite members via email
   - Member roles (owner, admin, member)
   - Remove members
   - Member limits based on plan

3. **Teams Within Orgs**
   - Create teams
   - Add team members
   - Team-specific prompts
   - Team permissions

4. **Organization Features**
   - Shared prompt library
   - Organization-wide visibility
   - Team-based access control
   - Activity tracking
   - Analytics dashboard

5. **Invitation System**
   - Email invitations
   - Invitation tokens
   - Expiring invitations
   - Acceptance flow

**Key Models**:
- Organization
- Membership
- Team
- TeamMembership

---

### 📋 Phase 6: Frontend UI with React (TO DO)
**Estimated Time**: 5-7 days
**Document**: `PHASE_6_FRONTEND_UI.md`

**What to build**:
1. **Authentication UI**
   - Login/Signup forms
   - 2FA setup and verification
   - Profile management
   - Password reset

2. **Prompt Management UI**
   - Prompt list with filters
   - Prompt detail view
   - Prompt editor (rich text)
   - Version history viewer
   - File upload for attachments

3. **Social Features UI**
   - Comments thread
   - Like/bookmark buttons
   - User following
   - Activity feed
   - Notifications bell

4. **AI Features UI**
   - AI improvement dialog
   - Analysis display
   - Variations generator
   - Provider comparison
   - Usage stats

5. **Organization UI**
   - Org dashboard
   - Member management
   - Team management
   - Settings pages
   - Invitation flow

6. **Layout & Navigation**
   - Navbar with search
   - Sidebar navigation
   - User menu
   - Organization switcher
   - Footer

7. **Additional Features**
   - Global search
   - Responsive design
   - Dark mode (already have ThemeContext)
   - Loading states
   - Error handling
   - Toast notifications

**Key Technologies**:
- React Router for routing
- React Hook Form for forms
- Zod for validation
- Axios for API calls
- Zustand or React Query for state
- Shadcn UI components
- Tailwind CSS for styling

---

## Development Workflow

### For Each Phase:

1. **Read the Phase Document**
   - Review all steps carefully
   - Understand the requirements
   - Plan your approach

2. **Backend First**
   - Create models and migrations
   - Build API controllers
   - Implement policies
   - Test with Postman/cURL

3. **Test Database**
   - Run migrations
   - Create seed data
   - Test associations
   - Verify constraints

4. **Test APIs**
   - Test all CRUD operations
   - Test error cases
   - Test authorization
   - Document endpoints

5. **Commit Regularly**
   - Commit after each major feature
   - Write clear commit messages
   - Push to your branch

6. **Frontend Integration** (Phase 6)
   - Build UI components
   - Connect to APIs
   - Handle loading/error states
   - Test user flows

---

## Database Schema Overview

### Users & Authentication
- `users` - User accounts with Devise
- `memberships` - User-Organization relationships
- `follows` - User following relationships

### Prompts & Content
- `prompts` - Core prompt data
- `prompt_versions` - Version history
- `tags` - Tag definitions
- `prompt_tags` - Prompt-Tag relationships
- `active_storage_blobs` - File storage
- `active_storage_attachments` - File associations

### Social Features
- `comments` - Comments on prompts
- `likes` - Polymorphic likes
- `bookmarks` - User bookmarks
- `activities` - Activity feed
- `notifications` - User notifications

### AI Integration
- `ai_suggestions` - AI-generated suggestions
- `ai_usage` - API usage tracking

### Organizations & Teams
- `organizations` - Organization data
- `teams` - Teams within organizations
- `team_memberships` - User-Team relationships

---

## API Structure

All APIs are versioned under `/api/v1/`:

### Authentication (Devise)
- `POST /users/sign_in` - Login
- `DELETE /users/sign_out` - Logout
- `POST /users` - Signup

### Prompts
- `/api/v1/prompts` - CRUD operations
- `/api/v1/prompts/:id/versions` - Version management
- `/api/v1/prompts/:id/restore_version` - Restore version

### Social
- `/api/v1/comments` - Comment management
- `/api/v1/likes` - Like/unlike
- `/api/v1/bookmarks` - Bookmark management
- `/api/v1/users/:id/follow` - Follow users

### AI
- `/api/v1/ai/improve_prompt` - Improve with AI
- `/api/v1/ai/analyze_prompt` - Analyze quality
- `/api/v1/ai/generate_variations` - Generate variations
- `/api/v1/ai/suggestions` - Get AI suggestions

### Organizations
- `/api/v1/organizations` - CRUD operations
- `/api/v1/organizations/:id/members` - Member management
- `/api/v1/organizations/:id/teams` - Team management
- `/api/v1/memberships` - Invitation management

### Tags
- `/api/v1/tags` - Tag CRUD

---

## Key Design Decisions

### Why Custom Versioning?
- PaperTrail doesn't support Rails 8 yet
- More control over version data
- Can customize version comparison
- Simpler for this use case

### Why Polymorphic Likes?
- Single table for liking prompts and comments
- Easy to extend to other models
- Efficient querying

### Why JSONB for Settings?
- Flexible configuration storage
- No schema changes for new settings
- Fast queries with GIN indexes (PostgreSQL)
- Easy to add organization-specific settings

### Why Separate Teams from Organizations?
- Teams provide finer-grained access control
- Large orgs can have multiple teams
- Team-specific prompts and permissions
- Matches real-world structure

---

## Environment Variables Needed

Create `.env` file with:

```bash
# Database
DATABASE_USERNAME=your_db_user
DATABASE_PASSWORD=your_db_password
DATABASE_HOST=localhost

# Rails
SECRET_KEY_BASE=generate_with_rails_secret
OTP_SECRET_ENCRYPTION_KEY=generate_with_rails_secret

# AI APIs (Phase 4)
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key

# Email (for invitations - Phase 5)
SMTP_ADDRESS=smtp.gmail.com
SMTP_USERNAME=your_email
SMTP_PASSWORD=your_app_password

# Redis (for Sidekiq - optional)
REDIS_URL=redis://localhost:6379/0
```

---

## Testing Strategy

### Backend Testing
1. **Model Tests**: Test validations, associations, methods
2. **Policy Tests**: Test authorization rules
3. **Controller Tests**: Test API endpoints
4. **Integration Tests**: Test full workflows

### Frontend Testing
1. **Unit Tests**: Test individual components
2. **Integration Tests**: Test component interactions
3. **E2E Tests**: Test full user journeys (optional)

### Manual Testing
1. **API Testing**: Use Postman or Insomnia
2. **Browser Testing**: Test UI in different browsers
3. **Mobile Testing**: Test responsive design
4. **Accessibility Testing**: Use screen readers

---

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Assets precompiled
- [ ] CORS configured if needed
- [ ] API rate limiting set up
- [ ] Error monitoring set up (Sentry, etc.)

### Production Setup
- [ ] PostgreSQL database provisioned
- [ ] Redis instance (if using Sidekiq)
- [ ] File storage configured (S3, CloudFlare R2, etc.)
- [ ] Email service configured (SendGrid, Mailgun, etc.)
- [ ] SSL certificate installed
- [ ] Domain DNS configured
- [ ] Backups scheduled

### Post-Deployment
- [ ] Smoke test all features
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Verify email delivery
- [ ] Test payment flow (if applicable)

---

## Performance Considerations

### Database
- Add indexes on frequently queried columns
- Use counter caches for counts
- Optimize N+1 queries with `includes`
- Use pagination everywhere
- Consider materialized views for complex queries

### Caching
- Cache prompt list responses
- Cache user session data
- Cache AI responses
- Use fragment caching for expensive views
- Set appropriate cache TTLs

### Assets
- Minify and compress CSS/JS
- Use CDN for static assets
- Optimize images (WebP format)
- Lazy load images
- Code split React bundles

### API
- Rate limit API endpoints
- Implement request throttling
- Use background jobs for slow operations
- Stream large responses
- Compress responses with gzip

---

## Security Checklist

- [ ] CSRF protection enabled (Rails default)
- [ ] SQL injection protection (use ActiveRecord)
- [ ] XSS prevention (escape user input)
- [ ] Strong password requirements
- [ ] 2FA available and encouraged
- [ ] API rate limiting
- [ ] Secure headers configured (Rails default)
- [ ] Environment variables not committed
- [ ] API keys rotated regularly
- [ ] User input sanitized before AI calls
- [ ] File upload validation
- [ ] Authorization on all endpoints
- [ ] HTTPS enforced in production

---

## Monitoring & Maintenance

### Key Metrics to Track
1. **Application**:
   - Response times
   - Error rates
   - Request volume
   - Database query times

2. **Business**:
   - User signups
   - Prompts created
   - AI API usage
   - Active organizations

3. **Costs**:
   - Infrastructure costs
   - AI API costs
   - Storage costs
   - Email costs

### Tools to Consider
- **Error Tracking**: Sentry, Rollbar, Honeybadger
- **Performance**: New Relic, Scout APM, Skylight
- **Analytics**: Google Analytics, Mixpanel, Amplitude
- **Uptime**: Pingdom, UptimeRobot
- **Logging**: Papertrail, Loggly

---

## Future Enhancements

### Short Term
- [ ] Email notifications
- [ ] Markdown preview in editor
- [ ] Prompt templates
- [ ] Export prompts to JSON/CSV
- [ ] Import prompts from file
- [ ] Duplicate detection

### Medium Term
- [ ] Elasticsearch for better search
- [ ] Public API with API keys
- [ ] Webhooks for integrations
- [ ] Slack/Discord integration
- [ ] Browser extension
- [ ] Mobile app (React Native)

### Long Term
- [ ] Prompt marketplace (buy/sell)
- [ ] AI model playground
- [ ] Prompt chaining/workflows
- [ ] Scheduled prompt execution
- [ ] Analytics dashboard
- [ ] A/B testing for prompts
- [ ] Prompt performance tracking

---

## Getting Help

### Resources
- **Rails Guides**: https://guides.rubyonrails.org/
- **React Docs**: https://react.dev/
- **Tailwind Docs**: https://tailwindcss.com/docs
- **Shadcn UI**: https://ui.shadcn.com/
- **Devise Wiki**: https://github.com/heartcombo/devise/wiki
- **Pundit Docs**: https://github.com/varvet/pundit

### Community
- **Rails Forum**: https://discuss.rubyonrails.org/
- **React Forum**: https://react.dev/community
- **Stack Overflow**: Tag questions with `ruby-on-rails`, `react`, etc.

---

## Success Metrics

### Launch Goals
- [ ] 10 active users testing the platform
- [ ] 50+ prompts created
- [ ] 5 organizations created
- [ ] All core features working smoothly
- [ ] < 500ms average response time
- [ ] 99% uptime

### 3-Month Goals
- [ ] 100 active users
- [ ] 500+ prompts
- [ ] 20 organizations
- [ ] AI features being actively used
- [ ] Positive user feedback
- [ ] Feature requests prioritized

---

## Final Notes

This is an ambitious project with lots of moving parts. Here's how to approach it:

1. **Take it step by step**: Complete one phase before moving to the next
2. **Test thoroughly**: Don't skip testing - it saves time later
3. **Commit often**: Small, focused commits are easier to debug
4. **Document as you go**: Update docs when you make changes
5. **Ask for help**: Don't get stuck - reach out to communities
6. **Iterate**: Get feedback and improve continuously

Good luck building PromptHub! 🚀

---

**Created**: November 23, 2025
**Status**: Phases 1-2 Complete, Phases 3-6 Ready to Build
**Branch**: `claude/build-theme-switcher-016FUo4a1Ad2yzL6RJy5N1vJ`
