import React from 'react';
import PropTypes from 'prop-types';
import {graphql} from 'gatsby';
import {get} from 'lodash';

import DocsLayout from './DocsLayout';
import Mdx from './Mdx';
import SEO from '../app/seo';

// eslint-disable-next-line
export const pageQuery = graphql`
    query DocQuery($id: String) {
        file(id: {eq: $id}, extension: {eq: "mdx"}) {
            id
            name
            dir
            childMdx {
                body
            }
        }
    }
`;

// eslint-disable-next-line
export default function DocLayout({data: {file}}) {
    const mdx = get(file, 'childMdx', {});

    return (
        <DocsLayout className="doc-layout">
            <SEO title={file.name} />
            <Mdx title={file.name} mdx={mdx} />
        </DocsLayout>
    );
}

DocLayout.propTypes = {
    data: PropTypes.shape({
        file: PropTypes.string,
    }),
};
