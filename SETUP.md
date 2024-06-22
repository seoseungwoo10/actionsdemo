## NODE 1.6 버전으로 BUILD 할 때

```config
  "scripts": {
    "build:16": "npx webpack --config ./src/webpack.config.js --mode production",
    "dev:16": "npx webpack --config ./src/webpack.config.js --mode development --watch",
    "test:16": "npx standard && npx jest",
  }
```

```yml

jobs:
  build-node-16:
    # 단독 OS 실행시에는 아래 주석을 풀고 실행하면 된다.
    #    runs-on: ubuntu-latest
    # env 사용하면 환경변수를 설정할 수 있다.
    #    env:
    #      UPDATE_SNAPSHOT: true
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest]
        node-version: [18.x]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      - name: Install dependencies ${{ matrix.node-version }}
        run: npm ci
      - name: Build ${{ matrix.node-version }}
        run: npm run build:16 --if-present
      - name: Run tests ${{ matrix.node-version }}
        run: npm run test:16
```

## NODE 1.8 버전으로 BUILD 할 때

`cross-env` 를 사용하여 `NODE_OPTIONS` 환경변수를 설정합니다.

```shell
npm install --save-dev cross-env
```

```config
  "scripts": {
    "build:18": "cross-env NODE_OPTIONS=--openssl-legacy-provider npx webpack --config ./src/webpack.config.js --mode production",
    "dev:18": "set NODE_OPTIONS=--openssl-legacy-provider npx webpack --config ./src/webpack.config.js --mode development --watch",
    "test:18": "set NODE_OPTIONS=--openssl-legacy-provider npx standard && npx jest"
  }
```

```yml

jobs:
  build-node-18:
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest]
        node-version: [16.x]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      - name: Install dependencies ${{ matrix.node-version }}
        run: npm ci
      - name: Build ${{ matrix.node-version }}
        run: npm run build:18 --if-present
      - name: Run tests ${{ matrix.node-version }}
        run: npm run test:18
```


## yml 파일에 node 버전별 환경변수로 설정하기


```config
"scripts": {
    "build": "npx webpack --config ./src/webpack.config.js --mode production",
    "dev": "npx webpack --config ./src/webpack.config.js --mode development --watch",
    "test": "npx standard && npx jest"
}
```

```yml

jobs:
  build-node-16:
# 단독 OS 실행시에는 아래 주석을 풀고 실행하면 된다.
#    runs-on: ubuntu-latest
# env 사용하면 환경변수를 설정할 수 있다.
#    env:
#      UPDATE_SNAPSHOT: true
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest]
        node-version: [16.x]
    runs-on: ${{ matrix.os }}
    steps:
    - uses: actions/checkout@v4
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    - name: Install dependencies ${{ matrix.node-version }}
      run: npm ci
    - name: Build ${{ matrix.node-version }}
      run: npm run build --if-present
    - name: Run tests ${{ matrix.node-version }}
      run: npm run test
  build-node-18:
    env:
      NODE_OPTIONS: "--openssl-legacy-provider"    
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest]
        node-version: [18.x]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      - name: Install dependencies ${{ matrix.node-version }}
        run: npm ci
      - name: Build ${{ matrix.node-version }}
        run: npm run build --if-present
      - name: Run tests ${{ matrix.node-version }}
        run: npm run test
```

### if 조건절을 이용하여 환경변수 설정하기

```yml

jobs:
  build-node:
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest]
        node-version: [16.x, 18.x]
    runs-on: ${{ matrix.os }}
    steps:
    - uses: actions/checkout@v4
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    - name: Install dependencies ${{ matrix.node-version }}
      run: npm ci
    - name: Build ${{ matrix.node-version }}
      if: matrix.node-version == '18.x'
      run: npm run build --if-present
      env:
        NODE_OPTIONS: "--openssl-legacy-provider"
    - name: Run tests ${{ matrix.node-version }}
      if: matrix.node-version == '18.x'      
      run: npm run test
      env:
        NODE_OPTIONS: "--openssl-legacy-provider"      
    - name: Build ${{ matrix.node-version }}
      if: matrix.node-version == '16.x'      
      run: npm run build --if-present
    - name: Run tests ${{ matrix.node-version }}
      if: matrix.node-version == '16.x'
      run: npm run test
```

## build와 test를 분리 후 병렬로 실행하기

```yml

jobs:
  build:
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest]
        node-version: [16.x, 18.x, 20.x]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      - name: Install dependencies ${{ matrix.node-version }}
        run: npm ci
      - name: Build ${{ matrix.node-version }}
        if: matrix.node-version == '18.x' || matrix.node-version == '20.x'
        run: npm run build --if-present
        env:
          NODE_OPTIONS: "--openssl-legacy-provider"
      - name: Build ${{ matrix.node-version }}
        if: matrix.node-version == '16.x'
        run: npm run build --if-present
      - uses: actions/upload-artifact@v4
        with:
          name: webpack artifacts ${{ matrix.os }} ${{ matrix.node-version }}
          path: public/
  test:
    needs: build
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest]
        node-version: [16.x, 18.x, 20.x]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/download-artifact@v4
        with:
          name: webpack artifacts ${{ matrix.os }} ${{ matrix.node-version }}
          path: public/
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      - name: Install dependencies ${{ matrix.node-version }}
        run: npm ci
      - name: Run tests ${{ matrix.node-version }}
        if: matrix.node-version == '18.x' || matrix.node-version == '20.x'
        run: npm run test
        env:
          NODE_OPTIONS: "--openssl-legacy-provider"
      - name: Run tests ${{ matrix.node-version }}
        if: matrix.node-version == '16.x'
        run: npm run test
```
