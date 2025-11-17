# Vehicle Lookup Caching Setup (Redis)

This guide explains how to use Redis caching for vehicle lookups to reduce API costs.

## Why Caching?

Vehicle lookups via UK Vehicle Data API are **expensive** (typically £0.10-0.20 per lookup). Since vehicle data doesn't change often, we cache results for 30 days, which means:

- **First lookup**: Calls the API (costs money)
- **Subsequent lookups**: Served from cache (FREE!)
- **Automatic expiry**: Cache clears after 30 days

### Cost Savings Example

Without caching:
- 1,000 unique vehicles looked up 10 times each = 10,000 API calls
- Cost: 10,000 × £0.10 = **£1,000**

With caching:
- 1,000 unique vehicles = 1,000 API calls (subsequent lookups cached)
- Cost: 1,000 × £0.10 = **£100**
- **Savings: £900** (90% reduction!)

## ✅ Already Configured!

Your Redis instance is already set up and configured in `.env.local`:

```bash
REDIS_URL="redis://default:***@redis-15374.c338.eu-west-2-1.ec2.cloud.redislabs.com:15374"
```

**No additional setup needed!** The caching is already working.

## How It Works

### Cache Strategy

Each vehicle lookup is cached with:
- **Key**: `vehicle:{REGISTRATION}` (e.g., `vehicle:AB12CDE`)
- **Value**: Complete vehicle data (JSON)
- **TTL**: 30 days (automatically expires)

### Cache Behavior

1. **Cache Hit**: Returns instantly from Redis (FREE, ~1-5ms)
2. **Cache Miss**: Calls UK Vehicle Data API (costs money, ~500-1000ms)
3. **Auto-expiry**: Old entries removed after 30 days
4. **Graceful Fallback**: If Redis is down, API calls still work

### Why 30 Days?

- Vehicle data doesn't change (make/model/year is permanent)
- Long enough to capture repeat customers
- Short enough to manage storage effectively
- Balances accuracy with cost savings

## Redis Provider: Redis Labs

You're using **Redis Labs** (now Upstash Redis), which provides:

- **Free Tier**: 30 MB storage (~3,000 vehicle records)
- **High Performance**: Sub-5ms response times
- **Global Availability**: EU West 2 (London)
- **Auto-scaling**: Handles traffic spikes

Perfect for production use!

## Monitoring

### Check Logs

View caching activity in your deployment logs:

```
✓ Cache HIT for AB12CDE   ← Served from cache (FREE!)
✗ Cache MISS for XY34FGH  ← Called API (costs money)
✓ Cached vehicle data for XY34FGH (TTL: 2592000s)
```

### Key Metrics to Track

1. **Cache Hit Rate**
   - Target: >80% after first month
   - Formula: `(cache hits / total requests) × 100`

2. **API Call Reduction**
   - Compare API usage before/after caching
   - Monitor in UK Vehicle Data dashboard

3. **Storage Usage**
   - Check Redis Labs dashboard
   - Each vehicle record: ~0.5-1 KB

## Manual Cache Management

### Clear Specific Vehicle

If vehicle data becomes incorrect, connect to Redis and delete the key:

```bash
# Using redis-cli
redis-cli -u "your-redis-url"
DEL vehicle:AB12CDE
```

Or use the Redis Labs dashboard web interface.

### Clear All Cached Vehicles

To clear all cached vehicles:

```bash
# Using redis-cli
redis-cli -u "your-redis-url"
KEYS vehicle:* | xargs redis-cli -u "your-redis-url" DEL
```

⚠️ **Use with caution** - this will cause all subsequent lookups to hit the API!

## Troubleshooting

### High API Costs Despite Caching

**Check**:
1. Verify Redis connection in logs (no "Cache unavailable" warnings)
2. Check cache hit rate (should be >50% after initial ramp-up)
3. Ensure registrations are normalized (uppercase, no spaces)

### "Cache unavailable" Warnings

**Cause**: Redis connection issue
**Effect**: App continues to work, just no caching
**Solution**: 
1. Check `REDIS_URL` in environment variables
2. Verify Redis Labs instance is running
3. Check network connectivity/firewall rules

### Storage Limit Exceeded

**Free tier limit**: 30 MB (~3,000 vehicles)

**Solutions**:
1. Reduce TTL from 30 days to 7-14 days
2. Upgrade Redis Labs plan
3. Implement LRU eviction (configured in Redis Labs dashboard)

## Performance

### Expected Response Times

**With Cache (Hit)**:
- 1-5ms response time
- Zero API cost

**Without Cache (Miss)**:
- 500-1000ms response time (API latency)
- Full API cost

### Capacity Planning

With 30 MB storage:
- Average vehicle record: ~10 KB (includes all data)
- Capacity: ~3,000 unique vehicles
- At 30-day TTL: Handles ~100 new vehicles/day
- Perfect for small-medium traffic sites

## Security

### Connection Security

- ✅ **TLS/SSL**: Connection encrypted in transit
- ✅ **Authentication**: Password-protected Redis instance
- ✅ **Private Data**: Only vehicle info cached (no personal data)
- ✅ **Expiry**: All data auto-deleted after 30 days

### Best Practices

1. Never commit `.env.local` to git
2. Use different Redis instances for dev/staging/production
3. Monitor for unusual access patterns
4. Rotate Redis password periodically

## Scaling

### When to Upgrade

Consider upgrading your Redis plan if:
- Storage exceeds 25 MB (83% of free tier)
- Cache evictions happening frequently
- Response times increasing
- Traffic growing significantly

### Next Tier

Redis Labs paid tiers start at ~$7/month and include:
- 100 MB+ storage
- Higher throughput
- Better SLA
- Support

## Alternative: Vercel KV

If you deploy to Vercel, you can also use **Vercel KV** (which is built on Redis):

1. Vercel Dashboard → Storage → Create KV Database
2. Environment variables added automatically
3. Same pricing model (free tier available)

The code already supports both Redis URLs and Vercel KV.

## Questions?

- **Redis Labs/Upstash**: https://redis.io/docs/
- **ioredis Client Docs**: https://github.com/redis/ioredis
- **UK Vehicle Data**: help@ukvehicledata.co.uk
