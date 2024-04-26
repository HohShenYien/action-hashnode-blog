const fetch = require("node-fetch");
const helpers = require("./helpers");
const API_URL = "https://gql.hashnode.com/",
	DEFAULT_HEADERS = {
		"Content-type": "application/json",
	};

async function query_api(username = false, pageSize = 6) {
	const query = `
query {
	user(username: "${username}"){
		posts(page:1, pageSize: ${pageSize}) {
			nodes {
				title
				canonicalUrl
				slug
				url
				cuid
				brief
				coverImage {
					url
				}
				updatedAt
				publishedAt
			}
		}
	}
}
`;
	const result = await fetch(API_URL, {
		method: "POST",
		headers: DEFAULT_HEADERS,
		body: JSON.stringify({ query }),
	});
	const ApiResponse = await result.json();

	if (0 === ApiResponse.data.user.posts.nodes.length) {
		return false;
	}

	return ApiResponse.data.user.posts.nodes;
}

module.exports = async function (
	username,
	limit = 6,
	BLOG_URL = false,
	USE_CANONICAL_URL = false,
	USE_CUSTOM_BLOG_URL = false
) {
	let posts = [];
	let results = await query_api(username, limit);
	results.forEach((post) => {
		post.url = helpers.post_link(
			post,
			USE_CUSTOM_BLOG_URL,
			USE_CANONICAL_URL,
			BLOG_URL
		);
		posts.push(post);
	});
	return posts;
};
