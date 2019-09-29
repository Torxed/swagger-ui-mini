export function load_manifest(url, post) {
	let xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.onreadystatechange = function() {
		if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
			manifest = JSON.parse(this.responseText);
			post();
		}
	}
	xhr.send();
}

export function forEach(obj, func) {
	//Object.keys(obj).forEach(func);
	for (const [key, val] of Object.entries(obj)) {
		func(key, val);
	}
}

export function build_method_square(method, DEPRECATED=false, EDITABLE=false) {
	let type;
	if(!EDITABLE) {
		type = document.createElement('div');
		type.innerHTML = method;
	} else {
		type = document.createElement('input');
		type.placeholder = method;
		type.id = 'method';
	}
	if(!DEPRECATED)
		type.classList = 'type ' + method;
	else
		type.classList = 'type ' + method + ' DEPRECATED';
	return type;
}

export function build_url_string(url_path, DEPRECATED=false, EDITABLE=false) {
	let url;
	if(!EDITABLE) {
		url = document.createElement('div')
		url.innerHTML = url_path;
	} else {
		url = document.createElement('input');
		url.value = url_path;
		url.id = 'url';
	}
	
	if(!DEPRECATED) {
		url.classList = 'url';
	} else {
		url.classList = 'url DEPRECATED';
	}
	return url;
}

export function build_description_string(description, EDITABLE=false) {
	let desc;
	if(!EDITABLE) {
		desc = document.createElement('div');
		desc.innerHTML = description;
	} else {
		desc = document.createElement('input');
		desc.value = description;
		desc.placeholder = 'Description';
		desc.id = 'description';
	}

	desc.classList = 'short_desc';
	desc.innerHTML = description;
	return desc;
}

export function build_header(method, url_path, description, DEPRECATED=false, EDITABLE=false) {
	let type = build_method_square(method, DEPRECATED, EDITABLE)
	let url = build_url_string(url_path, DEPRECATED, EDITABLE);
	let desc = build_description_string(description, EDITABLE);
	return [type, url, desc];
}

export function generate_lock_icon() {
	let authorization_required = document.createElement('div');
	let tmp_btn = document.createElement('button');
	tmp_btn.classList = 'authbutton unlocked';
	tmp_btn.innerHTML = `<svg width="20" height="20">
				<use href="#unlocked" xlink:href="#unlocked">
					<svg viewBox="0 0 20 20" id="unlocked">
						<path d="M15.8 8H14V5.6C14 2.703 12.665 1 10 1 7.334 1 6 2.703 6 5.6V6h2v-.801C8 3.754 8.797 3 10 3c1.203 0 2 .754 2 2.199V8H4c-.553 0-1 .646-1 1.199V17c0 .549.428 1.139.951 1.307l1.197.387C5.672 18.861 6.55 19 7.1 19h5.8c.549 0 1.428-.139 1.951-.307l1.196-.387c.524-.167.953-.757.953-1.306V9.199C17 8.646 16.352 8 15.8 8z">
						</path>
					</svg>
				</use>
			</svg>`
	authorization_required.classList = 'protected';
	authorization_required.appendChild(tmp_btn);
	return authorization_required;
}

export function build_description(description, EDITABLE=false) {
	let tmp;
	if(!EDITABLE) {
		tmp = document.createElement('div');
		tmp.innerHTML = description;
	} else {
		tmp = document.createElement('input');
		tmp.value = description;
		tmp.placeholder = 'Description';
	}
		
	tmp.classList = 'description';
	return tmp;
}

export function build_responses(data) {
	let responses = document.createElement('div');
	responses.classList = 'responses';

	let title = document.createElement('h4');
	title.innerHTML = 'Responses';
	responses.appendChild(title);

	forEach(data, function(response_code, val) {
		let code = document.createElement('div');
		let description = document.createElement('div');
		let span = document.createElement('span');
		let example = document.createElement('div');
		let pre = document.createElement('pre');
		let _break = document.createElement('div');
		_break.classList = 'break';

		code.classList = 'code';
		code.innerHTML = response_code;

		example.classList = 'example';

		description.classList = 'description';
		span.innerHTML = val['description'];
		description.appendChild(span);

		if(typeof val['example'] !== 'undefined') {
			pre.innerHTML = JSON.stringify(val['example'], null, 4);
			example.appendChild(pre);
			description.appendChild(example);
		}

		responses.appendChild(code);
		responses.appendChild(description);
		responses.appendChild(_break);
	});

	return responses;
}

