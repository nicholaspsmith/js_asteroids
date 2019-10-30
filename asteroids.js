let canvas
let ctx
let ship
let canvasWidth = window.innerWidth - 20
let canvasHeight = window.innerHeight - 20
let keys = []
let bullets = []
let asteroids = []
let numAsteroids = 8

document.addEventListener('DOMContentLoaded', SetupCanvas);

function SetupCanvas() {
  canvas = document.getElementById('my-canvas')
  ctx = canvas.getContext('2d')
  canvas.width = canvasWidth
  canvas.height = canvasHeight
  ctx.fillStyle = 'black'
  ctx.fillRect(0,0,canvas.width,canvas.height)
  ship = new Ship()

  for (let i = 0; i < numAsteroids; i++) {
    asteroids.push(new Asteroid())
  }

  document.body.addEventListener("keydown", e => {
    keys[e.keyCode] = true
  })
  document.body.addEventListener("keyup", e => {
    keys[e.keyCode] = false
    if (e.keyCode === 32) {
      // spacebar
      bullets.push(new Bullet(ship.angle))
    }
  })
  Render();
}

class Ship {
  constructor(offsetX, offsetY) {
    offsetX = offsetX ? offsetX : 0
    offsetY = offsetY ? offsetY : 0
    console.log(offsetX)
    this.visible = true
    this.x = canvasWidth / 2 + offsetX
    this.y = canvasHeight / 2 + offsetY
    this.movingForward = false
    this.speed = 0.1
    this.velX = 0
    this.velY = 0
    this.rotateSpeed = 0.001
    this.radius = 15
    this.angle = 0
    this.strokeColor = 'white'
    this.noseX = canvasWidth / 2 + 15
    this.noseY = canvasHeight / 2
  }

  Rotate(dir) {
    this.angle += this.rotateSpeed * dir
  }

  Update() {
    // convert degrees to radians
    let radians = this.angle / Math.PI * 180
    // oldX + cos(radians) * distance
    // oldY + sin(radians) * distance
    if (this.movingForward) {
      this.velX += Math.cos(radians) * this.speed
      this.velY += Math.sin(radians) * this.speed
    }

    // bounds checking
    if (this.x < this.radius) {
      this.x = canvas.width
    }
    if (this.x > canvas.width) {
      this.x = this.radius
    }
    if (this.y < this.radius) {
      this.y = canvas.height
    }
    if (this.y > canvas.height) {
      this.y = this.radius
    }
    this.velX *= 0.99
    this.velY *= 0.99

    this.x -= this.velX
    this.y -= this.velY
  }

  Draw() {
    ctx.strokeStyle = this.strokeColor
    ctx.beginPath()
    let vertAngle = ((Math.PI * 2) / 3)
    let radians = this.angle / Math.PI * 180
    this.noseX = this.x - this.radius * Math.cos(radians)
    this.noseY = this.y - this.radius * Math.sin(radians)
    for (let i = 0; i < 3; i++) {
      let newX = this.x - this.radius * Math.cos(vertAngle * i + radians)
      let newY = this.y - this.radius * Math.sin(vertAngle * i + radians)
      ctx.lineTo(newX, newY)
    }
    ctx.closePath()
    ctx.stroke()
  }
}

class Bullet {
  constructor(angle) {
    this.visible = true
    this.x = ship.noseX
    this.y = ship.noseY
    this.angle = angle
    this.height = 4
    this.width = 4
    this.speed = 5
    this.velX = 0
    this.velY = 0
  }
  Update() {
    var radians = this.angle / Math.PI * 180
    this.x -= Math.cos(radians) * this.speed
    this.y -= Math.sin(radians) * this.speed
  }
  Draw() {
    ctx.fillStyle = 'white'
    ctx.fillRect(this.x, this.y, this.width, this.height)
  }
}

class Asteroid {
  constructor(x, y) {
    this.numSides = 6
    this.visible = true
    this.x = Math.floor(Math.random() * canvasWidth)
    this.y = Math.floor(Math.random() * canvasHeight)
    this.speed = 1
    this.radius = 50
    this.angle = Math.floor(Math.random() * 359)
    this.strokeColor = 'white'
  }
  Update(){
    var radians = this.angle / Math.PI * 180
    this.x += Math.cos(radians) * this.speed
    this.y += Math.sin(radians) * this.speed
    if (this.x < this.radius) {
      this.x = canvas.width
    }
    if (this.x > canvas.width) {
      this.x = this.radius
    }
    if (this.y < this.radius) {
      this.y = canvas.height
    }
    if (this.y > canvas.height) {
      this.y = this.radius
    }
  }
  Draw(){
    ctx.beginPath()
    let vertAngle = ((Math.PI * 2) / this.numSides)
    var radians = this.angle / Math.PI * 180
    for (let i = 0; i < this.numSides; i++) {
      let newX = this.x - this.radius * Math.cos(vertAngle * i + radians)
      let newY = this.y - this.radius * Math.sin(vertAngle * i + radians)
      ctx.lineTo(newX, newY)
    }
    ctx.closePath()
    ctx.stroke()
  }
}

function Render() {
  ship.movingForward = (keys[87])
  if (keys[68]) {
    // d key
    ship.Rotate(1)
  }
  if (keys[65]) {
    // a key
    ship.Rotate(-1)
  }
  ctx.clearRect(0,0,canvasWidth,canvasHeight)
  ship.Update()
  ship.Draw()
  if (bullets.length !== 0) {
    // draw bullets
    for (let i = 0; i < bullets.length; i++) {
      bullets[i].Update()
      bullets[i].Draw()
    }
  }
  if (asteroids.length !== 0) {
    // draw asteroids
    for (let i = 0; i < asteroids.length; i++) {
      asteroids[i].Update()
      asteroids[i].Draw()
    }
  }
  requestAnimationFrame(Render)
}