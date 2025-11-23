# Inertia.js configuration
InertiaRails.configure do |config|
  # Set the default version (for asset versioning and cache busting)
  # This can be a string, lambda, or any object that responds to `call`
  config.version = ViteRuby.digest

  # Configure Deep Merge (for shared data)
  # Set to true to deeply merge shared data with page props
  config.deep_merge_shared_data = false

  # Configure Layout
  # The default layout for Inertia responses
  config.layout = "inertia"
end
