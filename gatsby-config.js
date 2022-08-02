module.exports = {
  siteMetadata: {
    siteUrl: `https://www.yourdomain.tld`,
    title: `Ishan Deshpande`,
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/pages/`,
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        defaultLayouts: {
          //posts: require.resolve("./src/components/posts-layout.js"),
          default: require.resolve("./src/components/layout.js")
        },
      },
    },
    `gatsby-plugin-sass`,
    /*{
      resolve: "gatsby-plugin-page-creator",
      options: {
        path: `${__dirname}/src/posts`,
      },
    },*/
  ],
}
