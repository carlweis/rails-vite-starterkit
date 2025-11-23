# Phase 5: Team Management & Organizations - Implementation Plan

## Overview
Enable teams and organizations to collaborate on prompts, share knowledge, and manage permissions. This allows companies to use PromptHub as a centralized prompt library for their entire organization.

---

## Part 1: Organization Model

### Step 1: Create Organization Model
1. Generate Organization model with fields:
   - `name:string` (required, unique)
   - `slug:string` (URL-friendly identifier)
   - `description:text`
   - `avatar_url:string`
   - `website:string`
   - `settings:jsonb` (for flexible settings storage)
   - `owner_id:integer` (references users)
   - `plan:integer` (enum: free, pro, enterprise)
   - `max_members:integer` (based on plan)

2. Update migration:
   - Add NOT NULL constraint on name
   - Add unique index on slug
   - Add index on owner_id
   - Add foreign key for owner_id -> users
   - Set default plan to 0 (free)

3. Update Organization model:
   - belongs_to :owner, class_name: 'User'
   - has_many :memberships, dependent: :destroy
   - has_many :users, through: :memberships
   - has_many :prompts, through: :users (or direct association)
   - has_many :teams, dependent: :destroy

4. Add validations:
   - name: presence, length (3-100), uniqueness
   - slug: presence, uniqueness, format (only alphanumeric and dashes)
   - plan: inclusion in allowed plans

5. Add callbacks:
   - before_validation: generate_slug (from name)
   - after_create: create_default_team
   - after_create: add_owner_as_admin_member

6. Add enums:
   - plan: { free: 0, pro: 1, enterprise: 2 }

7. Add scopes:
   - alphabetical
   - by_plan
   - recent

8. Add methods:
   - `at_member_limit?` - check if org has reached max members
   - `can_add_member?` - validate if new member can be added
   - `member?(user)` - check if user is a member

---

## Part 2: Membership Model (Join Table)

### Step 1: Create Membership Model
1. Generate Membership model:
   - `organization:references`
   - `user:references`
   - `role:integer` (enum: member, admin, owner)
   - `joined_at:datetime`
   - `invitation_token:string` (for invites)
   - `invitation_sent_at:datetime`
   - `invitation_accepted_at:datetime`

2. Update migration:
   - Add compound unique index on [organization_id, user_id]
   - Add index on invitation_token
   - Add index on role
   - Set joined_at default to current timestamp

3. Update Membership model:
   - belongs_to :organization
   - belongs_to :user
   - enum role: { member: 0, admin: 1, owner: 2 }

4. Add validations:
   - Uniqueness of user_id scoped to organization_id
   - Role presence
   - Only one owner per organization (custom validation)

5. Add scopes:
   - active -> where.not(invitation_accepted_at: nil)
   - pending -> where(invitation_accepted_at: nil)
   - by_role

6. Add methods:
   - `admin?` - check if role is admin or owner
   - `owner?` - check if owner
   - `accept_invitation!` - mark invitation as accepted
   - `generate_invitation_token` - create secure token

---

## Part 3: Teams Within Organizations

### Step 1: Create Team Model
1. Generate Team model:
   - `organization:references`
   - `name:string`
   - `description:text`
   - `slug:string`

2. Update migration:
   - Add unique index on [organization_id, slug]
   - Add index on organization_id

3. Update Team model:
   - belongs_to :organization
   - has_many :team_memberships, dependent: :destroy
   - has_many :users, through: :team_memberships
   - has_many :prompts (prompts can belong to a team)

4. Add validations:
   - name: presence, length (2-50)
   - slug: uniqueness scoped to organization_id

5. Add callbacks:
   - before_validation: generate_slug

6. Add scopes:
   - alphabetical
   - for_user -> joins with team_memberships

### Step 2: Create TeamMembership Model
1. Generate TeamMembership model:
   - `team:references`
   - `user:references`
   - `role:integer` (lead, member)

2. Update migration:
   - Add compound unique index on [team_id, user_id]

3. Update TeamMembership model:
   - belongs_to :team
   - belongs_to :user
   - enum role: { member: 0, lead: 1 }
   - Validation: uniqueness of user_id scoped to team_id

---

## Part 4: Update Existing Models

