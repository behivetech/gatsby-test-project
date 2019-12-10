import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Layout from '../app/layout';
import Links from './Links';
import './DocsLayout.scss';

export default function DocsLayout({children, className}) {
    return (
        <Layout className={classnames('docs-layout', className)} fullWidth>
            <div className="docs-layout__content">
                <Links className="docs-layout__links" />
                <div className="docs-layout__children">{children}</div>
            </div>
        </Layout>
    );
}

DocsLayout.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};
