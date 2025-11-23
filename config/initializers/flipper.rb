require "flipper"
require "flipper/adapters/active_record"

# Configure Flipper to use ActiveRecord adapter
Flipper.configure do |config|
  config.adapter do
    Flipper::Adapters::ActiveRecord.new
  end
end

# Preload features in production for better performance
if Rails.env.production?
  Flipper.preload_all
end
