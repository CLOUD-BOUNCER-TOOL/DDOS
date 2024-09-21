import json
from datetime import datetime
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import time

class LogHandler(FileSystemEventHandler):
    def __init__(self, file_path, time_window=2, ddos_threshold=30):
        self.file_path = file_path
        self.time_window = time_window
        self.ddos_threshold = ddos_threshold
        self.datetime_objects = []
        self.ip_buckets = []
        self.abs_differences = []
        self.last_position = 0
        self.read_logs()

    def on_modified(self, event):
        if event.src_path == self.file_path:
            self.read_logs()

    def read_logs(self):
        with open(self.file_path, 'r') as file:
            file.seek(self.last_position)  # Move to the last read position
            new_lines = file.readlines()
            self.last_position = file.tell()  # Update the last position

        if not new_lines:
            return
        
        for line in new_lines:
            line = line.strip()  # Remove any extra whitespace or newlines
            if not line:
                continue  # Skip empty lines
            try:
                log = json.loads(line)
                timestamp = log.get('timestamp')
                if timestamp:
                    self.datetime_objects.append(datetime.strptime(timestamp, "%Y-%m-%dT%H:%M:%S.%fZ") if '.' in timestamp else datetime.strptime(timestamp, "%Y-%m-%dT%H:%M:%SZ"))
            except json.JSONDecodeError as e:
                print(f"Error decoding JSON: {e}")
        
        # Process logs
        self.process_logs()

    def process_logs(self):
        if not self.datetime_objects:
            return
        
        # Initialize the first time window
        bucket_start_time = self.datetime_objects[0]
        request_count = 0
        
        self.ip_buckets = []
        
        for i in range(len(self.datetime_objects)):
            # Calculate the time difference (in seconds, including microseconds) from the bucket start time
            time_diff = (self.datetime_objects[i] - bucket_start_time).total_seconds()
            
            if time_diff <= self.time_window:
                # If within the time window, increment the request count
                request_count += 1
            else:
                # Move to the next time window and store the request count
                self.ip_buckets.append(request_count)
                
                # Reset the count for the next window
                bucket_start_time = self.datetime_objects[i]
                request_count = 1  # Start counting for the new window
        
        # Add the last count to the buckets
        self.ip_buckets.append(request_count)
        
        # Calculate absolute differences between consecutive windows
        self.abs_differences = [abs(self.ip_buckets[i+1] - self.ip_buckets[i]) for i in range(len(self.ip_buckets)-1)]
        
        # Check for DDoS attack by comparing differences with the threshold
        for i, diff in enumerate(self.abs_differences):
            if diff > self.ddos_threshold:
                print(f"⚠️ DDoS Alert! Absolute difference of {diff} IP requests detected between time windows {i+1} and {i+2}.")
        
        print("IP requests in each window:", self.ip_buckets)
        print("Absolute differences between windows:", self.abs_differences)

if __name__ == "__main__":
    file_path = 'D:/ddos/SIH/logs/logs.json'  # Replace with the actual file path
    time_window = 2  # Define the time window in seconds, including microseconds
    ddos_threshold = 30  # Set the threshold for detecting DDoS attack

    event_handler = LogHandler(file_path, time_window, ddos_threshold)
    observer = Observer()
    observer.schedule(event_handler, path=file_path, recursive=False)
    observer.start()

    try:
        while True:
            time.sleep(1)  # Keep the script running
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
