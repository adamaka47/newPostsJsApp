function http() {
	return {
		get(url, cb) {

			try {
				let http = new XMLHttpRequest();

				http.open('GET', url);

				http.addEventListener('load', () => {
					if (Math.floor(http.status / 100) !== 2) {
						cb('error! Status code ' + http.status, http);
						return http;
					}
					let data = JSON.parse(http.responseText)
					cb(null, data);

				})

				http.addEventListener('error', () => {
					console.log('error')
				})


				http.send()

			} catch(e) {
				cb(e)
			}
		},
		post(url, body, headers, cb) {

			try {
				let http = new XMLHttpRequest();

				http.open('POST', url);

				http.addEventListener('load', () => {
					if (Math.floor(http.status / 100) !== 2) {
						cb('error! Status code ' + http.status, http);
						return http;
					}
					let data = JSON.parse(http.responseText)
					cb(null, data);

				})

				http.addEventListener('error', () => {
					console.log('error')
				})

				if (headers) {
					Object.entries(headers).forEach(([key, value]) => {
						http.setRequestHeader(key, value)
					});

				}


				http.send(JSON.stringify(body))

			} catch(e) {
				cb(e)
			}
		}
	}
}

let form = document.querySelector('form');
let select = document.querySelector('select');
let search = document.querySelector('input');

form.addEventListener('submit', event => {
	event.preventDefault();
	loadNews();
})

let getNewsServices = (function() {
	let keyApi = '56efe3e6fbd14bb2822717b1e1d6dbd8';
	let urlApi = 'https://newsapi.org/v2';

	return {
		everything(text, cb) {
			cbHttp.get(`${urlApi}/everything?q=${text}&apiKey=${keyApi}`, cb)
		},
		hots(country = 'RU', cb) {
			cbHttp.get(`${urlApi}/top-headlines?country=${country}&category=technology&apiKey=${keyApi}`, cb)
		}
	}

}())

document.addEventListener('DOMContentLoaded', () => {
	loadNews();
})

let cbHttp  = http();

// Load news

function loadNews() {
	let intVal = search.value;
	let selectVal = select.value;
	if (!intVal) {
		getNewsServices.hots(selectVal, getResponse)
	} else {
		getNewsServices.everything(intVal, getResponse)
	}
	// getNewsServices.hots('RU', getResponse)
}


function getResponse(err, resp) {
	if (err) {
		alert(err)
		return;
	}
	if (!resp.articles.length) {
		showEmptyMessage('Sorry. We couldn\'t search that news...  ')
	}
	rendNews(resp.articles)
}

function showEmptyMessage(text) {
	alert(text)
}

function clearContent(content) {
	let child = content.lastElementChild;
	while (child) {
		content.removeChild(child);
		child = content.lastElementChild;
	}
}


function rendNews(post) {

	let newContainer = document.querySelector('.new-content');
	if (newContainer.children.length) {
		clearContent(newContainer);
	}
	let fg = '';
	post.forEach(item => {
		let post = generatePost(item);
		fg += post;
	})

	newContainer.insertAdjacentHTML('afterbegin', fg)
}

function generatePost(post) {
	// console.log(post)
	return ` 
	<div class="post">
		<div class="post_image">
			<img src="${post.urlToImage}" alt="News" />
			<h3 class="post_title">${post.title || ''}</h3>
		</div>
		<div class="post_info">
			<p>${post.description || ''}</p>
		</div>
		<div class="card-cta">
			<a target=_blank href="${post.url}">Check that</a>
		</div>
	</div>
	`
}