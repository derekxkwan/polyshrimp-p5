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

let polys = [];
let s_dur = [];

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

function mobile_or_tablet() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

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
    let is_mobile = mobile_or_tablet();
    createCanvas(cw,ch);
    frameRate(24);
    if(is_mobile == true){
	num_slices = 30;
    };
    
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
    shrimp = loadImage("assets/shrimp.png");
    }


function poly_draw(cur_time)
{
    
    for(let i=0; i < num_poly; i++)
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
	    /*
	    if(horiz == true)
		shift_line(bg_gfx, 0, cur_slice , cur_prop*cur_dir*cur_swell, width, height, slice_width);
	    else
		shift_line(bg_gfx, 1, cur_slice , cur_prop*cur_dir*cur_swell, width, height, slice_width);
		*/

	      if(horiz == true)
		draw_strip(bg_gfx, 0, 0, 0, cur_slice , cur_prop*cur_dir*cur_swell, slice_width);
	    else
		draw_strip(bg_gfx, 1, 0, 0, cur_slice , cur_prop*cur_dir*cur_swell, slice_width);
	    

	};


    poly_draw(cur_time);


    
}

//function draw_strip(img, horiz_vert, dest_x, dest_y, cur_idx, shift_amt, strip_size)

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

function draw_strip(img, horiz_vert, dest_x, dest_y, cur_idx, shift_amt, strip_size)
{
    let s_x, s_y, d_x, d_y, c_w, c_h;
    // if we are starting within the bounds
    let can_draw = false, can_copy = false;
    let real_idx = cur_idx * strip_size;
    //horizontal
    if(horiz_vert == 0)
    {
	// strip dest idx we want
	let copy_x = 0;
	let copy_y = real_idx;
	let want_idx = real_idx + dest_y; //draw_y
	let want_shift = shift_amt + dest_x; //draw_x
	let want_h = strip_size;
	let want_w = img.width;
	if(want_shift + want_w >= width) want_w = width - want_shift;
	else if (want_shift < 0)
	{
	    copy_x = -1.0* want_shift;
	    want_w = want_w + want_shift;
	};
	if(want_idx  + want_h > height) want_h = height - want_idx;
	else if(want_idx < 0)
	{
	    copy_y = -1.0 * want_idx;
	    want_h = strip_size + want_idx;
	}
	can_draw = want_w > 0 && want_shift < width && want_idx < height;
	can_copy = real_idx < img.height && want_h > 0 && want_w > 0;

	d_x = want_shift;
	d_y = want_idx;
	c_w = want_w;
	c_h = want_h;
	s_y = real_idx;
	s_x = copy_x;
	s_y = copy_y;
    }
    else
    {
	// vertical
	let copy_x = real_idx;
	let copy_y = 0;
	let want_idx = real_idx + dest_x; //draw_x
	let want_shift = shift_amt + dest_y; //draw_y
	let want_h = img.height;
	let want_w = strip_size;
	if(want_shift + want_h >= height) want_h = height - want_shift;
	else if (want_shift < 0){
	    copy_y = -1.0* want_shift;
	    want_h = want_h + want_shift;
	};
	if(want_idx  + want_w > height) want_w = width - want_idx;
	else if(want_idx < 0)
	{
	    copy_x = -1.0 * want_idx;
	    want_w = strip_size + want_idx;
	};
	can_draw = want_w > 0 && want_shift < height && want_idx < width;
	can_copy = real_idx < img.width && want_h > 0 && want_w > 0;

	d_x = want_idx;
	d_y = want_shift;
	c_w = want_w;
	c_h = want_h;
	s_x = copy_x;
	s_y = copy_y;
	

	
    };

    if(can_draw && can_copy)
    {
	copy(img, s_x, s_y, c_w, c_h, d_x, d_y, c_w, c_h);
    }
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
