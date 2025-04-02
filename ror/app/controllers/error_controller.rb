class ErrorController < ApplicationController
	def index
		render plain: "Error index OK"
	end
	def file_not_found
		render plain: "Error file_not_found"
	end
	def unprocessable
		render plain: "Error unprocessable"
	end
	def internal_server_error
		render plain: "Error internal_server_error"
	end
end
