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

export const ORDER_FRAGMENT = gql`
  fragment OrderFields on Order {
    id
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
    createdAt
  }
`;

export const CREATE_ORDER = gql`
  ${ORDER_FRAGMENT}
  mutation CreateOrder($input: CreateOrderData!) {
    CreateOrder(input: $input) {
      ...OrderFields
    }
  }
`;

export const GET_ORDERS = gql`
  ${ORDER_FRAGMENT}
  query GetOrders($first: Int, $after: String, $status: OrderStatus!) {
    orders(first: $first, after: $after, status: $status) {
      totalCount
      edges {
        node {
          ...OrderFields
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

export const ORDER_SUBSCRIPTION = gql`
  ${ORDER_FRAGMENT}
  subscription OnOrderCreated {
    OrderCreatedEdge {
      node {
        ...OrderFields
      }
      cursor
    }
  }
`;

export const UPDATE_ORDER_STATUS = gql`
  mutation UpdateOrderStatus($id: ID!, $status: OrderStatus!) {
    UpdateOrderStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

export const ORDER_STATUS_SUBSCRIPTION = gql`
  subscription OnOrderStatusChanged($id: [ID]!) {
    OrderStatusChanged(id: $id) {
      id
      status
    }
  }
`;

export const GET_USER_ORDERS = gql`
  ${ORDER_FRAGMENT}
  query GetUserOrders($id: [ID]!) {
    getUserOrders(id: $id) {
      ...OrderFields
    }
  }
`;

export const GET_STATS = gql`
  query GetStats($start: DateTime!) {
    stats(start: $start) {
      initiatedOrders
      receivedOrders
      inKitchenOrders
      inDeliveryOrders
      completedOrders
    }
  }
`;
