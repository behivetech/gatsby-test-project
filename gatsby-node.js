const {createFilePath} = require(`gatsby-source-filesystem`);
const path = require("path");

exports.onCreateNode = ({node, getNode, actions}) => {
    const {createNodeField} = actions;

    if (node.displayName) {
        const slug = createFilePath({node, getNode, basePath: `pages`})
        createNodeField({
            node,
            name: `slug`,
            value: slug,
        });
    }
};

exports.createPages = async ({graphql, actions, reporter}) => {
    // Destructure the createPage function from the actions object
    const {createPage} = actions;

    await createComponentDocPages(createPage, graphql, reporter);
    await createDocPages(createPage, graphql, reporter);
};

async function createDocPages(createPage, graphql, reporter) {
    const result = await graphql(`
        query {
            allFile(filter: {extension: {eq: "mdx"}, sourceInstanceName: {eq: "documents"}}) {
                edges {
                    node {
                        id
                        name
                    }
                }
            }
        }
    `);

    if (result.errors) {
        reporter.panicOnBuild('🚨    ERROR: Loading "createPages" query');
    }

    const files = result.data.allFile.edges;

    // you'll call `createPage` for each result
    files.forEach(({node}, index) => {
        createPage({
            path: `docs/${node.name}`,
            // This component will wrap our MDX content
            component: path.resolve(`./src/components/documentation/DocLayout.js`),
            // You can use the values in this context in
            // our page layout component
            context: {
                id: node.id,
            },
        });
    });
}

async function createComponentDocPages(createPage, graphql, reporter) {
    const result = await graphql(`
        query {
            allComponentMetadata(filter: {props: {elemMatch: {name: {ne: "null"}}}}, sort: {fields: displayName}) {
                edges {
                    node {
                        displayName
                        fields {
                            slug
                        }
                        id
                    }
                }
            }
        }
    `);

    if (result.errors) {
        reporter.panicOnBuild('🚨    ERROR: Loading "createPages" query');
    }

    const components = result.data.allComponentMetadata.edges;

    // you'll call `createPage` for each result
    components.forEach(({node}, index) => {
        createPage({
            path: `docs${node.fields.slug.toLowerCase()}`,
            // This component will wrap our MDX content
            component: path.resolve(`./src/components/documentation/ComponentDocLayout.js`),
            // You can use the values in this context in
            // our page layout component
            context: {
                id: node.id,
                name: node.displayName,
                dir: node.fields.slug,
            },
        });
    });
}
