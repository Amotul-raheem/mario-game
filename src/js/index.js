import platform from "../images/platform.png"
import platformSmallTall from "../images/platformSmallTall.png"
import hills from "../images/hills.png"
import background from "../images/background.png"
import spriteRunLeft from "../images/spriteRunLeft.png"
import spriteRunRight from "../images/spriteRunRight.png"
import spriteStandLeft from "../images/spriteStandLeft.png"
import spriteStandRight from "../images/spriteStandRight.png"


const canvas = document.querySelector('canvas')

const c = canvas.getContext('2d')
canvas.width = 1400
canvas.height = 700

const gravity = 0.5

class Player {
    constructor() {
        this.speed = 10
        this.position = {
            x: 100, y: 100
        }
        this.velocity = {
            x: 0, y: 0
        }
        this.width = 66
        this.height = 150
        this.image = createImage(spriteStandRight)
        this.frames = 0
        this.sprites = {
            stand: {
                right: createImage(spriteStandRight),
                left: createImage(spriteStandLeft),
                cropWidth: 177,
                width: 66
            },
            run: {
                right: createImage(spriteRunRight),
                left: createImage(spriteRunLeft),
                cropWidth: 341,
                width:127.875
            }
        }
        this.currentSprite = this.sprites.stand.right
        this.currentCropWidth = 177
    }

    draw() {
        c.drawImage(
            this.currentSprite,
            this.currentCropWidth * this.frames,
            0,
            this.currentCropWidth,
            400,
            this.position.x,
            this.position.y,
            this.width,
            this.height)
    }

    update() {
        this.frames++

        if (this.frames > 59 && (this.currentSprite === this.sprites.stand.right || this.currentSprite === this.sprites.stand.left)) this.frames = 0
        else if (this.frames > 29 && (this.currentSprite === this.sprites.run.right || this.currentSprite === this.sprites.run.left)) this.frames = 0
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y <= canvas.height) this.velocity.y += gravity
    }
}

