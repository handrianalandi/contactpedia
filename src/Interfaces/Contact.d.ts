export interface Contact {
    id: number;
    first_name: string;
    last_name: string;
    phones: { number: string }[];
    children?: React.ReactNode;
}
