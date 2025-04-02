class PostsController < ApplicationController
	def new
		p Table.new(params[:post])
  	end
	def create
		# params[:post] = {:title => "Hello", :text => "World"}
		@post = Table.new(params[:post])
		@post.save
		p posts_path
		render :json => {:navigate => posts_path + "/" +@post.id.to_s,
						 :saved_data => params[:post],
						 :send_data => params
						}
	end

	def show
  		@post = Table.find(params[:id])
	end
	def index
  		@posts = Table.all
	end
	def edit
		@post = Table.find(params[:id])
	end
	def update
	  	@post = Table.find(params[:id])
	 
	  	if @post.update(params[:post].permit(:title, :text))
	    	redirect_to action: :show, id: @post.id #redirect_to @post
	  	else
	    	render 'edit'
	  	end
	end
	def get_json

        if not params[:id]
        	posts = Table.all
        	all_posts = Array.new
        	posts.map.each do |post|
        		# all_posts.push("msg_id => #{post.id}, msg_title => #{post.title}")
        	end
        	all_posts = posts
      		render :json => all_posts
      		return
    	else
      		begin
      			post = Table.find(params[:id])
      			render :json => post.to_json
      			return
      		rescue ActiveRecord::RecordNotFound
        		render :json => {:status => 'FAILURE', :error => 'INCORRECT_ID'}
        		return
      		rescue Exception => e
        		render :json => {:status => 'FAILURE', :error => e.inspect}
        		return
      	end
    end
	end
end
