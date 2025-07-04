#!/bin/bash
# Force Python 3.10 environment
export PYTHON_VERSION=3.10
python${PYTHON_VERSION} -m ensurepip --upgrade
python${PYTHON_VERSION} -m pip install --upgrade pip setuptools wheel
python${PYTHON_VERSION} -m pip install -r requirements.txt
