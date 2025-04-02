class ApplicationController < ActionController::Base
    # Prevent CSRF attacks by raising an exception.
    # For APIs, you may want to use :null_session instead.
    # protect_from_forgery with: :exception
    # redirect_to "/welcome/index"
    def index
        # render plain: "Application index OK"
        redirect_to "/error/index" and return
    end
end
