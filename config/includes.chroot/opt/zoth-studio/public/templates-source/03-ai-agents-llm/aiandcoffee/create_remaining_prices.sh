#!/bin/bash

# Run this to create the remaining prices and products after the partial run

echo "Creating remaining prices and products..."

#!/bin/bash

echo "=== Creating missing price for Private Monthly (using prod you already have) ==="
stripe prices create \
  --unit-amount=49900 \
  --currency=usd \
  --recurring.interval=month \
  --product=prod_UmVkIlw0rO7KX8

echo ""
echo "=== 4. Private Annual Retainer ==="
PRIVATE_ANNUAL_PROD=$(stripe products create \
  --name="Private Annual Retainer" \
  --description="Best value — 24 sessions per year (2 per month). Save 20%.")
echo "Private Annual Product: $PRIVATE_ANNUAL_PROD"

stripe prices create \
  --unit-amount=479000 \
  --currency=usd \
  --recurring.interval=year \
  --product=$(echo "$PRIVATE_ANNUAL_PROD" | grep -o '"id": "[^"]*"' | head -1 | cut -d'"' -f4)

echo ""
echo "=== 5. Starter Helper ==="
STARTER_PROD=$(stripe products create \
  --name="Starter Helper" \
  --description="Perfect for basic online Q&A. Keeps your custom business training active so you never miss customer question leads. 24/7 Q&A, SMS & Chat integrations.")
echo "Starter Product: $STARTER_PROD"

stripe prices create \
  --unit-amount=1900 \
  --currency=usd \
  --recurring.interval=month \
  --product=$(echo "$STARTER_PROD" | grep -o '"id": "[^"]*"' | head -1 | cut -d'"' -f4)

echo ""
echo "=== 6. Autopilot Pro ==="
AUTOPILOT_PROD=$(stripe products create \
  --name="Autopilot Pro" \
  --description="Everything in Starter + booking & scheduling, pre-orders & reservations, automated text follow-ups, and daily morning lead summaries.")
echo "Autopilot Product: $AUTOPILOT_PROD"

stripe prices create \
  --unit-amount=3900 \
  --currency=usd \
  --recurring.interval=month \
  --product=$(echo "$AUTOPILOT_PROD" | grep -o '"id": "[^"]*"' | head -1 | cut -d'"' -f4)

echo ""
echo "=== 7. Social & Media ==="
SOCIAL_PROD=$(stripe products create \
  --name="Social & Media" \
  --description="Everything in Autopilot Pro + graphic & banner ad design, video clip & reel promos, custom AI voice generation, and premium model access.")
echo "Social Product: $SOCIAL_PROD"

stripe prices create \
  --unit-amount=7900 \
  --currency=usd \
  --recurring.interval=month \
  --product=$(echo "$SOCIAL_PROD" | grep -o '"id": "[^"]*"' | head -1 | cut -d'"' -f4)

echo ""
echo "✅ Run complete. Paste the full terminal output here (all the JSON and Price IDs) and I'll give you the exact payment link creation commands."