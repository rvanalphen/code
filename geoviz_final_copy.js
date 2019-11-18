let lines = 100;


// API Key for Mapbox
const key = 'pk.eyJ1IjoicnZhbmFscGhlbiIsImEiOiJjazI2ODFnNnUwMnZkM2NsbG0yc3YxNnU1In0._LCd_x_e2LbjGGNfDK9wCg'

// Options for map
const options = {
    lat: 36.767,
    lng: -116.606,
    zoom: 15,
    studio: true,
    style: 'mapbox://styles/mapbox/satellite-streets-v10',
};

// Create an instance of Mapbox
const mappa = new Mappa('Mapbox', key);
let myMap;
//loading preliminary GCPs 
function preload() {
    gcps = loadTable('/HTML_Tutorials/R10_GPS_geo_color.csv');
    console.log(gcps);

}

function setup() {
    canvas = createCanvas(1000, 800);

    //Top Left Coordinates  
    inputX = createInput(" 36.775");
    inputX.position(10, 810);
    inputX.changed(newText);
    inputY = createInput("-116.611");
    inputY.position(185, 810);
    inputY.changed(newText);

    //Bottom Right Coordinates 
    inputX2 = createInput(" 36.763");
    inputX2.position(360, 810);
    inputX2.changed(newText);
    inputY2 = createInput("-116.60");
    inputY2.position(535, 810);
    inputY2.changed(newText);

    //Path Spacing
    inputSpacing = createInput("30");
    inputSpacing.position(710, 810);

    myMap = mappa.tileMap(options)
    myMap.overlay(canvas);
}


function newText() {
    console.log(inputX2.value(), inputY2.value(),
        inputX.value(),
        inputY.value());
}

function draw() {
    clear();
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


    // drawing the survey rectangle
    //converting the lat and long into pixel coordinates
    //drawing the rectangle with a green fill
    var lat = inputX.value();
    var lng = inputY.value();
    var lat2 = inputX2.value();
    var lng2 = inputY2.value();
    var spacing = inputSpacing.value();

    const tlc = myMap.latLngToPixel(lat, lng);
    const brc = myMap.latLngToPixel(lat2, lng2);
    //
    rectMode(CORNERS);
    strokeWeight(4);
    //noFill();
    stroke(255, 204, 0);
    fill(150, 250, 100);
    rect(tlc.x, tlc.y, brc.x, brc.y);


    var x = tlc.x;
    var y = tlc.y;
    var l = brc.y


    for (let i = 0; i < lines; i++) {
        if (x < brc.x) {
            console.log(x, spacing);
            noLoop();
            strokeWeight(3);
            beginShape();
            vertex(x, y);
            vertex(x, l);
            endShape();
            x += spacing;

        }
    }
}
