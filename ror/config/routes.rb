Rails.application.routes.draw do
  resources :users
  # get 'welcome/index'
  # root 'application#index'
  root :to => 'application#index'

  resources :users

  # match 'register', to: 'users#new', via: :get
  get 'welcome/index'
  get 'error/index'
  match 'articles', to: 'articles#index', via: :get
  match 'articles', to: 'articles#create', via: :post
  match 'articles/new', to: 'articles#new', via: :get
  get 'articles/:id', to: 'articles#show'

  match '404', to: 'error#file_not_found', via: :all
  match '422', to: 'error#unprocessable', via: :all

  # match '500', to: 'error#internal_server_error', via: :all
  # match "*" => 'error/index'
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
  # resources :articles
  # resources :error
  # match 'articles/*' => 'articles#unknown', :via => :get
end
