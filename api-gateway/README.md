RUN docker run -d \
  --name api-gateway \
  -p 3000:3000 \
  --env-file .env \
  api-gateway