export function build_parameters_info(data, EDITABLE=false) {
	let parameters = document.createElement('div');
	parameters.classList = 'parameters';

	if (data) {
		/* Render data */
		forEach(data, function(parameter, val) {
			let name = document.createElement('div');
			let description = document.createElement('div');
			let description_span = document.createElement('span');
			let example = document.createElement('div');
			let code = document.createElement('pre');

			let title = document.createElement('h4');
			title.innerHTML = 'Parameters';
			parameters.appendChild(title);

			name.classList = 'name';
			description.classList = 'description';
			example.classList = 'example';

			name.innerHTML = parameter;
			description_span.innerHTML = val['description'];
			description.appendChild(description_span);

			if(typeof val['data'] !== 'undefined') {
				code.innerHTML = JSON.stringify(val['data'], null, 4);
				example.appendChild(code);
				description.appendChild(example);
			}

			parameters.appendChild(name);
			parameters.appendChild(description);

			let responses = build_responses(val['responses']);

			let _break = document.createElement('div');
			_break.classList = 'break';

			parameters.appendChild(_break);
			parameters.appendChild(responses);
		});
	} else {
		/* Edit new data */
		let name = document.createElement('div');
		let description = document.createElement('div');
		let description_span = document.createElement('span');
		let example = document.createElement('div');
		let code = document.createElement('pre');

		let title = document.createElement('h4');
		title.innerHTML = 'Parameters';
		parameters.appendChild(title);

		name.classList = 'name';
		description.classList = 'description';
		example.classList = 'example';

		name.innerHTML = "New parameter";
		description_span.innerHTML = "Enter new description";
		description.appendChild(description_span);

//		if(typeof val['data'] !== 'undefined') {
//			code.innerHTML = ;
//			example.appendChild(code);
//			description.appendChild(example);
//		}

		parameters.appendChild(name);
		parameters.appendChild(description);

		//let responses = build_responses(val['responses']);

		let _break = document.createElement('div');
		_break.classList = 'break';

		parameters.appendChild(_break);
		//parameters.appendChild(responses);
	}

	return parameters;
}

export function build_api_info(data, EDITABLE=false) {
	let content = document.createElement('div');
	let description = data ? data['description'] : null
	let payloads = data ? data['payloads'] : null
	content.classList = 'content';
	
	let descriptions = build_description(description, EDITABLE);
	let parameters = build_parameters_info(payloads, EDITABLE);

	content.appendChild(descriptions);
	content.appendChild(parameters);

	return content;
}

export function build_row(method, url_path, data) {
	let row = document.createElement('div');
	let DEPRECATED = false;

	if(typeof data['flags'] === "undefined") { data['flags'] = '' };
	if(data['flags'].indexOf('DEPRECATED') >= 0)
		DEPRECATED = true;

	let [type, url, short_desc] = build_header(method, url_path, data['description'], DEPRECATED);

	if (!DEPRECATED)
		row.classList = 'row ' + method;
	else
		row.classList = 'row ' + method + ' DEPRECATED';

	row.appendChild(type);
	row.appendChild(url);
	row.appendChild(short_desc);
	row.appendChild(generate_lock_icon());

	/* If we have information about the API, extend it */
	if(typeof data['payloads'] !== "undefined") {
		let endpoint_instructions = build_api_info(data)


		let _break = document.createElement('div');
		_break.classList = 'break';
		row.appendChild(_break);
		row.appendChild(endpoint_instructions);
	}

	return row;
}

export function save_new_entry() {
	let method = document.getElementById('method').value;
	let url = document.getElementById('url').value;
	let description = document.getElementById('description').value;

	let urls = url.split('/');
	let path = '';
	let manifest_path = manifest;
	for(let i=0; i<urls.length; i++) {
		if(urls[i].length <= 0)
			continue;
		path += '/'+urls[i];
		
		if(typeof manifest_path['urls'][path] === 'undefined') {
			manifest_path['urls'][path] = {'urls' : {}}
		}
		manifest_path = manifest_path['urls'][path];
	}

	manifest_path[method] = {
		'description' : description
	}

	let container = document.getElementById('table')
	container.innerHTML = '';
	console.log(JSON.stringify(manifest, null, 4));
	load_urls(manifest['urls'], container);

	add_empty_slot(container);
}

export function generate_save_button(label) {
	let button = document.createElement('button');
	button.classList = 'button';
	button.innerHTML = label;
	button.addEventListener('click', function() {
		save_new_entry();
	});
	return button;
}

export function add_empty_slot(container) {
	let row = document.createElement('div');
	let [type, url, short_desc] = build_header('METHOD', '/', '', false, true);

	row.classList = 'row METHOD';

	row.appendChild(type);
	row.appendChild(url);
	row.appendChild(short_desc);
	row.appendChild(generate_lock_icon());
	row.appendChild(generate_save_button("Save"));

	let endpoint_instructions = build_api_info(null, true);

	let _break = document.createElement('div');
	_break.classList = 'break';
	row.appendChild(_break);
	row.appendChild(endpoint_instructions);

	row.style.maxHeight = "none";

	container.appendChild(row);
}

export function expand(obj) {
	if(obj.getAttribute('expanded') == 'true') {
		obj.setAttribute('expanded', false);
		obj.style.maxHeight = '42px';
		obj.style.overflow = 'hidden';
	} else {
		obj.setAttribute('expanded', true);
		obj.style.maxHeight = obj.scrollHeight;
		obj.style.overflow = 'visible';
	}
}

export function load_urls(data, container) {
	forEach(data, function(url, val) {
		forEach(data[url], function(method, val) {
			if (method == 'urls') {
				load_urls(val, container);
			} else {
				let row = build_row(method, url, val);
				row.addEventListener('click', function() {
					expand(row)
				})
				container.appendChild(row);
			}
		});
	});
}
