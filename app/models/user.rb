class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :two_factor_authenticatable,
         otp_secret_encryption_key: ENV.fetch('OTP_SECRET_ENCRYPTION_KEY', Rails.application.secret_key_base)

  # Associations
  has_many :prompts, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :prompt_versions, foreign_key: :changed_by_id, dependent: :nullify

  # Enums
  enum :role, { user: 0, admin: 1 }

  # Validations
  validates :email, presence: true, uniqueness: true
  validates :username, uniqueness: true, allow_nil: true
  validates :name, length: { maximum: 100 }

  # Methods
  def display_name
    name.presence || username.presence || email.split('@').first
  end
end
