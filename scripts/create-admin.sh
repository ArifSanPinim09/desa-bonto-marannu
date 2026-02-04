#!/bin/bash

# Script to create admin user via Supabase API
# Usage: ./scripts/create-admin.sh

echo "==================================="
echo "Create Admin User for Village Website"
echo "==================================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "Error: .env.local file not found!"
    echo "Please create .env.local with your Supabase credentials"
    exit 1
fi

# Load environment variables
source .env.local

# Prompt for email and password
read -p "Enter admin email: " ADMIN_EMAIL
read -sp "Enter admin password: " ADMIN_PASSWORD
echo ""

# Create user using Supabase API
echo ""
echo "Creating admin user..."

curl -X POST "${NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users" \
  -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"${ADMIN_EMAIL}\",
    \"password\": \"${ADMIN_PASSWORD}\",
    \"email_confirm\": true,
    \"user_metadata\": {
      \"role\": \"admin\"
    }
  }"

echo ""
echo ""
echo "==================================="
echo "Admin user created successfully!"
echo "Email: ${ADMIN_EMAIL}"
echo "You can now login at /login"
echo "==================================="
