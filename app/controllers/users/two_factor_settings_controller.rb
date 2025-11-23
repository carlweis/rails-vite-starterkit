# frozen_string_literal: true

class Users::TwoFactorSettingsController < ApplicationController
  before_action :authenticate_user!

  # GET /users/two_factor_settings
  def show
    if current_user.otp_required_for_login
      render inertia: 'auth/TwoFactorEnabled', props: {
        user: {
          otp_enabled: true
        },
        flash: flash.to_hash
      }
    else
      # Generate a new OTP secret for setup if one doesn't exist
      if current_user.otp_secret.blank?
        current_user.otp_secret = User.generate_otp_secret
        current_user.save!
      end

      qr_code = RQRCode::QRCode.new(current_user.otp_provisioning_uri(current_user.email, issuer: 'RailsApp'))
      qr_svg = qr_code.as_svg(
        offset: 0,
        color: '000',
        shape_rendering: 'crispEdges',
        module_size: 4
      )

      render inertia: 'auth/TwoFactorSetup', props: {
        qr_code: qr_svg,
        secret: current_user.otp_secret,
        flash: flash.to_hash
      }
    end
  end

  # POST /users/two_factor_settings
  def create
    if current_user.validate_and_consume_otp!(params[:otp_attempt])
      current_user.update!(otp_required_for_login: true)
      redirect_to users_two_factor_settings_path, notice: 'Two-factor authentication enabled successfully'
    else
      flash.now[:alert] = 'Invalid verification code. Please try again.'

      qr_code = RQRCode::QRCode.new(current_user.otp_provisioning_uri(current_user.email, issuer: 'RailsApp'))
      qr_svg = qr_code.as_svg(
        offset: 0,
        color: '000',
        shape_rendering: 'crispEdges',
        module_size: 4
      )

      render inertia: 'auth/TwoFactorSetup', props: {
        qr_code: qr_svg,
        secret: current_user.otp_secret,
        flash: flash.to_hash,
        error: 'Invalid verification code. Please try again.'
      }
    end
  end

  # DELETE /users/two_factor_settings
  def destroy
    current_user.update!(otp_required_for_login: false, otp_secret: nil)
    redirect_to users_two_factor_settings_path, notice: 'Two-factor authentication disabled'
  end
end
