class PostsController < ApplicationController
	def new
		@post = Post.new
	end
	def create
		@post = Post.new(params[:post])
 		@save_status = @post.save

  		if @save_status
    		redirect_to @post
  		else
    		render 'new'
    	end
  	end
  	def show
  		@post = Post.find(params[:id])
	end
	def index
  		@posts = Post.all
	end
	def edit
  		@post = Post.find(params[:id])
	end	
	def update
  		@post = Post.find(params[:id])
  		@post.update_attributes(params[:post])
  		@save_status = @post.save
  		if @save_status
    		redirect_to @post
  		else
  			render 'edit'
    	end
	end
	def destroy
  		@post = Post.find(params[:id])
  		@post.destroy
  		redirect_to posts_path
	end
end
