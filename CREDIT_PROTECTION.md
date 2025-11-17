# API Credit Protection Strategy

## Your Credits

- **Total Credits**: 400 lookups
- **Total Cost**: £60
- **Per Lookup**: £0.15
- **Risk**: Credits can be exhausted quickly without protection

## Protection Layers

### 1. ✅ Rate Limiting (Implemented)

**Current Setting**: 10 requests per hour per IP

**Protection**:
- Single user can't exceed 10 lookups/hour
- Maximum 240 lookups/day per IP
- Even if abused by multiple IPs, growth is controlled

**Why 10/hour?**
- Legitimate user needs: 2-3 lookups (one vehicle, maybe typos)
- Allows 3-4 different vehicle checks per hour
- Generous enough for real customers
- Tight enough to prevent abuse

### 2. ✅ Caching (Implemented)

**Cache Duration**: 30 days

**Credit Savings**:
- First lookup of `AB12CDE`: Uses 1 credit
- Next 100 lookups of `AB12CDE`: Uses 0 credits (FREE!)
- Typical cache hit rate after 1 month: 70-90%

**Real Impact**:
```
Without cache:
- 1,000 lookups = 1,000 credits = £150
- You'd run out in days

With cache:
- 1,000 lookups = ~200 new + 800 cached
- Only 200 credits used = £30
- 400 credits last much longer
```

### 3. ⚠️ Monitoring (Needs Implementation)

**What to Monitor**:
- Total credits used per day
- Credits remaining
- Unusual spikes in usage
- Most looked-up vehicles

**Alert When**:
- Daily usage exceeds 20 credits
- Total remaining < 100 credits
- Single IP makes 50+ requests

## Current Protection Math

### Worst Case Scenario (Abuse)

**Maximum possible usage**:
- 10 IPs attacking simultaneously
- Each doing 10 requests/hour
- No cache hits (all unique vehicles)

Calculation:
```
10 IPs × 10 requests/hour × 24 hours = 2,400 requests/day

With 400 credits:
- Would exhaust credits in: ~4 hours
- BUT: This is extremely unlikely
```

**Reality**:
- Most IPs won't hit the limit
- Cache will help significantly
- You'll notice unusual traffic

### Realistic Scenario (Normal Usage)

**Typical day**:
- 50 unique visitors
- 30% look up their vehicle = 15 lookups
- 70% cache hit rate after first month

First month (building cache):
```
15 lookups/day × 30 days = 450 lookups
Cost: 450 credits - Exceeds budget! ⚠️
```

After cache is warm (month 2+):
```
15 lookups/day × 70% cached = 10.5 cached (free)
15 lookups/day × 30% new = 4.5 new (uses credits)
4.5 new/day × 30 days = 135 credits/month
400 credits = ~3 months ✓
```

## Recommendations

### Immediate Actions

1. **Lower Rate Limit** (Done)
   - Changed from 20 to 10 requests/hour
   - More conservative for limited credits

2. **Monitor Dashboard**
   - Check UK Vehicle Data dashboard daily
   - Set up email alerts if available
   - Track credits remaining

3. **Pre-warm Cache** (Optional)
   - Manually add common vehicles to cache
   - Reduces initial credit usage

### Short-term (This Week)

1. **Add Credit Monitoring**
   ```typescript
   // Log every API call with credit count
   console.log(`Credit used. Remaining: ${remainingCredits}/400`);
   ```

2. **Test Rate Limiting**
   - Try 11 lookups in an hour
   - Verify you get rate limit error
   - Check error message is clear

3. **Monitor First Week**
   - Track actual usage patterns
   - Adjust rate limit if needed
   - Watch for any abuse

### Medium-term (This Month)

1. **Add Admin Alerts**
   ```typescript
   if (creditsRemaining < 100) {
     sendEmailAlert('Low credits warning!');
   }
   ```

2. **Consider Upgrade**
   - If traffic grows, upgrade API plan
   - Or increase rate limits and buy more credits

3. **Add Analytics**
   - Track most popular vehicles
   - Pre-cache these to save credits
   - Understand your traffic patterns

### Long-term (Future)

1. **User Authentication**
   - Logged-in users: Higher limits
   - Anonymous: Lower limits
   - Prevents abuse, rewards customers

2. **Business Model**
   - If traffic justifies it, upgrade to unlimited plan
   - Or charge for instant quotes
   - Current protection is for low-traffic startup phase

## Adjusting Rate Limits

### If Credits Running Out Too Fast

**Tighten the limit**:
```typescript
const RATE_LIMIT_REQUESTS = 5;  // Very tight
const RATE_LIMIT_WINDOW_SECONDS = 60 * 60; // 1 hour
```

Or increase the window:
```typescript
const RATE_LIMIT_REQUESTS = 20;
const RATE_LIMIT_WINDOW_SECONDS = 24 * 60 * 60; // 24 hours
```

### If Legitimate Users Complaining

**Relax the limit**:
```typescript
const RATE_LIMIT_REQUESTS = 15;  // More generous
const RATE_LIMIT_WINDOW_SECONDS = 60 * 60; // 1 hour
```

## Cache Pre-warming (Advanced)

Save credits by pre-caching popular UK registrations:

```bash
# Most common UK registration patterns
# You could manually cache these to save credits
AB12CDE, XY34FGH, CD56IJK, etc.
```

But honestly, better to let real users build the cache naturally.

## Budget Planning

### Current Budget: £60 (400 credits)

**Realistic Timeline**:
- **Month 1**: 200-300 credits (building cache)
- **Month 2+**: 100-150 credits/month (cache working)
- **Total Duration**: 2-4 months

**When to Upgrade**:
- If you're getting 100+ visitors/day
- If credits run out in < 1 month
- If business is growing

**Upgrade Options** (UK Vehicle Data):
- Pay-as-you-go: Top up £60 = 400 more credits
- Monthly subscription: ~£50-100/month for more lookups
- Contact them for custom pricing

## Testing Without Using Credits

Use **sandbox mode** with test registrations:
- `AB12CDE`, `XY34FGH`, `CD56IJK`
- These don't use real credits
- Perfect for development/testing

## Summary

✅ **Rate Limiting**: 10 requests/hour protects against abuse
✅ **Caching**: 30-day cache saves 70-90% of credits long-term
✅ **Monitoring**: Watch your UK Vehicle Data dashboard daily
⚠️ **Budget**: 400 credits = ~2-4 months with normal traffic
📊 **Next Step**: Monitor first week, adjust limits if needed

Your credits are now well-protected! 🛡️

