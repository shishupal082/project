class CustomClass
	def initialize(id, name)
    	@id=id
    	@name=name
    end
	def id
		return "#{@id}"
	end
	def name
		return "#{@name}"
	end
end
class WelcomeController < ApplicationController
  def index
  	@c = CustomClass.new("10", "name")
  end
end
