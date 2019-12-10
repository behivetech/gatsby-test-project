import React from 'react';
import PropTypes from 'prop-types';
import {graphql} from 'gatsby';
import {get} from 'lodash';

import DocsLayout from './DocsLayout';
import GithubIcon from '../core/GithubIcon';
import Mdx from './Mdx';
import SEO from '../app/seo';

import './ComponentDocLayout.scss';

// eslint-disable-next-line
export const pageQuery = graphql`
    query ComponentDocQuery($id: String, $name: String) {
        file(name: {eq: $name}, extension: {eq: "mdx"}) {
            id
            name
            dir
            childMdx {
                body
            }
        }
        componentMetadata(id: {eq: $id}) {
            displayName
            id
            description {
                childMdx {
                    body
                }
            }
            props {
                name
                docblock
                type {
                    name
                    value
                }
                required
                defaultValue {
                    value
                }
            }
        }
    }
`;

/* eslint-disable max-len */
// eslint-disable-next-line
export default function ComponentDocLayout({data: {file, componentMetadata}, pageContext: {dir}}) {
    const mdx = get(file, 'childMdx', {});
    const {description, displayName, props} = componentMetadata;
    const githubUrl = 'https://github.com/bruqui/my-portfolio/blob/master/src/components';

    return (
        <DocsLayout className="compoennt-doc-layout">
            <SEO title={`Site Docs: ${displayName}`} />
            <a href={`${githubUrl}${dir.substring(0, dir.length - 1)}.js`}>
                <GithubIcon className="component-doc-layout__icon" />
            </a>
            <Mdx
                descriptionMdx={description.childMdx.body}
                mdx={mdx}
                propsMetadata={props}
                title={displayName}
            />
        </DocsLayout>
    );
}

ComponentDocLayout.propTypes = {
    data: PropTypes.shape({
        file: PropTypes.object,
        componentMetadata: PropTypes.shape({
            description: PropTypes.object,
            displayName: PropTypes.string,
            props: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
        }),
    }),
    pageContext: PropTypes.shape({
        dir: PropTypes.string,
    }),
};
