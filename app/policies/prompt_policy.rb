class PromptPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      if user&.admin?
        scope.all
      elsif user
        # Users can see their own prompts + public prompts + team prompts they have access to
        scope.where(visibility: :public_prompt)
             .or(scope.where(user_id: user.id))
             .or(scope.where(visibility: :team))  # TODO: Add team membership check
      else
        # Non-authenticated users can only see public prompts
        scope.where(visibility: :public_prompt)
      end
    end
  end

  def index?
    true  # Anyone can view the index (filtered by scope)
  end

  def show?
    record.public_prompt? || (user && record.user_id == user.id) || user&.admin?
  end

  def create?
    user.present?
  end

  def update?
    user.present? && (record.user_id == user.id || user.admin?)
  end

  def destroy?
    user.present? && (record.user_id == user.id || user.admin?)
  end

  def restore_version?
    update?
  end

  def duplicate?
    user.present?
  end
end
