require "sidekiq/web"
require "flipper/ui"

Rails.application.routes.draw do
  # Devise routes with custom controllers
  devise_for :users, controllers: {
    sessions: "users/sessions",
    registrations: "users/registrations",
    passwords: "users/passwords"
  }

  # Two-factor authentication routes
  namespace :users do
    resource :two_factor_settings, only: [ :show, :create, :destroy ]
    get "two_factor_authentication", to: "two_factor_authentication#show"
    post "two_factor_authentication", to: "two_factor_authentication#create"
  end

  # Admin-only UIs
  authenticate :user, ->(user) { user.admin? } do
    mount Sidekiq::Web => "/sidekiq"
    mount Flipper::UI.app(Flipper) => "/flipper"
  end

  get "home/index"

  # Inertia.js example page
  get "welcome", to: "inertia_pages#welcome"

  # User profile
  resource :profile, only: [ :show, :update, :destroy ] do
    patch "password", to: "profiles#update_password", on: :collection
  end

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  root "inertia_pages#welcome"
end
