# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  # GET /users/sign_in
  def new
    render inertia: 'auth/SignIn', props: {
      flash: flash.to_hash
    }
  end

  # POST /users/sign_in
  # def create
  #   super
  # end

  # DELETE /users/sign_out
  # def destroy
  #   super
  # end

  protected

  # Override to redirect using Inertia
  def respond_to_on_destroy
    redirect_to after_sign_out_path_for(resource_name)
  end
end
