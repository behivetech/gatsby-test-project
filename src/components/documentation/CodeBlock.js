/* eslint react/jsx-key: 0 */

import React from 'react';
import PropTypes from 'prop-types';
import Highlight, {defaultProps} from 'prism-react-renderer';
import {
    LiveProvider,
    LiveEditor,
    LiveError,
    LivePreview,
} from 'react-live';
import {mdx, useMDXComponents} from '@mdx-js/react';

import './CodeBlock.scss';

export default function CodeBlock({
    codeString,
    className: classNameProp,
    live,
    render,
    renderedChild,
    ...props
}) {
    const components = useMDXComponents();
    const language = classNameProp.replace(/language-/, '');

    if (live) {
        return (
            <div className="code-block">
                <LiveProvider
                    code={codeString}
                    scope={{...components, mdx}}
                >
                    <div className="code-block__preview">
                        <div className="code-block__preview-title">Preview:</div>
                        <div className="code-block__preview-content">
                            <LivePreview />
                        </div>
                    </div>
                    You can live edit the code below to modify the preview...
                    <div className="code-block__editor">
                        <LiveEditor />
                    </div>
                    <LiveError />
                </LiveProvider>
            </div>
        );
    }

    if (render) {
        return (
            <div style={{marginTop: '40px'}}>
                <LiveProvider code={codeString}>
                    <LivePreview />
                </LiveProvider>
            </div>
        );
    }

    return (
        <Highlight {...defaultProps} code={codeString} language={language}>
            {
                ({
                    className,
                    style,
                    tokens,
                    getLineProps,
                    getTokenProps,
                }) => (
                    <pre className={className} style={{...style, padding: '20px'}}>
                        {
                            tokens.map((line, i) => {
                                const lineKey = `line_${i}`;

                                return (
                                    <div key={lineKey} {...getLineProps({line, key: i})}>
                                        {
                                            line.map((token, key) => {
                                                const tokenKey = `token_${key}`;

                                                return <span key={tokenKey} {...getTokenProps({token, key})} />;
                                            })
                                        }
                                    </div>
                                );
                            })
                        }
                    </pre>
                )
            }
        </Highlight>
    );
}

CodeBlock.propTypes = {
    codeString: PropTypes.string,
    className: PropTypes.string,
    live: PropTypes.bool,
    render: PropTypes.func,
    renderedChild: PropTypes.func,
};
