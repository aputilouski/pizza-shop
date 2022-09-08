import { gql } from '@apollo/client';

export const GET_All_PRODUCTS = gql`
  query GetAllProducts {
    allProducts {
      id
      type
      name
      description
      prices {
        variant
        value
        weight
      }
      images
    }
  }
`;

export const GET_PRODUCTS = gql`
  query GetProducts($limit: Int, $offset: Int, $type: ProductType) {
    products(limit: $limit, offset: $offset, type: $type) {
      rows {
        id
        name
        updatedAt
        createdAt
      }
      count
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    DeleteProduct(id: $id) {
      id
    }
  }
`;

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: CreateProductData!) {
    CreateProduct(input: $input) {
      id
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      name
      description
      prices {
        variant
        value
        weight
      }
      images
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($input: UpdateProductData!) {
    UpdateProduct(input: $input) {
      id
    }
  }
`;

export const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderData!) {
    CreateOrder(input: $input) {
      id
    }
  }
`;

export const GET_ORDERS = gql`
  query GetOrders($first: Int, $after: String) {
    orders(first: $first, after: $after) {
      totalCount
      edges {
        node {
          number
          status
          address {
            city
            addr
            entrance
            floor
            flat
            phone
            note
          }
          items {
            name
            amount
            variant
            price
          }
          total
        }
        cursor
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;
