# frozen_string_literal: true

class Users::PasswordsController < Devise::PasswordsController
  # GET /users/password/new
  def new
    render inertia: 'auth/ForgotPassword', props: {
      flash: flash.to_hash
    }
  end

  # POST /users/password
  # def create
  #   super
  # end

  # GET /users/password/edit
  def edit
    render inertia: 'auth/ResetPassword', props: {
      reset_password_token: params[:reset_password_token],
      flash: flash.to_hash
    }
  end

  # PUT /users/password
  # def update
  #   super
  # end
end
