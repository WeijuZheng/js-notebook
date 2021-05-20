import { useTypedSelector } from './use-typed-selector';

export const useCumulativeCode = (cellId: string) => {
    // put all the code before this cell together
    // so it can have access to the previous written code
    return useTypedSelector((state) => {
        const { data, order } = state.cells;
        const orderedCells = order.map(id => data[id]);

        // implement a show function so that a user can show 
        // there content easily
        const showFunc = `
            import _React from 'react';
            import _ReactDOM from 'react-dom';
            var show = (value) => {
                const root = document.querySelector('#root');
                if (typeof value === 'object') {
                    if(value.$$typeof && value.props) {
                        _ReactDOM.render(value, root);
                    } else {
                        root.innerHTML = JSON.stringify(value);
                    }
                } else {
                    root.innerHTML = value;
                }
            };
        `;

        // show function that does nothing, use for previous cell's show
        // using var keyword allow us to redefine show multiple time
        const showFuncNoop = 'var show = () => {}';
        const cumulativeCode = [];

        for (let c of orderedCells) {
            if (c.type === 'code') {
                if (c.id === cellId) {
                    cumulativeCode.push(showFunc);
                } else {
                    cumulativeCode.push(showFuncNoop);
                }
                cumulativeCode.push(c.content);
            }

            // break early when it reach the current cell
            // we just want the cell before the current cell
            if (c.id === cellId) {
                break;
            }
        }
        return cumulativeCode;
    }).join('\n');
};