export function load_manifest(post) {
	let xhr = new XMLHttpRequest();
	xhr.open("GET", "./manifest.json", true);
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

export function build_row(method, url_path, data) {
	let row = document.createElement('div');
	let type = document.createElement('div');
	let url = document.createElement('div');
	let short_desc = document.createElement('div');
	let authorization_required = document.createElement('div');

	if(typeof data['flags'] === "undefined" || data['flags'].indexOf('DEPRECATED') < 0) {
		row.classList = 'row ' + method;
		type.classList = 'type ' + method;
		url.classList = 'url';
	} else {
		row.classList = 'row ' + method + ' DEPRECATED';
		type.classList = 'type ' + method + ' DEPRECATED';
		url.classList = 'url DEPRECATED';
	}
	short_desc.classList = 'short_desc';
	authorization_required.classList = 'protected';

	type.innerHTML = method;
	url.innerHTML = url_path;
	short_desc.innerHTML = data['description'];

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
	authorization_required.appendChild(tmp_btn);
	row.appendChild(type);
	row.appendChild(url);
	row.appendChild(short_desc);
	row.appendChild(authorization_required);

	if(typeof data['payloads'] !== "undefined") {
		/* Building the expandable content */
		let content = document.createElement('div');
		let api_description = document.createElement('div');
		let parameters_title = document.createElement('h4');
		let parameters = document.createElement('div');
		let responses_title = document.createElement('h4');
		let responses = document.createElement('div');

		content.classList = 'content';
		api_description.classList = 'description'
		parameters.classList = 'parameters';
		responses.classList = 'responses';

		parameters_title.innerHTML = 'Parameters';
		responses_title.innerHTML = 'Responses';

		forEach(data['payloads'], function(parameter, val) {
			let name = document.createElement('div');
			let desc = document.createElement('div');
			let desc_span = document.createElement('span');
			let example = document.createElement('div');
			let data = document.createElement('pre');

			name.classList = 'name';
			desc.classList = 'description';
			example.classList = 'example';

			name.innerHTML = parameter;
			desc_span.innerHTML = val['description'];
			desc.appendChild(desc_span);

			if(typeof val['data'] !== 'undefined') {
				data.innerHTML = val['data'];
				example.appendChild(data);
				desc.appendChild(example);
			}

			parameters.appendChild(name);
			parameters.appendChild(desc);

			forEach(val['responses'], function(response_code, val) {
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
		});

		content.appendChild(api_description);
		content.appendChild(parameters_title);
		content.appendChild(parameters);
		content.appendChild(responses_title);
		content.appendChild(responses);

		let _break = document.createElement('div');
		_break.classList = 'break';
		row.appendChild(_break);
		row.appendChild(content);
	}

	return row;
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
