class Post < ActiveRecord::Base
  attr_accessible :text, :title
  validates :title, presence: true,
            		length: { minimum: 8 }
  validates :text, presence: true,
            		length: { minimum: 8 }
end
