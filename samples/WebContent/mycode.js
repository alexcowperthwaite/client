/**
 * Simple application that displays an image moving off the screen.
 * Contains FPS slider to change tick speed.
 */

// Global vars
var stage, image, fpstext;

/**
 * Entry point on page load.
 */
function init() {

    // Stage is main container
    stage = new createjs.Stage(id("gameCanvas"));

    // Build assets
    image = new createjs.Bitmap("assets/bg.png");
    
    fpstext = new createjs.Text("fps:", "20px Arial", "#7a1567");
    fpstext.x = 0;
    fpstext.y = 20;
    
    // Add assets to stage
    stage.addChild(image);
    stage.addChild(fpstext);
    
    // fps value
    var fpsValue = id("fps").value;
    id("lblfps").innerHTML = fpsValue;
    
    // Set loop fps and listener
    createjs.Ticker.setFPS(fpsValue);
    createjs.Ticker.addEventListener("tick", tick);
}

/**
 * Handles loop update.
 */
function tick() {

    image.x += 10;
    if (image.x > 600)
        image.x = 0;

    fpstext.text = Math.round(createjs.Ticker.getMeasuredFPS()) + " fps"; 
    
    stage.update();
}

/**
 * Safe method of getting an element id
 * @param id
 * @returns
 */
function id(id) {
    
    return id === null || id === undefined ? alert("Please provide element id")
            : document.getElementById(id);
}

/**
 * Updates the labels and ticker with the new fps value.
 * @param _id
 * @param value
 */
function showRangeValue(_id, value) {
    
    id("fps").value = value;
    id("lbl" + _id).innerHTML = value; 
    createjs.Ticker.setFPS(value);
}