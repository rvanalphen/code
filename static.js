// API key for Mapbox. 
const key = 'pk.eyJ1IjoicnZhbmFscGhlbiIsImEiOiJjazI2ODFnNnUwMnZkM2NsbG0yc3YxNnU1In0._LCd_x_e2LbjGGNfDK9wCg';

// Create an instance of Mapbox.
const mappa = new Mappa('Mapbox', key);

// Options for map
const options = {
    lat: 36.769,
    lng: -116.606,
    zoom: 15,
    width: 1000,
    height: 800,
    scale: 1,
    pitch: 0,
    style: 'satellite-v9'
};

// Create the static map reference.
const myMap = mappa.staticMap(options);

function preload() {
    // Load the  mapbox image
    img = loadImage(myMap.imgUrl);
    magMap = loadImage('./images/MagMap1.png');
}

function setup() {
    createCanvas(1000, 800)

    //input for the starting position of the drone
    dx = window.prompt("Please Enter your UAV's Latitude, a suggestion is provided", 36.763);
    dy = window.prompt("Please Enter your UAV's Longitude, a suggestion is provided", -116.611);

    //Top Left Coordinates  
    inputX = createInput();
    inputX.position(10, 810);

    inputY = createInput();
    inputY.position(185, 810);

    //Bottom Right Coordinates 
    inputX2 = createInput();
    inputX2.position(360, 810);

    inputY2 = createInput();
    inputY2.position(535, 810);

    //Path Spacing
    inputSpacing = createInput();
    inputSpacing.position(710, 810);

    //Button to start animation 
    button = createButton('Start Drone');
    button.position(width - (width * 0.10), height + 10);
    button.mousePressed(start);

    function start() {
        delay = 1;
    }

    // Path variables 

    //velocity
    vy = -5;
    vx = 0;
    //lines
    lines = 1;
    //setting a really long delay so the button function above can shorted the delay and start the animation 
    delay = 600000;
    //color
    r = 0
    g = 255
    b = 0

    //Input coordinates for Path
    d0 = myMap.latLngToPixel(dx, dy);
    d1 = myMap.latLngToPixel(dx, dy);
    //Creating a path vector 
    path = new p5.Vector(floor(d0.x), ceil(d1.y))
}


function draw() {
    //Drawing image of static map called by mappa
    imageMode(CORNER);
    image(img, 0, 0);

    //Labals
    rectMode(CORNER);
    noStroke();
    fill(130, 150, 100, );
    rect(0, 768, width, 30);
    textSize(20);
    fill(0);
    text('Lattitude', width - (width * 0.99), height - (height * .01));
    textSize(20);
    fill(0);
    text('Longitude', width - (width * 0.81), height - (height * .01));
    textSize(20);
    fill(0);
    text('Lattitude 2', width - (width * 0.63), height - (height * .01));
    textSize(20);
    fill(0);
    text('Longitude 2', width - (width * 0.45), height - (height * .01));
    textSize(20);
    fill(0);
    text('Line Spacing', width - (width * 0.27), height - (height * .01));

    //Label above botton that displays the line #
    if (path.y == ceil(d1.y) && path.x == floor(d0.x) && g == 255) {
        fill(255);
        textSize(20);
        text('Press to Start', width - (width * 0.13), height - (height * .01));

    } else if (r == 255) {
        fill(255);
        textSize(20);
        text('Done!', width - (width * 0.1), height - (height * .01));
    } else {
        b = 255
        g = 0
        fill(255);
        textSize(20);
        text('Line #' + lines, width - (width * 0.1), height - (height * .01));
    }


    lat = inputX.value();
    lng = inputY.value();
    lat2 = inputX2.value();
    lng2 = inputY2.value();
    spacing = inputSpacing.value();

    //Converting the inputs into pixel coordinates
    // tlc = "Top Left Corner", brc = "Bottom Right Corner"
    tlc = myMap.latLngToPixel(lat, lng);
    brc = myMap.latLngToPixel(lat2, lng2);

    //Delaying the function so that a button can be pressed and shorten the delay 
    setTimeout(dronePath, delay);

    //Function within draw that sets and checks conditions to move the "drone" along a straight line path
    function dronePath() {
        fill(255)
        noStroke();
        if (path.x > ceil(brc.x)) {
            print('End')
            path.x = floor(tlc.x);
            path.y = ceil(brc.y);
            g = 0;
            r = 255;
            b = 0
            vy = 0;
            vx = 0;
            noLoop();
        } else if (vy < 0 && path.y > floor(tlc.y)) {
            print("Conditional 1")

        } else if (path.y <= floor(tlc.y) && path.x < floor(tlc.x) + lines * spacing) {
            print("Conditional 2")
            print(path.x, floor(tlc.x) + (lines * spacing))
            print(path.y, floor(tlc.y));

            vy = 0;
            vx = 5;
        } else if (path.x >= floor(tlc.x) + (lines * spacing) && path.y == floor(tlc.y) || path.x <= floor(tlc.x) + (lines * spacing) && path.y <= floor(tlc.y)) {
            print("Conditional 3")
            path.x = floor(tlc.x) + (lines * spacing);
            vx = 0;
            vy = 5;
            lines += 1;
        } else if (vy > 0 && path.y < ceil(brc.y)) {
            print("Conditional 4")

        } else if (path.y >= ceil(brc.y) && path.x < floor(tlc.x) + lines * spacing) {
            print("Conditional 5")
            path.y = ceil(brc.y);
            vy = 0;
            vx = 5;
        } else if (path.x >= floor(tlc.x) + (lines * spacing) && path.y == ceil(brc.y)) {
            print("Conditional 6")
            path.x = floor(tlc.x) + (lines * spacing);
            vx = 0;
            vy = -5;
            lines += 1;

        }


        path.x += vx;
        path.y += vy;
    }



    //Drawing the survey rectangle
    rectMode(CORNERS);
    strokeWeight(4);
    noFill();
    stroke(255, 204, 0);
    rect(tlc.x, tlc.y, brc.x, brc.y);

    //Drawing ellipse as the path changes 
    strokeWeight(1);
    noStroke();
    fill(r, g, b);
    ellipse(path.x, path.y, 10);


}
