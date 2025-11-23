# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "user#{n}@example.com" }
    password { 'password123' }
    password_confirmation { 'password123' }
    name { Faker::Name.name }
    username { Faker::Internet.username }
    role { :user }

    trait :admin do
      role { :admin }
    end

    trait :with_2fa do
      otp_required_for_login { true }
      otp_secret { User.generate_otp_secret }
    end
  end
end
