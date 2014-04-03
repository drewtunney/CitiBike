Citibike::Application.routes.draw do

  # get "/stations", to: "directions#index"
  
  root "directions#show"

end
