# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2025_11_23_074443) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.bigint "record_id", null: false
    t.string "record_type", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.string "content_type"
    t.datetime "created_at", null: false
    t.string "filename", null: false
    t.string "key", null: false
    t.text "metadata"
    t.string "service_name", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "prompt_tags", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "prompt_id", null: false
    t.bigint "tag_id", null: false
    t.datetime "updated_at", null: false
    t.index ["prompt_id", "tag_id"], name: "index_prompt_tags_on_prompt_id_and_tag_id", unique: true
    t.index ["prompt_id"], name: "index_prompt_tags_on_prompt_id"
    t.index ["tag_id"], name: "index_prompt_tags_on_tag_id"
  end

  create_table "prompt_versions", force: :cascade do |t|
    t.string "change_description"
    t.bigint "changed_by_id"
    t.text "content", null: false
    t.datetime "created_at", null: false
    t.bigint "prompt_id", null: false
    t.datetime "updated_at", null: false
    t.integer "version_number", null: false
    t.index ["changed_by_id"], name: "index_prompt_versions_on_changed_by_id"
    t.index ["created_at"], name: "index_prompt_versions_on_created_at"
    t.index ["prompt_id", "version_number"], name: "index_prompt_versions_on_prompt_id_and_version_number", unique: true
    t.index ["prompt_id"], name: "index_prompt_versions_on_prompt_id"
  end

  create_table "prompts", force: :cascade do |t|
    t.integer "ai_provider", default: 0
    t.string "category"
    t.text "content", null: false
    t.datetime "created_at", null: false
    t.text "description"
    t.integer "like_count", default: 0, null: false
    t.string "slug"
    t.string "title", null: false
    t.datetime "updated_at", null: false
    t.integer "usage_count", default: 0, null: false
    t.bigint "user_id", null: false
    t.integer "visibility", default: 0, null: false
    t.index ["category"], name: "index_prompts_on_category"
    t.index ["created_at"], name: "index_prompts_on_created_at"
    t.index ["slug"], name: "index_prompts_on_slug", unique: true
    t.index ["user_id", "created_at"], name: "index_prompts_on_user_id_and_created_at"
    t.index ["user_id"], name: "index_prompts_on_user_id"
    t.index ["visibility"], name: "index_prompts_on_visibility"
  end

  create_table "tags", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.string "slug", null: false
    t.datetime "updated_at", null: false
    t.integer "usage_count", default: 0, null: false
    t.index ["name"], name: "index_tags_on_name", unique: true
    t.index ["slug"], name: "index_tags_on_slug", unique: true
    t.index ["usage_count"], name: "index_tags_on_usage_count"
  end

  create_table "users", force: :cascade do |t|
    t.string "avatar_url"
    t.integer "consumed_timestep"
    t.datetime "created_at", null: false
    t.string "email", default: "", null: false
    t.string "encrypted_otp_secret"
    t.string "encrypted_otp_secret_iv"
    t.string "encrypted_otp_secret_salt"
    t.string "encrypted_password", default: "", null: false
    t.string "name"
    t.boolean "otp_required_for_login", default: false
    t.datetime "remember_created_at"
    t.datetime "reset_password_sent_at"
    t.string "reset_password_token"
    t.integer "role", default: 0, null: false
    t.datetime "updated_at", null: false
    t.string "username"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["username"], name: "index_users_on_username", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "prompt_tags", "prompts"
  add_foreign_key "prompt_tags", "tags"
  add_foreign_key "prompt_versions", "prompts"
  add_foreign_key "prompt_versions", "users", column: "changed_by_id"
  add_foreign_key "prompts", "users"
end
