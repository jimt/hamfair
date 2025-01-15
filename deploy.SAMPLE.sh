#!/bin/bash

# Remote host details
REMOTE_HOST="www.example.com"
REMOTE_BASE_DIR="/var/www/html"

# Local base directory
LOCAL_BASE_DIR="public"

# Starting and ending years
START_YEAR=2001
END_YEAR=$(date +%Y) # Current year

# Loop through the years
for year in $(seq $START_YEAR $END_YEAR); do
  LOCAL_DIR="${LOCAL_BASE_DIR}/${year}/hamfair"
  REMOTE_DIR="${REMOTE_BASE_DIR}/${year}"

  # Check if the local directory exists
  if [ -d "$LOCAL_DIR" ]; then
    echo "Syncing ${LOCAL_DIR} to ${REMOTE_HOST}:${REMOTE_DIR}"

    # Create the remote directory if it doesn't exist
    ssh "$REMOTE_HOST" "mkdir -p $REMOTE_DIR"

    # Rsync command
    rsync -az --delete "$LOCAL_DIR" "$REMOTE_HOST:$REMOTE_DIR"

    if [ $? -eq 0 ]; then
      echo "Sync completed successfully for $year"
    else
      echo "Error syncing $year. Check the logs for details."
    fi
  else
    echo "Directory $LOCAL_DIR does not exist. Skipping."
  fi
done

# handle the icom-festival specially
rsync -avz --progress --delete public/2016/icom-festival "$REMOTE_HOST:$REMOTE_BASE_DIR/2016"

echo "Sync process finished."
