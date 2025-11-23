module Api
  module V1
    class PromptsController < ApplicationController
      before_action :authenticate_user!, except: [:index, :show]
      before_action :set_prompt, only: [:show, :update, :destroy, :versions, :restore_version]

      # GET /api/v1/prompts
      def index
        @prompts = policy_scope(Prompt)
          .includes(:user, :tags)
          .page(params[:page])
          .per(params[:per_page] || 20)

        # Filters
        @prompts = @prompts.by_category(params[:category]) if params[:category].present?
        @prompts = @prompts.by_user(params[:user_id]) if params[:user_id].present?
        @prompts = @prompts.where(visibility: params[:visibility]) if params[:visibility].present?

        # Sorting
        @prompts = case params[:sort]
                   when 'popular'
                     @prompts.popular
                   when 'recent'
                     @prompts.recent
                   else
                     @prompts.recent
                   end

        render json: {
          prompts: @prompts.as_json(
            include: {
              user: { only: [:id, :name, :username, :email] },
              tags: { only: [:id, :name, :slug] }
            },
            methods: [:attachment_urls]
          ),
          meta: {
            current_page: @prompts.current_page,
            total_pages: @prompts.total_pages,
            total_count: @prompts.total_count
          }
        }
      end

      # GET /api/v1/prompts/:id
      def show
        authorize @prompt

        render json: @prompt.as_json(
          include: {
            user: { only: [:id, :name, :username, :email] },
            tags: { only: [:id, :name, :slug] },
            prompt_versions: { only: [:id, :version_number, :created_at, :change_description] }
          },
          methods: [:attachment_urls]
        )
      end

      # POST /api/v1/prompts
      def create
        @prompt = current_user.prompts.build(prompt_params)
        authorize @prompt

        if @prompt.save
          attach_files if params[:attachments].present?
          attach_tags if params[:tag_ids].present?

          render json: @prompt, status: :created
        else
          render json: { errors: @prompt.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /api/v1/prompts/:id
      def update
        authorize @prompt

        if @prompt.update(prompt_params)
          attach_files if params[:attachments].present?
          update_tags if params[:tag_ids].present?

          render json: @prompt
        else
          render json: { errors: @prompt.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/prompts/:id
      def destroy
        authorize @prompt
        @prompt.destroy

        head :no_content
      end

      # GET /api/v1/prompts/:id/versions
      def versions
        authorize @prompt

        @versions = @prompt.prompt_versions.includes(:changed_by)

        render json: @versions.as_json(
          include: {
            changed_by: { only: [:id, :name, :username, :email] }
          }
        )
      end

      # POST /api/v1/prompts/:id/restore_version
      def restore_version
        authorize @prompt, :restore_version?

        version = @prompt.prompt_versions.find(params[:version_id])
        version.restore!

        render json: @prompt.reload
      end

      private

      def set_prompt
        @prompt = Prompt.find_by(id: params[:id]) || Prompt.find_by!(slug: params[:id])
      end

      def prompt_params
        params.require(:prompt).permit(
          :title,
          :content,
          :description,
          :visibility,
          :category,
          :ai_provider
        )
      end

      def attach_files
        params[:attachments].each do |file|
          @prompt.attachments.attach(file)
        end
      end

      def attach_tags
        tag_ids = params[:tag_ids].is_a?(String) ? JSON.parse(params[:tag_ids]) : params[:tag_ids]
        tag_ids.each do |tag_id|
          @prompt.prompt_tags.find_or_create_by(tag_id: tag_id)
        end
      end

      def update_tags
        tag_ids = params[:tag_ids].is_a?(String) ? JSON.parse(params[:tag_ids]) : params[:tag_ids]
        @prompt.prompt_tags.where.not(tag_id: tag_ids).destroy_all
        tag_ids.each do |tag_id|
          @prompt.prompt_tags.find_or_create_by(tag_id: tag_id)
        end
      end
    end
  end
end