### Step 1: Update User Model
1. Add associations:
   - `has_many :memberships, dependent: :destroy`
   - `has_many :organizations, through: :memberships`
   - `has_many :owned_organizations, class_name: 'Organization', foreign_key: :owner_id`
   - `has_many :team_memberships, dependent: :destroy`
   - `has_many :teams, through: :team_memberships`

2. Add methods:
   - `member_of?(organization)` - check membership
   - `admin_of?(organization)` - check if admin/owner
   - `organizations_admin` - orgs where user is admin
   - `current_organization` - get primary organization (stored in session/token)

### Step 2: Update Prompt Model
1. Add fields via migration:
   - `organization_id:integer` (optional, for org-owned prompts)
   - `team_id:integer` (optional, for team-specific prompts)

2. Add associations:
   - `belongs_to :organization, optional: true`
   - `belongs_to :team, optional: true`

3. Update visibility enum:
   - Change from: { private: 0, public: 1, team: 2 }
   - To: { private: 0, public: 1, team: 2, organization: 3 }

4. Add scopes:
   - `for_organization(org_id)` -> where(organization_id: org_id)
   - `for_team(team_id)` -> where(team_id: team_id)
   - `organization_wide` -> where(visibility: :organization)

5. Update validations:
   - If visibility is :team, team_id must be present
   - If visibility is :organization, organization_id must be present

---

## Part 5: Authorization Updates

### Step 1: Create OrganizationPolicy
Create `app/policies/organization_policy.rb`:

1. Define rules:
   - `index?` - anyone can list organizations
   - `show?` - anyone can view public org profile, members can see private details
   - `create?` - authenticated users can create orgs
   - `update?` - only admins/owner
   - `destroy?` - only owner
   - `manage_members?` - admin or owner
   - `invite_member?` - admin or owner

2. Scope:
   - Return public organizations + user's organizations

### Step 2: Create MembershipPolicy
Create `app/policies/membership_policy.rb`:

1. Define rules:
   - `create?` - admin of organization
   - `update?` - admin of organization or self (for accepting invites)
   - `destroy?` - admin of org or self (to leave)
   - `change_role?` - only owner can change roles

### Step 3: Update PromptPolicy
1. Update `show?` rule:
   - Public prompts: anyone
   - Private: owner only
   - Team: team members only
   - Organization: organization members only

2. Update `update?` and `destroy?`:
   - Owner can always edit/delete
   - Team leads can edit team prompts
   - Organization admins can edit org prompts

3. Update Scope:
   - Include prompts from user's organizations
   - Include team prompts from user's teams

---

## Part 6: API Controllers

### Step 1: Organizations Controller
Create `app/controllers/api/v1/organizations_controller.rb`:

1. **Actions**:

   - `index` (GET `/api/v1/organizations`):
     - List all organizations (filtered by scope)
     - Support pagination
     - Support search by name

   - `show` (GET `/api/v1/organizations/:id`):
     - Show organization details
     - Include member count, team count, prompt count
     - Only show sensitive data to members

   - `create` (POST `/api/v1/organizations`):
     - Create new organization
     - Current user becomes owner
     - Auto-create default team

   - `update` (PATCH `/api/v1/organizations/:id`):
     - Update organization details
     - Only admins/owner

   - `destroy` (DELETE `/api/v1/organizations/:id`):
     - Delete organization
     - Only owner
     - Handle associated data (prompts, teams)

   - `members` (GET `/api/v1/organizations/:id/members`):
     - List all members
     - Include role, joined_at
     - Paginate

   - `prompts` (GET `/api/v1/organizations/:id/prompts`):
     - List organization's prompts
     - Filter by team, category, etc.

2. **Private Methods**:
   - `set_organization`
   - `organization_params` - permit name, description, avatar_url, website
   - `check_member_limit` - before adding members

### Step 2: Memberships Controller
Create `app/controllers/api/v1/memberships_controller.rb`:

1. **Actions**:

   - `create` (POST `/api/v1/organizations/:org_id/memberships`):
     - Invite user to organization
     - Generate invitation token
     - Send invitation email
     - Require admin/owner

   - `update` (PATCH `/api/v1/memberships/:id`):
     - Update member role
     - Accept invitation

   - `destroy` (DELETE `/api/v1/memberships/:id`):
     - Remove member or leave organization
     - Cannot remove owner
     - Owner must transfer ownership first

   - `accept_invite` (POST `/api/v1/memberships/:token/accept`):
     - Accept invitation via token
     - Mark invitation as accepted
     - Add user to organization

