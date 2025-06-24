#!/bin/bash
set -o errexit

# Move to python_backend directory
cd python_backend

# Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install build dependencies
pip install --upgrade pip
pip install wheel setuptools

# Install requirements from python_backend directory
pip install -r requirements.txt
