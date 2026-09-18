#!/bin/bash

# Canonical Stripe provisioning flow:
# creates products, prices, payment links, and updates payment-links.js.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec "$SCRIPT_DIR/create_payment_links.sh" "$@"
