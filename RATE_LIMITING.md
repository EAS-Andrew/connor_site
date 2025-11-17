# Rate Limiting Documentation

## Overview

Rate limiting is implemented on the vehicle lookup API to:
- **Prevent abuse** and excessive API costs
- **Protect against bots** and scrapers
- **Ensure fair usage** across all users
- **Control expenses** from the UK Vehicle Data API

## Configuration

### Current Limits

- **20 requests per hour** per IP address
- Uses **sliding window** algorithm for fair distribution
- Tracked using Redis for accuracy across all servers

### Rate Limit Headers

All API responses include rate limit information:

```
X-RateLimit-Limit: 20          # Total requests allowed per window
X-RateLimit-Remaining: 15      # Requests remaining in current window
X-RateLimit-Reset: 2024-01-15T14:30:00Z  # When the limit resets
```

## User Experience

### Normal Usage (Under Limit)

```
User enters registration → Vehicle lookup succeeds → Shows vehicle details
```

Headers show remaining requests:
```
X-RateLimit-Remaining: 15
```

### Rate Limit Exceeded

When limit is reached:

1. **API Response**: `429 Too Many Requests`
2. **Error Message**: "RATE LIMIT EXCEEDED - Too many lookups. Please try again after 14:30"
3. **User Sees**: Red error banner with retry time

```
⚠ RATE LIMIT EXCEEDED - Too many lookups. Please try again after 14:30
```

## Why These Limits?

### 20 Requests/Hour is Generous

**Typical User Journey:**
- Looks up their vehicle: 1-2 attempts (typos, etc.)
- Maybe checks a second vehicle: 1-2 attempts
- **Total:** 2-4 requests

20 requests/hour allows:
- 5+ complete vehicle searches
- Room for mistakes/typos
- Testing different vehicles

### Who Hits the Limit?

- **Bots** scraping your site
- **Automated tools** testing registrations
- **Malicious actors** trying to abuse the API
- **Accidental loops** in client code

**Legitimate users** rarely hit this limit.

## Technical Implementation

### Sliding Window Algorithm

More fair than fixed windows:

**Fixed Window Problem:**
```
13:59 → 20 requests
14:01 → 20 more requests
Result: 40 requests in 2 minutes! ❌
```

**Sliding Window Solution:**
```
13:59 → 20 requests
14:01 → Previous requests still count
Result: Limited to ~20 requests per hour ✓
```

### IP-Based Tracking

Rate limits are tracked by IP address:
- Behind a proxy/VPN? Shares limit with other users on same IP
- Each unique IP gets its own limit
- Stored in Redis with automatic expiry

### Cache Interaction

**Important:** Cached lookups don't count against rate limit!

```
First lookup: AB12CDE
  → Calls API (counts toward limit)
  → Remaining: 19/20

Second lookup: AB12CDE
  → From cache (FREE - doesn't count!)
  → Remaining: Still 19/20
```

This is why caching is so important - it protects legitimate users.

## Adjusting Limits

### Increase Limit

Edit `/app/api/vehicle-lookup/route.ts`:

```typescript
// Current
const RATE_LIMIT_REQUESTS = 20; // requests
const RATE_LIMIT_WINDOW = '1 h'; // per hour

// More permissive
const RATE_LIMIT_REQUESTS = 50; // requests
const RATE_LIMIT_WINDOW = '1 h'; // per hour

// Or use different windows
const RATE_LIMIT_WINDOW = '1 d'; // per day
const RATE_LIMIT_WINDOW = '15 m'; // per 15 minutes
```

### Per-User Limits (Advanced)

Instead of IP-based, use authenticated user IDs:

```typescript
// If user is logged in
const identifier = user?.id ? `user:${user.id}` : `ip:${ip}`;
```

Requires authentication system.

## Monitoring

### Check Rate Limit Status

```bash
curl -X GET https://yoursite.com/api/vehicle-lookup
```

Response includes:
```json
{
  "rateLimit": {
    "enabled": true,
    "limit": 20,
    "window": "1 h"
  }
}
```

### View Logs

