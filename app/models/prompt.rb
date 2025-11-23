class Prompt < ApplicationRecord
  # Associations
  belongs_to :user
  has_many :prompt_versions, dependent: :destroy
  has_many :prompt_tags, dependent: :destroy
  has_many :tags, through: :prompt_tags
  has_many :comments, dependent: :destroy
  has_many_attached :attachments

  # Enums
  enum :visibility, { private_prompt: 0, public_prompt: 1, team: 2 }
  enum :ai_provider, { both: 0, openai: 1, anthropic: 2 }

  # Validations
  validates :title, presence: true, length: { minimum: 3, maximum: 200 }
  validates :content, presence: true, length: { minimum: 10, maximum: 10000 }
  validates :description, length: { maximum: 500 }, allow_blank: true
  validates :slug, uniqueness: true, allow_nil: true
  validates :category, length: { maximum: 50 }, allow_blank: true

  # Callbacks
  before_validation :generate_slug, on: :create
  after_update :create_version, if: :saved_change_to_content?

  # Scopes
  scope :public_prompts, -> { where(visibility: :public_prompt) }
  scope :recent, -> { order(created_at: :desc) }
  scope :popular, -> { order(usage_count: :desc, like_count: :desc) }
  scope :by_category, ->(category) { where(category: category) if category.present? }
  scope :by_user, ->(user_id) { where(user_id: user_id) }

  # Instance methods
  def increment_usage!
    increment!(:usage_count)
  end

  def increment_likes!
    increment!(:like_count)
  end

  def decrement_likes!
    decrement!(:like_count)
  end

  def attachment_urls
    return [] unless attachments.attached?

    attachments.map do |attachment|
      {
        id: attachment.id,
        filename: attachment.filename.to_s,
        content_type: attachment.content_type,
        byte_size: attachment.byte_size,
        url: Rails.application.routes.url_helpers.rails_blob_url(attachment, only_path: true)
      }
    end
  end

  private

  def generate_slug
    return if title.blank?

    base_slug = title.parameterize
    self.slug = base_slug
    counter = 1

    while Prompt.exists?(slug: slug)
      self.slug = "#{base_slug}-#{counter}"
      counter += 1
    end
  end

  def create_version
    prompt_versions.create!(
      content: content_before_last_save,
      version_number: prompt_versions.count + 1,
      changed_by_id: user_id,
      change_description: "Updated prompt content"
    )
  end
end
