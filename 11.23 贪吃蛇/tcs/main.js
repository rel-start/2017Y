
const RetroSnaker = {
  x: 20,
  y: 20,
  snake: [],
  dirction: 39,
  snakeLen: 3,
  viewMap: [],    // 用来绘制蛇以及其他的物品
  dataMap: [],    // 存放所有的数据
  speed: 500,
  changeDirAble: true,
  score: document.getElementById('score'),
  init() {

    this._createData();
    this._createMap();
    this._initSnake();
    this._addObject('food');
    this.walk();
    this.changeDir();
  },

  _createData(x, y) {
    let map = new Array(y);
    for (let i = 0; i < map.length; i++) {
      map[i] = new Array(x);
    }

    return map;
  },
  _createMap() {
    const gameMap = document.querySelector('.game-map');
    let { x, y } = this;
    this.viewMap = this._createData(x, y);
    this.dataMap = this._createData(x, y);

    for (let i = 0; i < y; i++) {
      const row = document.createElement('div');
      for (let j = 0; j < x; j++) {
        const col = document.createElement('span');
        this.viewMap[i][j] = row.appendChild(col);
        this.dataMap[i].fill(false);
      }
      gameMap.appendChild(row);
    }
  },
  _createPoint(startX, startY, endX, endY) {
    let { x, y, _rp, dataMap } = this;
    let p = [];
    let X = _rp([startX, endX]);
    let Y = _rp([startY, endY]);

    // 物品不能出现在蛇身上
    if (dataMap[Y][X]) {
      return this._createPoint(startX, startY, endX, endY);
    }

    p.push(Y, X);
    return p;
  },
  _rp(arr) {
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    return Math.round(Math.random() * (max - min) + min);
  },
  _initSnake() {
    let { snakeLen, viewMap, dataMap, snake, x, y } = this;
    // X: [2 - 17]
    // Y: [0 - 19]
    let p = this._createPoint(snakeLen - 1, 0, x - snakeLen, y - 1);

    for (let i = 0; i < snakeLen; i++) {
      let x = p[1] - i, y = p[0];
      snake.push([y, x]);
      viewMap[y][x].className = i ? 'snake' : 'snake head';
      dataMap[y][x] = 'snake';
    }
  },
  _addObject(name) {
    let { viewMap, dataMap, x, y } = this;
    // X: [0 - 19]
    // Y: [0 - 19]
    let p = this._createPoint(0, 0, x - 1, y - 1);
    viewMap[p[0]][p[1]].className = name;
    dataMap[p[0]][p[1]] = name;

  },
  walk() {
    clearInterval(this.gameTimer);
    this.gameTimer = setInterval(this._walk.bind(this), this.speed);
  },
  _walk() {
    let { dirction, snake, viewMap, dataMap, changeDir, x, y } = this;
    let oldX = headX = snake[0][1];
    let oldY = headY = snake[0][0];

    viewMap[headY][headX].className = 'snake';

    switch (dirction) {
      case 37:
        headX -= 1;
        break;
      case 38:
        headY -= 1;
        break;
      case 39:
        headX += 1;
        break;
      case 40:
        headY += 1;
        break;
    }

    // 撞墙和撞自己
    if (headX > x-1 || headX < 0 || headY > y-1 || headY <0 || dataMap[headY][headX] === 'snake') {
      alert('游戏结束');
      window.removeEventListener('keydown', changeDir.fn);
      viewMap[oldY][oldX].className = 'snake head';

      return clearInterval(this.gameTimer);
    }

    if (dataMap[headY][headX] !== 'food') {
      let lastIndex = snake.length - 1;
      let lastX = snake[lastIndex][1];
      let lastY = snake[lastIndex][0];
      snake.pop();
      viewMap[lastY][lastX].className = '';
      dataMap[lastY][lastX] = false;
    } else {
      let {score} = this;
      this._addObject('food');
      score.innerHTML = score.innerHTML*1+1;

      if (score.innerHTML % 3 === 0 && this.speed > 200) {
        this.speed = this.speed - 100;
        this.walk();
      }
    }

    snake.unshift([headY, headX]);
    viewMap[headY][headX].className = 'snake head';
    dataMap[headY][headX] = 'snake';
    this.changeDirAble = true;
  },
  changeDir() {
    let fn = this.changeDir.fn = this._changeDir.bind(this);
    window.addEventListener('keydown', fn);
  },
  _changeDir(e) {
    if (!this.changeDirAble) return;
    let { keyCode } = e;
    // 只有方向键才可以改变蛇头。不能反向运动 180°转弯
    if (keyCode > 36 && keyCode < 41 && Math.abs(this.dirction - keyCode) !== 2) {
      this.dirction = keyCode;
      this.changeDirAble = false;
    }
  }
};


RetroSnaker.init();



































