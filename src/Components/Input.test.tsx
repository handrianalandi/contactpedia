import {render,fireEvent,screen} from '@testing-library/react';
import Input from './Input';
describe('Input', () => {
    const props = {
        mockOnChange: jest.fn(),
        placeholder: 'test',
        value: 'test',
        type: 'text',
    }
    it('should render correctly without props', () => {
        const {container} = render(<Input />);
        expect(container).toMatchSnapshot();
    }
    );

    it('should render correctly with props', () => {
        const {container} = render(<Input {...props}/>);
        expect(container).toMatchSnapshot();
    }
    );

    it('should call onChange when input is changed', () => {
        const mockOnChange = jest.fn();
        render(<Input onChange={mockOnChange}/>);
        //get the input
        const input = screen.getByTestId('input-element-test');
        //fire the change event
        fireEvent.change(input, {target: {value: 'test'}});
        expect(mockOnChange).toHaveBeenCalled();
    }
    );
});