// var compareVersions = require('compare-versions');

// var ans = compareVersions('10.1.8', '10.0.4', '>');

// console.log(Boolean(ans));

const axios = require('axios');
const cheerio = require('cheerio');

function searchPackagesOnPyPi(packageName, callback, onerror = () => {}) {
	axios
		.get(`https://pypi.org/search/?q=${packageName}`)
		.then(res => {
			const $ = cheerio.load(res.data);

			const matchedPackages = {};

			for (const package of $('a.package-snippet')) {
				const packageName =
					package.children[1].children[1].children[0].data;

				const packageDescriptionPTag = package.children[3];

				let packageDescription = '';
				
				// Check if package description is provided or not
				if (packageDescriptionPTag.children.length) {
					packageDescription = packageDescriptionPTag.children[0].data;
				}

				matchedPackages[packageName] = packageDescription;
			}

			callback(matchedPackages);
		})
		.catch(err => onerror(err));
}

searchPackagesOnPyPi(
	'name',
	function (data) {
		console.log(data);
	},
	function (err) {
		console.log(err);
	},
);
