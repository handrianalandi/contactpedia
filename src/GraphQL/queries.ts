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

export const GetContactDetail = gql`
query GetContactDetail($id: Int!){
  contact_by_pk(id: $id) {
  last_name
  id
  first_name
  created_at
  phones {
    number
  }
}
}
`

export const EditContactById = gql`
mutation EditContactById($id: Int!, $_set: contact_set_input) {
  update_contact_by_pk(pk_columns: {id: $id}, _set: $_set) {
    id
    first_name
    last_name
    phones {
      number
    }
  }
}
`

export const EditPhoneNumber = gql`
mutation EditPhoneNumber($pk_columns: phone_pk_columns_input!, $new_phone_number:String!) {
  update_phone_by_pk(pk_columns: $pk_columns, _set: {number: $new_phone_number}) {
    contact {
      id
      last_name
      first_name
      created_at
      phones {
        number
      }
    }
  }
}
`