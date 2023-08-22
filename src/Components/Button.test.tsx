import {render,screen} from '@testing-library/react';
import Button from './Button';
describe('Button', () => {
    //create jest fn
    it('should render correctly', () => {
        const {container} = render(<Button />);
        expect(container).toMatchSnapshot();
    });

    it('should render correctly with children', () => {
        const {container} = render(<Button>Test</Button>);
        expect(container).toMatchSnapshot();
    }
    );

    it('should render correctly with isLoading', () => {
        const {container} = render(<Button isLoading/>);
        expect(container).toMatchSnapshot();
    }
    );

    it('should render correctly with variant', () => {
        const {container} = render(<Button variant='success'/>);
        expect(container).toMatchSnapshot();
    }
    );

    it('should render correctly with onClick', () => {
        const mockOnClick = jest.fn();
        render(<Button onClick={mockOnClick}/>);
        //click the button
        screen.getByRole('button').click();
        expect(mockOnClick).toHaveBeenCalled();
    }
    );
});