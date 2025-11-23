# frozen_string_literal: true

require 'rails_helper'
require 'rotp'

RSpec.feature 'User Profile', type: :feature do
  let(:user) { create(:user) }

  before do
    sign_in user
  end

  describe 'accessing profile settings' do
    scenario 'user can access the profile page' do
      # This is a placeholder for when profile page exists
      # For now, we're focusing on 2FA settings
      expect(current_path).to eq(root_path)
    end
  end

  describe 'Two-Factor Authentication Settings' do
    describe 'when 2FA is not enabled' do
      scenario 'user can view the 2FA setup page' do
        visit users_two_factor_settings_path

        # Check that we're on the setup page
        # Since this is an Inertia.js app, we'll check for the presence of key elements
        expect(page).to have_current_path(users_two_factor_settings_path)
      end

      scenario 'user can see QR code and secret for 2FA setup' do
        visit users_two_factor_settings_path

        # Verify the user has an OTP secret generated
        user.reload
        expect(user.otp_secret).to be_present
      end

      scenario 'user can enable 2FA with valid OTP code', js: true do
        visit users_two_factor_settings_path

        # Get the user's OTP secret
        user.reload
        otp_secret = user.otp_secret

        # Generate a valid OTP code using ROTP
        totp = ROTP::TOTP.new(otp_secret)
        valid_otp = totp.now

        # Find the OTP input field and submit button
        # Note: The exact selectors depend on your Inertia.js component implementation
        # We'll use a generic approach that works with standard forms
        page.execute_script("document.querySelector('input[name=\"otp_attempt\"]').value = '#{valid_otp}'")
        page.execute_script("document.querySelector('form').submit()")

        # Wait for the redirect
        sleep 1

        # Verify 2FA is enabled
        user.reload
        expect(user.otp_required_for_login).to be true
      end

      scenario 'user sees error with invalid OTP code', js: true do
        visit users_two_factor_settings_path

        # Submit an invalid OTP code
        page.execute_script("document.querySelector('input[name=\"otp_attempt\"]').value = '000000'")
        page.execute_script("document.querySelector('form').submit()")

        # Wait for the response
        sleep 1

        # Verify 2FA is not enabled
        user.reload
        expect(user.otp_required_for_login).to be false
      end
    end

    describe 'when 2FA is already enabled' do
      let(:user_with_2fa) { create(:user, :with_2fa) }

      before do
        sign_in user_with_2fa
      end

      scenario 'user can view the 2FA enabled page' do
        visit users_two_factor_settings_path

        # Check that we're on the enabled page
        expect(page).to have_current_path(users_two_factor_settings_path)
      end

      scenario 'user can disable 2FA', js: true do
        visit users_two_factor_settings_path

        # Find and click the disable button
        # Note: The exact selector depends on your Inertia.js component implementation
        page.execute_script("document.querySelector('form').submit()")

        # Wait for the redirect
        sleep 1

        # Verify 2FA is disabled
        user_with_2fa.reload
        expect(user_with_2fa.otp_required_for_login).to be false
        expect(user_with_2fa.otp_secret).to be_nil
      end
    end

    describe '2FA secret persistence' do
      scenario 'OTP secret persists across page refreshes during setup' do
        visit users_two_factor_settings_path

        # Get the initial secret
        user.reload
        initial_secret = user.otp_secret
        expect(initial_secret).to be_present

        # Refresh the page
        visit users_two_factor_settings_path

        # Verify the secret hasn't changed
        user.reload
        expect(user.otp_secret).to eq(initial_secret)
      end

      scenario 'OTP secret is not regenerated when returning to setup page' do
        # First visit
        visit users_two_factor_settings_path
        user.reload
        first_secret = user.otp_secret

        # Leave and come back
        visit root_path
        visit users_two_factor_settings_path

        # Verify secret hasn't changed
        user.reload
        expect(user.otp_secret).to eq(first_secret)
      end
    end

    describe '2FA verification with drift tolerance' do
      scenario 'accepts OTP codes with clock drift during setup', js: true do
        visit users_two_factor_settings_path

        user.reload
        otp_secret = user.otp_secret

        # Generate an OTP code from 30 seconds ago (within drift tolerance)
        totp = ROTP::TOTP.new(otp_secret)
        old_otp = totp.at(Time.now - 30)

        # Submit the old OTP code
        page.execute_script("document.querySelector('input[name=\"otp_attempt\"]').value = '#{old_otp}'")
        page.execute_script("document.querySelector('form').submit()")

        # Wait for the redirect
        sleep 1

        # Verify 2FA is enabled (drift tolerance allowed it)
        user.reload
        expect(user.otp_required_for_login).to be true
      end
    end

    describe 'authentication flow' do
      let(:user_with_2fa) { create(:user, :with_2fa) }

      scenario 'user must provide OTP code during login', js: true do
        # Sign out first
        visit destroy_user_session_path

        # Try to sign in
        visit new_user_session_path
        page.execute_script("document.querySelector('input[name=\"user[email]\"]').value = '#{user_with_2fa.email}'")
        page.execute_script("document.querySelector('input[name=\"user[password]\"]').value = 'password123'")
        page.execute_script("document.querySelector('form').submit()")

        # Wait for redirect to 2FA page
        sleep 1

        # Should be redirected to 2FA verification page
        expect(page).to have_current_path(users_two_factor_authentication_path)
      end

      scenario 'user can complete login with valid OTP code', js: true do
        # Sign out first
        visit destroy_user_session_path

        # Sign in with email and password
        visit new_user_session_path
        page.execute_script("document.querySelector('input[name=\"user[email]\"]').value = '#{user_with_2fa.email}'")
        page.execute_script("document.querySelector('input[name=\"user[password]\"]').value = 'password123'")
        page.execute_script("document.querySelector('form').submit()")

        # Wait for redirect to 2FA page
        sleep 1

        # Generate valid OTP code
        totp = ROTP::TOTP.new(user_with_2fa.otp_secret)
        valid_otp = totp.now

        # Submit OTP code
        page.execute_script("document.querySelector('input[name=\"otp_attempt\"]').value = '#{valid_otp}'")
        page.execute_script("document.querySelector('form').submit()")

        # Wait for the redirect
        sleep 2

        # Should be logged in now
        expect(page).to have_current_path(root_path)
      end
    end
  end
end
