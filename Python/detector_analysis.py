import re
import json
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from user_agents import parse

# Define the log file path
log_file_path = '../TOOL/logs/logs.json'

# Read log file
with open(log_file_path, 'r') as f:
    logs = json.load(f)  # Assuming the logs are in valid JSON format

# Convert logs to a DataFrame
df = pd.DataFrame(logs)

# Convert timestamp to datetime if the 'timestamp' column exists
if 'timestamp' in df.columns:
    df['timestamp'] = pd.to_datetime(df['timestamp'], format='%Y-%m-%dT%H:%M:%S.%fZ')

# Ensure the 'response_size_bytes' column exists
if 'response_size_bytes' in df.columns:
    df['response_size_bytes'] = pd.to_numeric(df['response_size_bytes'], errors='coerce')
else:
    # If 'response_size_bytes' column doesn't exist, create it with default value 0
    df['response_size_bytes'] = 0

# Parse user agent for browser and OS if 'user_agent' exists
if 'user_agent' in df.columns:
    df['browser'] = df['user_agent'].apply(lambda x: parse(x).browser.family)
    df['os'] = df['user_agent'].apply(lambda x: parse(x).os.family)
    # Drop 'user_agent' column as it's no longer needed
    df.drop(columns=['user_agent'], inplace=True)

# Plot graphs
def plot_graphs():
    # Top 10 IP Addresses by Request Count
    plt.figure(figsize=(10,6))
    ip_request_count = df['ip'].value_counts().head(10)
    sns.barplot(x=ip_request_count.index, y=ip_request_count.values)
    plt.title('Top 10 IP Addresses by Request Count')
    plt.xlabel('IP Address')
    plt.ylabel('Number of Requests')
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig('top_10_ip_addresses.png')
    plt.close()

    # Requests Over Time (Minute)
    plt.figure(figsize=(12,6))
    df_time = df.set_index(pd.to_datetime(df['timestamp'])).resample('min').size()
    df_time.plot()
    plt.title('Requests Over Time (Minute)')
    plt.xlabel('Time')
    plt.ylabel('Number of Requests')
    plt.xticks(rotation=45)
    plt.grid(True)
    plt.tight_layout()
    plt.savefig('requests_over_time.png')
    plt.close()

    # Response Status Code Distribution
    plt.figure(figsize=(8,6))
    if 'status_code' in df.columns:
        status_count = df['status_code'].value_counts()
        sns.barplot(x=status_count.index, y=status_count.values)
        plt.title('Response Status Code Distribution')
        plt.xlabel('Status Code')
        plt.ylabel('Count')
        plt.tight_layout()
        plt.savefig('status_code_distribution.png')
        plt.close()

    # Top 10 User Agents
    plt.figure(figsize=(10,6))
    top_user_agents = df['browser'].value_counts().head(10)
    sns.barplot(x=top_user_agents.index, y=top_user_agents.values)
    plt.title('Top 10 User Agents')
    plt.xlabel('User Agent')
    plt.ylabel('Number of Requests')
    plt.xticks(rotation=90)
    plt.tight_layout()
    plt.savefig('top_10_user_agents.png')
    plt.close()

    # Request Method Distribution
    plt.figure(figsize=(8,6))
    method_count = df['method'].value_counts()
    sns.barplot(x=method_count.index, y=method_count.values)
    plt.title('Request Method Distribution')
    plt.xlabel('HTTP Method')
    plt.ylabel('Count')
    plt.tight_layout()
    plt.savefig('request_method_distribution.png')
    plt.close()

    # Response Size Distribution
    plt.figure(figsize=(10,6))
    sns.histplot(df['response_size_bytes'], bins=50)
    plt.title('Response Size Distribution')
    plt.xlabel('Response Size (Bytes)')
    plt.ylabel('Frequency')
    plt.tight_layout()
    plt.savefig('response_size_distribution.png')
    plt.close()

    # Distribution of OS
    plt.figure(figsize=(8, 8))
    os_counts = df['os'].value_counts()
    plt.pie(os_counts, labels=os_counts.index, autopct='%1.1f%%', startangle=90, colors=plt.cm.Paired.colors)
    plt.title('Distribution of OS')
    plt.tight_layout()
    plt.savefig('os_distribution.png')
    plt.close()

# Call the plotting function
plot_graphs()
