import {render} from '@testing-library/react';
import AppHeader from './AppHeader';
import { MemoryRouter } from 'react-router-dom';

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom') as any,
  useNavigate: () => mockedUsedNavigate,
}));

describe('AppHeader', () => {
    const props = {
        enableBackButton: true,
        backRoute: '/',
    };
    it('should render correctly without props', () => {
        const {container} = render(
        <MemoryRouter>
        <AppHeader />
        </MemoryRouter>
        );
        expect(container).toMatchSnapshot();
    }
    );

    it('should render correctly with props and children', () => {
        const {container} = render(
        <MemoryRouter>
        <AppHeader {...props}>
            <div>Test</div>
        </AppHeader>
        </MemoryRouter>
        );
        expect(container).toMatchSnapshot();
    }
    );


});