class CreateTables < ActiveRecord::Migration
  def change
    create_table :tables do |t|
      t.string :title
      t.text :text
      
      t.timestamps
    end
  end
end
