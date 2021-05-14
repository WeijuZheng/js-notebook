import { useTypedSelector } from '../hooks/use-typed-selector';
import CellListItem from './cell-list-item';

const CellList: React.FC = () => {
    const cells = useTypedSelector(({ cells: { order, data } }) => {
        return order.map(id => data[id]);
    });

    const renderCells = cells.map(cell => <CellListItem key={cell.id} cell={cell} />)

    return <div>{renderCells}</div>
};

export default CellList;