const isProd = process.env.NODE_ENV === 'production'

module.exports = {
	assetPrefix: isProd ? 'https://github.com/Jhrach700/ChessAnnotate' : '',
	images: {
		domains: ["cloudflare-ipfs.com", "etherscan.io"],
	},
	assetPrefix: "/ethereum-nextjs-boilerplate/",
	basePath: "/ethereum-nextjs-boilerplate",
};
