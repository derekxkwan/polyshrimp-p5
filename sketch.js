//credit for shrimp img: https://commons.wikimedia.org/wiki/File:NCI_steamed_shrimp.jpg

//steamed shrimp http://visualsonline.cancer.gov/details.cfm?imageid=2676 Source: National Cancer Institute Author: Renee Comet (photographer) AV Number: AV-9400-4228 Date Created: 1994 {{PD-USGov}}


let cw = window.innerWidth;
let ch = window.innerHeight;

let swell_state = 0;
let swell_inc = 0.5;
let swell_dir = 1.0;
let swell_mininc = 0.25;
let swell_maxinc = 0.75;
let swell_max = 200.0;
let min_dim = Math.min(cw, ch);
let bg_gfx;
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


let slice_idx;
let num_slices = 200;
let slice_prop;
let slice_dir;
let slice_max = 90;
let slice_width;
let horiz = false;

function slice_instantiate()
{
    if(horiz == true)
    {
	slice_prop = Array.from({length: num_slices}, (x, i) => random(0.01,1.0));
	slice_dir = Array.from({length: num_slices}, (x, i) => coin_flip());
    }
    else
    {
	slice_prop = Array.from({length: num_slices}, (x, i) => random(0.01,1.0));
	slice_dir = Array.from({length: num_slices}, (x, i) => coin_flip());
    };
			   
}

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
    bg_gfx.image(shrimp, c_cx, c_cy, cur_dim, cur_dim);
}

