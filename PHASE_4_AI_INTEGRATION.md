# Phase 4: AI Integration - Implementation Plan

## Overview
Integrate OpenAI (ChatGPT) and Anthropic (Claude) APIs to help users improve, iterate, and optimize their prompts with AI assistance.

---

## Part 1: Setup & Configuration

### Step 1: Install Required Gems
1. Add to Gemfile:
   - `gem 'ruby-openai'` - OpenAI API client
   - `gem 'anthropic'` or use HTTP client - Anthropic API client
   - `gem 'sidekiq'` - Background job processing (optional but recommended)
   - `gem 'redis'` - For Sidekiq and caching

2. Run `bundle install`

### Step 2: Configure API Keys
1. Add environment variables to `.env` (create if doesn't exist):
   ```
   OPENAI_API_KEY=your_key_here
   ANTHROPIC_API_KEY=your_key_here
   ```

2. Add `.env` to `.gitignore` if not already

3. Install `dotenv-rails` gem for loading environment variables

4. Configure initializers:
   - Create `config/initializers/openai.rb`
   - Create `config/initializers/anthropic.rb`
   - Set up API clients with keys from ENV

### Step 3: Set Up Sidekiq (Optional but Recommended)
1. Create `config/sidekiq.yml` with queue configuration

2. Update `config/application.rb`:
   - Set ActiveJob adapter to Sidekiq

3. Add Sidekiq web UI route (behind authentication)

---

## Part 2: AI Service Architecture

### Step 1: Create AI Service Classes
Create a service layer in `app/services/ai/`:

1. **Base Service** (`app/services/ai/base_service.rb`):
   - Abstract base class for AI services
   - Common methods: rate limiting, error handling, retry logic
   - Methods to override: `call`, `model_name`, `max_tokens`

2. **OpenAI Service** (`app/services/ai/openai_service.rb`):
   - Inherits from BaseService
   - Method: `improve_prompt(prompt_text, instructions = nil)`
   - Method: `generate_variations(prompt_text, count = 3)`
   - Method: `analyze_prompt(prompt_text)` - get quality feedback
   - Method: `suggest_tags(prompt_text)` - auto-suggest tags
   - Handle API errors gracefully

3. **Anthropic Service** (`app/services/ai/anthropic_service.rb`):
   - Similar structure to OpenAI service
   - Use Claude API for same methods
   - Different model parameters and endpoints

4. **Comparison Service** (`app/services/ai/comparison_service.rb`):
   - Run same prompt through both APIs
   - Return side-by-side comparison
   - Method: `compare(prompt_text, task)`

### Step 2: Create Prompt Improvement Service
Create `app/services/prompt_improver.rb`:

1. Purpose: Coordinate AI improvements for prompts

2. Methods:
   - `improve(prompt, provider: :both, instructions: nil)`
     - Call appropriate AI service(s)
     - Create PromptVersion with AI suggestions
     - Return improved content + explanation

   - `generate_variations(prompt, count: 3, provider: :openai)`
     - Generate multiple prompt variations
     - Return array of variations with explanations

   - `analyze(prompt, provider: :both)`
     - Get quality score and feedback
     - Return analysis object with:
       - Clarity score
       - Specificity score
       - Suggestions for improvement
       - Estimated effectiveness

---

## Part 3: Database Changes

### Step 1: Create AI Suggestion Model
1. Generate AiSuggestion model:
   - `prompt:references`
   - `user:references`
   - `provider:integer` (enum: openai, anthropic)
   - `suggestion_type:integer` (enum: improvement, variation, analysis)
   - `original_content:text`
   - `suggested_content:text`
   - `explanation:text`
   - `metadata:jsonb` (store scores, reasoning, etc.)
   - `applied:boolean` (default: false)
   - `tokens_used:integer`

2. Update migration:
   - Add indexes on prompt_id, user_id, provider, created_at
   - Add index on metadata using GIN for JSONB queries (PostgreSQL)

3. Update AiSuggestion model:
   - belongs_to :prompt
   - belongs_to :user
   - Enums for provider and suggestion_type
   - Validations
   - Scope: `applied` -> where(applied: true)
   - Scope: `by_provider` -> where(provider: provider)

### Step 2: Add AI Fields to Prompts
1. Generate migration: `AddAiFieldsToPrompts`

2. Add columns:
   - `ai_generated:boolean` (default: false)
   - `ai_improved:boolean` (default: false)
   - `quality_score:decimal` (0-100 score from AI analysis)
   - `last_analyzed_at:datetime`

3. Update Prompt model with these fields

### Step 3: Create AI Usage Tracking
1. Generate AiUsage model for tracking API usage:
   - `user:references`
   - `provider:integer` (openai, anthropic)
   - `operation:string` (improve, analyze, generate_variations)
   - `tokens_used:integer`
   - `cost_cents:integer` (calculated from tokens)
   - `prompt:references` (optional)

2. Purpose: Track costs and enforce usage limits

---

## Part 4: Background Jobs

### Step 1: Create AI Job Classes
Create background jobs in `app/jobs/`:

1. **PromptImprovementJob** (`app/jobs/prompt_improvement_job.rb`):
   - Perform async: Call AI service to improve prompt
   - Parameters: prompt_id, provider, user_id, instructions
   - On success: Create AiSuggestion record
   - On failure: Log error, notify user

2. **PromptAnalysisJob** (`app/jobs/prompt_analysis_job.rb`):
   - Analyze prompt quality
   - Update prompt's quality_score and last_analyzed_at
   - Create AiSuggestion with analysis

3. **BatchTagSuggestionJob** (`app/jobs/batch_tag_suggestion_job.rb`):
   - Process multiple prompts to suggest tags
   - Useful for existing prompts without tags

### Step 2: Handle Job Failures
1. Use Sidekiq retry mechanism with exponential backoff
2. Set up dead letter queue for failed jobs
3. Add monitoring/alerts for failures

---

## Part 5: API Controllers

### Step 1: Create AI Controller
Create `app/controllers/api/v1/ai_controller.rb`:

1. **Actions**:

   - `improve_prompt` (POST `/api/v1/ai/improve`):
     - Params: prompt_id, provider, instructions
     - Authenticate user
     - Check usage limits
     - Enqueue PromptImprovementJob
     - Return: { job_id, status: 'processing' }

   - `analyze_prompt` (POST `/api/v1/ai/analyze`):
     - Params: prompt_id, provider
     - Enqueue PromptAnalysisJob
     - Return analysis or job status

   - `generate_variations` (POST `/api/v1/ai/variations`):
     - Params: prompt_id, count, provider
     - Generate variations synchronously (quick) or async
     - Return array of variations

   - `compare_providers` (POST `/api/v1/ai/compare`):
     - Params: prompt_id, task
     - Run same prompt through OpenAI and Anthropic
     - Return side-by-side comparison

   - `suggestions` (GET `/api/v1/ai/suggestions`):
     - Get all AI suggestions for a prompt
     - Params: prompt_id
     - Return paginated suggestions

   - `apply_suggestion` (POST `/api/v1/ai/suggestions/:id/apply`):
     - Apply an AI suggestion to the prompt
     - Creates new PromptVersion
     - Marks suggestion as applied

2. **Private Methods**:
   - `check_usage_limits` - ensure user hasn't exceeded limits
   - `track_usage` - record AI API usage
   - `calculate_cost` - estimate cost in cents

### Step 2: Update Prompts Controller
Add AI-related actions to `api/v1/prompts_controller.rb`:

1. `auto_tag` - Suggest tags using AI
2. `improve` - Quick improvement endpoint (calls AI controller)
3. Add `ai_suggestions` to prompt JSON response

---

## Part 6: Rate Limiting & Usage Quotas

### Step 1: Implement Usage Limits
1. Create `app/models/concerns/ai_usage_limitable.rb`:
   - Module for User model
   - Method: `ai_requests_today` - count requests in last 24h
   - Method: `can_use_ai?` - check if under limit
   - Method: `ai_tokens_used_this_month` - track monthly usage

2. Update User model:
   - Include AiUsageLimitable concern
   - Add fields via migration:
     - `ai_quota_tokens:integer` (monthly limit)
     - `ai_quota_resets_at:datetime`

3. Set different limits based on user role:
   - Regular users: 10,000 tokens/month
   - Premium users: 100,000 tokens/month
   - Admins: unlimited

### Step 2: Create Rate Limiter
1. Use Rack::Attack or similar gem

2. Configure limits in `config/initializers/rack_attack.rb`:
   - Limit AI requests per user per hour
   - Throttle based on IP for anonymous users

### Step 3: Add Usage Dashboard
1. Create endpoint to view usage stats:
   - GET `/api/v1/users/me/ai_usage`
   - Return: tokens used, requests made, quota remaining, cost estimate

---

## Part 7: Prompt Templates & AI Personas

### Step 1: Create System Prompts
Create `app/prompts/` directory with template files:

1. **improvement_template.txt**:
   - Template for improving prompts
   - Variables: {original_prompt}, {instructions}

2. **analysis_template.txt**:
   - Template for analyzing prompt quality
   - Return structured JSON with scores

3. **variation_template.txt**:
   - Template for generating variations
   - Variables: {original_prompt}, {count}

4. **tag_suggestion_template.txt**:
   - Template for suggesting tags
   - Variables: {prompt_content}

### Step 2: Create Template Helper
Create `app/helpers/prompt_template_helper.rb`:
- Method to load and interpolate templates
- Method to parse AI responses (especially JSON)

---

## Part 8: Caching Strategy

### Step 1: Cache AI Responses
1. Use Redis to cache similar prompt improvements

2. Create cache key based on:
   - Prompt content (hash)
   - Provider
   - Operation type
   - Instructions (if any)

3. Cache TTL: 24 hours

4. Before calling AI API:
   - Check cache
   - Return cached result if exists
   - Otherwise call API and cache result

### Step 2: Implement Smart Caching
1. Only cache successful responses
2. Invalidate cache when prompt is updated
3. Track cache hit rate for monitoring

---

## Part 9: Error Handling & Resilience

### Step 1: Handle API Errors
1. Create custom error classes:
   - `AiServiceError` (base)
   - `RateLimitError`
   - `QuotaExceededError`
   - `InvalidResponseError`

2. In AI services:
   - Wrap API calls in begin/rescue
   - Retry on transient failures (429, 500, 503)
   - Exponential backoff
   - Log all errors

### Step 2: Fallback Strategies
1. If OpenAI fails, try Anthropic (or vice versa)
2. If both fail, queue for later retry
3. Notify user of failure with option to retry

### Step 3: Monitor API Health
1. Create health check endpoint for AI services
2. Track success/failure rates
3. Alert on high failure rates

---

## Part 10: Frontend Integration Helpers

### Step 1: Real-time Updates (Optional)
1. Use ActionCable or polling to notify users when AI job completes

2. Create WebSocket channel:
   - `AiSuggestionsChannel`
   - Broadcast when suggestion is ready
   - Update UI in real-time

### Step 2: Streaming Responses (Advanced)
1. For real-time AI generation:
   - Use OpenAI streaming API
   - Stream response chunks to frontend via SSE (Server-Sent Events)
   - Progressive display of AI output

---

## Part 11: Testing AI Integration

### Step 1: Stub AI Requests in Tests
1. Use VCR gem or WebMock to record/replay API responses

2. Create fixtures for common AI responses:
   - Improvement response
   - Analysis response
   - Variations response

### Step 2: Test AI Services
1. Unit tests for each service:
   - Test successful responses
   - Test error handling
   - Test retry logic
   - Test caching

2. Integration tests:
   - Test full flow from controller to AI service
   - Test job processing
   - Test usage tracking

### Step 3: Test with Real APIs (Optional)
1. Create test suite that calls real APIs
2. Run in CI with API keys in secrets
3. Monitor costs carefully

---

## Part 12: Cost Management

### Step 1: Track Costs
1. Calculate cost based on tokens used:
   - OpenAI: ~$0.002 per 1K tokens (GPT-4)
   - Anthropic: ~$0.003 per 1K tokens (Claude)

2. Update AiUsage model with cost calculation

3. Add admin dashboard to view total costs

### Step 2: Optimize Token Usage
1. Reduce system prompt length
2. Truncate very long prompts before sending
3. Use cheaper models for simple tasks (GPT-3.5 instead of GPT-4)
4. Cache aggressively

### Step 3: Set Budget Alerts
1. Monitor monthly spend
2. Alert admins when nearing budget limit
3. Automatically disable AI features if budget exceeded

---

## Part 13: Routes Configuration

Add to `config/routes.rb` under `api/v1`:

```ruby
namespace :ai do
  post :improve_prompt
  post :analyze_prompt
  post :generate_variations
  post :compare_providers

  resources :suggestions, only: [:index] do
    member do
      post :apply
    end
  end
end

namespace :users do
  get 'me/ai_usage'
end
```

---

## Testing Checklist

- [ ] OpenAI API configured and working
- [ ] Anthropic API configured and working
- [ ] Can improve prompts with both providers
- [ ] Can analyze prompt quality
- [ ] Can generate variations
- [ ] Can compare providers side-by-side
- [ ] Usage tracking working
- [ ] Rate limiting working
- [ ] Quota enforcement working
- [ ] Caching reducing API calls
- [ ] Background jobs processing correctly
- [ ] Error handling working (retry, fallback)
- [ ] Costs being calculated correctly
- [ ] AI suggestions can be applied to prompts
- [ ] Version history tracks AI improvements
- [ ] Auto-tagging working

---

## Security Considerations

1. **API Key Protection**:
   - Never expose keys in client-side code
   - Use environment variables
   - Rotate keys regularly

2. **Input Validation**:
   - Sanitize user input before sending to AI
   - Validate response from AI before saving
   - Prevent prompt injection attacks

3. **Rate Limiting**:
   - Prevent abuse of AI endpoints
   - Different limits for authenticated vs anonymous users

4. **Cost Controls**:
   - Hard limits on token usage per user
   - Alert on unusual usage patterns
   - Ability to disable AI for users if needed

---

## Completion Checklist

- [ ] OpenAI and Anthropic gems installed
- [ ] API keys configured
- [ ] AI service classes created
- [ ] Background jobs set up
- [ ] Database models for AI suggestions and usage
- [ ] Controllers and routes configured
- [ ] Usage limits and quotas implemented
- [ ] Rate limiting configured
- [ ] Caching strategy implemented
- [ ] Error handling robust
- [ ] Cost tracking working
- [ ] All endpoints tested
- [ ] Documentation updated

---

## Next Steps

After completing Phase 4, you'll have powerful AI capabilities! Next:
- **Phase 5**: Team Management & Organizations
- **Phase 6**: Frontend UI with React
