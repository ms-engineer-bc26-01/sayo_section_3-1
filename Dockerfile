# Node.js LTS イメージを使用
FROM node:lts

# 作業ディレクトリを指定
WORKDIR /usr/src/app

# client フォルダ内のファイルをコピー
COPY ./client ./client

# client フォルダに移動
WORKDIR /usr/src/app/client

# パッケージをインストール
RUN npm install

# 3000番ポートを開放
EXPOSE 3000

# React アプリ起動（ホットリロード可能）
CMD ["npm", "run", "dev"]
