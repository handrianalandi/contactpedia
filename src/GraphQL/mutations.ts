import { gql } from '@apollo/client';

export const DeleteContactById = gql`
mutation MyMutation($id: Int!) {
    delete_contact_by_pk(id: $id) {
      first_name
      last_name
      id
    }
  }
  
`;
