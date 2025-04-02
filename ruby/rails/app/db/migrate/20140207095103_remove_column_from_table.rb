class RemoveColumnFromTable < ActiveRecord::Migration
  def up
    remove_column :tables, :title_new_xyz123
  end

  def down
    add_column :tables, :title_new_xyz123, :string
  end
end
