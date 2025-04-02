=begin
	params => {
		:post => {:text => "", :title => "" }
	}
=end
class Table < ActiveRecord::Base
  attr_accessible :text, :title
end
