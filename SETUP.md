## NODE 1.6 버전으로 BUILD 할 때

```config
"scripts": {
    "build": "npx webpack --config ./src/webpack.config.js --mode production",
    "dev": "npx webpack --config ./src/webpack.config.js --mode development --watch",
    "test": "npx standard && npx jest"
}
```

## NODE 1.8 버전으로 BUILD 할 때

`cross-env` 를 사용하여 `NODE_OPTIONS` 환경변수를 설정합니다.

```shell
npm install --save-dev cross-env
```

```config
"scripts": {
    "build": "cross-env NODE_OPTIONS=--openssl-legacy-provider npx webpack --config ./src/webpack.config.js --mode production",
    "dev": "cross-env set NODE_OPTIONS=--openssl-legacy-provider npx webpack --config ./src/webpack.config.js --mode development --watch",
    "test": "cross-env set NODE_OPTIONS=--openssl-legacy-provider npx standard && npx jest"
}
```
