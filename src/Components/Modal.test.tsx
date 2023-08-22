import {
    render,
    screen,
    fireEvent} from '@testing-library/react';
import Modal from './Modal';

describe('Modal', () => {
    const props = {
        isOpen: true,
        heading: 'Test',
        confirmText: 'Test Confirm',
        onClose: jest.fn(),
        onConfirm: jest.fn(),
    };

    it('should render correctly opened', () => {
        render(<Modal isOpen/>);
        const modal = screen.getByTestId('modal-test');
        expect(modal).toMatchSnapshot();
    }
    );

    it('should render correctly when isLoading', () => {
        render(<Modal isOpen isLoading/>);
        const modal = screen.getByTestId('modal-test');
        expect(modal).toMatchSnapshot();
    }
    );

    it('should render correctly with props and children', () => {
        render(
        <Modal {...props}>
            <div>Test</div>
        </Modal>
        );
        const modal = screen.getByTestId('modal-test');
        expect(modal).toMatchSnapshot();
    }
    );

    it('should call onClose when close button is clicked', () => {
        render(<Modal {...props}/>);
        const closeButton = screen.getByLabelText('Close');
        fireEvent.click(closeButton);
        expect(props.onClose).toHaveBeenCalled();
    }
    );

    it('should call onConfirm when confirm button is clicked', () => {
        render(<Modal {...props}/>);
        const confirmButton = screen.getByTestId('modal-confirm-button');
        fireEvent.click(confirmButton);
        expect(props.onConfirm).toHaveBeenCalled();
    }
    );


});