function disp_bg(cur_time)
{
    let cur_pos = cur_time - bg_start;

    bg_gfx.colorMode(HSB, 255);
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


    let ret_color = color(ret_bg[0], ret_bg[1], ret_bg[2], 150);

    bg_gfx.fill(ret_color);
    bg_gfx.noStroke();
    bg_gfx.rect(0,0,cw, ch)

    
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
    frameRate(24);
    bg_gfx = createGraphics(cw,ch);
    old_bg = new_bg_color();
    new_bg = new_bg_color();
    bg_ramp = 1250 + random(1750);
    bg_start = millis();
    shrimp_swell = Math.floor(7500 + random(5000));

    if(horiz == true) slice_width = Math.round(height/num_slices);
    else slice_width = Math.round(width/num_slices);

    slice_idx = Array.from({length: num_slices}, (x, i) => i*slice_width);
    slice_instantiate();


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


function poly_draw(cur_time)
{
    
    for(let i=0; i < polys.length; i++)
    {
	let [cur_x, cur_y, cur_dim] = calc_coords(i, cur_time);
	polys[i].draw(cur_time);
	image(polys[i].gfx, cur_x, cur_y, cur_dim, cur_dim);
    };

}

function draw() {
  // put drawing code here
    let cur_time = millis();
    //clear();
    //disp_bg();
    bg_gfx.background(255);
    disp_img(cur_time);
    disp_bg(cur_time);
    //colorMode(RGB, 255);


    let cur_swell = swell_state;
    swell_state += (swell_inc * swell_dir);
    if(swell_state > swell_max) swell_dir = -1.0;
    else if (swell_state <= 0)
    {
	swell_dir = 1.0;
	slice_instantiate();
	swell_inc = random(swell_mininc, swell_maxinc);
    };
    for(let i=0; i < num_slices; i++)
	{
	    let cur_slice = slice_idx[i];
	    let cur_prop = slice_prop[i];
	    let cur_dir = slice_dir[i];
	    if(horiz == true)
		shift_line(bg_gfx, 0, cur_slice , cur_prop*cur_dir*cur_swell, width, height, slice_width);
	    else
		shift_line(bg_gfx, 1, cur_slice , cur_prop*cur_dir*cur_swell, width, height, slice_width);

	    

	};


    poly_draw(cur_time);


    
}

// neg shift = shift left.
function shift_line(img = null, horiz_vert = 0, idx = 0 , shift_amt = 0, cur_w = width, cur_h = height, chunk_size = 1)
{

    //horizontal
    if(horiz_vert == 0)
    {
	let cur_idx = idx < 0 ? 0 : (idx >= cur_h ? cur_h - 1 : idx);
	let cur_chunk = cur_idx + chunk_size >= cur_h ? cur_h - cur_idx : chunk_size;
	let cur_shift = shift_amt >= cur_w ? cur_w - 1 : (shift_amt <= (-1 * cur_w) ? (-1 * cur_w) + 1 : shift_amt);
	if(cur_shift > 0)
	{
	    let copy_width = cur_w - cur_shift;
	    if(img)
	    {
		copy(img, 0, cur_idx, copy_width, cur_chunk, cur_shift, cur_idx, copy_width, cur_chunk);
		copy(img, 0, cur_idx, 1, cur_chunk, 0, cur_idx, cur_shift, cur_chunk);

	    }
	    else
	    {
		copy(0, cur_idx, copy_width, cur_chunk, cur_shift, cur_idx, copy_width, cur_chunk);
		copy(0, cur_idx, 1, cur_chunk, 0, cur_idx, cur_shift, cur_chunk);
	    }

	}
	else if (cur_shift < 0)
	{
	    let copy_width = cur_w + cur_shift;
	    if(img)
	    {
		copy(img, cur_shift, cur_idx, copy_width, cur_chunk, 0, cur_idx, copy_width, cur_chunk);
		copy(img, cur_w - 1, cur_idx, 1, cur_chunk, copy_width, cur_chunk, -1 * cur_shift, cur_chunk);
	    }
	    else
	    {
		copy(cur_shift, cur_idx, copy_width, cur_chunk, 0, cur_idx, copy_width, cur_chunk);
		copy(cur_w - 1, cur_idx, 1, cur_chunk, copy_width, cur_chunk, -1 * cur_shift, cur_chunk);
	    };
	};
	
    }
    else
	{
      //vertical
	    let cur_idx =  idx < 0 ? 0 : (idx >= cur_w ? cur_w - 1  : idx);
	    let cur_chunk = idx + chunk_size >= cur_w ? cur_w  - idx : chunk_size;
	    let cur_shift = shift_amt >= cur_h ? cur_h - 1 : (shift_amt <= (-1 * cur_h) ? (-1 * cur_h) + 1 : shift_amt);
	    if(cur_shift > 0)
	    {
		let copy_height = cur_h - cur_shift;
		if(img)
		{
		    copy(img, cur_idx, 0, cur_chunk, copy_height, cur_idx, cur_shift, cur_chunk, copy_height);
		    copy(img, cur_idx, 0, cur_chunk, 1, cur_idx, 0, cur_chunk, cur_shift+1);
		}
		else
		{
		    copy(cur_idx, 0, cur_chunk, copy_height, cur_idx, cur_shift, cur_chunk, copy_height);
		    copy(cur_idx, 0, cur_chunk, 1, cur_idx, 0, cur_chunk, cur_shift+1);
		}
	    }
	    else if (cur_shift < 0)
	    {

		let copy_height = cur_h + cur_shift;
		if(img)
		{
		    copy(img, cur_idx, -1*cur_shift, cur_chunk, copy_height, cur_idx, 0, cur_chunk, copy_height);
		    copy(img, cur_idx, cur_h - 1, cur_chunk, 1, cur_idx, copy_height, cur_chunk, -1 * cur_shift);
		}
		else
		{
		    copy(cur_idx, -1*cur_shift, cur_chunk, copy_height, cur_idx, 0, cur_chunk, copy_height);
		    copy(cur_idx, cur_h - 1, cur_chunk, 1, cur_idx, copy_height, cur_chunk, -1 * cur_shift);
		}
	    };
							     
	};
}

function coin_flip()
{
    let cur = random(100);
    if(cur >= 50) return 1;
    else return -1;
}

window.onerror = function(error) {
    alert(error);
};
