#!/bin/bash
# scripts/integration-tests.sh
# Integration tests against the staging API.
# Runs ON the staging VM (private subnet, not reachable from the runner).
#
# Flow: health -> register -> login -> cleanup
# Exits non-zero on the first failure so the pipeline fails fast.

set -u

API="http://localhost:4000/api"
COOKIE_JAR="/tmp/staging-test-cookies.txt"
STAMP=$(date +%s)
EMAIL="ci-test-${STAMP}@silverbank.test"
PASSWORD="TestPass123!"
NAME="CI Test User"
PASSED=0
FAILED=0

check() {
  # $1 = test name, $2 = expected code, $3 = actual code
  if [ "$2" = "$3" ]; then
    echo "  ✅ $1 (HTTP $3)"
    PASSED=$((PASSED + 1))
  else
    echo "  ❌ $1 - expected HTTP $2, got HTTP $3"
    FAILED=$((FAILED + 1))
  fi
}

echo "Running integration tests against staging API"
echo "Test account: $EMAIL"
echo ""

# ---- 1. Health endpoint reports a connected database ----
HEALTH_BODY=$(curl -s "$API/health")
HEALTH_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API/health")
check "Health endpoint responds" "200" "$HEALTH_CODE"

if echo "$HEALTH_BODY" | grep -q '"database":"connected"'; then
  echo "  ✅ Database reported as connected"
  PASSED=$((PASSED + 1))
else
  echo "  ❌ Database not connected - response: $HEALTH_BODY"
  FAILED=$((FAILED + 1))
fi

# ---- 2. Register a new account ----
REG_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
  -X POST "$API/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"$NAME\",\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
check "Register new account" "201" "$REG_CODE"

# ---- 3. Log in and capture the auth cookie ----
# The API sets an httpOnly cookie, so we store it in a cookie jar
LOGIN_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
  -c "$COOKIE_JAR" \
  -X POST "$API/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
check "Login with new account" "200" "$LOGIN_CODE"

# ---- 4. Clean up: delete the test account using the cookie ----
DEL_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
  -b "$COOKIE_JAR" \
  -X DELETE "$API/auth/delete")
check "Delete test account (cleanup)" "200" "$DEL_CODE"

rm -f "$COOKIE_JAR"

echo ""
echo "════════════════════════════════════════════"
echo "  Integration tests: $PASSED passed, $FAILED failed"
echo "════════════════════════════════════════════"

[ "$FAILED" -eq 0 ] || exit 1
echo "✅ All integration tests passed on staging"
