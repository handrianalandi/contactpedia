import {render,fireEvent,screen} from '@testing-library/react';
import SearchBar from './SearchBar';
describe('Searchbar', () => {
    const mockOnChange = jest.fn();
    it('should render correctly', () => {
        const {container} = render(<SearchBar setSearchTerm={mockOnChange}/>);
        expect(container).toMatchSnapshot();
    }
    );

    it('should call onChange when input is changed', () => {
        render(<SearchBar setSearchTerm={mockOnChange}/>);
        //get the input
        const input = screen.getByTestId('search-bar');
        //fire the change event
        fireEvent.change(input, {target: {value: 'test'}});
        expect(mockOnChange).toHaveBeenCalledWith('test');
    }
    );
});