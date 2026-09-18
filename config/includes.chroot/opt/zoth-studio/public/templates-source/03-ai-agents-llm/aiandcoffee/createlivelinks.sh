#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "🚀 Creating LIVE Stripe Payment Links..."

# Price IDs
WORKSHOP_PRICE="price_1Tmwl9D70vviV6vn6F1EOqZB"
PRIVATE_PRICE="price_1Tmwl9D70vviV6vnxCk0UWsX"
PRIVATE_MONTHLY_PRICE="price_1TmwlBD70vviV6vnZVX9c4Rd"
PRIVATE_ANNUAL_PRICE="price_1TmwlBD70vviV6vnkiWahhJa"
STARTER_PRICE="price_1TmwlCD70vviV6vnbvzHDfzA"
AUTOPILOT_PRICE="price_1TmwlDD70vviV6vnec7nBYxQ"
SOCIAL_PRICE="price_1TmwlED70vviV6vnmCVXZ9Zk"

# Helper function to extract URL using jq
get_url() {
    echo "$1" | jq -r '.url'
}

echo "=== 1. Workshop $99 (one-time) ==="
WORKSHOP_LINK=$(stripe payment_links create --live -d "line_items[0][price]=$WORKSHOP_PRICE" -d "line_items[0][quantity]=1")
WORKSHOP_URL=$(get_url "$WORKSHOP_LINK")

echo "=== 2. Private $299 (one-time) ==="
PRIVATE_LINK=$(stripe payment_links create --live -d "line_items[0][price]=$PRIVATE_PRICE" -d "line_items[0][quantity]=1")
PRIVATE_URL=$(get_url "$PRIVATE_LINK")

echo "=== 3. Private Monthly $499/mo (30-day trial) ==="
PRIVATE_MONTHLY_LINK=$(stripe payment_links create --live -d "line_items[0][price]=$PRIVATE_MONTHLY_PRICE" -d "line_items[0][quantity]=1" -d "subscription_data[trial_period_days]=30")
PRIVATE_MONTHLY_URL=$(get_url "$PRIVATE_MONTHLY_LINK")

echo "=== 4. Private Annual $4,790/yr (30-day trial) ==="
PRIVATE_ANNUAL_LINK=$(stripe payment_links create --live -d "line_items[0][price]=$PRIVATE_ANNUAL_PRICE" -d "line_items[0][quantity]=1" -d "subscription_data[trial_period_days]=30")
PRIVATE_ANNUAL_URL=$(get_url "$PRIVATE_ANNUAL_LINK")

echo "=== 5. Starter $19/mo (30-day trial) ==="
STARTER_LINK=$(stripe payment_links create --live -d "line_items[0][price]=$STARTER_PRICE" -d "line_items[0][quantity]=1" -d "subscription_data[trial_period_days]=30")
STARTER_URL=$(get_url "$STARTER_LINK")

echo "=== 6. Autopilot Pro $39/mo (30-day trial) ==="
AUTOPILOT_LINK=$(stripe payment_links create --live -d "line_items[0][price]=$AUTOPILOT_PRICE" -d "line_items[0][quantity]=1" -d "subscription_data[trial_period_days]=30")
AUTOPILOT_URL=$(get_url "$AUTOPILOT_LINK")

echo "=== 7. Social & Media $79/mo (30-day trial) ==="
SOCIAL_LINK=$(stripe payment_links create --live -d "line_items[0][price]=$SOCIAL_PRICE" -d "line_items[0][quantity]=1" -d "subscription_data[trial_period_days]=30")
SOCIAL_URL=$(get_url "$SOCIAL_LINK")

echo ""
echo "✅ All LIVE Payment Links created!"
echo "=== COPY THIS BLOCK INTO app.js ==="
cat << EOF
const PAYMENT_LINKS = {
    class99: "$WORKSHOP_URL",
    private299: "$PRIVATE_URL",
    privateMonthly499: "$PRIVATE_MONTHLY_URL",
    privateAnnual4790: "$PRIVATE_ANNUAL_URL",
    starter19: "$STARTER_URL",
    autopilot39: "$AUTOPILOT_URL",
    media79: "$SOCIAL_URL",
    default: "$WORKSHOP_URL"
};
EOF
