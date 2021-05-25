import produce from 'immer';
import { ActionType } from '../action-types';
import { Action } from '../actions';
import { Cell } from '../cell';

interface CellsState {
    loading: boolean;
    error: string | null;
    order: string[];
    data: {
        [key: string]: Cell
    }
}

const initialState: CellsState = {
    loading: false,
    error: null,
    order: [],
    data: {}
};

// using immer library to update the state
const reducer = produce((state: CellsState, action: Action) => {
    switch (action.type) {
        case ActionType.FETCH_CELLS: {
            state.loading = true;
            state.error = null;
            break;
        }
        case ActionType.FETCH_CELLS_COMPLETE: {
            state.loading = false;
            state.order = action.payload.map(cell => cell.id);
            state.data = action.payload.reduce((acc, cell) => {
                acc[cell.id] = cell;
                return acc;
            }, {} as CellsState['data']);
            break;
        }
        case ActionType.FETCH_CELLS_ERROR: {
            state.loading = false;
            state.error = action.payload;
            break;
        }
        case ActionType.SAVE_CELLS_ERROR: {
            state.error = action.payload;
            break;
        }
        case ActionType.UPDATE_CELL: {
            const { id, content } = action.payload;
            state.data[id].content = content;
            break;
        }
        case ActionType.DELETE_CELL: {
            delete state.data[action.payload];
            state.order = state.order.filter(id => id !== action.payload);
            break;
        }
        case ActionType.MOVE_CELL: {
            const { direction } = action.payload;
            const index = state.order.findIndex((id) => id === action.payload.id);
            const targetIndex = direction === 'up' ? index - 1 : index + 1;

            // check if the targetIndex is out of bound
            if (targetIndex < 0 || targetIndex > state.order.length - 1) {
                break;
            }

            // swap the order
            state.order[index] = state.order[targetIndex];
            state.order[targetIndex] = action.payload.id;
            break;
        }
        case ActionType.INSERT_CELL_AFTER: {
            const cell: Cell = {
                content: '',
                type: action.payload.type,
                id: randomId()
            };

            state.data[cell.id] = cell;

            const index = state.order.findIndex((id) => id === action.payload.id);

            if (index < 0) {
                state.order.unshift(cell.id);
            } else {
                state.order.splice(index + 1, 0, cell.id);
            }
            break;
        }
    }
}, initialState);

const randomId = () => {
    return Math.random().toString(36).substr(2, 5);
};

export default reducer;