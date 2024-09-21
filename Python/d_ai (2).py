# -*- coding: utf-8 -*-
"""D_ai.ipynb

Automatically generated by Colab.

Original file is located at
    https://colab.research.google.com/drive/1DxY6dw4HTpC7V-qbXadaY31lfjBWCmIa

# Importing Lbraries and Data

Libraries
"""
""
print("Detecting Started!!")
import traceback
import os
import signal
import subprocess
import json
import time
from datetime import datetime, timedelta, timezone
import pandas as pd
from matplotlib import pyplot as plt

"""Data"""

with open('./merged_data.json', 'r') as f:
  json_log = json.load(f)

df = pd.DataFrame(json_log)

"""# Preprocessing

Create relative timestamp (UNIX timestamp)
"""

def UNIX_time(df):

  # Convert timestamp to datetime
  df['timestamp'] = pd.to_datetime(df['timestamp'], format='ISO8601')

  # Convert the 'date_time' column to UNIX timestamp
  df['unix_timestamp'] = df['timestamp'].astype('int64') // 10**9  # Divide by 10^9 to get seconds

  return df

df = UNIX_time(df)

"""Sort according to time"""

df.sort_values(by='unix_timestamp', inplace=True) # for training data only

"""Create Time Windows"""

def create_windows(df):
    # Define the size of each window
    window_size = 1  # 2 seconds

    # Create empty lists to store counts and differences
    traffic_in_window_1 = []
    traffic_in_window_2 = []
    traffic_in_window_3 = []
    traffic_in_window_4 = []

    # Define a sliding window
    start_time = df['unix_timestamp'].min()
    previous_count = None  # Variable to store the count of the previous window

    while start_time + (4 * window_size) <= df['unix_timestamp'].max():
        # Define the time windows
        first_window = (start_time, start_time + window_size)
        second_window = (start_time + window_size, start_time + 2 * window_size)
        third_window = (start_time + 2 * window_size, start_time + 3 * window_size)
        fourth_window = (start_time + 3 * window_size, start_time + 4 * window_size)

        # Count the number of requests in each window
        count_1st = df[(df['unix_timestamp'] >= first_window[0]) & (df['unix_timestamp'] < first_window[1])].shape[0]
        count_2nd = df[(df['unix_timestamp'] >= second_window[0]) & (df['unix_timestamp'] < second_window[1])].shape[0]
        count_3rd = df[(df['unix_timestamp'] >= third_window[0]) & (df['unix_timestamp'] < third_window[1])].shape[0]
        count_4th = df[(df['unix_timestamp'] >= fourth_window[0]) & (df['unix_timestamp'] < fourth_window[1])].shape[0]

        # Calculate differences
        if previous_count is None:
            diff_1st = count_1st  # Or use a default value
        else:
            diff_1st = count_1st - previous_count

        diff_2nd = count_2nd - count_1st
        diff_3rd = count_3rd - count_2nd
        diff_4th = count_4th - count_3rd

        # Append the differences to the lists
        traffic_in_window_1.append(diff_1st)
        traffic_in_window_2.append(diff_2nd)
        traffic_in_window_3.append(diff_3rd)
        traffic_in_window_4.append(diff_4th)

        # Update the previous_count and move the window by 2 seconds (sliding mechanism)
        previous_count = count_1st
        start_time += 1

    # Create a new DataFrame with the collected data
    feature_df = pd.DataFrame({
        'traffic in window 1': traffic_in_window_1,
        'traffic in window 2': traffic_in_window_2,
        'traffic in window 3': traffic_in_window_3,
        'traffic in window 4': traffic_in_window_4
    })
    return feature_df

windows_df = create_windows(df)

"""Feature Scaling"""

from sklearn.preprocessing import StandardScaler

def scale_windows(df):
    # Initialize the scaler
    scaler = StandardScaler()
    #scaler = MinMaxScaler(feature_range=(0, 1))

    # Define which columns to scale
    feature_columns = df.columns  # Adjust this as necessary

    # Fit and transform the feature columns
    scaled_features = scaler.fit_transform(df[feature_columns])

    # Create a DataFrame from the scaled features
    scaled_df = pd.DataFrame(scaled_features, columns=feature_columns)

    return scaled_df

features_df = scale_windows(windows_df)

"""# Model Training (Unsupervised)

GMM
"""

from sklearn.mixture import GaussianMixture

gmm = GaussianMixture(n_components=3, random_state=0)  # 3 clusters: benign, hike, downward
gmm.fit(features_df)

# Predict clusters using GMM
features_df['cluster'] = gmm.predict(features_df)

"""Analysis"""

'''#@title Visualize Clusters

plt.scatter(features_df.iloc[:, 0], features_df.iloc[:, 1], c=features_df['cluster'], cmap='viridis')
plt.title('GMM Clusters')
plt.xlabel('Traffic Feature 1')
plt.ylabel('Traffic Feature 2')
plt.show()'''

"""Predicting the cluster for a row of known nature

"""

cluster_label = gmm.predict([features_df.iloc[4, :-1].values]) # Select all columns except the last one ('cluster')
print(f"Predicted cluster label: {cluster_label}")

"""# Detector AI"""

