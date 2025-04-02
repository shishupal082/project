class AddColumnToTable < ActiveRecord::Migration
  def change
    add_column :tables, :xyz, :string
  end
end
