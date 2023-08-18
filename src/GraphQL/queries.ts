import { gql } from '@apollo/client';

export const GetContactList = gql`
query GetContactList (
    $distinct_on: [contact_select_column!], 
    $limit: Int, 
    $offset: Int, 
    $order_by: [contact_order_by!], 
    $where: contact_bool_exp
) {
  contact(
      distinct_on: $distinct_on, 
      limit: $limit, 
      offset: $offset, 
      order_by: $order_by, 
      where: $where
  ){
    created_at
    first_name
    id
    last_name
    phones {
      number
    }
  }
}
`;
