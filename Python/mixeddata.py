import random
from datetime import datetime, timedelta
import json

# Base values for dataset generation
methods = ['GET', 'POST']
urls = ['/home', '/login', '/profile', '/products', '/cart', '/checkout', '/terms-and-conditions', '/update-profile', '/edit-profile']
user_agents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15",
    "Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Mobile Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:90.0) Gecko/20100101 Firefox/90.0",
]
status_codes = [200, 302, 304, 400, 403, 404]
http_versions = ['1.1', '2']
ips = ['192.168.1.', '192.168.2.', '127.0.0.', '203.0.113.', '198.51.100.', '150.172.238.', '8.8.8.']

# Generate random IPs
def generate_ip():
    base_ip = random.choice(ips)
    return base_ip + str(random.randint(1, 254))

# Generate realistic timestamps
def generate_timestamp(start_time, time_gap):
    new_time = start_time + timedelta(seconds=time_gap)
    return new_time.isoformat(timespec='milliseconds') + 'Z', new_time

# Generate traffic dataset
def generate_dataset(duration_minutes):
    dataset = []
    start_time = datetime(2024, 9, 13, 12, 0, 0)
    end_time = start_time + timedelta(minutes=duration_minutes)

    current_time = start_time

    while current_time < end_time:
        # Normal traffic (moderate rate)
        traffic_rate = random.randint(30, 50)  # requests per minute
        for _ in range(traffic_rate):
            method = random.choices(methods, weights=[0.85, 0.15], k=1)[0]
            entry = {
                "timestamp": generate_timestamp(current_time, random.uniform(0, 60 / traffic_rate))[0],
                "method": method,
                "url": random.choice(urls),
                "ip": generate_ip(),
                "user_agent": random.choice(user_agents),
                "referrer": random.choice(urls) if random.random() > 0.1 else "",
                "http_version": random.choice(http_versions),
                "status_code": random.choices(status_codes, weights=[0.7, 0.1, 0.05, 0.05, 0.05, 0.05], k=1)[0],
                "response_size_bytes": random.randint(500, 100000),
                "query_params": {} if method == 'POST' else {"id": random.randint(1, 100)},
                "body": {} if method == 'GET' else {"field": "value"},
                "cookies": f"session_id={''.join(random.choices('abcdefghijklmnopqrstuvwxyz1234567890', k=8))}" if random.random() > 0.5 else ""
            }
            dataset.append(entry)
            current_time = datetime.fromisoformat(entry['timestamp'][:-1])

        # Inject aggressive DDoS periods (1000-2000 requests per minute)
        if (current_time - start_time).seconds // 60 in [60, 120, 150]:  # DDoS patterns at 1 hour, 2 hours, and 2.5 hours
            ddos_rate = random.randint(200, 250)
            for _ in range(ddos_rate * 3):  # DDoS lasts 3 minutes
                method = random.choice(methods)
                entry = {
                    "timestamp": generate_timestamp(current_time, random.uniform(0, 60 / ddos_rate))[0],
                    "method": method,
                    "url": random.choice(urls),
                    "ip": generate_ip(),
                    "user_agent": random.choice(user_agents),
                    "referrer": random.choice(urls) if random.random() > 0.1 else "",
                    "http_version": random.choice(http_versions),
                    "status_code": random.choices(status_codes, k=1)[0],
                    "response_size_bytes": random.randint(500, 100000),
                    "query_params": {} if method == 'POST' else {"id": random.randint(1, 100)},
                    "body": {} if method == 'GET' else {"field": "value"},
                    "cookies": f"session_id={''.join(random.choices('abcdefghijklmnopqrstuvwxyz1234567890', k=8))}" if random.random() > 0.5 else ""
                }
                dataset.append(entry)
                current_time = datetime.fromisoformat(entry['timestamp'][:-1])

        # Inject medium DDoS (500 requests per minute)
        if (current_time - start_time).seconds // 60 in [40, 70, 110]:  # Medium DDoS at 40, 70, and 110 minutes
            ddos_rate = 200
            for _ in range(ddos_rate * 3):  # Medium DDoS lasts 3 minutes
                method = random.choice(methods)
                entry = {
                    "timestamp": generate_timestamp(current_time, random.uniform(0, 60 / ddos_rate))[0],
                    "method": method,
                    "url": random.choice(urls),
                    "ip": generate_ip(),
                    "user_agent": random.choice(user_agents),
                    "referrer": random.choice(urls) if random.random() > 0.1 else "",
                    "http_version": random.choice(http_versions),
                    "status_code": random.choices(status_codes, k=1)[0],
                    "response_size_bytes": random.randint(500, 100000),
                    "query_params": {} if method == 'POST' else {"id": random.randint(1, 100)},
                    "body": {} if method == 'GET' else {"field": "value"},
                    "cookies": f"session_id={''.join(random.choices('abcdefghijklmnopqrstuvwxyz1234567890', k=8))}" if random.random() > 0.5 else ""
                }
                dataset.append(entry)
                current_time = datetime.fromisoformat(entry['timestamp'][:-1])

        # Inject peak traffic (150 requests per minute)
        if (current_time - start_time).seconds // 60 in [30, 90]:  # Peak traffic at 30 minutes and 1.5 hours
            peak_rate = 150
            for _ in range(peak_rate * 10):  # Peak lasts 10 minutes
                method = random.choice(methods)
                entry = {
                    "timestamp": generate_timestamp(current_time, random.uniform(0, 60 / peak_rate))[0],
                    "method": method,
                    "url": random.choice(urls),
                    "ip": generate_ip(),
                    "user_agent": random.choice(user_agents),
                    "referrer": random.choice(urls) if random.random() > 0.1 else "",
                    "http_version": random.choice(http_versions),
                    "status_code": random.choices(status_codes, k=1)[0],
                    "response_size_bytes": random.randint(500, 100000),
                    "query_params": {} if method == 'POST' else {"id": random.randint(1, 100)},
                    "body": {} if method == 'GET' else {"field": "value"},
                    "cookies": f"session_id={''.join(random.choices('abcdefghijklmnopqrstuvwxyz1234567890', k=8))}" if random.random() > 0.5 else ""
                }
                dataset.append(entry)
                current_time = datetime.fromisoformat(entry['timestamp'][:-1])

    return dataset

# Generate 3-hour dataset
duration_minutes = 180  # 3 hours
dataset = generate_dataset(duration_minutes)

# Save to JSON file
with open('traffic_with_ddos_and_peak.json4', 'w') as f:
    json.dump(dataset, f, indent=2)

print(f"Traffic dataset saved with aggressive and medium DDoS attacks, and peak traffic periods for {duration_minutes} minutes.")