class Platform {
    constructor({x, y, image}) {
        this.position = {
            x, y
        }
        this.image = image
        this.width = image.width
        this.height = image.height
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

class GenericObject {
    constructor({x, y, image}) {
        this.position = {
            x, y
        }
        this.image = image
        this.width = image.width
        this.height = image.height
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

function createImage(imageSrc) {
    const image = new Image()
    image.src = imageSrc
    return image
}

let platformImage = createImage(platform)
let platformSmallTallImage = createImage(platformSmallTall)

let player = new Player()
let platforms = []
let genericObjects = []

let scrollOffSet = 0
let lastKey

// Keeps tracked of when keys are pressed
const keys = {
    right: {
        pressed: false
    }, left: {
        pressed: false
    },
}

function init() {
    platformImage = createImage(platform)

    player = new Player()
    platforms = [
        new Platform({
            x: platformImage.width * 4 + 300 - 2 + platformImage.width - platformSmallTallImage.width,
            y: 380,
            image: platformSmallTallImage
        }),
        new Platform({
            x: platformImage.width * 5 + 300 - 2 + platformImage.width - platformSmallTallImage.width,
            y: 180,
            image: platformSmallTallImage
        }),
        new Platform({x: -1, y: 580, image: platformImage}),
        new Platform({x: platformImage.width - 3, y: 580, image: platformImage}),
        new Platform({x: platformImage.width * 2 + 100, y: 580, image: platformImage}),
        new Platform({x: platformImage.width * 3 + 300, y: 580, image: platformImage}),
        new Platform({x: platformImage.width * 4 + 300 - 2, y: 580, image: platformImage}),
        new Platform({x: platformImage.width * 5 + 800 - 2, y: 580, image: platformImage}),
        new Platform({x: platformImage.width * 6 + 800 - 3, y: 580, image: platformImage}),
        new Platform({x: platformImage.width * 7 + 1200 - 4, y: 580, image: platformImage}),

    ]

    genericObjects = [
        new GenericObject({x: -1, y: -1, image: createImage(background)}),
        new GenericObject({x: -1, y: -1, image: createImage(hills)})
    ]

    scrollOffSet = 0
}


function animate() {
    // Recursion call
    requestAnimationFrame(animate)

    // Makes the player not a continuous strip, Previous rendition of the player is erased
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)

    genericObjects.forEach(genericObject => {
        genericObject.draw()
    })

    platforms.forEach(platform => {
        platform.draw()
    })
    player.update()

    // Creates a boundary to animate the background and platforms
    if (keys.right.pressed && player.position.x < 400) {
        player.velocity.x = player.speed
    } else if ((keys.left.pressed && player.position.x > 100) ||
        (keys.left.pressed && scrollOffSet === 0 && player.position.x > 0)) {
        player.velocity.x = -player.speed
    } else {
        player.velocity.x = 0

        // The player doesn't move and the platform and background moves as long the right and left keys are pressed
        if (keys.right.pressed) {
            scrollOffSet += player.speed
            platforms.forEach(platform => {
                platform.position.x -= player.speed
            })
            genericObjects.forEach(genericObject => {
                genericObject.position.x -= player.speed * .66
            })
        } else if (keys.left.pressed && scrollOffSet > 0) {
            scrollOffSet -= player.speed
            platforms.forEach(platform => {
                platform.position.x += player.speed
            })
            genericObjects.forEach(genericObject => {
                genericObject.position.x += player.speed * .66
            })
        }
    }

// Platform Collision Detection Logic
    platforms.forEach(platform => {
        if (player.position.y + player.height <= platform.position.y
            && player.position.y + player.height + player.velocity.y >= platform.position.y
            && player.position.x + player.width >= platform.position.x
            && player.position.x <= platform.position.x + platform.width) {
            player.velocity.y = 0
        }
    })

    if (keys.right.pressed && lastKey === 'right' && player.currentSprite !== player.sprites.run.right) {
        player.frames = 1
        player.currentSprite = player.sprites.run.right
        player.currentCropWidth = player.sprites.run.cropWidth
        player.width = player.sprites.run.width
    } else if (keys.left.pressed && lastKey === 'left' && player.currentSprite !== player.sprites.run.left) {
        player.currentSprite = player.sprites.run.left
        player.currentCropWidth = player.sprites.run.cropWidth
        player.width = player.sprites.run.width
    } else if (!keys.left.pressed && lastKey === 'left' && player.currentSprite !== player.sprites.stand.left) {
        player.currentSprite = player.sprites.stand.left
        player.currentCropWidth = player.sprites.stand.cropWidth
        player.width = player.sprites.stand.width
    } else if (!keys.right.pressed && lastKey === 'right' && player.currentSprite !== player.sprites.stand.right) {
        player.currentSprite = player.sprites.stand.right
        player.currentCropWidth = player.sprites.stand.cropWidth
        player.width = player.sprites.stand.width
    }

    // Win scenario
    if (scrollOffSet > platformImage.width * 7 + 1200 - 4) {
        console.log("You win")
    }

    // Lose Scenario
    if (player.position.y > canvas.height) {
        init()
    }
}

init()
animate()


// Event listeners for controlling the player
addEventListener('keydown', ({key}) => {
    switch (key) {
        case 'a' :
            keys.left.pressed = true
            lastKey = 'left'
            break
        case 'ArrowLeft' :
            keys.left.pressed = true
            lastKey = 'left'
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
            lastKey = 'right'
            break
        case 'ArrowRight' :
            keys.right.pressed = true
            lastKey = 'right'
            break
        case 'w' :
            player.velocity.y -= 15
            break
        case 'ArrowUp' :
            player.velocity.y -= 15
            break
    }
})
addEventListener('keyup', ({key}) => {
    // console.log(key)
    switch (key) {
        case 'a' :
            keys.left.pressed = false
            break
        case 'ArrowLeft' :
            keys.left.pressed = false
            break
        case 's' :
            console.log("down")
            break
        case 'ArrowDown' :
            console.log("down")
            break
        case 'd' :
            keys.right.pressed = false
            break
        case 'ArrowRight' :
            keys.right.pressed = false
            break
        case 'w' :
            console.log("up")
            break
        case 'ArrowUp' :
            console.log("up")
            break
    }
})