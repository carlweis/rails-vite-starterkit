# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

# Only create demo user in development environment
if Rails.env.development?
  puts "Creating demo admin user..."

  demo_user = User.find_or_initialize_by(email: 'demo@example.com')

  if demo_user.new_record?
    demo_user.assign_attributes(
      password: 'demouser1234',
      password_confirmation: 'demouser1234',
      name: 'Demo Admin',
      username: 'demo',
      role: :admin
    )

    if demo_user.save
      puts "✓ Demo user created successfully!"
      puts "  Email: demo@example.com"
      puts "  Password: demouser1234"
      puts "  Role: Admin"
    else
      puts "✗ Failed to create demo user:"
      puts demo_user.errors.full_messages.join("\n")
    end
  else
    puts "✓ Demo user already exists"
  end
else
  puts "Skipping demo user creation (not in development environment)"
end
