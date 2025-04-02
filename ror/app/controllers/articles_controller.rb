class ArticlesController < ApplicationController
	layout "layout"
	def index
		@articles = Article.all
	end
	def show
		Rails.logger.info "ArticlesController : show"
		@article = Article.find_by(id: params[:id])
		Rails.logger.info @article
		Rails.logger.info @article.title
		Rails.logger.info @article.created_at
	end
	def new
		@article = Article.new
	end
	def edit
		@article = Article.find(params[:id])
	end
	def create
  		# render plain: params[:article].inspect
  		# render :json => params[:article]
  		# @article = Article.new(params[:article])
  		# @article = Article.new(params.require(:article).permit(:title, :text))

		# @article.save
		@article = Article.new(article_params)
		if @article.save
			redirect_to "/articles"
		else
			render 'new'
		end
  	end
  	def update
		@article = Article.find(params[:id])
		if @article.update(article_params)
			redirect_to @article
		else
			render 'edit'
		end
	end
	def unknown
		render 'edit'
	end
	private
		def article_params
			params.require(:article).permit(:title, :text)
		end
end
