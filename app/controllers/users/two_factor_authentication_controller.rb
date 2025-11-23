# frozen_string_literal: true

class Users::TwoFactorAuthenticationController < Devise::SessionsController
  skip_before_action :handle_two_factor_authentication

  # GET /users/two_factor_authentication
  def show
    unless session[:otp_user_id]
      redirect_to new_user_session_path
      return
    end

    render inertia: 'auth/TwoFactorVerify', props: {
      flash: flash.to_hash
    }
  end

  # POST /users/two_factor_authentication
  def create
    user = User.find_by(id: session[:otp_user_id])

    # Allow some drift tolerance for clock differences
    if user&.validate_and_consume_otp!(params[:otp_attempt], drift: 60)
      session.delete(:otp_user_id)
      sign_in(user)
      redirect_to after_sign_in_path_for(user)
    else
      flash.now[:alert] = 'Invalid authentication code'
      render inertia: 'auth/TwoFactorVerify', props: {
        flash: flash.to_hash,
        error: 'Invalid authentication code'
      }
    end
  end
end