2. **Private Methods**:
   - `set_membership`
   - `set_organization`
   - `membership_params` - permit role, user_id
   - `send_invitation_email`

### Step 3: Teams Controller
Create `app/controllers/api/v1/teams_controller.rb`:

1. **Actions**:

   - `index` (GET `/api/v1/organizations/:org_id/teams`):
     - List organization's teams
     - Filter by user membership

   - `show` (GET `/api/v1/teams/:id`):
     - Show team details
     - Include members, prompts count

   - `create` (POST `/api/v1/organizations/:org_id/teams`):
     - Create new team within organization
     - Require organization membership

   - `update` (PATCH `/api/v1/teams/:id`):
     - Update team details
     - Require team lead or org admin

   - `destroy` (DELETE `/api/v1/teams/:id`):
     - Delete team
     - Handle team prompts (reassign or delete)

   - `add_member` (POST `/api/v1/teams/:id/members`):
     - Add user to team
     - User must be org member

   - `remove_member` (DELETE `/api/v1/teams/:id/members/:user_id`):
     - Remove user from team

2. **Private Methods**:
   - `set_team`
   - `set_organization`
   - `team_params`
   - `verify_org_membership`

---

## Part 7: Invitation System

### Step 1: Create Invitation Mailer
1. Generate mailer: `rails g mailer OrganizationMailer`

2. Create email templates:
   - `organization_invitation.html.erb`
   - `organization_invitation.text.erb`

3. Add methods to mailer:
   - `invitation_email(membership)` - send invitation
   - Include organization name, inviter name, accept link
   - Accept link: `/organizations/invitations/:token`

### Step 2: Handle Invitation Flow
1. When inviting user:
   - Check if user exists (by email)
   - If exists: create membership with pending status
   - If not: create invitation record, send email
   - Generate secure token

2. When accepting invitation:
   - Find membership by token
   - Verify token is valid and not expired
   - Mark as accepted
   - Redirect to organization dashboard

3. Add invitation expiry:
   - Invitations expire after 7 days
   - Add validation: `invitation_token_expired?`

---

## Part 8: Organization Settings & Features

### Step 1: Organization Settings Model
Use JSONB column for flexible settings:

1. Settings structure:
   ```json
   {
     "allow_public_signup": false,
     "require_admin_approval": true,
     "default_prompt_visibility": "organization",
     "allowed_ai_providers": ["openai", "anthropic"],
     "max_prompt_size": 10000,
     "branding": {
       "primary_color": "#3B82F6",
       "logo_url": "https://..."
     }
   }
   ```

2. Add methods to Organization model:
   - `setting(key)` - get setting value
   - `update_setting(key, value)` - update setting
   - Provide sensible defaults

### Step 2: Plan-Based Features
1. Define limits per plan:
   - Free: 5 members, 100 prompts
   - Pro: 50 members, 1000 prompts
   - Enterprise: unlimited

2. Add enforcement:
   - Check limits before creating prompts
   - Check limits before adding members
   - Show upgrade prompt if at limit

---

## Part 9: Organization Dashboard

### Step 1: Create Analytics/Stats
Add methods to Organization model:

1. `prompt_count` - total prompts
2. `active_members_count` - members who logged in last 30 days
3. `prompts_created_this_month`
4. `most_popular_prompts` - top 10 by usage
5. `most_active_members` - top contributors

### Step 2: Create Stats Endpoint
Create `app/controllers/api/v1/organizations/:id/stats_controller.rb`:

1. Return stats JSON:
   - Total members
   - Total prompts
   - Total teams
   - Activity metrics
   - Top contributors
   - Recent activity

---

## Part 10: Permissions & Roles

### Step 1: Define Permission Matrix
Create `app/models/concerns/organization_permissions.rb`:

1. Define what each role can do:
   - **Owner**: Everything
   - **Admin**: Manage members, teams, all prompts, settings (except delete org)
   - **Member**: Create prompts, join teams, view org prompts

