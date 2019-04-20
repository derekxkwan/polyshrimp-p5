let cw = window.innerWidth;
let ch = window.innerHeight;

let min_dim = Math.min(cw, ch);

let dim = 75;
let nx = Math.floor(cw/dim);
let ny = Math.floor(ch/dim);
let num_poly = nx * ny;
let min_swell = 0.35;
let max_swell = 1.0;
let swell_rng = max_swell - min_swell;

let old_bg = [0,0,0];
let new_bg = [0,0,0];
let bg_ramp = 3500;
let bg_start = 0;
let bg_weights = [[0.0,1.0], [0.2, 0.4], [1.0, 1.0]];
var shrimp;
let shrimp_swell = 0;
let shrimp_bounds = [0.65, 0.75];

var polys = [];
var s_dur = [];

let cstr = ["SHRIMP", "WONTONNOODLES", "SHUMAI",
	    "KIMCHI", "EBITEMPURA", "SHRIMPTACOS", "MEIFUN",
	    "HARGOW",  "INSTANTNOODLES", "TOMYUMGOONG",
	    "DRUNKENSHRIMP", "EBINIGIRIZUSHI", "SEAFOODGUMBO",
	    "SHRIMPCHIPS", "HAMAICHEUNG", "CHICKENBROTH"];

//returns cx, cy, dim

function new_bg_color()
{
    return Array.from({length: 3}, (x, i) => Math.floor(random(bg_weights[i][0]*256, bg_weights[i][1]*256)));
}

function disp_img(cur_time)
{
    let modtime = cur_time % shrimp_swell;
    let swell_pos = 1.0 - Math.abs(((modtime/shrimp_swell) * 2.0) - 1.0);
    let cur_dim = min_dim * ((shrimp_bounds[1] - shrimp_bounds[0]) * swell_pos + shrimp_bounds[0]);
    let c_cx = (cw-cur_dim)/2.0;
    let c_cy = (ch-cur_dim)/2.0;
    image(shrimp, c_cx, c_cy, cur_dim, cur_dim);
}

function disp_bg(cur_time)
{
    let cur_pos = cur_time - bg_start;
    colorMode(HSB, 255);
    if(cur_pos >= bg_ramp)
	{
	    old_bg = new_bg;
	    new_bg = new_bg_color();

	    bg_start = cur_time;
	};

    cur_pos = (cur_pos % bg_ramp)/bg_ramp;
    
    let ret_bg = old_bg.map(
	(old_clr, idx) =>
	    
	((new_bg[idx] - old_clr) * cur_pos) + old_clr
	
    );


    let ret_color =  color(ret_bg[0], ret_bg[1], ret_bg[2], 150);

    background(ret_color);

    
}

function  calc_coords(idx, cur_time)
{
    let c_cx = polys[idx].cx;
    let c_cy = polys[idx].cy;
    let c_sdur = s_dur[idx];
    let c_start_time =  polys[idx].start_time;
    let modtime = (cur_time - c_start_time) % c_sdur;
    let swell_pos = 1.0 - Math.abs(((modtime/c_sdur) * 2.0) - 1.0);
    let cur_swell = (swell_rng * swell_pos) + min_swell;
    let pos_offset =  (1.0 - swell_pos) * swell_rng * 0.5 * dim;
    return [c_cx + pos_offset, c_cy + pos_offset, cur_swell * dim];
    
    }

function setup() {
  // put setup code here
    createCanvas(cw,ch);
    old_bg = new_bg_color();
    new_bg = new_bg_color();
    console.log(old_bg);
    bg_ramp = 1250 + random(1750);
    bg_start = millis();
    shrimp_swell = Math.floor(7500 + random(5000));



    for(let i = 0; i < num_poly; i++)
	{
	    let cur_str = cstr[Math.floor(random(cstr.length))];
	    let c_c1 = color(random(256), random(256), random(256));
	    let c_c2 = color(random(256), random(256), random(256));
	    let c_dur = random(600) + 150;
	    //let c_dur = 125;
	    let c_cx = (i % nx) * dim;
	    let c_cy = Math.floor(i/nx) * dim;
	    let c_sdur = Math.round(1000 + random(2500));
	    let cur_poly = new PolyVisSq(cur_str, c_c1, c_c2, c_dur, c_cx, c_cy, dim);
	    polys.push(cur_poly);
	    s_dur.push(c_sdur);
	};

}

function preload(){
    shrimp = loadImage('assets/shrimp.png');
    }

function draw() {
  // put drawing code here
    let cur_time = millis();
    clear();
    //disp_bg();
    disp_img(cur_time);
    disp_bg(cur_time);
    colorMode(RGB, 255);


    for(let i=0; i < polys.length; i++)
    {
	let [cur_x, cur_y, cur_dim] = calc_coords(i, cur_time);
	polys[i].draw(cur_time);
	image(polys[i].gfx, cur_x, cur_y, cur_dim, cur_dim);
    };

}
