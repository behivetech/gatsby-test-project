import React from 'react';
import {graphql, Link, useStaticQuery} from 'gatsby';
import {map} from 'lodash';
import classnames from 'classnames';

import './Links.scss';

// eslint-disable-next-line
export default function Links({className}) {
    const {
        allComponentMetadata: {
            edges: componentLinks,
        },
        allFile: {
            edges: documentLinks,
        },
    } = useStaticQuery(graphql`
        query Links {
            allComponentMetadata(filter: {props: {elemMatch: {name: {ne: "null"}}}}, sort: {fields: fields___slug}) {
                edges {
                    node {
                        id
                        fields {
                            slug
                        }
                        displayName
                    }
                }
            }
            allFile(filter: {extension: {eq: "mdx"}, sourceInstanceName: {eq: "documents"}}, , sort: {fields: name}) {
                edges {
                    node {
                        id
                        name
                    }
                }
            }
        }
    `);

    function renderLinks() {
        let fileType;
        const result = map([...documentLinks, ...componentLinks], ({node}, index) => {
            const {
                fields,
                id,
                displayName,
                name,
            } = node;
            const currentFileType = (fields)
                ? `Components ${fields.slug.split('/').slice(1, 2)[0]}`
                : 'Docs';
            const toLink = (fields) ? `docs/${fields.slug}` : `/docs/${name}`;
            const link = <Link key={id} className="links__link" to={toLink.toLowerCase()}>{displayName || name}</Link>;
            const firstSection = (!fileType && currentFileType)
                ? <h2>{currentFileType}</h2>
                : null;
            const section = (fileType && fileType !== currentFileType)
                ? (
                    <React.Fragment>
                        <hr />
                        <h2>{currentFileType}</h2>
                    </React.Fragment>
                )
                : null;

            fileType = currentFileType;

            return <React.Fragment key={id}>{firstSection}{section}{link}</React.Fragment>;
        });

        return <React.Fragment>{result}</React.Fragment>;
    }

    return (
        <div className={classnames('links', className)}>
            {renderLinks()}
        </div>
    );
}
