Rails.application.routes.draw do
  devise_for :users
  get "home/index"

  # API routes
  namespace :api do
    namespace :v1 do
      resources :prompts do
        member do
          get :versions
          post :restore_version
          post :duplicate
          post :increment_usage
        end
      end

      resources :tags, only: [:index, :create, :show]
      resources :comments, only: [:create, :update, :destroy]
    end
  end

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  root "home#index"
end
