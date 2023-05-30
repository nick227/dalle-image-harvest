require('dotenv').config();
const https = require('https');
const Stream = require('stream').Transform;
const fs = require('fs');

const stableDiffApiKey = process.env.STABLEDIFF_API_KEY;
const stableDiffEndPoint = 'https://stablediffusionapi.com/api/v3/text2img';

module.exports.stableDiffuse = function() {
	const obj = {
	    "key": stableDiffApiKey,
	    "prompt": "ultra realistic close up portrait ((beautiful pale cyberpunk female with heavy black eyeliner)), blue eyes, shaved side haircut, hyper detail, cinematic lighting, magic neon, dark red city, Canon EOS R3, nikon, f/1.4, ISO 200, 1/160s, 8K, RAW, unedited, symmetrical balance, in-frame, 8K",
	    "negative_prompt": "((out of frame)), ((extra fingers)), mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), (((tiling))), ((naked)), ((tile)), ((fleshpile)), ((ugly)), (((abstract))), blurry, ((bad anatomy)), ((bad proportions)), ((extra limbs)), cloned face, (((skinny))), glitchy, ((extra breasts)), ((double torso)), ((extra arms)), ((extra hands)), ((mangled fingers)), ((missing breasts)), (missing lips), ((ugly face)), ((fat)), ((extra legs)), anime",
	    "width": "512",
	    "height": "512",
	    "samples": "1",
	    "num_inference_steps": "20",
	    "safety_checker": "no",
	    "enhance_prompt": "yes",
	    "seed": null,
	    "guidance_scale": 7.5,
	    "webhook": null,
	    "track_id": null
	}

}

module.exports.getMonthStr = function(){
	const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	const d = new Date();
	return monthNames[d.getMonth()].toLowerCase();
}