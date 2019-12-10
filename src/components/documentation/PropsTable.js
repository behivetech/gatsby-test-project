import React from 'react';
import PropTypes from 'prop-types';
import {get, map} from 'lodash';

import './PropsTable.scss';

export default function PropsTable({propsMetadata = []}) {
    return (
        <table className="props-table">
            <thead>
                <tr>
                    <th className="props-table__th">Prop Name</th>
                    <th className="props-table__th">Type</th>
                    <th className="props-table__th">Is Required</th>
                    <th className="props-table__th">Default Value</th>
                    <th className="props-table__th">Description</th>
                </tr>
            </thead>
            <tbody>
                {
                    map(propsMetadata, ({
                        docblock,
                        name,
                        type,
                        required,
                        defaultValue,
                    }, key) => {
                        /* eslint-disable react/display-name */
                        const nameMap = {
                            arrayOf: {
                                name: 'arrayOf',
                                render: (values) => <pre>{JSON.stringify(values, undefined, 4)}</pre>,
                            },
                            enum: {
                                name: 'oneOf',
                                render: (values) => <div>enum: {map(values, 'value').join(', ')}</div>,
                            },
                            shape: {
                                name: 'shape',
                                render: (values) => <pre>{JSON.stringify(values, undefined, 4)}</pre>,
                            },
                            union: {
                                name: 'oneOfType',
                                render: (values) => (
                                    <div>
                                        types: {map(values, ({name: propName}) => propName).join(', ')}
                                    </div>
                                ),
                            },
                        };
                        /* eslint-enable */
                        let typeName = get(type, 'name');
                        let propValues = null;
                        const defaultDescriptions = {
                            className: `Additional class name to add to the component
                                for the ability to add styling from the parent`,
                            children: `Child elements or components defined within the
                                parent component`,
                            onClick: `Callback function from parent when this component is clicked.`,
                        };
                        const description = docblock || defaultDescriptions[name] || null;

                        if (nameMap[typeName]) {
                            const {name: nameMapName, render} = nameMap[typeName];

                            typeName = nameMapName;
                            propValues = render(type.value);
                        }

                        return (
                            <tr key={key}>
                                <td className="props-table__td-name">{name}</td>
                                <td className="props-table__td">{typeName}</td>
                                {
                                    (required)
                                        ? <td className="props-table__td-required">required</td>
                                        : <td className="props-table__td-optional">optional</td>
                                }
                                {
                                    (defaultValue)
                                        ? (
                                            <td className="props-table__td-default">
                                                {defaultValue.value}
                                            </td>
                                        )
                                        : (
                                            <td className="props-table__td-no-default">none</td>
                                        )
                                }
                                <td className="props-table__td">
                                    {description}
                                    {propValues && <div>{propValues}</div>}
                                </td>
                            </tr>
                        );
                    })
                }
            </tbody>
        </table>
    );
}

PropsTable.propTypes = {
    /** this is the `metadata.props` field of what metadata you get from the react-docgen-loader.    */
    propsMetadata: PropTypes.array,
};

PropsTable.defaultProps = {
    propsMetadata: [],
};
