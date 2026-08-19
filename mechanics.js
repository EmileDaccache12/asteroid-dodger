document.addEventListener("DOMContentLoaded" , function() {
    function checkCollision(rocketHitbox, asteroidHitbox) {
        const rocketRect = rocketHitbox.getBoundingClientRect();
        const asteroidRect = asteroidHitbox.getBoundingClientRect();

        return (
            rocketRect.left < asteroidRect.right &&
            rocketRect.right > asteroidRect.left &&
            rocketRect.top < asteroidRect.bottom &&
            rocketRect.bottom > asteroidRect.top
        );
    }

    const rocket0 = document.getElementById("rocket0");
    const rocket1 = document.getElementById("rocket1");
    const rocket2 = document.getElementById("rocket2");
    const rocket3 = document.getElementById("rocket3");

    const container = document.getElementById("game");
    const box = document.getElementById("rocket-container");
    const hitbox1 = document.getElementById("hitbox1");

    const start_h1 = document.getElementById("start-h1");
    const restart_h1 = document.getElementById("restart-h1");
    const restart_h3 = document.getElementById("restart-h3");

    const scoreIndicator = document.getElementById("scoreVal");
    const highScoreIndicator = document.getElementById("high-scoreVal")
    const high_score = document.getElementById("high-score")
    const Score_h3 = document.getElementById("score");

    let left = true;
    let asteroidControllers = [];

    let running = false;

    // Alternate rocket animation
    let alternate;

    function alternation() {
        let currentRocket = 1;

        alternate = setInterval(() => {
            rocket1.style.display = "none";
            rocket2.style.display = "none";
            rocket3.style.display = "none";

            if (currentRocket === 1) {
                rocket1.style.display = "block";
            } else if (currentRocket === 2) {
                rocket3.style.display = "block";
            } else if (currentRocket === 3) {
                rocket2.style.display = "block";
            }

            currentRocket++;
            if (currentRocket > 3) {
                currentRocket = 1;
            }
        }, 202);
    }

    //------------------------------------------------------------------------------------//

    // CLICK DETECTORS
    document.addEventListener("pointerdown" , function() {
        // move click detector
        if (running === true) {
            // movement direction detector
            if (left === true) moveRight();
            else moveLeft();
        }

        // start click detector
        if (running === true) return;

        // Remove previous asteroids
        document.querySelectorAll(".asteroid-div").forEach(asteroid => {
            asteroid.remove();
        });

        // Clear old asteroid controllers
        asteroidControllers = [];

        // rocket mechanics reset
        clearInterval(rotate_drop);
        clearTimeout(delay);
        
        rocket0.style.display = "none";
        box.style.transform = "rotate(0deg)";

        left = true;

        //start
        high_score.style.display = "none";

        running = true;
        console.log("started");

        launch();
        container.style.animationPlayState = "running";

        alternation();

        start_h1.style.display = "none";
        restart_h1.style.display = "none";
        restart_h3.style.display = "none";

        asteroids();
        score();

        // score and highscore visibility
        Score_h3.style.display = "block";
        high_score.style.display = "none";
        high_score.style.color = "white";
    });

    //--------------------------------------------------------------------------------------//

    // score counter
    let socreInterval;
    let scoreVal = 0;
    let highScore = Number(localStorage.getItem("highScore")) || 0;

    highScoreIndicator.innerText = highScore;

    function score() {
        scoreVal = 0;

        socreInterval = setInterval(() => {
            scoreIndicator.innerText = scoreVal;

            // Check for new high score
            if (scoreVal > highScore) {
                highScore = scoreVal;

                highScoreIndicator.innerText = highScore;

                // Save high score
                localStorage.setItem("highScore", highScore);

                // styling
                Score_h3.style.display = "none";
                high_score.style.display = "block";
                high_score.style.color = "yellow";
            }

            scoreVal++;
        }, 400);
    }

    //--------------------------------------------------------------------------------------//
    
    box.style.top = container.clientHeight + 70 + "px";

    // LAUNCH
    let accend;

    function launch() {
        box.style.left = (container.clientWidth / 2) - 35 + "px";
        let num = 110;

        // launch interval
        accend = setInterval(() => {
            num--;
            box.style.top = num + "%";

            // stop accend detector
            if (num <= 65) {
                box.style.top = "65%";
                clearInterval(accend);
            }
        }, 20);

    }

    //--------------------------------------------------------------------------------------//

    let generator;
    
    // ASTEROIDS FUNCTION
    function asteroids() {
        // GENERATOR INTERVAL
        generator = setInterval(() => {
            // asteroid div creation
            const asteroid = document.createElement("div");
            asteroid.className = "asteroid-div";
            asteroid.innerHTML = `<img src="asteroid-pixel-1.png" alt="asteroid" class="asteroids">`;

            // asteroid hitbox creation
            const hitbox2 = document.createElement("div");
            hitbox2.className = "hitbox2";

            // X-position randomizer
            const randomX = Math.floor(Math.random() * 3) * 120;
            asteroid.style.left = randomX + "px";

            // asteroid Y-poisitioning
            let topPos = -120;

            asteroid.style.left = randomX + "px";
            asteroid.style.top = topPos + "px";

            asteroid.appendChild(hitbox2);
            container.appendChild(asteroid);

            // ASTEROID MOVER
            let controller = setInterval(() => {
            topPos++;
            asteroid.style.top = topPos + "px";

            // Collision detector
            if (checkCollision(hitbox1, hitbox2)) {
                clearInterval(controller);
                game_over();
                return;
            }

            // asteroid off screen detector
            if (topPos > container.clientHeight) {
                clearInterval(controller);
                asteroid.remove();
            }
        }, 5);
            asteroidControllers.push(controller);
            
        }, 1100);
    }

    //----------------------------------------------------------------------------------//

    // ROCKET MOVEMENT
    let moveL;
    let moveR;

    let index;
    
    //move left
    function moveLeft() {
        clearInterval(moveR);
        left = true;

        index = parseInt(box.style.left);
        box.style.transform = "rotate(-9deg)";

        moveL = setInterval(() => {
            box.style.left = index-- + "px";

            // wall collision detecotor L
            if (index <= -5) {
                clearInterval(moveL);
                game_over();
            }
        }, 5);
    }

    function moveRight() {
        clearInterval(moveL);
        left = false;

        index = parseInt(box.style.left);
        box.style.transform = "rotate(9deg)";

        moveR = setInterval(() => {
            box.style.left = index++ + "px";

            // wall collision detector R
            if (parseInt(box.style.left) >= container.clientWidth - 65) {
                clearInterval(moveR);
                game_over();
            }
        }, 5);
    }

    //------------------------------------------------------------------------------//

    // GAME OVER
    let rotate_drop;
    let delay;

    function game_over() {
        // interval clearing
        clearInterval(generator);
        clearInterval(moveL);
        clearInterval(moveR);
        clearInterval(socreInterval);
        clearInterval(alternate)
        
        // asteroid movement freeze
        asteroidControllers.forEach(controller => {
            clearInterval(controller);
        });

        // background animation pause
        container.style.animationPlayState = "paused";

        // game over text
        restart_h3.style.display = "block";
        restart_h1.style.display = "block";

        Score_h3.style.display = "block";
        high_score.style.display = "block";

        // restart
        running = false;

        // turn off fire
        rocket1.style.display = "none";
        rocket2.style.display = "none";
        rocket3.style.display = "none";
        rocket0.style.display = "block";

        // rocket spin and fall
        let rotation = 1;
        let drop = 66;

        delay = setTimeout(() => {
            rotate_drop = setInterval(() => {
                box.style.transform = `rotate(${rotation}deg)`;
                rotation += 3;

                box.style.top = drop + "%";
                drop += 0.4;

                if (drop >= 110) {
                    clearInterval(rotate_drop);
                }
            }, 15);
        }, 300);
    }
});