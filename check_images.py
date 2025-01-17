#!/usr/bin/env python3

import os
import yaml
import glob

def get_referenced_images(yaml_file):
    """Extract all image references from a YAML file and check for duplicates across all sections."""
    with open(yaml_file, 'r') as f:
        try:
            data = yaml.safe_load(f)
            if not data:
                return set(), []
            
            referenced_images = set()
            all_images = []  # Track all images to check for duplicates
            # Look through all sections in the YAML
            for section in data.values():
                if isinstance(section, list):
                    # Extract image filenames from each item in the section
                    for item in section:
                        if isinstance(item, dict) and 'img' in item:
                            img = item['img']
                            referenced_images.add(img)
                            all_images.append(img)
            
            # Find duplicates across all sections
            duplicates = []
            for img in referenced_images:  # Only check each unique image
                if all_images.count(img) > 1:  # If it appears more than once
                    duplicates.append(img)
            duplicates.sort()  # Sort for consistent output
            
            return referenced_images, duplicates
        except yaml.YAMLError as e:
            print(f"Error parsing {yaml_file}: {e}")
            return set(), []

def find_unreferenced_images(start_dir):
    """Walk directory tree and find unreferenced images in directories with description.yaml."""
    for root, dirs, files in os.walk(start_dir):
        # Check if description.yaml exists in this directory
        yaml_file = os.path.join(root, 'description.yaml')
        if os.path.exists(yaml_file):
            # Get all referenced images and duplicates from the YAML file
            referenced_images, duplicates = get_referenced_images(yaml_file)
            
            # Get all jpg files in the directory
            jpg_files = set()
            for pattern in ['*.jpg', '*.JPG']:
                jpg_files.update(
                    os.path.basename(f) 
                    for f in glob.glob(os.path.join(root, pattern))
                )
            
            # Find unreferenced images
            unreferenced = jpg_files - referenced_images
            # Find referenced images that don't exist
            missing = referenced_images - jpg_files
            
            if unreferenced or missing or duplicates:
                print(f"\nDirectory: {root}")
                if unreferenced:
                    for img in sorted(unreferenced):
                        print(f"  Unreferenced: {img}")
                if missing:
                    for img in sorted(missing):
                        print(f"  Missing: {img}")
                if duplicates:
                    for img in sorted(duplicates):
                        print(f"  Duplicate: {img}")

def main():
    # Start from the current directory
    start_dir = os.path.join(os.getcwd(), 'content')
    print(f"Searching for unreferenced images starting from: {start_dir}")
    find_unreferenced_images(start_dir)

if __name__ == "__main__":
    main()
