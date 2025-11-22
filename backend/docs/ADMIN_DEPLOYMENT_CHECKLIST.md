# Admin Dashboard Deployment Checklist

## Pre-Deployment Checklist

### 1. Environment Setup

- [ ] `.env` file configured with all required variables
- [ ] `JWT_SECRET` is strong and unique
- [ ] `JWT_REFRESH_SECRET` is strong and unique
- [ ] `MONGODB_URI` points to correct database
- [ ] `NODE_ENV` is set to production
- [ ] Port configuration is correct

### 2. Database

- [ ] MongoDB connection is stable
- [ ] Database backups are configured
- [ ] Indexes are created for User model
- [ ] At least one admin user exists

### 3. Security

- [ ] HTTPS is enabled (production)
- [ ] CORS is properly configured
- [ ] Rate limiting is implemented
- [ ] Helmet.js is configured
- [ ] JWT secrets are not exposed
- [ ] Environment variables are secured

### 4. Testing

- [ ] All endpoints tested with Postman
- [ ] Authentication flow works correctly
- [ ] Authorization checks are working
- [ ] Error handling is tested
- [ ] Edge cases are covered
- [ ] Load testing completed

### 5. Code Quality

- [ ] No syntax errors
- [ ] No console errors
- [ ] Code is properly documented
- [ ] API documentation is complete
- [ ] Error messages are clear

## Deployment Steps

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Set Admin User in Database

Update a user's role to 'admin' in MongoDB:

```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin", isActive: true, isEmailVerified: true } }
);
```

### Step 3: Test Locally

```bash
# Start server
npm start
```

### Step 4: Verify Endpoints

Test these critical endpoints:

- [ ] `GET /api/admin/dashboard` - Dashboard loads
- [ ] `GET /api/admin/users` - Users list loads
- [ ] `GET /api/admin/users/:userId` - User profile loads
- [ ] `PATCH /api/admin/users/:userId/activate` - Can activate user
- [ ] `PATCH /api/admin/users/:userId/deactivate` - Can deactivate user

### Step 5: Deploy to Server

```bash
# Build if needed
npm run build

# Start with PM2 (recommended)
pm2 start src/server.js --name "gourd-api"

# Or use Docker
docker-compose up -d
```

### Step 6: Post-Deployment Tests

- [ ] Health check endpoint works: `GET /api/health`
- [ ] Database connection is healthy: `GET /api/health/database`
- [ ] Admin login works
- [ ] Dashboard loads
- [ ] User operations work

## Production Configuration

### Recommended Environment Variables

```env
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb://your-production-db/gourd-classification

# JWT
JWT_SECRET=your-super-strong-secret-key-change-this
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-super-strong-refresh-secret-key-change-this
JWT_REFRESH_EXPIRE=30d

# CORS
CORS_ORIGIN=https://your-frontend-domain.com,https://admin.your-domain.com

# Security
MAX_FILE_SIZE=5mb
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg

# Rate Limiting (if implemented)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### PM2 Configuration (ecosystem.config.js)

```javascript
module.exports = {
  apps: [
    {
      name: "gourd-api",
      script: "./src/server.js",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 5000,
      },
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_file: "./logs/combined.log",
      time: true,
    },
  ],
};
```

### Nginx Configuration (if using)

```nginx
server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Monitoring & Maintenance

### Health Checks

- [ ] Set up automated health checks
- [ ] Monitor response times
- [ ] Track error rates
- [ ] Monitor database connections

### Logging

- [ ] Application logs are being written
- [ ] Error logs are being captured
- [ ] Admin actions are logged
- [ ] Logs are being rotated

### Backups

- [ ] Database backups are scheduled
- [ ] Backup restoration is tested
- [ ] Backup retention policy is defined

### Updates

- [ ] Update schedule is defined
- [ ] Security patches are applied
- [ ] Dependencies are updated regularly

## Security Best Practices

### Access Control

- [ ] Only admin users can access admin endpoints
- [ ] Admins cannot modify their own accounts (certain operations)
- [ ] Failed login attempts are monitored
- [ ] Suspicious activity is logged

### Data Protection

- [ ] Sensitive data is not logged
- [ ] Passwords are properly hashed
- [ ] User data is encrypted in transit (HTTPS)
- [ ] PII is handled according to regulations

### API Security

- [ ] Rate limiting is enabled
- [ ] Input validation is comprehensive
- [ ] SQL injection prevention is in place
- [ ] XSS protection is enabled

## Troubleshooting

### Common Issues

#### Issue: "Cannot connect to database"

**Solution:**

1. Check MongoDB is running
2. Verify MONGODB_URI is correct
3. Check network connectivity
4. Verify database credentials

#### Issue: "Insufficient permissions"

**Solution:**

1. Verify user has admin role in database
2. Check JWT token is valid
3. Ensure Authorization header is correct

#### Issue: "Token expired"

**Solution:**

1. Login again to get fresh token
2. Check token expiration settings
3. Implement token refresh flow

#### Issue: "User not found"

**Solution:**

1. Verify user ID is correct
2. Check user exists in database
3. Ensure proper ObjectId format

## Performance Optimization

### Database

- [ ] Indexes are created for frequently queried fields
- [ ] Connection pooling is configured
- [ ] Query optimization is done

### API

- [ ] Response caching is implemented (where appropriate)
- [ ] Pagination limits are reasonable
- [ ] Large responses are paginated

### Monitoring

- [ ] APM tool is configured (New Relic, DataDog, etc.)
- [ ] Performance metrics are tracked
- [ ] Slow queries are identified

## Documentation

### For Developers

- [ ] API documentation is up to date
- [ ] Setup guide is clear
- [ ] Code is well-commented
- [ ] Architecture is documented

### For Admins

- [ ] User guide is available
- [ ] Common tasks are documented
- [ ] Troubleshooting guide exists

## Support & Maintenance

### Contact Information

- [ ] Support email is defined
- [ ] On-call schedule exists
- [ ] Escalation path is clear

### Maintenance Windows

- [ ] Maintenance schedule is defined
- [ ] Users are notified of downtime
- [ ] Rollback plan exists

## Final Checks

- [ ] All tests pass
- [ ] Documentation is complete
- [ ] Admin users are created
- [ ] Backup system is working
- [ ] Monitoring is active
- [ ] Security audit is done
- [ ] Performance is acceptable
- [ ] Team is trained

## Post-Deployment

### Week 1

- [ ] Monitor error logs daily
- [ ] Check performance metrics
- [ ] Gather user feedback
- [ ] Address critical issues

### Month 1

- [ ] Review security logs
- [ ] Analyze usage patterns
- [ ] Optimize performance
- [ ] Update documentation

### Quarterly

- [ ] Security audit
- [ ] Performance review
- [ ] Feature requests review
- [ ] Dependency updates

---

## Deployment Sign-Off

**Deployed By:** ******\_\_\_******  
**Date:** ******\_\_\_******  
**Environment:** ******\_\_\_******  
**Version:** ******\_\_\_******

**Verified By:** ******\_\_\_******  
**Date:** ******\_\_\_******

---

**Status:** Ready for Deployment ✅  
**Last Updated:** November 22, 2025
