module.exports = {
	plugins: [
		"gatsby-plugin-styled-components",

		{
			resolve: `gatsby-plugin-mdx`,
			options: {
				defaultLayouts: {
					posts: require.resolve("./src/components/layout.tsx"),
				},
			},
		},
	],
}