2. Create ability checks:
   - `can_manage_members?(user)`
   - `can_manage_teams?(user)`
   - `can_change_settings?(user)`
   - `can_delete_organization?(user)`

### Step 2: Implement in Policies
Use these ability checks in Pundit policies for fine-grained control.

---

## Part 11: Prompt Sharing Within Organizations

### Step 1: Organization Prompt Library
1. Add scope to Prompt:
   - `organization_library(org)` - all prompts visible to org members
   - Include: public prompts, organization prompts, team prompts user has access to

2. Add filtering:
   - By team
   - By author (org member)
   - By category
   - By date range

### Step 2: Prompt Duplication Across Orgs
1. Add method to Prompt model:
   - `duplicate_to_organization(organization, user)` - create copy in org
   - Preserve content but create new record
   - Update organization_id and user_id

2. Add controller action:
   - POST `/api/v1/prompts/:id/duplicate`
   - Params: organization_id

---

## Part 12: Activity Tracking for Organizations

### Step 1: Extend Activity Model (from Phase 3)
1. Add `organization:references` to Activity model

2. Track organization-level activities:
   - Member joined
   - Member left
   - Prompt created
   - Team created
   - Settings changed

### Step 2: Organization Activity Feed
1. Add endpoint: GET `/api/v1/organizations/:id/activity`

2. Return recent activities:
   - Who did what
   - When
   - Paginated

---

## Part 13: Migration Strategy for Existing Prompts

### Step 1: Handle Existing Data
1. Create rake task to migrate existing team prompts:
   - Find prompts with visibility: team
   - Assign to default organization (if any)
   - Or mark as needing migration

2. Provide UI for users to:
   - Move personal prompts to organization
   - Specify which organization/team

---

## Part 14: Routes Configuration

Add to `config/routes.rb` under `api/v1`:

```ruby
resources :organizations do
  member do
    get :members
    get :prompts
    get :teams
    get :stats
    get :activity
  end

  resources :memberships, only: [:create, :update, :destroy]
  resources :teams do
    member do
      post 'members/:user_id', to: 'teams#add_member'
      delete 'members/:user_id', to: 'teams#remove_member'
    end
  end
end

post 'memberships/:token/accept', to: 'memberships#accept_invite'
```

---

## Part 15: Testing

### Test Organizations
1. Create organization
2. Add members with different roles
3. Test role-based permissions
4. Test member limits
5. Invite users
6. Accept invitations
7. Leave organization

### Test Teams
1. Create teams within organization
2. Add/remove team members
3. Create team prompts
4. Test team visibility

### Test Prompts
1. Create organization prompts
2. Test visibility rules
3. Test access for different roles
4. Duplicate prompts across orgs

### Test Permissions
1. Member trying to access admin features (should fail)
2. Admin managing members (should succeed)
3. Owner deleting organization (should succeed)

---

## Security Considerations

1. **Prevent Organization Hopping**:
   - Verify user is member before showing sensitive data
   - Check organization membership in all actions

2. **Invitation Token Security**:
   - Use secure random tokens
   - Set expiration date
   - One-time use (invalidate after acceptance)

3. **Role Escalation Prevention**:
   - Only owners can promote to admin
   - Only owners can transfer ownership
   - Validate role changes in policy

4. **Data Isolation**:
   - Ensure users can only see prompts they have access to
   - Prevent cross-organization data leaks
   - Test authorization thoroughly

---

## Completion Checklist

- [ ] Organization model created with validations
- [ ] Membership model with roles
- [ ] Teams and TeamMemberships created
- [ ] User, Prompt models updated with organization associations
- [ ] Policies updated for organization permissions
- [ ] Organizations controller with CRUD
- [ ] Memberships controller with invitations
- [ ] Teams controller
- [ ] Invitation emails working
- [ ] Settings stored in JSONB
- [ ] Plan-based limits enforced
- [ ] Organization stats/analytics
- [ ] Activity tracking for organizations
- [ ] Prompt sharing within orgs working
- [ ] Routes configured
- [ ] All endpoints tested
- [ ] Authorization thoroughly tested

---

## Next Steps

After completing Phase 5, you'll have full team/organization support! Next:
- **Phase 6**: Frontend UI with React - Build the complete user interface
