class CreatePrompts < ActiveRecord::Migration[8.1]
  def change
    create_table :prompts do |t|
      t.string :title, null: false
      t.text :content, null: false
      t.text :description
      t.integer :visibility, default: 0, null: false  # 0: private, 1: public, 2: team
      t.references :user, null: false, foreign_key: true
      t.string :category
      t.integer :ai_provider, default: 0  # 0: both, 1: openai, 2: anthropic
      t.integer :usage_count, default: 0, null: false
      t.integer :like_count, default: 0, null: false
      t.string :slug  # For pretty URLs

      t.timestamps
    end

    add_index :prompts, :slug, unique: true
    add_index :prompts, :visibility
    add_index :prompts, :category
    add_index :prompts, :created_at
    add_index :prompts, [:user_id, :created_at]
  end
end
