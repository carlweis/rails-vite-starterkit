class InertiaPagesController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:welcome]

  def welcome
    render inertia: "Welcome", props: {
      message: "Build modern SPAs with Rails and React using Inertia.js!",
      user: current_user ? {
        id: current_user.id,
        name: current_user.name,
        email: current_user.email,
        username: current_user.username,
        role: current_user.role
      } : nil
    }
  end
end
