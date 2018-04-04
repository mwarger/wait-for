# wait-for-redis

[![npm](https://img.shields.io/npm/v/@swarthy/wait-for-redis.svg)](https://www.npmjs.com/package/@swarthy/wait-for-redis)

*wait-for-redis* will try connect to Redis server and exit with code ```0``` if server is available and ```1``` otherwise.

Uses [redis](https://www.npmjs.com/package/redis) package

| Environment variable | Default value     | Description              |
| -------------------- | ----------------- | ------------------------ |
| ```REDIS_URI```      | redis://localhost | Connection string        |
| ```MAX_ATTEMPTS```   | 60                | Max attempt count        |
| ```DELAY```          | 1000              | Delay between attempts   |

### Usage example

```bash
wait-for-redis && npm run test-integration

MAX_ATTEMPTS=5 wait-for-redis && npm run test-integration
```

#### See also
[wait-for-postgres](https://www.npmjs.com/package/@swarthy/wait-for-postgres)
[wait-for-rabbit](https://www.npmjs.com/package/@swarthy/wait-for-rabbit)
