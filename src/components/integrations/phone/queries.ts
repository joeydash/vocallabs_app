export const phoneNumberQueries = {
  GET_PHONE_NUMBERS: `
    query GetPhoneNumbers($token_id: uuid!) {
      vocallabs_token_phone_mapping(
        order_by: {created_at: desc}, 
        where: {token_id: {_eq: $token_id}}
      ) {
        phone
        id
        created_at
        updated_at
      }
    }
  `,

  ADD_PHONE_NUMBER: `
    mutation AddPhoneNumber($token_id: uuid!, $phone: String!) {
      insert_vocallabs_token_phone_mapping_one(
        object: { token_id: $token_id, phone: $phone }
      ) {
        id
        phone
        created_at
        updated_at
      }
    }
  `,

  DELETE_PHONE_NUMBER: `
    mutation DeletePhoneNumber($id: uuid!) {
      delete_vocallabs_token_phone_mapping_by_pk(id: $id) {
        id
      }
    }
  `
};
