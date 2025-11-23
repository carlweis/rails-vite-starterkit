class ProfilesController < ApplicationController
  before_action :authenticate_user!

  def show
    render inertia: "Profile", props: {
      user: {
        id: current_user.id,
        name: current_user.name,
        email: current_user.email,
        username: current_user.username,
        role: current_user.role
      }
    }
  end

  def update
    if current_user.update(profile_params)
      redirect_to profile_path, notice: "Profile updated successfully"
    else
      redirect_to profile_path, inertia: { errors: current_user.errors.full_messages }
    end
  end

  def update_password
    if current_user.valid_password?(password_params[:current_password])
      if current_user.update(password: password_params[:password], password_confirmation: password_params[:password_confirmation])
        # Sign in the user again to maintain session after password change
        bypass_sign_in(current_user)
        redirect_to profile_path, notice: "Password updated successfully"
      else
        redirect_to profile_path, alert: current_user.errors.full_messages.join(", ")
      end
    else
      redirect_to profile_path, alert: "Current password is incorrect"
    end
  end

  def destroy
    current_user.destroy
    redirect_to root_path, notice: "Your account has been deleted"
  end

  private

  def profile_params
    params.require(:user).permit(:name, :username, :email)
  end

  def password_params
    params.require(:user).permit(:current_password, :password, :password_confirmation)
  end
end
