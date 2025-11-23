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

  private

  def profile_params
    params.require(:user).permit(:name, :username, :email)
  end
end