Check function logs for rate limit events:

```
Rate limit check: ip:203.0.113.42 → 15/20 remaining
Rate limit check: ip:203.0.113.42 → 0/20 remaining
Rate limit exceeded: ip:203.0.113.42 → blocked until 14:30
```

### Redis Keys

Rate limit data is stored in Redis:

```
Key: ratelimit:vehicle-lookup:ip:203.0.113.42
TTL: Auto-expires after rate limit window
```

## Bypass for Testing

### Disable Rate Limiting

Comment out in `/app/api/vehicle-lookup/route.ts`:

```typescript
// Rate limiting check
// const rateLimiter = getRateLimiter();
// if (rateLimiter) {
//   ... rate limit code ...
// }
```

⚠️ **Never disable in production!**

### Use Different IPs

For testing, use:
- Different browsers (may have different IPs behind NAT)
- VPN/proxy to change IP
- Incognito mode (same IP, but good for testing UX)

## Error Handling

### Backend (API Route)

Returns `429` with detailed info:

```json
{
  "error": "Rate limit exceeded",
  "message": "Too many requests. Please try again after 14:30",
  "limit": 20,
  "remaining": 0,
  "reset": "2024-01-15T14:30:00Z"
}
```

### Frontend (lib/api.ts)

Custom `VehicleLookupError` class:

```typescript
catch (err) {
  if (err instanceof VehicleLookupError) {
    if (err.statusCode === 429) {
      // Show user-friendly rate limit message
      // with reset time
    }
  }
}
```

### User-Facing Message

Styled error banner in tactical theme:

```
⚠ RATE LIMIT EXCEEDED - Too many lookups. Please try again after 14:30
```

## Best Practices

### For Users

1. **Use correct registration** - typos waste your limit
2. **Don't refresh repeatedly** - cached results are instant
3. **Wait if limited** - limit resets automatically

### For Developers

1. **Monitor logs** - watch for unusual patterns
2. **Adjust limits** - based on real usage data
3. **Consider whitelist** - for trusted IPs/users
4. **Cache aggressively** - reduces API calls and limits

## Troubleshooting

### "Rate limit exceeded" but user just started

**Possible causes:**
- Shared IP (office/school/VPN)
- Previous user on same IP
- Automated testing/scripts

**Solution:**
- Wait for window to reset
- Try different network
- Check for client-side loops

### Rate limiting not working

**Check:**
1. Redis connection configured?
2. `REDIS_URL` in environment?
3. Any errors in logs?
4. Rate limiter initialized correctly?

### Too many false positives

**Adjust:**
- Increase limit (50 or 100/hour)
- Increase window (24 hours)
- Implement user authentication for per-user limits

## Security Considerations

### DDoS Protection

Rate limiting provides basic DDoS protection:
- Limits damage from single IP
- Prevents cost explosion
- Maintains service for legitimate users

**Not a complete solution** - consider:
- Cloudflare or similar CDN
- Web Application Firewall (WAF)
- IP blocking for repeat offenders

### Privacy

Rate limiting uses IP addresses:
- Not stored long-term (auto-expires)
- Only in Redis, not in logs (by default)
- No personal data collected

## Cost Impact

### Without Rate Limiting

Theoretical abuse scenario:
- Bot hits API 1,000 times/hour
- Runs for 24 hours = 24,000 requests
- Cost: 24,000 × £0.10 = **£2,400/day**

### With Rate Limiting

Same scenario:
- Bot limited to 20 requests/hour
- 24 hours = 480 requests max
- Cost: 480 × £0.10 = **£48/day**

**Savings: £2,352/day (98% reduction)**

## Summary

✅ **Implemented**: IP-based rate limiting with sliding window
✅ **Configured**: 20 requests/hour (adjustable)
✅ **User-Friendly**: Clear error messages with retry times
✅ **Cost-Effective**: Prevents API abuse and excessive costs
✅ **Monitored**: Full logging and Redis analytics
✅ **Cached-Aware**: Cached responses don't count toward limit

Rate limiting protects your API costs while maintaining excellent UX for legitimate users! 🛡️

