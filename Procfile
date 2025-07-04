web: cd python_backend && chmod +x setup.sh && ./setup.sh && python3.10 -m gunicorn app:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT --timeout 120
