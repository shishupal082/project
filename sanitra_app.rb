require 'sinatra'
require 'logger'
require 'json'
require 'pp'
require 'rack/mobile-detect'

set :port, 8080
set :static, true
set :public_folder, File.dirname(__FILE__)
set :views, "ruby/views/sanitra"
require_relative 'ruby/static_helper'

ENVIRONMENT = 'development'
BASEURL = 'http://localhost:8080/'
STATICPATH = '/static/'

use Rack::Logger
helpers do
  def logger
    request.logger
  end
end
get '/' do
    redirect '/ua'
end
get '/ua' do
    @name = request.env["HTTP_USER_AGENT"]
    logger.info @name
    erb :user_agent
end
get '/hello' do
    greeting = params[:greeting] || "Hi There"
    @name = params[:name] || "Nobody"
    erb :index, :locals => {'greeting' => greeting}
end
get '/home' do
    return File.read('templates/home.html')
end
get '/test/id/:id' do
    id = params[:id]
    static = Static.new(id)
	@title = "Test Id : #{id}"
	@file_name = static.get_html_file()
    @js = static.get_js_file()
    @css = static.get_css_file()
	@body_html = File.read(File.join(@file_name))
    erb :test_view
end
