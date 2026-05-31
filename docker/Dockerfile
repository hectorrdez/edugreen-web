FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_URL
ARG VITE_API_IMAGE
ARG VITE_API_KEY
ENV VITE_API_URL=$VITE_API_URL \
    VITE_API_IMAGE=$VITE_API_IMAGE \
    VITE_API_KEY=$VITE_API_KEY
RUN npm run build

FROM node:22-alpine
LABEL name="edugreen-pre-web"
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
ENV PORT=3000
EXPOSE $PORT
CMD sh -c "serve -s dist -l $PORT"
