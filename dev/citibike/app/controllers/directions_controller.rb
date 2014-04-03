class DirectionsController <ApplicationController

  def show
    @stations = HTTParty.get("http://citibikenyc.com/stations/json")
    # binding.pry
  end

end