class PromptVersion < ApplicationRecord
  # Associations
  belongs_to :prompt
  belongs_to :changed_by, class_name: 'User', optional: true

  # Validations
  validates :version_number, presence: true, uniqueness: { scope: :prompt_id }
  validates :content, presence: true

  # Scopes
  default_scope { order(version_number: :desc) }
  scope :recent, -> { order(created_at: :desc) }

  # Instance methods
  def restore!
    prompt.update!(content: content)
  end
end
