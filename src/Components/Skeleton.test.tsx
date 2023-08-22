import {render} from '@testing-library/react';
import Skeleton from './Skeleton';
describe('Skeleton', () => {
    it('should render correctly', () => {
        const {container} = render(<Skeleton/>);
        expect(container).toMatchSnapshot();
    }
    );
});