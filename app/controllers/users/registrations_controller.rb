# frozen_string_literal: true

class Users::RegistrationsController < Devise::RegistrationsController
  # GET /users/sign_up
  def new
    build_resource
    render inertia: 'auth/SignUp', props: {
      flash: flash.to_hash
    }
  end

  # POST /users
  # def create
  #   super
  # end

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
