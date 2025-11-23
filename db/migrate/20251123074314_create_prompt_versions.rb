class CreatePromptVersions < ActiveRecord::Migration[8.1]
  def change
    create_table :prompt_versions do |t|
      t.references :prompt, null: false, foreign_key: true
      t.integer :version_number, null: false
      t.text :content, null: false
      t.string :change_description
      t.references :changed_by, foreign_key: { to_table: :users }

      t.timestamps
    end

    add_index :prompt_versions, [:prompt_id, :version_number], unique: true
    add_index :prompt_versions, :created_at
  end
end
