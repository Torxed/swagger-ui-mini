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
		type.value = method;
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
	}
	
	if(!DEPRECATED) {
		url.classList = 'url';
	} else {
		url.classList = 'url DEPRECATED';
	}
	return url;
}

export function build_description_string(description, DEPRECATED=false, EDITABLE=false) {
	let desc;
	if(!EDITABLE) {
		desc = document.createElement('div');
		desc.innerHTML = description;
	} else {
		desc = document.createElement('input');
		desc.value = description;
	}

	desc.classList = 'short_desc';
	desc.innerHTML = description;
	return desc;
}

export function build_header(method, url_path, description, DEPRECATED=false, EDITABLE=false) {
	let type = build_method_square(method, DEPRECATED, EDITABLE)
	let url = build_url_string(url_path, DEPRECATED, EDITABLE);
	let desc = build_description_string(description, DEPRECATED, EDITABLE);
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

export function build_description(description) {
	let tmp = document.createElement('div');
	tmp.classList = 'description';
	tmp.innerHTML = description;
	return tmp;
}

export function build_responses(data) {
	let responses = document.createElement('div');
	responses.classList = 'responses';

	let title = document.createElement('h4');
	title.innerHTML = 'Parameters';
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

export function build_parameters_info(data) {
	let parameters = document.createElement('div');
	parameters.classList = 'parameters';

	forEach(data, function(parameter, val) {
		let name = document.createElement('div');
		let desc = document.createElement('div');
		let desc_span = document.createElement('span');
		let example = document.createElement('div');
		let code = document.createElement('pre');

		let title = document.createElement('h4');
		title.innerHTML = 'Parameters';
		parameters.appendChild(title);

		name.classList = 'name';
		desc.classList = 'description';
		example.classList = 'example';

		name.innerHTML = parameter;
		desc_span.innerHTML = val['description'];
		desc.appendChild(desc_span);

		if(typeof val['data'] !== 'undefined') {
			code.innerHTML = val['data'];
			example.appendChild(code);
			desc.appendChild(example);
		}

		parameters.appendChild(name);
		parameters.appendChild(desc);

		let responses = build_responses(val['responses']);

		let _break = document.createElement('div');
		_break.classList = 'break';

		parameters.appendChild(_break);
		parameters.appendChild(responses);
	});

	return parameters;
}

export function build_api_info(data) {
	let content = document.createElement('div');
	content.classList = 'content';
	
	let description = build_description(data['description']);
	let parameters = build_parameters_info(data['payloads'], content);

	content.appendChild(description);
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

export function add_empty_slot(container) {
	let row = document.createElement('div');
	let [type, url, short_desc] = build_header('UNKNOWN', '/', 'Description here', false, true);

	row.classList = 'row UNKNOWN';

	row.appendChild(type);
	row.appendChild(url);
	row.appendChild(short_desc);
	row.appendChild(generate_lock_icon());

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
