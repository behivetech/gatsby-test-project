import React from 'react';
import PropTypes from 'prop-types';
import {MDXRenderer} from 'gatsby-plugin-mdx';
import {MDXProvider} from '@mdx-js/react';
import {preToCodeBlock} from 'mdx-utils';
import CodeBlock from './CodeBlock';
import PropsTable from './PropsTable';

import './Mdx.scss';

export default function Mdx({
    descriptionMdx,
    propsMetadata,
    mdx,
    title,
}) {
    const shortcodes = {
    };
    /* eslint-disable react/display-name */
    const components = {
        pre: (preProps) => {
            const props = preToCodeBlock(preProps);
            return <CodeBlock {...props} />;
        },
        code: (preProps) => {
            const props = preToCodeBlock(preProps);
            return <CodeBlock {...props} />;
        },
        render: (props) => <CodeBlock {...props} />,
    };
    /* eslint-enable */

    return (
        <MDXProvider components={{...components, ...shortcodes}}>
            {title && <h2 className="mdx__headline">{title}</h2>}
            {descriptionMdx && <MDXRenderer>{descriptionMdx}</MDXRenderer>}
            {propsMetadata && <PropsTable propsMetadata={propsMetadata} />}
            {
                (mdx && mdx.body) && <MDXRenderer>{mdx.body}</MDXRenderer>
            }
        </MDXProvider>
    );
}

Mdx.propTypes = {
    descriptionMdx: PropTypes.string,
    propsMetadata: PropTypes.array,
    mdx: PropTypes.shape({
        body: PropTypes.string,
    }),
    title: PropTypes.string,
};
