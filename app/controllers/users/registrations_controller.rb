# frozen_string_literal: true

class Users::RegistrationsController < Devise::RegistrationsController
  skip_before_action :verify_authenticity_token, only: [:create]

  # GET /users/sign_up
  def new
    build_resource
    render inertia: 'auth/SignUp', props: {
      flash: flash.to_hash
    }
  end

  # POST /users
  def create
    build_resource(sign_up_params)

    resource.save
    yield resource if block_given?
    if resource.persisted?
      if resource.active_for_authentication?
        set_flash_message! :notice, :signed_up
        sign_up(resource_name, resource)
        respond_with resource, location: after_sign_up_path_for(resource)
      else
        set_flash_message! :notice, :"signed_up_but_#{resource.inactive_message}"
        expire_data_after_sign_in!
        respond_with resource, location: after_inactive_sign_up_path_for(resource)
      end
    else
      clean_up_passwords resource
      set_minimum_password_length
      render inertia: 'auth/SignUp', props: {
        flash: { alert: resource.errors.full_messages.join(', ') }
      }
    end
  end

  # GET /users/edit
  def edit
    render inertia: 'auth/EditProfile', props: {
      user: {
        id: resource.id,
        email: resource.email,
        name: resource.name,
        username: resource.username
      },
      flash: flash.to_hash
    }
  end

  # PUT /users
  # def update
  #   super
  # end

  # DELETE /users
  # def destroy
  #   super
  # end

  protected

  # Override to allow name and username params
  def configure_sign_up_params
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name, :username])
  end

  # Override to allow name and username params
  def configure_account_update_params
    devise_parameter_sanitizer.permit(:account_update, keys: [:name, :username])
  end
end
