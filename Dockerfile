FROM node:20-alpine

WORKDIR /app

# 只複製 package 檔案
COPY . .

# 安裝依賴
RUN npm install

# 不要 COPY 原始碼,改用 volume 掛載

EXPOSE 3000

CMD ["npm", "run", "dev"]