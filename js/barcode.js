var html_canvas = document.getElementById('canvas');

function generate_barcode(explicit) {

	var selected_function = { 'upc_barcode' : generat_upc_barcode};
	var active_function = null;
	
		if (document.getElementById('upc_barcode').checked)
			active_function = selected_function['upc_barcode'];

	var barcode;
	var canvas_data = html_canvas.getContext('2d');
	try {
		if (active_function == null)
			throw 'error';
		barcode = active_function(document.getElementById('text').value);
	} catch (e) {
		//empty canvas on data error
		canvas_data.fillStyle = '#FFFFFF';
		canvas_data.fillRect(0, 0, html_canvas.width, html_canvas.height);
		if (explicit)
			alert(event);
		return;
	}
	
	// canvas data blank barcode
	var scale = parseInt(document.getElementById('barwidth').value, 10);
	var width = barcode.length * scale + 100;
	var height = 300;
	var image = canvas_data.createImageData(width, height);
	var data = image.data;
	for (var i = 0; i < width * height * 4; i++)
		data[i] = 0xFF;
	
	// canvas data for bars
	for (var y = 50; y < 250; y++) {
		for (var i = 0, x = 50; i < barcode.length; i++) {
			for (var j = 0; j < scale; j++, x++) {
				var k = ((y * width) + x) * 4;
				data[k + 0] = data[k + 1] = data[k + 2] = barcode[i] * 255;
			}
		}
	}
	html_canvas.width  = width;
	html_canvas.height = height;
	canvas_data.putImageData(image, 0, 0);
}


// barcode
function generat_upc_barcode(s) {
	if (!/^\d{12}$/.test(s))
		throw 'UPC Code needs to be 12 digits';
	
	var table = ['1110010',
                 '1100110',
                 '1101100',
                 '1000010',
                 '1011100',
                 '1001110',
                 '1010000',
                 '1000100',
                 '1001000',
                 '1110100'];
    
	var result = [];
	join_barcode_numbers(result, '010');
	for (var i = 0; i < s.length; i++) {
		if (i == s.length / 2)
			join_barcode_numbers(result, '10101');  // middle of the barcode
		var code = table[parseInt(s.charAt(i), 10)];
		if (i >= s.length / 2)
			code = invert_bits(code);
		join_barcode_numbers(result, code);
	}
	join_barcode_numbers(result, '010');  // end of the barcode
	return result;
}

function join_barcode_numbers(arr, str) {
	for (var i = 0; i < str.length; i++)
		arr.push(parseInt(str.charAt(i), 10));
}

function invert_bits(s) {
	return s.replace(/./g, function(d) { return 1 - d + ''; });
}
