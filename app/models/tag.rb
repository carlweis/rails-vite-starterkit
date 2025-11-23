class Tag < ApplicationRecord
  # Associations
  has_many :prompt_tags, dependent: :destroy
  has_many :prompts, through: :prompt_tags

  # Validations
  validates :name, presence: true, uniqueness: { case_sensitive: false }, length: { maximum: 50 }
  validates :slug, presence: true, uniqueness: true

  # Callbacks
  before_validation :generate_slug, on: :create
  after_create :set_initial_usage_count
  after_destroy :decrement_usage_count_on_destroy

  # Scopes
  scope :popular, -> { order(usage_count: :desc) }
  scope :alphabetical, -> { order(name: :asc) }

  # Instance methods
  def increment_usage!
    increment!(:usage_count)
  end

  def decrement_usage!
    decrement!(:usage_count) if usage_count > 0
  end

  private

  def generate_slug
    return if name.blank?
    self.slug = name.parameterize
  end

  def set_initial_usage_count
    update_column(:usage_count, prompts.count) if usage_count.zero?
  end

  def decrement_usage_count_on_destroy
    # Already handled by dependent: :destroy on prompt_tags
  end
end