def test_features(df):

    # Define the size of each window
    window_size = 1  # 1 second

    # Check if there are enough data points to form a full set of windows
    if df.empty or df.shape[0] < 4:
        # Not enough data to process
        return pd.DataFrame({
            'traffic in window 1': [0],
            'traffic in window 2': [0],
            'traffic in window 3': [0],
            'traffic in window 4': [0]
        })

    # Define the time windows based on the available data
    start_time = df['unix_timestamp'].min()
    end_time = df['unix_timestamp'].max()

    # Define windows
    first_window = (end_time - 4 * window_size, end_time - 3 * window_size)
    second_window = (end_time - 3 * window_size, end_time - 2 * window_size)
    third_window = (end_time - 2 * window_size, end_time - window_size)
    fourth_window = (end_time - window_size, end_time)

    # Count the number of requests in each window
    count_1st = df[(df['unix_timestamp'] >= first_window[0]) & (df['unix_timestamp'] < first_window[1])].shape[0]
    count_2nd = df[(df['unix_timestamp'] >= second_window[0]) & (df['unix_timestamp'] < second_window[1])].shape[0]
    count_3rd = df[(df['unix_timestamp'] >= third_window[0]) & (df['unix_timestamp'] < third_window[1])].shape[0]
    count_4th = df[(df['unix_timestamp'] >= fourth_window[0]) & (df['unix_timestamp'] < fourth_window[1])].shape[0]

    # Calculate differences for the first window
    if 'previous_counts' in test_features.__dict__:
        prev_count = test_features.previous_counts['traffic in window 4']  # Changed this to traffic in window 4
        diff_1st = count_1st - prev_count
    else:
        diff_1st = count_1st  # No previous count, so just use the current count
    
    diff_2nd = count_2nd - count_1st
    diff_3rd = count_3rd - count_2nd
    diff_4th = count_4th - count_3rd

    # Store the counts for the next iteration
    test_features.previous_counts = {
        'traffic in window 4': count_4th  # Store the latest count for the next call
    }

    # Create a new DataFrame with the current window's data
    test_feature_df = pd.DataFrame({
        'traffic in window 1': [diff_1st],
        'traffic in window 2': [diff_2nd],
        'traffic in window 3': [diff_3rd],
        'traffic in window 4': [diff_4th]
    })

    return test_feature_df

# Function to load the log file and parse the JSON list
def load_log_file(file_path):
    with open(file_path, 'r') as file:
        try:
            log_data = json.load(file)
        except json.JSONDecodeError:
            log_data = []
    return log_data

# Function to filter JSON objects within the last 3 seconds
def get_recent_entries(log_data, current_time, seconds=4):
    threshold_time = current_time - timedelta(seconds=seconds)
    return [entry for entry in log_data if datetime.fromisoformat(entry['timestamp'].replace('Z', '+00:00')) > threshold_time]

# Global placeholders
placeholders = {"a": None, "b": None, "c": None, "d": None}
#j_test = []

# Function to load the log file and parse the JSON list
def load_log_file(file_path):
    with open(file_path, 'r') as file:
        try:
            log_data = json.load(file)
        except json.JSONDecodeError:
            log_data = []
    return log_data

# Function to filter JSON objects within the last 3 seconds
def get_recent_entries(log_data, current_time, seconds=3):
    threshold_time = current_time - timedelta(seconds=seconds)
    return [entry for entry in log_data if datetime.fromisoformat(entry['timestamp'].replace('Z', '+00:00')) > threshold_time]

# Main logic for tracking placeholders and updating j_test
def update_j_test(file_path):
    global placeholders  # Declare the global placeholders

    # Load the latest log data
    log_data = load_log_file(file_path)

    # Get current time with UTC timezone
    current_time = datetime.now(timezone.utc)

    # Update placeholders after 1 second
    placeholders["a"] = placeholders["b"]
    placeholders["b"] = placeholders["c"]
    placeholders["c"] = placeholders["d"]
    placeholders["d"] = len(log_data)  # Placeholder d at the new bottom

    # Get all JSON objects between placeholders a and d
    if placeholders["a"] is not None:
        recent_data = log_data[placeholders["a"]:placeholders["d"]]
    else:
        # On the first run, there are no placeholders a/b/c yet
        recent_data = get_recent_entries(log_data, current_time)

    # Update j_test with the recent data
    j_test = recent_data
    
    return j_test



node_server_process = None

while True:
    try:
        # Call the update function with the correct path to your log file
        j_test = update_j_test('D:/Uploaded/Uploaded/TOOL/logs/logs.json')

        # Check if j_test is empty
        if not j_test:
            print("No new entries found, waiting...")
            time.sleep(1)
            continue  # Skip the rest of the loop and check again

        # Convert j_test to DataFrame
        test_df = pd.DataFrame(j_test)

        # Apply UNIX time conversion
        test_df = UNIX_time(test_df)

        # Generate features from the test data
        test_feature_df = test_features(test_df)

        # Create scaled test features
        scaled_test_features = scale_windows(test_feature_df)

        # Predict the cluster label using the GMM model
        cluster_label = gmm.predict(test_feature_df)
        
        # Output the predicted cluster
        print(f"Predicted cluster label: {cluster_label}")

        # Check if the predicted cluster label is 1
        if cluster_label == [1]:  # Ensure it's a single value, or adjust as necessary
            print("Cluster 1 detected. Starting tool.js...")

            # Check if the server is already running
            if node_server_process is None or node_server_process.poll() is not None:
                try:
                    # Start the Node.js server (tool.js)
                    node_server_process = subprocess.Popen(["node", "D:/ddos/Main/TOOL_APP/Backend/updatedaction.js"])
                    print("JavaScript tool.js server started.")
                except Exception as e:
                    print(f"Failed to start tool.js: {e}")
            else:
                print("tool.js is already running. Skipping restart.")

    except Exception as inner_error:
        print("Error in main loop:", inner_error)
        traceback.print_exc()

    # Sleep for 2 seconds before checking the file again
    time.sleep(1)