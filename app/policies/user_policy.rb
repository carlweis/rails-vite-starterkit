class UserPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      if user&.admin?
        scope.all
      else
        scope.where(id: user&.id)
      end
    end
  end

  def index?
    user&.admin?
  end

  def show?
    user.present? && (record.id == user.id || user.admin?)
  end

  def create?
    true # Anyone can create a user (sign up)
  end

  def update?
    user.present? && (record.id == user.id || user.admin?)
  end

  def destroy?
    user.present? && (record.id == user.id || user.admin?)
  end

  def make_admin?
    user&.admin?
  end
end
