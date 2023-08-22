import {render} from '@testing-library/react';
import Preloader from './Preloader';
describe('Preloader', () => {
    it('should render correctly', () => {
        const {container} = render(<Preloader />);
        expect(container).toMatchSnapshot();
    }
    );
});