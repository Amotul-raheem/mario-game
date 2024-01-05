import platform from "./images/platform.png"

// console.log(platform)

const canvas = document.querySelector('canvas')

const c = canvas.getContext('2d')
canvas.width = innerWidth
canvas.height = innerHeight

const gravity = 0.5
let scrollOffSet = 0

class Player {
    constructor() {
        this.position = {
            x: 100,
            y: 100
        }
        this.velocity = {
            x: 0,
            y: 0
        }
        this.width = 30
        this.height = 30
    }

    draw() {
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y <= canvas.height)
            this.velocity.y += gravity
        else this.velocity.y = 0

    }
}

class Platform {
    constructor({x, y}) {
        this.position = {
            x, y
        }
        this.width = 200
        this.height = 20
    }

    draw() {
        c.fillStyle = "blue"
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}


const player = new Player()
const platforms = [new Platform({x: 200, y: 100}), new Platform({x: 500, y: 200}), new Platform({x: 300, y: 500})]

// Keeps tracked of when keys are pressed
const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    },
}

function animate() {
    // Recursion call
    requestAnimationFrame(animate)

    // Makes the player not a continuous strip, Previous rendition of the player is erased
    c.clearRect(0, 0, canvas.width, canvas.height)
    player.update()
    platforms.forEach(platform => {
        platform.draw()
    })

    // Creates a boundary to animate the background and platforms
    if (keys.right.pressed && player.position.x < 400) {
        player.velocity.x = 5
    } else if (keys.left.pressed && player.position.x > 100) {
        player.velocity.x = -5
    } else {
        player.velocity.x = 0

 // The player doesn't move and the platform and background moves as long the right and left keys are pressed
        if (keys.right.pressed) {
            scrollOffSet += 5
            platforms.forEach(platform => {
                platform.position.x -= 5
            })
        } else if (keys.left.pressed) {
            scrollOffSet -= 5
            platforms.forEach(platform => {
                platform.position.x += 5
            })
        }
    }

// Platform Collision Detection Logic
    platforms.forEach(platform => {
        if (player.position.y + player.height <= platform.position.y
            && player.position.y + player.height + player.velocity.y >= platform.position.y
            && player.position.x + player.width >= platform.position.x
            && player.position.x <= platform.position.x + platform.width
        ) {
            player.velocity.y = 0
        }
    })

 // Win scenario
    if (scrollOffSet > 2000) {
        console.log("You win")
    }
}

animate()


// Event listeners for controlling the player
addEventListener('keydown', ({key}) => {
    console.log(key)
    switch (key) {
        case 'a' :
            console.log("left")
            keys.left.pressed = true
            break
        case 'ArrowLeft' :
            console.log("left")
            keys.left.pressed = true
            break
        case 's' :
            console.log("down")
            break
        case 'ArrowDown' :
            console.log("down")
            break
        case 'd' :
            console.log("right")
            keys.right.pressed = true
            break
        case 'ArrowRight' :
            console.log("right")
            keys.right.pressed = true
            break
        case 'w' :
            console.log("up")
            player.velocity.y -= 5
            break
        case 'ArrowUp' :
            console.log("up")
            player.velocity.y -= 5
            break
    }
})
addEventListener('keyup', ({key}) => {
    // console.log(key)
    switch (key) {
        case 'a' :
            console.log("left")
            keys.left.pressed = false
            break
        case 'ArrowLeft' :
            console.log("left")
            keys.left.pressed = false
            break
        case 's' :
            console.log("down")
            break
        case 'ArrowDown' :
            console.log("down")
            break
        case 'd' :
            console.log("right")
            keys.right.pressed = false
            break
        case 'ArrowRight' :
            console.log("right")
            keys.right.pressed = false
            break
        case 'w' :
            console.log("up")
            player.velocity.y -= 10
            break
        case 'ArrowUp' :
            console.log("up")
            player.velocity.y -= 10
            break
    }
})