class PromptTag < ApplicationRecord
  # Associations
  belongs_to :prompt
  belongs_to :tag, counter_cache: :usage_count

  # Validations
  validates :prompt_id, uniqueness: { scope: :tag_id }
end
