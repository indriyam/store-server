// src/config/env.ts
import "dotenv/config";
import { z } from "zod";
var appEnvSchema = z.object({
  PORT: z.string(),
  // NODE_ENV: z
  //   .string()
  //   .refine((value) => ["development", "production"].includes(value)),
  MONGO_USER: z.string(),
  MONGO_PASSWORD: z.string(),
  MONGO_DEFAULT_DATABASE: z.string(),
  JWT_KEY: z.string(),
  API_URL: z.string()
}).required();
var env = appEnvSchema.safeParse(process.env);
if (!env.success) {
  const errMessage = env.error.issues.map((issue) => `${issue.path.join(".")} ${issue.message}`).join(", ");
  throw new Error(errMessage);
}
var env_default = env.data;

// src/app.ts
import express9 from "express";
import http from "http";
import session from "express-session";
import MongoStore from "connect-mongo";
import bodyparser from "body-parser";

// src/datasources/track-api.ts
import { RESTDataSource } from "@apollo/datasource-rest";
var TrackAPI = class extends RESTDataSource {
  // the Catstronauts catalog is hosted on this server
  baseURL = "https://odyssey-lift-off-rest-api.herokuapp.com/";
  getTracksForHome() {
    return this.get("tracks");
  }
  getAuthor(authorId) {
    return this.get(`author/${authorId}`);
  }
  getTrack(trackId) {
    return this.get(`track/${trackId}`);
  }
  getTrackModules(trackId) {
    return this.get(`track/${trackId}/modules`);
  }
  getModule(moduleId) {
    return this.get(`module/${moduleId}`);
  }
  incrementTrackViews(trackId) {
    return this.patch(`track/${trackId}/numberOfViews`);
  }
};

// src/datasources/item-api.ts
import { RESTDataSource as RESTDataSource2 } from "@apollo/datasource-rest";
var ItemAPI = class extends RESTDataSource2 {
  baseURL = `${env_default.API_URL}/api/`;
  token;
  constructor(options) {
    super(options);
    this.token = options.token;
  }
  willSendRequest(_path, request) {
    request.headers["usertoken"] = this.token;
  }
  async getItemsBySearch(searchStr, itemType) {
    const searchString = !searchStr ? "all" : searchStr;
    const typeString = itemType;
    return await this.get(
      `item/search/${itemType}/${searchString}/`
    );
  }
  async getItemById(id) {
    return await this.get(`item/${id}`);
  }
  async getPart(itemid) {
    return await this.get(`item/${itemid}`);
  }
  async getItemsByType(itemType) {
    return await this.get(`item/select/${itemType}`);
  }
  async getAssignments(assign) {
    return await this.get(`part/${assign}`);
  }
  async getAssignedParts(assignid, item_type) {
    return await this.get(`part/${item_type}/${assignid}`);
  }
  async getLikes() {
    const likes = await this.get("like/");
    return likes;
  }
  async changeLike(itemId) {
    try {
      return await this.patch(`like/${itemId}`);
    } catch (error) {
      console.log("graphql error: ", error?.extensions);
      return null;
    }
  }
  async createAssignments(item) {
    try {
      return await this.post(`part/assign/${item.id}`, {
        body: item
      });
    } catch (error) {
      console.log("graphql error: ", error?.extensions);
      return null;
    }
  }
  async createItem(item) {
    try {
      return await this.post("item/new", {
        body: item
      });
    } catch (error) {
      console.log("graphql error: ", error?.extensions);
      return null;
    }
  }
  async updateItem(item) {
    try {
      return await this.put(`item/${item.id}`, {
        body: item
      });
    } catch (error) {
      console.log("graphql error: ", error?.extensions);
      return null;
    }
  }
  async deleteItem(id) {
    try {
      return await this.delete(`item/${id}`);
    } catch (error) {
      console.log("graphql error: ", error?.extensions);
      return null;
    }
  }
};

// src/datasources/part-api.ts
import { RESTDataSource as RESTDataSource3 } from "@apollo/datasource-rest";
var PartAPI = class extends RESTDataSource3 {
  baseURL = `${env_default.API_URL}/api/`;
  token;
  constructor(options) {
    super(options);
    this.token = options.token;
  }
  willSendRequest(_path, request) {
    request.headers["usertoken"] = this.token;
  }
  // async getAssignedParts(assignid: string, assign: string) {
  //   return await this.get<PartModel[]>(`part/${assign}/${assignid}`);
  // }
  // async getAssignedPart(assignid: string, assign: string) {
  //   return await this.get<PartModel>(`part/${assign}/${assignid}`);
  // }
};

// src/datasources/stock-api.ts
import { RESTDataSource as RESTDataSource4 } from "@apollo/datasource-rest";
var StockAPI = class extends RESTDataSource4 {
  baseURL = `${env_default.API_URL}/api/`;
  token;
  constructor(options) {
    super(options);
    this.token = options.token;
  }
  willSendRequest(_path, request) {
    request.headers["usertoken"] = this.token;
  }
  async getStockById(stockId) {
    return await this.get(`stock/${stockId}`);
  }
  async getStockByItemId(itemid) {
    return await this.get(`stock/item/${itemid}`);
  }
  async getStockByItemType(itemtype) {
    return await this.get(`stock/type/${itemtype}`);
  }
  async createStock(stockitem) {
    try {
      return await this.post("stock/new", {
        body: stockitem
      });
    } catch (error) {
      console.log("graphql error: ", error?.extensions);
      return null;
    }
  }
  async updateStock(stockitem) {
    try {
      return await this.put(`stock/update`, {
        body: stockitem
      });
    } catch (error) {
      console.log("graphql error: ", error?.extensions);
      return null;
    }
  }
  async deleteStock(id) {
    try {
      return await this.delete(`stock/delete/${id}`);
    } catch (error) {
      console.log("graphql error: ", error?.extensions);
      return null;
    }
  }
};

// src/datasources/bill-api.ts
import { RESTDataSource as RESTDataSource5 } from "@apollo/datasource-rest";
var BillAPI = class extends RESTDataSource5 {
  baseURL = `${env_default.API_URL}/api/`;
  token;
  constructor(options) {
    super(options);
    this.token = options.token;
  }
  willSendRequest(_path, request) {
    request.headers["usertoken"] = this.token;
  }
  async getBillById(billId) {
    return await this.get(`invoice/${billId}`);
  }
  async getBillByItemId(itemid) {
    return await this.get(`invoice/item/${itemid}`);
  }
  async createBill(billitem) {
    try {
      return await this.post("invoice/new", {
        body: billitem
      });
    } catch (error) {
      console.log("graphql error: ", error?.extensions);
      return null;
    }
  }
  async updateBill(stockitem) {
    try {
      return await this.put(`invoice/update`, {
        body: stockitem
      });
    } catch (error) {
      console.log("graphql error: ", error?.extensions);
      return null;
    }
  }
  async deleteBill(id) {
    try {
      return await this.delete(`invoice/delete/${id}`);
    } catch (error) {
      console.log("graphql error: ", error?.extensions);
      return null;
    }
  }
};

// src/datasources/auth-api.ts
import { RESTDataSource as RESTDataSource6 } from "@apollo/datasource-rest";
var AuthAPI = class extends RESTDataSource6 {
  baseURL = `${env_default.API_URL}/api/`;
  token;
  constructor(options) {
    super(options);
    this.token = options.token;
  }
  willSendRequest(_path, request) {
    request.headers["usertoken"] = this.token;
  }
  async getCurrentUser() {
    return await this.get("users/currentuser");
  }
  async signin(credentials) {
    try {
      return await this.post("users/signin", {
        body: credentials
      });
    } catch (error) {
      console.log("graphql error: ", error?.extensions);
      return null;
    }
  }
  async signup(credentials) {
    try {
      return await this.post("users/signup", {
        body: credentials
      });
    } catch (error) {
      console.log("graphql error: ", error?.extensions);
      return null;
    }
  }
  async signout() {
    try {
      return await this.post(`users/signout`);
    } catch (error) {
      return null;
    }
  }
};

// src/datasources/cart-api.ts
import { RESTDataSource as RESTDataSource7 } from "@apollo/datasource-rest";
var CartAPI = class extends RESTDataSource7 {
  baseURL = `${env_default.API_URL}/api/`;
  token;
  constructor(options) {
    super(options);
    this.token = options.token;
  }
  willSendRequest(_path, request) {
    request.headers["usertoken"] = this.token;
  }
  async getCartUser() {
    return await this.get("cart/");
  }
  async replaceCart(cartitems, totalQuantity) {
    try {
      return await this.post("cart/", {
        body: { cartitems, totalQuantity }
      });
    } catch (error) {
      console.log("graphql error: ", error?.extensions);
      return null;
    }
  }
};

// src/datasources/order-api.ts
import { RESTDataSource as RESTDataSource8 } from "@apollo/datasource-rest";
var OrderAPI = class extends RESTDataSource8 {
  baseURL = `${env_default.API_URL}/api/`;
  token;
  constructor(options) {
    super(options);
    this.token = options.token;
  }
  willSendRequest(_path, request) {
    request.headers["usertoken"] = this.token;
  }
  async getUserAddresses() {
    return await this.get("order/address/");
  }
  async getAddress(id) {
    return await this.get(`order/address/${id}`);
  }
  async getUserOrders() {
    return await this.get("order/");
  }
  async getOrder(orderid) {
    return await this.get(`order/${orderid}`);
  }
  async getOrderPdf(orderid) {
    return await this.get(`order/genpdf/${orderid}`);
  }
  async createOrder(cart, value) {
    try {
      return await this.post("order/", {
        body: { cart, value }
      });
    } catch (error) {
      console.log("graphql error: ", error?.extensions);
      return null;
    }
  }
  async updateOrder(orderid, status) {
    try {
      return await this.patch(`order/${orderid}`, {
        body: { status }
      });
    } catch (error) {
      console.log("graphql error: ", error?.extensions);
      return null;
    }
  }
  async cancelOrder(orderid) {
    try {
      return await this.delete(`order/${orderid}`);
    } catch (error) {
      console.log("graphql error: ", error?.extensions);
      return null;
    }
  }
  // async completeOrder(orderid: string, shipping: AddressModel) {
  async completeOrder(orderid, shipping) {
    try {
      return await this.patch(
        `order/complete/${orderid}`,
        {
          body: { shipping }
        }
      );
    } catch (error) {
      console.log("graphql error: ", error?.extensions);
      return null;
    }
  }
  // async createAddress(input: Omit<AddressModel, "id" | "userId">) {
  async createAddress(input) {
    try {
      return await this.post("order/address", {
        body: { input }
      });
    } catch (error) {
      console.log("graphql error: ", error?.extensions);
      return null;
    }
  }
};

// src/app.ts
import cors from "cors";
import cookieParser from "cookie-parser";
import { expressMiddleware } from "@as-integrations/express4";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

// src/graphql/schema.ts
import { gql } from "graphql-tag";
var typeDefs = gql`
  scalar Date

  type Query {
    "Query to get tracks array for the homepage grid"
    tracksForHome: [Track!]!
    "Fetch a specific track, provided a track's ID"
    track(id: ID!): Track!
    "Fetch a specific module, provided a module's ID"
    module(id: ID!): Module!
    "Fetch all categories"
    categories: [Category]
    "Common query to get item like Category, Equipment, Product etc for the select input"
    itemsBySearch(search: String!, itemType: String!): [Item!]
    "Get Item by itemid"
    itemById(id: ID!): Item!
    "Get Stock by itemid"
    stockByItemId(itemid: ID!): [StockEntry]
    "Get Stock by stockid"
    stockById(stockid: ID!): StockEntry
    "Get Stock by itemType"
    stockByItemType(itemType: String!): [ItemStock!]!
    "get items by type for filling the select list in assign page"
    itemsByType(itemType: String!): [TypeEntry]
    "Assignment of Item to category. Get items by Category"
    assignments(assign: String!): [Assignments]
    "Get Part or Subcategory by assigned Category"
    assignedParts(assignid: ID!, itemtype: String!): [Part!]!
    billById(billid: ID!): BillEntry
    billByItemId(itemid: ID!): [BillEntry]
    currentUser: User
    cartUser: Cart!
    "get shipping address by userId"
    userAddresses: [Address!]!
    "get orders by user"
    userOrders: [OrderEntry!]!
    "get order by Id"
    orderByID(orderid: ID!): OrderEntry!
    "generate a pdf file for order by Id"
    generateOrderPdf(orderid: ID!): File
    likes: [LikeItem]
  }

  type Mutation {
    incrementTrackViews(id: ID!): IncrementTrackViewsResponse!
    createItem(input: ItemInput!): CreateItemResponse!
    updateItem(input: ItemInput!): CreateItemResponse!
    deleteItem(id: ID!): DeleteItemResponse!
    createAssignments(input: AssignmentInput!): CreateAssignmentResponse!
    createStock(input: StockInput!): CreateStockResponse!
    updateStock(input: StockInput!): CreateStockResponse!
    deleteStock(stockId: ID!): DeleteStockResponse!
    createBill(input: BillInput!): CreateBillResponse!
    updateBill(input: BillInput!): CreateBillResponse!
    deleteBill(billId: ID!): DeleteBillResponse!
    signin(input: SignInput!): SignInResponse!
    signup(input: SignUpInput!): SignInResponse!
    signout: SignOutResponse!
    replaceCart(input: CartInput!): ReplaceCartResponse!
    createOrder(cart: CartInput!, value: Float!): CreateOrderResponse!
    updateOrder(orderid: ID!, status: String!): UpdateOrderResponse!
    cancelOrder(orderid: ID!): UpdateOrderResponse!
    completeOrder(orderid: ID!, shipping: AddressInput!): UpdateOrderResponse!
    createAddress(input: AddressInput!): CreateAddressResponse!
    like(itemId: ID!): UpdateLikeResponse!
  }

  type File {
    id: String!
    filename: String!
    fileurl: String!
  }

  type LikeItem {
    item: Item
    userId: String!
  }

  input AddressInput {
    id: ID!
    email: String!
    receiver: String!
    phone: String!
    house: String!
    street: String!
    pincode: String!
    city: String!
  }

  type Address {
    id: ID!
    email: String!
    receiver: String!
    phone: String!
    house: String!
    street: String!
    pincode: String!
    city: String!
  }

  type CreateAddressResponse {
    code: Int!
    success: Boolean!
    message: String!
    shipid: String
  }

  type UpdateLikeResponse {
    code: Int!
    success: Boolean!
    message: String!
  }

  type UpdateOrderResponse {
    code: Int!
    success: Boolean!
    message: String!
  }

  type CreateOrderResponse {
    code: Int!
    success: Boolean!
    message: String!
    order: OrderEntry
  }

  type OrderEntry {
    id: ID!
    userId: String!
    status: String!
    items: [OrderItem!]!
    orderDate: Date!
    expiresAt: Date!
    totalQuantity: Int!
    orderValue: Float!
    shipping: Address
  }

  type OrderItem {
    orderitem: Item!
    orderId: String!
    quantity: Int!
    price: Float!
    totalPrice: Float!
  }

  input CartInput {
    cartitems: [CartItemInput!]!
    totalQuantity: Int!
  }

  type Cart {
    cartitems: [CartItem!]!
    totalQuantity: Int!
    userId: String!
  }

  input CartItemInput {
    itemid: String!
    quantity: Int!
    price: Float!
    totalPrice: Float!
    limitQty: Int!
  }

  type CartItem {
    item: Item!
    quantity: Int!
    price: Float!
    totalPrice: Float!
    limitQty: Int!
  }

  type Part {
    id: ID!
    partitem: Item!
    itemtype: String!
    assignparent: Item!
    assign: String!
  }

  input SignInput {
    email: String!
    password: String!
  }

  input SignUpInput {
    email: String!
    password: String!
    firstName: String!
    lastName: String!
    phone: String!
  }

  type ReplaceCartResponse {
    code: Int!
    success: Boolean!
    message: String!
  }

  type SignInResponse {
    code: Int!
    success: Boolean!
    message: String!
    user: User
    token: String!
  }

  type SignOutResponse {
    code: Int!
    success: Boolean!
    message: String!
  }

  type User {
    id: ID!
    email: String!
    firstName: String!
    lastName: String!
    phone: String!
  }

  input BillInput {
    itemid: String!
    itemtype: String!
    quantity: Int!
    qtytype: String!
    unit: String!
    price: Float!
    gst: Float!
    discount: Float!
    billtotal: Float!
    shipping: Float!
    userId: String!
  }

  type BillEntry {
    id: String!
    itemid: String!
    itemtype: String!
    quantity: Int!
    qtytype: String!
    unit: String!
    price: Float!
    gst: Float!
    discount: Float!
    billtotal: Float!
    shipping: Float!
    userId: String!
  }

  input StockInput {
    itemid: String!
    itemtype: String!
    quantity: Int!
    qtytype: String!
    unit: String!
    price: Float!
    gst: Float!
    discount: Float!
    userId: String!
  }

  "A generic item type that can represent different entities like Category, Equipment, Product, etc."
  type Item {
    id: ID!
    itemType: String!
    title: String!
    description: String!
    image: String!
    unit: String
    dimensions: String
    userId: String!
  }

  type ItemStock {
    id: ID!
    item: Item!
    quantity: Int!
    qtytype: String!
    price: Float!
    gst: Float!
    discount: Float!
    userId: String!
  }

  type StockEntry {
    id: String!
    itemid: String!
    itemtype: String!
    quantity: Int!
    qtytype: String!
    unit: String!
    price: Float!
    gst: Float!
    discount: Float!
    userId: String!
  }

  type CreateBillResponse {
    code: Int!
    success: Boolean!
    message: String!
    item: BillEntry
  }

  type DeleteBillResponse {
    code: Int!
    success: Boolean!
    message: String!
    item: String
  }

  type CreateStockResponse {
    code: Int!
    success: Boolean!
    message: String!
    item: StockEntry
  }

  type DeleteStockResponse {
    code: Int!
    success: Boolean!
    message: String!
    item: String!
  }

  type TestPart {
    id: ID!
    name: String!
  }

  type Assignments {
    _id: TestPart!
    assigned: [Assignment!]!
  }

  type Assignment {
    id: ID!
    itemType: String!
    title: String!
    description: String!
    image: String!
  }

  input AssignmentInput {
    id: ID!
    assignIDs: [ID!]!
    assign: String!
  }

  type TypeEntry {
    key: ID!
    label: String!
  }

  type CreateAssignmentResponse {
    code: Int!
    success: Boolean!
    message: String!
    item: String
  }

  type CreateItemResponse {
    code: Int!
    success: Boolean!
    message: String!
    item: Item
  }

  type DeleteItemResponse {
    code: Int!
    success: Boolean!
    message: String!
    item: String!
  }

  type IncrementTrackViewsResponse {
    "Similar to HTTP status code, represents the status of the mutation"
    code: Int!
    "Indicates whether the mutation was successful"
    success: Boolean!
    "Human-readable message for the UI"
    message: String!
    "Newly updated track after a successful mutation"
    track: Track
  }

  type Category {
    id: ID!
    title: String!
    description: String!
    image: String!
    userId: String!
  }

  input ItemInput {
    id: ID!
    itemType: String!
    title: String!
    description: String!
    image: String!
    unit: String!
    dimensions: String!
    userId: String!
    referid: String!
  }

  "A track is a group of Modules that teaches about a specific topic"
  type Track {
    id: ID!
    "The track's title"
    title: String!
    "The track's main Author"
    author: Author!
    "The track's illustration to display in track card or track page detail"
    thumbnail: String
    "The track's approximate length to complete, in minutes"
    length: Int
    "The number of modules this track contains"
    modulesCount: Int
    "The track's complete description, can be in markdown format"
    description: String
    "The number of times a track has been viewed"
    numberOfViews: Int
    "The track's complete array of Modules"
    modules: [Module!]!
  }

  "Author of a complete Track or a Module"
  type Author {
    id: ID!
    "Author's first and last name"
    name: String!
    "Author's profile picture"
    photo: String
  }

  "A Module is a single unit of teaching. Multiple Modules compose a Track"
  type Module {
    id: ID!
    "The module's title"
    title: String!
    "The module's length in minutes"
    length: Int
    "The module's text-based description, can be in markdown format. In case of a video, it will be the enriched transcript"
    content: String
    "The module's video url, for video-based modules"
    videoUrl: String
  }
`;

// src/graphql/resolvers/custom-resolvers.ts
import { GraphQLScalarType, Kind } from "graphql";
var dateScalar = new GraphQLScalarType({
  name: "Date",
  description: "Date custom scalar type",
  serialize(value) {
    if (value instanceof Date) {
      return value.getTime();
    }
    throw Error("GraphQL Date Scalar serializer expected a `Date` object");
  },
  parseValue(value) {
    if (typeof value === "number") {
      return new Date(value);
    }
    throw new Error("GraphQL Date Scalar parser expected a `number`");
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10));
    }
    return null;
  }
});
var customResolvers = {
  Date: {
    date: dateScalar
  }
};

// src/graphql/resolvers/auth-resolver.ts
var authResolvers = {
  Query: {
    currentUser: (_3, __, { dataSources }) => {
      return dataSources.authAPI.getCurrentUser();
    }
  },
  Mutation: {
    signin: async (_3, { input }, { dataSources }) => {
      try {
        const result = await dataSources.authAPI.signin(input);
        if (!result) {
          return {
            code: 401,
            success: false,
            message: "Invalid credentials",
            user: void 0,
            token: ""
          };
        }
        const { user, token } = result;
        return {
          code: 200,
          success: true,
          message: "Signed In successfully",
          user,
          token
        };
      } catch (err) {
        return {
          code: err.extensions.response.status,
          success: false,
          message: err.extensions.response.body,
          user: void 0,
          token: ""
        };
      }
    },
    signup: async (_3, { input }, { dataSources }) => {
      try {
        const result = await dataSources.authAPI.signup(input);
        if (!result) {
          return {
            code: 401,
            success: false,
            message: "Invalid credentials",
            user: void 0,
            token: ""
          };
        }
        const { user, token } = result;
        return {
          code: 200,
          success: true,
          message: "Signed Up successfully",
          user,
          token
        };
      } catch (err) {
        return {
          code: err.extensions.response.status,
          success: false,
          message: err.extensions.response.body,
          user: void 0,
          token: ""
        };
      }
    },
    signout: async (_3, __, { dataSources }) => {
      try {
        await dataSources.authAPI.signout();
        return {
          code: 200,
          success: true,
          message: "Signed out"
        };
      } catch (err) {
        return {
          code: err.extensions.response.status,
          success: false,
          message: err.extensions.response.body
        };
      }
    }
  }
};

// src/graphql/resolvers/bill-resolver.ts
var billResolvers = {
  Query: {
    billById: (_3, { billid }, { dataSources }) => {
      return dataSources.billAPI.getBillById(billid);
    },
    billByItemId: (_3, { itemid }, { dataSources }) => {
      return dataSources.billAPI.getBillByItemId(itemid);
    }
  },
  Mutation: {
    createBill: async (_3, { input }, { dataSources }) => {
      try {
        const newBillItem = await dataSources.billAPI.createBill(input);
        return {
          code: 200,
          success: true,
          message: "Bill created successfully",
          item: newBillItem
        };
      } catch (err) {
        return {
          code: err.extensions.response.status,
          success: false,
          message: err.extensions.response.body,
          item: null
        };
      }
    },
    updateBill: async (_3, { input }, { dataSources }) => {
      try {
        const editBillItem = await dataSources.billAPI.updateBill(input);
        return {
          code: 200,
          success: true,
          message: "Bill updated successfully",
          item: editBillItem
        };
      } catch (err) {
        return {
          code: err.extensions.response.status,
          success: false,
          message: err.extensions.response.body,
          item: null
        };
      }
    },
    deleteBill: async (_3, { billId }, { dataSources }) => {
      try {
        const message = await dataSources.billAPI.deleteBill(billId);
        return {
          code: 200,
          success: true,
          message: "Bill deleted successfully",
          item: message
        };
      } catch (err) {
        return {
          code: err.extensions.response.status,
          success: false,
          message: err.extensions.response.body,
          item: ""
        };
      }
    }
  }
};

// src/graphql/resolvers/cart-resolver.ts
var cartResolvers = {
  Query: {
    cartUser: (_3, __, { dataSources }) => {
      return dataSources.cartAPI.getCartUser();
    }
  },
  CartItem: {
    item: ({ itemid }, _3, { dataSources }) => {
      return dataSources.itemAPI.getPart(itemid);
    }
  },
  Mutation: {
    replaceCart: async (_3, { input }, { dataSources }) => {
      if (!input) {
        throw new Error("Input is required");
      }
      const { cartitems, totalQuantity } = input;
      try {
        const cartMessage = await dataSources.cartAPI.replaceCart(cartitems, totalQuantity);
        return {
          code: 200,
          success: true,
          message: "Cart replaced successfully"
        };
      } catch (err) {
        return {
          code: err.extensions.response.status,
          success: false,
          message: err.extensions.response.body
        };
      }
    }
  }
};

// src/types/zod-schemas.ts
import { z as z2 } from "zod";

// src/types/order-status.ts
var OrderStatus = /* @__PURE__ */ ((OrderStatus2) => {
  OrderStatus2["Created"] = "Created";
  OrderStatus2["Cancelled"] = "Cancelled";
  OrderStatus2["AwaitingPayment"] = "Awaiting:payment";
  OrderStatus2["Complete"] = "Complete";
  return OrderStatus2;
})(OrderStatus || {});

// src/types/zod-schemas.ts
var UpdateMessage = z2.object({
  message: z2.string()
});
var addressSchema = z2.object({
  id: z2.string().transform((val) => val ? void 0 : val),
  email: z2.string(),
  receiver: z2.string(),
  phone: z2.string(),
  house: z2.string(),
  street: z2.string(),
  city: z2.string(),
  pincode: z2.string()
});
var ItemTypes = /* @__PURE__ */ ((ItemTypes2) => {
  ItemTypes2["Product"] = "Product";
  ItemTypes2["Spare"] = "Spare";
  ItemTypes2["Equipment"] = "Equipment";
  ItemTypes2["Package"] = "Package";
  ItemTypes2["Category"] = "Category";
  return ItemTypes2;
})(ItemTypes || {});
var numberSchema = z2.coerce.number().min(0.01).max(1e3).nonnegative().multipleOf(0.01);
var stringSchema = z2.string().min(6);
var itemSchema = z2.object({
  id: z2.string(),
  itemType: z2.enum(ItemTypes),
  title: stringSchema,
  image: stringSchema,
  description: stringSchema,
  unit: z2.string().optional(),
  dimensions: stringSchema.optional(),
  quantity: numberSchema.optional(),
  price: numberSchema.optional(),
  totalPrice: numberSchema.optional(),
  gst: numberSchema.optional(),
  discount: numberSchema.optional()
});
var orderItemSchema = z2.object({
  orderitem: itemSchema,
  orderId: z2.string().optional(),
  quantity: numberSchema,
  price: numberSchema,
  totalPrice: numberSchema
});
var orderSchema = z2.object({
  id: z2.string(),
  status: z2.enum(OrderStatus),
  items: z2.array(orderItemSchema),
  orderDate: z2.coerce.date(),
  totalQuantity: numberSchema,
  orderValue: numberSchema,
  shipping: addressSchema
});

// src/graphql/resolvers/item-resolver.ts
var itemResolvers = {
  Query: {
    itemsBySearch: (_3, { search, itemType }, { dataSources }) => {
      return dataSources.itemAPI.getItemsBySearch(search, itemType);
    },
    itemById: (_3, { id }, { dataSources }) => {
      return dataSources.itemAPI.getItemById(id);
    },
    itemsByType: (_3, { itemType }, { dataSources }) => {
      return dataSources.itemAPI.getItemsByType(itemType);
    },
    assignments: (_3, { assign }, { dataSources }) => {
      return dataSources.itemAPI.getAssignments(assign);
    },
    assignedParts: (_3, { assignid, itemtype }, { dataSources }) => {
      return dataSources.itemAPI.getAssignedParts(assignid, itemtype);
    },
    likes: (_3, __, { dataSources }) => {
      return dataSources.itemAPI.getLikes();
    }
  },
  Part: {
    partitem: ({ itemid }, _3, { dataSources }) => {
      return dataSources.itemAPI.getPart(itemid);
    },
    assignparent: ({ assignid }, _3, { dataSources }) => {
      return dataSources.itemAPI.getPart(assignid);
    }
  },
  LikeItem: {
    item: ({ itemId }, _3, { dataSources }) => {
      return dataSources.itemAPI.getPart(itemId);
    }
  },
  Mutation: {
    createAssignments: async (_3, { input }, { dataSources }) => {
      try {
        const assignMessage = await dataSources.itemAPI.createAssignments(
          input
        );
        return {
          code: 200,
          success: true,
          message: "Items assignments created successfully",
          item: assignMessage
        };
      } catch (err) {
        return {
          code: err.extensions.response.status,
          success: false,
          message: err.extensions.response.body,
          item: "Assignments failed"
        };
      }
    },
    createItem: async (_3, { input }, { dataSources, token }) => {
      try {
        const newItem = await dataSources.itemAPI.createItem(input);
        return {
          code: 200,
          success: true,
          message: "Item created successfully",
          item: newItem
        };
      } catch (err) {
        return {
          code: err.extensions.response.status,
          success: false,
          message: err.extensions.response.body,
          item: null
        };
      }
    },
    updateItem: async (_3, { input }, { dataSources }) => {
      try {
        const editItem = await dataSources.itemAPI.updateItem(input);
        return {
          code: 200,
          success: true,
          message: "Item updated successfully",
          item: editItem
        };
      } catch (err) {
        return {
          code: err.extensions.response.status,
          success: false,
          message: err.extensions.response.body,
          item: null
        };
      }
    },
    deleteItem: async (_3, { id }, { dataSources }) => {
      try {
        const message = await dataSources.itemAPI.deleteItem(id);
        return {
          code: 200,
          success: true,
          message: "Item deleted successfully",
          item: message
        };
      } catch (err) {
        return {
          code: err.extensions.response.status,
          success: false,
          message: err.extensions.response.body,
          item: ""
        };
      }
    },
    like: async (_3, { itemId }, { dataSources }) => {
      try {
        const likeStatus = await dataSources.itemAPI.changeLike(itemId);
        const statusMessage = UpdateMessage.safeParse(likeStatus);
        return {
          code: 200,
          success: true,
          message: statusMessage.success ? statusMessage.data.message : "Invalid return message"
        };
      } catch (error) {
        console.error("Error updating order:", error);
        return {
          code: error.extensions?.response?.status || 500,
          success: false,
          message: error.extensions?.response?.body || "Internal Server Error"
        };
      }
    }
  }
};

// src/graphql/resolvers/order-resolver.ts
var orderResolvers = {
  Query: {
    userAddresses: (_3, __, { dataSources }) => {
      return dataSources.orderAPI.getUserAddresses();
    },
    userOrders: (_3, __, { dataSources }) => {
      return dataSources.orderAPI.getUserOrders();
    },
    orderByID: (_3, { orderid }, { dataSources }) => {
      return dataSources.orderAPI.getOrder(orderid);
    },
    generateOrderPdf: (_3, { orderid }, { dataSources }) => {
      return dataSources.orderAPI.getOrderPdf(orderid);
    }
  },
  OrderItem: {
    orderitem: ({ itemid }, _3, { dataSources }) => {
      return dataSources.itemAPI.getPart(itemid);
    }
  },
  OrderEntry: {
    shipping: async ({ shipId }, _3, { dataSources }) => {
      if (!shipId) return null;
      const ship_id = shipId.toString();
      return dataSources.orderAPI.getAddress(ship_id);
    }
  },
  Mutation: {
    createOrder: async (_3, { cart, value }, { dataSources }) => {
      try {
        const newOrder = await dataSources.orderAPI.createOrder(cart, value);
        return {
          code: 200,
          success: true,
          message: "Order created successfully",
          order: newOrder
        };
      } catch (error) {
        console.error("Error creating order:", error);
        return {
          code: error.extensions?.response?.status || 500,
          success: false,
          message: error.extensions?.response?.body || "Internal Server Error",
          order: null
        };
      }
    },
    updateOrder: async (_3, { orderid, status }, { dataSources }) => {
      try {
        const updateStatus = await dataSources.orderAPI.updateOrder(
          orderid,
          status
        );
        const statusMessage = UpdateMessage.safeParse(updateStatus);
        return {
          code: 200,
          success: true,
          message: statusMessage.success ? statusMessage.data.message : "Invalid return message"
        };
      } catch (error) {
        console.error("Error updating order:", error);
        return {
          code: error.extensions?.response?.status || 500,
          success: false,
          message: error.extensions?.response?.body || "Internal Server Error"
        };
      }
    },
    cancelOrder: async (_3, { orderid }, { dataSources }) => {
      try {
        const cancelStatus = await dataSources.orderAPI.cancelOrder(orderid);
        const statusMessage = UpdateMessage.safeParse(cancelStatus);
        return {
          code: 200,
          success: true,
          message: statusMessage.success ? statusMessage.data.message : "Invalid return message"
          // message: cancelStatus?.message as string,
        };
      } catch (error) {
        console.error("Error cancelling order:", error);
        return {
          code: error.extensions?.response?.status || 500,
          success: false,
          message: error.extensions?.response?.body || "Internal Server Error"
        };
      }
    },
    completeOrder: async (_3, { orderid, shipping }, { dataSources }) => {
      try {
        const completeStatus = await dataSources.orderAPI.completeOrder(
          orderid,
          shipping
        );
        const statusMessage = UpdateMessage.safeParse(completeStatus);
        return {
          code: 200,
          success: true,
          message: statusMessage.success ? statusMessage.data.message : "Invalid return message"
        };
      } catch (error) {
        console.error("Error cancelling order:", error);
        return {
          code: error.extensions?.response?.status || 500,
          success: false,
          message: error.extensions?.response?.body || "Internal Server Error"
        };
      }
    },
    createAddress: async (_3, { input }, { dataSources }) => {
      try {
        const address = await dataSources.orderAPI.createAddress(input);
        return {
          code: 200,
          success: true,
          message: "Address created successfully",
          order: address
        };
      } catch (error) {
        console.error("Error creating order:", error);
        return {
          code: error.extensions?.response?.status || 500,
          success: false,
          message: error.extensions?.response?.body || "Internal Server Error",
          order: null
        };
      }
    }
  }
};

// src/graphql/resolvers/stock-resolver.ts
var stockResolvers = {
  Query: {
    stockById: (_3, { stockid }, { dataSources }) => {
      return dataSources.stockAPI.getStockById(stockid);
    },
    stockByItemId: (_3, { itemid }, { dataSources }) => {
      return dataSources.stockAPI.getStockByItemId(itemid);
    },
    stockByItemType: (_3, { itemType }, { dataSources }) => {
      return dataSources.stockAPI.getStockByItemType(itemType);
    }
  },
  ItemStock: {
    item: ({ itemid }, _3, { dataSources }) => {
      return dataSources.itemAPI.getPart(itemid);
    }
  },
  Mutation: {
    createStock: async (_3, { input }, { dataSources }) => {
      try {
        const newStockItem = await dataSources.stockAPI.createStock(input);
        return {
          code: 200,
          success: true,
          message: "Item created successfully",
          item: newStockItem
        };
      } catch (err) {
        return {
          code: err.extensions.response.status,
          success: false,
          message: err.extensions.response.body,
          item: null
        };
      }
    },
    updateStock: async (_3, { input }, { dataSources }) => {
      try {
        const editStockItem = await dataSources.stockAPI.updateStock(input);
        return {
          code: 200,
          success: true,
          message: "Item updated successfully",
          item: editStockItem
        };
      } catch (err) {
        return {
          code: err.extensions.response.status,
          success: false,
          message: err.extensions.response.body,
          item: null
        };
      }
    },
    deleteStock: async (_3, { stockId }, { dataSources }) => {
      try {
        const message = await dataSources.stockAPI.deleteStock(stockId);
        return {
          code: 200,
          success: true,
          message: "Item deleted successfully",
          item: message
        };
      } catch (err) {
        return {
          code: err.extensions.response.status,
          success: false,
          message: err.extensions.response.body,
          item: ""
        };
      }
    }
  }
};

// src/graphql/resolvers/root-resolver.ts
var rootResolvers = {
  Query: {
    ...itemResolvers.Query,
    ...stockResolvers.Query,
    ...billResolvers.Query,
    ...authResolvers.Query,
    ...cartResolvers.Query,
    ...orderResolvers.Query
  },
  Mutation: {
    ...itemResolvers.Mutation,
    ...stockResolvers.Mutation,
    ...billResolvers.Mutation,
    ...authResolvers.Mutation,
    ...cartResolvers.Mutation,
    ...orderResolvers.Mutation
  },
  Part: {
    ...itemResolvers.Part
  },
  LikeItem: {
    ...itemResolvers.LikeItem
  },
  CartItem: {
    ...cartResolvers.CartItem
  },
  OrderItem: {
    ...orderResolvers.OrderItem
  },
  OrderEntry: {
    ...orderResolvers.OrderEntry
  },
  ItemStock: {
    ...stockResolvers.ItemStock
  }
};

// src/lib/jose-calls.ts
import { jwtDecode } from "jwt-decode";
import jose from "node-jose";
var { JWE, JWK, JWS } = jose;
var joseutils = () => {
  const privateKey = process.env.JWT_PRIVATEKEY;
  const publicKey = process.env.JWT_PUBLICKEY;
  async function getKeys() {
    const makeKey = async (pem) => await JWK.asKey(pem, "pem");
    const pub_key = await makeKey(publicKey);
    const prv_key = await makeKey(privateKey);
    return { pub_key, prv_key };
  }
  async function sign2(raw) {
    const { prv_key } = await getKeys();
    if (!raw) {
      throw new Error("Missing Data");
    }
    const inputBuffer = JSON.stringify(raw);
    const jwsToken = await JWS.createSign({ format: "compact" }, prv_key).update(inputBuffer).final().then(function(result) {
      return result;
    });
    return jwsToken;
  }
  async function verify2(jwsToken) {
    const { pub_key } = await getKeys();
    if (!jwsToken) {
      throw new Error("Missing JWS Token");
    }
    const verifyResult = await JWS.createVerify(pub_key).verify(jwsToken).then((result) => {
      const buffertoString = jose.util.base64url.encode(result.payload);
      return jwtDecode(buffertoString, { header: true });
    }).catch((error) => {
      console.log("returned ", error);
    });
    return verifyResult;
  }
  async function encrypt2(raw) {
    const { pub_key } = await getKeys();
    if (!raw) {
      throw new Error("Missing Data");
    }
    const inputBuffer = JSON.stringify(raw);
    return await JWE.createEncrypt(pub_key).update(inputBuffer).final();
  }
  async function decrypt2(encrypted) {
    const { prv_key } = await getKeys();
    if (!encrypted) {
      throw new Error("Missing encrypted arg");
    }
    return await JWE.createDecrypt(prv_key).decrypt(encrypted);
  }
  return { encrypt: encrypt2, decrypt: decrypt2, sign: sign2, verify: verify2 };
};
var jose_calls_default = joseutils;

// src/lib/session.ts
var { encrypt, decrypt, sign, verify } = jose_calls_default();
async function generateUserToken(raw) {
  const signedData = await sign(raw);
  return signedData.toString();
}
async function verifyUserToken(tokenString) {
  const verification = await verify(tokenString);
  return verification;
}

// src/lib/types.ts
import { z as z3 } from "zod";
import validator from "validator";
var { isEmail, isMobilePhone } = validator;
var validCredentialsSchema = z3.object({
  email: z3.string().refine(isEmail, { message: "Invalid email address" }),
  password: z3.string().min(6).max(20),
  firstName: z3.string().min(4),
  lastName: z3.string().min(4),
  phone: z3.string().refine(isMobilePhone, { message: "Invalid phone number" })
});
var loginParamsSchema = z3.object({
  email: z3.string().refine(isEmail, { message: "Invalid email address" }),
  password: z3.string().min(6).max(20)
});
var userPayloadSchema = z3.object({
  id: z3.string(),
  email: z3.string().email(),
  firstName: z3.string(),
  lastName: z3.string()
});
var cartItemSchema = z3.object({
  itemid: z3.string(),
  itemtype: z3.string(),
  itemModel: z3.string(),
  name: z3.string(),
  quantity: z3.number(),
  totalPrice: z3.number(),
  price: z3.number()
});
var userCartSchema = z3.object({
  userId: z3.string(),
  items: z3.array(cartItemSchema),
  firstName: z3.string(),
  lastName: z3.string()
});

// src/auth/models/user.ts
import mongoose from "mongoose";

// src/auth/services/password.ts
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
var scryptAsync = promisify(scrypt);
var Password = class {
  static async toHash(password) {
    const salt = randomBytes(8).toString("hex");
    const buf = await scryptAsync(password, salt, 64);
    return `${buf.toString("hex")}.${salt}`;
  }
  static async compare(storedPassword, suppliedPassword) {
    const [hashedPassword, salt] = storedPassword.split(".");
    const buf = await scryptAsync(suppliedPassword, salt, 64);
    return buf.toString("hex") === hashedPassword;
  }
};

// src/auth/models/user.ts
var userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    access: {
      type: String,
      default: "user",
      required: true
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      }
    }
  }
);
userSchema.pre("save", async function(done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});
userSchema.statics.build = (attrs) => {
  return new User(attrs);
};
var User = mongoose.model("User", userSchema);

// src/middleware/current-user.ts
import { BadRequestError } from "@manprtickets/common";
var currentUser = async (req, res, next) => {
  if (!req.session?.jwt) {
    return next();
  }
  try {
    const payload = await verifyUserToken(req.session.jwt);
    const { id, email, firstName, lastName } = userPayloadSchema.parse({
      ...payload
      // first_name: "Toji",
      // last_name: "Varghese",
    });
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("Sorry you are not a valid user in the System");
    }
    req.currentUser = {
      id: existingUser.id,
      email: existingUser.email
      // firstName: existingUser.firstName,
      // lastName: existingUser.lastName,
    };
  } catch (error) {
  }
  next();
};

// src/app.ts
import { errorHandler } from "@manprtickets/common";

// src/auth/routes/auth_routes.ts
import express from "express";
import { body } from "express-validator";

// src/auth/routes/current-user.ts
var getCurrentUser = (req, res) => {
  const user = req.currentUser && userPayloadSchema.safeParse(req.currentUser);
  if (user) {
    res.send(user.data);
  } else {
    res.send(null);
  }
};
var current_user_default = getCurrentUser;

// src/auth/routes/signin.ts
import { BadRequestError as BadRequestError2 } from "@manprtickets/common";
var postSignin = async (req, res, next) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new BadRequestError2("Sorry you entered wrong login Credentials");
  }
  const passwordsMatch = await Password.compare(
    existingUser.password,
    password
  );
  if (!passwordsMatch) {
    throw new BadRequestError2("Invalid Credentials");
  }
  const userJwt = await generateUserToken({
    id: existingUser.id,
    email: existingUser.email,
    firstName: existingUser.firstName,
    lastName: existingUser.lastName
    // first_name: "Toji",
    // last_name: "Varghese",
  });
  req.session.jwt = userJwt;
  res.status(200).send({
    user: {
      id: existingUser.id,
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
      email: existingUser.email,
      phone: existingUser.phone
    },
    token: userJwt
  });
};
var signin_default = postSignin;

// src/auth/routes/signout.ts
var postSignout = (req, res, next) => {
  req.currentUser = void 0;
  req.session.jwt = "";
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.send({});
  });
};
var signout_default = postSignout;

// src/auth/routes/signup.ts
import { BadRequestError as BadRequestError3 } from "@manprtickets/common";
var postSignup = async (req, res, next) => {
  const user_valid = validCredentialsSchema.safeParse(req.body);
  if (!user_valid.success) {
    return res.status(400).send(user_valid.error);
  }
  const { email, password, firstName, lastName, phone } = user_valid.data;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new BadRequestError3("Email in use");
  }
  const user = User.build({ email, password, firstName, lastName, phone });
  await user.save();
  const userJwt = await generateUserToken({
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName
  });
  req.session.jwt = userJwt;
  res.status(200).send({
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone
    },
    token: userJwt
  });
};
var signup_default = postSignup;

// src/auth/routes/auth_routes.ts
import { validateRequest } from "@manprtickets/common";

// src/auth/routes/index.ts
var getUserById = async (req, res, next) => {
  const selectedUser = await User.findById(req.params.id);
  res.send(selectedUser);
};

// src/auth/routes/auth_routes.ts
var router = express.Router();
router.get("/currentuser", current_user_default);
router.get("/:id", getUserById);
router.post(
  "/signin",
  // async (req: Request, res: Response, next: NextFunction) => {
  //   console.log(req.body);
  //   next();
  // },
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("You must supply a password")
  ],
  validateRequest,
  signin_default
);
router.post("/signout", signout_default);
router.post(
  "/signup",
  // [
  //   body("email").isEmail().withMessage("Email must be valid"),
  //   body("password")
  //     .trim()
  //     .isLength({ min: 6, max: 20 })
  //     .withMessage("Password must be between 6 and 20 characters"),
  // ],
  // validateRequest,
  signup_default
);

// src/item/routes/item_routes.ts
import { requireAuth } from "@manprtickets/common";
import express2 from "express";

// src/item/models/item.ts
import mongoose2 from "mongoose";
var Schema = mongoose2.Schema;
var units = ["No", "Kg", "Lts", "mm", "cm", "meter"];
var itemtypes = ["Product", "Equipment", "Spare", "Package", "Category"];
var itemSchema2 = new Schema(
  {
    itemType: { type: String, enum: itemtypes, required: true, index: true },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    image: {
      type: String
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    discriminatorKey: "itemType",
    collection: "items",
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      }
    }
  }
);
itemSchema2.statics.build = (attrs) => {
  return new Item(attrs);
};
var Item = mongoose2.model("Item", itemSchema2);
var productSchema = new Schema({
  unit: {
    type: String,
    enum: units,
    required: true
  },
  dimensions: {
    type: String,
    required: true
  }
});
var categorySchema = new Schema({});
var equimentSchema = new Schema({
  dimensions: {
    type: String,
    required: true
  }
});
var packageSchema = new Schema({
  dimensions: {
    type: String,
    required: true
  }
});
var spareSchema = new Schema({
  dimensions: {
    type: String,
    required: true
  }
});
itemSchema2.index({ title: "text", description: "text", dimensions: "text" });
var Category = Item.discriminator("Category", categorySchema);
var Product = Item.discriminator("Product", productSchema);
var Equipment = Item.discriminator("Equipment", equimentSchema);
var Package = Item.discriminator("Package", packageSchema);
var Spare = Item.discriminator("Spare", spareSchema);

// src/item/routes/new.ts
var createNewItem = async (req, res, next) => {
  const { title, unit, dimensions, description, image, itemType } = req.body;
  let newObject = null;
  try {
    switch (itemType) {
      case "Product":
        newObject = new Product({ itemType, title, description, image, unit, dimensions, userId: req.currentUser.id });
        break;
      case "Equipment":
        newObject = new Equipment({ itemType, title, description, image, dimensions, userId: req.currentUser.id });
        break;
      case "Category":
        newObject = new Category({ itemType, title, description, image, userId: req.currentUser.id });
        break;
      case "Package":
        newObject = new Package({ itemType, title, description, image, dimensions, userId: req.currentUser.id });
        break;
      case "Spare":
        newObject = new Spare({ itemType, title, description, image, dimensions, userId: req.currentUser.id });
        break;
    }
    await newObject?.save();
    res.status(201).send(newObject);
  } catch (error) {
    console.log("errors in creation of item: ", error);
  }
};
var new_default = createNewItem;

// src/item/routes/index.ts
var getItemBySearch = async (req, res, next) => {
  let products;
  const searchString = req.params.keystr;
  const itemType = req.params.itemtype;
  let aggregate = Item.aggregate([
    { $match: { itemType } },
    { $addFields: { id: "$_id" } }
  ]);
  if (searchString !== "all") {
    aggregate = Item.aggregate([
      { $match: { itemType, $text: { $search: searchString } } },
      { $addFields: { id: "$_id" } }
    ]);
  }
  const results = await aggregate.exec();
  res.status(200).send(results);
};
var getItemById = async (req, res, next) => {
  const itemId = req.params.idstr;
  const itemObject = await Item.findById(itemId);
  res.status(200).send(itemObject);
};
var selectItemsByType = async (req, res, next) => {
  const itemType = req.params.typeStr;
  const items = await Item.find(
    { itemType },
    { key: "$_id", label: "$title", _id: 0 }
  );
  res.send(items);
};

// src/item/routes/update.ts
import { NotAuthorizedError, NotFoundError } from "@manprtickets/common";
import validator2 from "validator";
var { isEmpty } = validator2;
var updateItem = async (req, res, next) => {
  const _id = req.params.id;
  const { title, unit, dimensions, description, image, itemType } = req.body;
  const exitingItem = await Item.findOne({ _id });
  if (!exitingItem) {
    throw new NotFoundError();
  }
  if (exitingItem.userId.valueOf() !== req.currentUser.id) {
    throw new NotAuthorizedError();
  }
  exitingItem.set({
    title,
    description,
    // dimensions: dimensions,
    // unit: unit,
    image: isEmpty(image) ? exitingItem.image : image
  });
  try {
    switch (itemType) {
      case "Product":
        exitingItem.set({
          // title: title,
          // description: description,
          dimensions,
          unit
          // image: isEmpty(image) ? exitingItem.image : image,
        });
        break;
      case "Equipment":
        exitingItem.set({
          // title: title,
          // description: description,
          dimensions
          // unit: unit,
          // image: isEmpty(image) ? exitingItem.image : image,
        });
        break;
      case "Category":
        break;
      case "Package":
        exitingItem.set({
          // title: title,
          // description: description,
          dimensions
          // image: isEmpty(image) ? exitingItem.image : image,
        });
        break;
      case "Spare":
        exitingItem.set({
          // title: title,
          // description: description,
          dimensions
          // image: isEmpty(image) ? exitingItem.image : image,
        });
        break;
    }
    await exitingItem.save();
    res.status(201).send(exitingItem);
  } catch (error) {
    console.log("errors in updation of item: ", error);
  }
};
var update_default = updateItem;

// src/item/routes/delete.ts
import { NotAuthorizedError as NotAuthorizedError2, NotFoundError as NotFoundError2 } from "@manprtickets/common";
var deleteItemById = async (req, res, next) => {
  const itemid = req.params.id;
  const deleteItem = await Item.findById(itemid);
  if (!deleteItem) {
    throw new NotFoundError2();
  }
  if (deleteItem.userId.valueOf() !== req.currentUser.id) {
    throw new NotAuthorizedError2();
  }
  const { deletedCount } = await Item.deleteOne({ _id: itemid });
  res.status(201).send(`${deletedCount} Item deleted successfully`);
};

// src/item/routes/item_routes.ts
var router2 = express2.Router();
router2.get("/search/:itemtype/:keystr", getItemBySearch);
router2.get("/:idstr", getItemById);
router2.get("/select/:typeStr", selectItemsByType);
router2.post("/new", requireAuth, new_default);
router2.put("/:id", requireAuth, update_default);
router2.delete("/:id", requireAuth, deleteItemById);

// src/part/routes/part_routes.ts
import express3 from "express";
import { requireAuth as requireAuth2 } from "@manprtickets/common";

// src/part/routes/assign.ts
import {
  NotAuthorizedError as NotAuthorizedError3,
  NotFoundError as NotFoundError3,
  RequestValidationError
} from "@manprtickets/common";

// src/part/models/part.ts
import mongoose3 from "mongoose";
var Schema2 = mongoose3.Schema;
var itemtypes2 = ["Product", "Equipment", "Spare", "Package", "Category"];
var partSchema = new mongoose3.Schema(
  {
    itemid: {
      type: Schema2.Types.ObjectId,
      ref: "Item",
      required: true
    },
    itemtype: {
      type: String,
      enum: itemtypes2,
      // ref: "Product",
      required: true
    },
    assignid: {
      type: Schema2.Types.ObjectId,
      ref: "Item",
      required: true
    },
    assign: {
      type: String,
      required: true
    },
    userId: {
      type: Schema2.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      }
    }
  }
);
partSchema.index({ itemid: 1, assignid: 1 }, { unique: true });
partSchema.statics.build = (attrs) => {
  return new Part(attrs);
};
var Part = mongoose3.model("Part", partSchema);

// src/part/routes/assign.ts
import mongoose4 from "mongoose";
import { MongoBulkWriteError } from "mongodb";
var assignItemsToCategory = async (req, res, next) => {
  const selectedItem = await Item.findById(req.params.idStr);
  if (!selectedItem) {
    throw new NotFoundError3();
  }
  if (selectedItem.userId.valueOf() !== req.currentUser.id) {
    throw new NotAuthorizedError3();
  }
  const { assignIDs, assign } = req.body;
  try {
    const partsDocs = assignIDs.map((id) => {
      return {
        itemid: selectedItem.id,
        itemtype: selectedItem.itemType,
        assignid: id,
        assign,
        userId: req.currentUser.id
      };
    });
    await Part.insertMany(partsDocs);
  } catch (error) {
    if (error instanceof MongoBulkWriteError && error.code === 11e3) {
      throw RequestValidationError;
    }
  }
  res.status(201).send(`selected ${selectedItem.itemType} assigned to ${assign}`);
};
var getAssignments = async (req, res, next) => {
  const assign = req.params.assign;
  try {
    const assignments = await Part.aggregate([
      {
        $match: { assignid: new mongoose4.Types.ObjectId(assign) }
      },
      {
        $lookup: {
          from: "items",
          localField: "assignid",
          foreignField: "_id",
          as: "category"
        }
      },
      {
        $lookup: {
          from: "items",
          localField: "itemid",
          foreignField: "_id",
          as: "parts"
        }
      },
      {
        $unwind: "$category"
      },
      {
        $unwind: "$parts"
      },
      {
        $group: {
          _id: { id: "$category._id", name: "$category.title" },
          assigned: {
            $push: {
              id: "$parts._id",
              itemType: "$parts.itemType",
              title: "$parts.title",
              description: "$parts.description",
              image: "$parts.image"
            }
          }
        }
      }
    ]).exec();
    res.status(201).send(assignments);
  } catch (error) {
    console.log("error in assignments: ", error);
  }
};

// src/part/routes/index.ts
import mongoose5 from "mongoose";
var getAssignedParts = async (req, res, next) => {
  try {
    const assign_id = req.params.assignid;
    const item_type = req.params.itemtype;
    const parts = await Part.aggregate([
      {
        $match: {
          //   $expr: { $eq: ["$assignid", { $toObjectId: assign_id }] },
          $and: [
            { itemtype: item_type },
            { assignid: new mongoose5.Types.ObjectId(assign_id) }
          ]
        }
      },
      {
        $project: {
          itemid: { $toString: "$itemid" },
          itemtype: 1,
          assignid: { $toString: "$assignid" },
          assign: 1,
          id: { $toString: "$_id" }
        }
      }
    ]);
    res.status(201).send(parts);
  } catch (error) {
    console.log(error);
  }
};

// src/part/routes/part_routes.ts
var router3 = express3.Router();
router3.get("/:assign", getAssignments);
router3.post("/assign/:idStr", requireAuth2, assignItemsToCategory);
router3.get("/:itemtype/:assignid", getAssignedParts);

// src/likes/routes/likes_routes.ts
import express4 from "express";
import { requireAuth as requireAuth3 } from "@manprtickets/common";

// src/likes/models/like.ts
import mongoose6 from "mongoose";
var Schema3 = mongoose6.Schema;
var likeSchema = new mongoose6.Schema(
  {
    itemId: {
      type: Schema3.Types.ObjectId,
      required: true,
      ref: "Item"
    },
    // itemType: {
    //   type: String,
    //   enum: itemtypes,
    //   required: true,
    // },
    userId: {
      type: Schema3.Types.ObjectId,
      ref: "User",
      required: true
    }
    // itemModel: {
    //   type: String,
    //   required: true,
    //   enum: itemtypes,
    // },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      }
    }
  }
);
likeSchema.statics.build = (attrs) => {
  return new Like(attrs);
};
var Like = mongoose6.model("Like", likeSchema);

// src/likes/routes/index.ts
var getLikes = async (req, res, next) => {
  try {
    const likes = await Like.find({ userId: req.currentUser?.id }, "itemId userId");
    res.status(201).send(likes);
  } catch (error) {
  }
};
var routes_default = getLikes;

// src/likes/routes/update.ts
var changeLike = async (req, res, next) => {
  const filter = {
    itemId: req.params.itemid,
    userId: req.currentUser?.id
  };
  const { deletedCount } = await Like.deleteMany(filter);
  try {
    if (deletedCount <= 0) {
      await Like.findOneAndUpdate(filter, {}, { new: true, upsert: true });
    }
  } catch (error) {
    console.log("error in node js: ", error);
  }
  res.status(201).send("Successfully updated");
};
var update_default2 = changeLike;

// src/likes/routes/likes_routes.ts
var router4 = express4.Router();
router4.get("/", requireAuth3, routes_default);
router4.patch("/:itemid", requireAuth3, update_default2);

// src/stock/routes/stock_routes.ts
import { requireAuth as requireAuth4 } from "@manprtickets/common";
import express5 from "express";

// src/stock/routes/new.ts
import * as _ from "lodash";

// src/stock/models/stock.ts
import mongoose7 from "mongoose";
var Schema4 = mongoose7.Schema;
var itemtypes3 = ["Product", "Equipment", "Spare", "Package"];
var units2 = ["No", "Kg", "Lts", "cm", "mm", "mtr"];
var stockSchema = new mongoose7.Schema(
  {
    itemid: {
      type: Schema4.Types.ObjectId,
      ref: "item",
      required: true
    },
    itemtype: {
      type: String,
      enum: itemtypes3,
      required: true
    },
    unit: {
      type: String,
      enum: units2,
      required: true
    },
    qtytype: {
      type: String,
      default: "Stock",
      required: true
    },
    quantity: {
      type: Number,
      default: 0,
      required: true
    },
    price: {
      type: Number,
      default: 0,
      required: true
    },
    gst: {
      type: Number,
      default: 0,
      required: true
    },
    discount: {
      type: Number,
      default: 0,
      required: true
    },
    userId: {
      type: Schema4.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      }
    }
  }
);
stockSchema.statics.build = (attrs) => {
  return new Stock(attrs);
};
var Stock = mongoose7.model(
  "Stock",
  stockSchema
);

// src/stock/routes/new.ts
var postNewStockEntry = async (req, res, next) => {
  const { itemid, itemtype, quantity, qtytype, unit, price, gst, discount } = req.body;
  const modelName = _.upperFirst(itemtype);
  try {
    const stockitem = Stock.build({
      itemid,
      itemtype: modelName,
      quantity,
      qtytype,
      unit,
      price,
      gst,
      discount,
      userId: req.currentUser.id
      // itemModel: modelName,
    });
    await stockitem.save();
    res.status(201).send(stockitem);
  } catch (error) {
    console.log("error: ", error);
  }
};
var new_default2 = postNewStockEntry;

// src/stock/routes/index.ts
import mongoose8 from "mongoose";
var getStockByType = async (req, res, next) => {
  const stocks = await Stock.find({ itemtype: "Product" });
};
var getStockByItemId = async (req, res, next) => {
  console.log("from stock by item: ", req.params.itemid);
  let stockItemArr = await Stock.find({
    itemid: new mongoose8.Types.ObjectId(req.params.itemid)
  });
  res.send(stockItemArr);
};
var getStockByItemType = async (req, res, next) => {
  let stockItemArr = await Stock.aggregate([
    {
      $match: { itemtype: req.params.itemtype }
    },
    {
      $addFields: {
        itemid: { $toString: "$itemid" },
        id: { $toString: "$_id" },
        userId: { $toString: "$userId" }
      }
    },
    {
      $project: {
        _id: 0,
        id: 1,
        itemid: 1,
        quantity: 1,
        qtytype: 1,
        price: 1,
        gst: 1,
        discount: 1,
        userId: 1
      }
    }
  ]);
  res.send(stockItemArr);
};
var getStockById = async (req, res, next) => {
  const stockItem = await Stock.findOne({
    _id: new mongoose8.Types.ObjectId(req.params.id)
  });
  res.send(stockItem);
};

// src/stock/routes/update.ts
import { NotFoundError as NotFoundError4 } from "@manprtickets/common";
var updateStockEntry = async (req, res, next) => {
  const { itemid, quantity, unit, price, gst, discount } = req.body;
  const stockItem = await Stock.findById(itemid);
  if (!stockItem) {
    throw new NotFoundError4();
  }
  stockItem.set({
    quantity,
    unit,
    // qtytype: "Stock",
    price,
    gst,
    discount
  });
  await stockItem.save();
  res.status(201).send(stockItem);
};
var update_default3 = updateStockEntry;

// src/stock/routes/delete.ts
import { NotAuthorizedError as NotAuthorizedError4, NotFoundError as NotFoundError5 } from "@manprtickets/common";
var deleteStockEntry = async (req, res, next) => {
  const stockItem = await Stock.findById(req.params.id);
  if (!stockItem) {
    throw new NotFoundError5();
  }
  if (stockItem.userId.valueOf() !== req.currentUser.id) {
    throw new NotAuthorizedError4();
  }
  const { deletedCount } = await Stock.deleteOne({ _id: req.params.id });
  res.status(201).send(`${deletedCount} StockItem deleted successfully`);
};
var delete_default = deleteStockEntry;

// src/stock/routes/stock_routes.ts
var router5 = express5.Router();
router5.get("/:id", getStockById);
router5.post("/new", requireAuth4, new_default2);
router5.put("/update", requireAuth4, update_default3);
router5.delete("/delete/:id", requireAuth4, delete_default);
router5.get("/item/:itemid", getStockByItemId);
router5.get("/type/:itemtype", getStockByItemType);
router5.get("/:itemtype", getStockByType);

// src/invoice/routes/bill_routes.ts
import {
  requireAuth as requireAuth5
} from "@manprtickets/common";
import express6 from "express";

// src/invoice/models/bill-item.ts
import mongoose9 from "mongoose";
var Schema5 = mongoose9.Schema;
var itemtypes4 = ["Product", "Equipment", "Spare", "Package"];
var qtyactions = ["Purchase", "Sale", "Return", "Obsolete", "Defective"];
var units3 = ["No", "Kg", "Lts", "cm", "mm", "mtr"];
var billItemSchema = new mongoose9.Schema(
  {
    itemid: {
      type: Schema5.Types.ObjectId,
      required: true,
      ref: "items"
    },
    itemtype: {
      type: String,
      enum: itemtypes4,
      required: true
    },
    unit: {
      type: String,
      enum: units3,
      required: true
    },
    qtytype: {
      type: String,
      enum: qtyactions,
      default: "Invoice",
      required: true
    },
    quantity: {
      type: Number,
      default: 0,
      required: true
    },
    price: {
      type: Number,
      default: 0,
      required: true
    },
    gst: {
      type: Number,
      default: 0,
      required: true
    },
    discount: {
      type: Number,
      default: 0,
      required: true
    },
    billtotal: {
      type: Number,
      default: 0,
      required: true
    },
    shipping: {
      type: Number,
      default: 0,
      required: true
    },
    userId: {
      type: Schema5.Types.ObjectId,
      ref: "User",
      required: true
    }
    // itemModel: {
    //   type: String,
    //   required: true,
    //   enum: itemtypes,
    // },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      }
    }
  }
);
billItemSchema.statics.build = (attrs) => {
  return new BillItem(attrs);
};
var BillItem = mongoose9.model(
  "BillItem",
  billItemSchema
);

// src/invoice/routes/new.ts
import mongoose10 from "mongoose";
var postNewBill = async (req, res, next) => {
  const {
    itemid,
    itemtype,
    quantity,
    unit,
    qtytype,
    price,
    gst,
    discount,
    billtotal,
    shipping
  } = req.body;
  const session2 = await mongoose10.startSession();
  session2.startTransaction();
  try {
    const billitem = BillItem.build({
      itemid,
      itemtype,
      quantity,
      qtytype,
      unit,
      price,
      gst,
      discount,
      billtotal,
      shipping,
      userId: req.currentUser.id
    });
    const stockitem = Stock.build({
      itemid,
      itemtype,
      quantity,
      qtytype: "Stock",
      unit,
      price,
      gst,
      discount,
      userId: req.currentUser.id
    });
    await billitem.save();
    await stockitem.save();
    await session2.commitTransaction();
    res.status(201).send(billitem);
  } catch (error) {
    console.log("error: ", error);
    await session2.abortTransaction();
  }
};
var new_default3 = postNewBill;

// src/invoice/routes/index.ts
import mongoose11 from "mongoose";
var getBillsByItemId = async (req, res, next) => {
  let billItemArr = await BillItem.find({
    itemid: req.params.itemid
  });
  res.send(billItemArr);
};
var getInvoiceById = async (req, res, next) => {
  const billItem = await BillItem.findOne({
    _id: new mongoose11.Types.ObjectId(req.params.id)
  });
  res.send(billItem);
};

// src/invoice/routes/update.ts
import { NotFoundError as NotFoundError6 } from "@manprtickets/common";
var updateBill = async (req, res, next) => {
  const {
    itemid,
    quantity,
    unit,
    qtytype,
    price,
    gst,
    discount,
    billtotal,
    shipping
  } = req.body;
  const billItem = await BillItem.findById(itemid);
  if (!billItem) {
    throw new NotFoundError6();
  }
  billItem.set({
    quantity,
    unit,
    qtytype,
    price,
    gst,
    discount,
    billtotal,
    shipping
  });
  await billItem.save();
  res.status(201).send(billItem);
};
var update_default4 = updateBill;

// src/invoice/routes/delete.ts
import { NotAuthorizedError as NotAuthorizedError5, NotFoundError as NotFoundError7 } from "@manprtickets/common";
var deleteBill = async (req, res, next) => {
  const billItem = await BillItem.findById(req.params.id);
  if (!billItem) {
    throw new NotFoundError7();
  }
  if (billItem.userId.valueOf() !== req.currentUser.id) {
    throw new NotAuthorizedError5();
  }
  const deleteCount = await billItem.deleteOne({ _id: req.params.id });
  res.send(`${deleteCount.deletedCount} billItem deleted successfully`);
};
var delete_default2 = deleteBill;

// src/invoice/routes/bill_routes.ts
var router6 = express6.Router();
router6.get("/:id", getInvoiceById);
router6.get("/item/:itemid", requireAuth5, getBillsByItemId);
router6.post(
  "/new",
  requireAuth5,
  new_default3
);
router6.put(
  "/update",
  requireAuth5,
  update_default4
);
router6.delete("/delete/:id", requireAuth5, delete_default2);

// src/cart/routes/cart_routes.ts
import { requireAuth as requireAuth6 } from "@manprtickets/common";
import express7 from "express";

// src/cart/models/cart.ts
import mongoose12 from "mongoose";
var Schema6 = mongoose12.Schema;
var cartItemSchema2 = new mongoose12.Schema(
  {
    itemid: {
      type: Schema6.Types.ObjectId,
      required: true,
      ref: "Item"
    },
    // itemtype: {
    //   type: String,
    //   enum: itemtypes,
    //   required: true,
    // },
    // name: {
    //   type: String,
    //   required: true,
    // },
    quantity: {
      type: Number,
      default: 0,
      required: true
    },
    limitQty: {
      type: Number,
      default: 0,
      required: true
    },
    price: {
      type: Number,
      default: 0,
      required: true
    },
    totalPrice: {
      type: Number,
      default: 0,
      required: true
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      }
    }
  }
);
var cartSchema = new mongoose12.Schema(
  {
    userId: {
      type: Schema6.Types.ObjectId,
      ref: "User",
      required: true
    },
    cartitems: {
      type: [cartItemSchema2],
      // default: [],
      required: true
    },
    totalQuantity: {
      type: Number,
      default: 0,
      required: true
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      }
    }
  }
);
cartSchema.statics.build = (attrs) => {
  return new Cart(attrs);
};
var Cart = mongoose12.model("Cart", cartSchema);

// src/cart/routes/index.ts
var getCartUser = async (req, res, next) => {
  const cart = await Cart.findOne({ userId: req.currentUser?.id });
  if (!cart) {
    try {
      const newCart = Cart.build({
        userId: req.currentUser?.id,
        cartitems: [],
        totalQuantity: 0
      });
      await newCart.save();
      return res.send(newCart);
    } catch (error) {
      console.log("created errors: ", error);
    }
  }
  res.send(cart);
};
var replaceCartUser = async (req, res, next) => {
  const { cartitems, totalQuantity } = req.body;
  const userId = req.currentUser?.id;
  const filter = {
    userId
  };
  const { deletedCount } = await Cart.deleteMany(filter);
  try {
    await Cart.findOneAndUpdate(
      filter,
      { cartitems, totalQuantity },
      { new: true, upsert: true }
    );
  } catch (error) {
    console.log("error in node js: ", error);
  }
  res.status(201).send("Successfully replaced cart");
};

// src/cart/routes/cart_routes.ts
var router7 = express7.Router();
router7.get("/", requireAuth6, getCartUser);
router7.post("/", requireAuth6, replaceCartUser);

// src/order/routes/order-routes.ts
import { requireAuth as requireAuth7 } from "@manprtickets/common";
import express8 from "express";

// src/order/models/order.ts
import mongoose13 from "mongoose";
var Schema7 = mongoose13.Schema;
var orderItemSchema2 = new mongoose13.Schema(
  {
    // itemid: {
    //   type: Schema.Types.ObjectId,
    //   required: true,
    //   refPath: "items.itemModel",
    // },
    itemid: {
      type: Schema7.Types.ObjectId,
      required: true,
      ref: "Item"
    },
    orderId: {
      type: Schema7.Types.ObjectId,
      ref: "Order",
      required: true
    },
    // itemtype: {
    //   type: String,
    //   enum: Object.values(ItemTypes),
    //   default: ItemTypes.Product,
    //   required: true,
    // },
    quantity: {
      type: Number,
      default: 0,
      required: true
    },
    price: {
      type: Number,
      default: 0,
      required: true
    },
    totalPrice: {
      type: Number,
      default: 0,
      required: true
    }
    // title: {
    //   type: String,
    // },
    // description: {
    //   type: String,
    // },
    // image: {
    //   type: String,
    // },
    // itemModel: {
    //   type: String,
    //   required: true,
    //   //   enum: itemtypes,
    //   enum: Object.values(ItemTypes),
    //   default: ItemTypes.Product,
    // },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      }
    }
  }
);
var orderSchema2 = new mongoose13.Schema(
  {
    userId: {
      type: Schema7.Types.ObjectId,
      ref: "User",
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: "Created" /* Created */
    },
    items: {
      type: [orderItemSchema2]
    },
    orderDate: {
      type: mongoose13.Schema.Types.Date,
      required: true
    },
    expiresAt: {
      type: mongoose13.Schema.Types.Date
    },
    totalQuantity: {
      type: Number,
      default: 0,
      required: true
    },
    orderValue: {
      type: Number,
      default: 0,
      required: true
    },
    // paymentMode: {
    //   type: String,
    //   required: true,
    // },
    shipId: {
      type: Schema7.Types.ObjectId,
      ref: "Address"
      // required: true,
    }
    // paymentId: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Payment",
    //   required: true,
    // },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      }
    }
  }
);
orderSchema2.statics.build = (attrs) => {
  return new Order(attrs);
};
var Order = mongoose13.model("Order", orderSchema2);

// src/order/routes/delete.ts
import { NotAuthorizedError as NotAuthorizedError6, NotFoundError as NotFoundError8 } from "@manprtickets/common";
var cancelOrder = async (req, res, next) => {
  const order = await Order.findById(req.params.orderid);
  if (!order) {
    throw new NotFoundError8();
  }
  if (order.userId.valueOf() !== req.currentUser.id) {
    throw new NotAuthorizedError6();
  }
  const deleteCount = await Order.deleteOne({ _id: req.params.orderid });
  res.send({
    message: `${deleteCount.deletedCount} order deleted successfully`
  });
};
var delete_default3 = cancelOrder;

// src/order/models/address.ts
import mongoose14 from "mongoose";
var Schema8 = mongoose14.Schema;
var addressSchema2 = new mongoose14.Schema(
  {
    userId: {
      type: Schema8.Types.ObjectId,
      ref: "User",
      required: true
    },
    email: {
      type: String,
      required: true
    },
    receiver: {
      type: String,
      required: true
    },
    house: {
      type: String,
      required: true
    },
    street: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      }
    }
  }
);
addressSchema2.statics.build = (attrs) => {
  return new Address(attrs);
};
var Address = mongoose14.model(
  "Address",
  addressSchema2
);

// src/order/routes/index.ts
import _2 from "lodash";
var getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      userId: req.currentUser?.id,
      status: "Complete"
    });
    res.status(201).send(orders);
  } catch (error) {
    console.log(error);
  }
};
var getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById({
      _id: req.params.orderid
    });
    res.status(201).send(order);
  } catch (error) {
    console.log(error);
  }
};
var getAddresses = async (req, res, next) => {
  const addresses = await Address.find({ userId: req.currentUser?.id });
  res.status(201).send(addresses);
};
var getAddressById = async (req, res, next) => {
  const address = await Address.findById(req.params.id);
  res.send(address);
};

// src/order/routes/new.ts
var createOrder = async (req, res, next) => {
  const EXPIRATION_WINDOW_SECONDS = 15 * 60;
  const {
    cart: { cartitems, totalQuantity },
    value
  } = req.body;
  const expiration = /* @__PURE__ */ new Date();
  expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);
  const neworder = new Order({
    userId: req.currentUser.id,
    status: "Created" /* Created */,
    orderDate: /* @__PURE__ */ new Date(),
    orderValue: value,
    // cacheCart: req.body.items,
    expiresAt: expiration,
    items: [],
    totalQuantity,
    shipId: void 0
  });
  const orderitems = cartitems.map((itemobj) => ({
    itemid: itemobj.itemid,
    orderId: neworder._id,
    // itemtype: itemobj.itemtype,
    // itemModel: itemobj.itemtype,
    quantity: itemobj.quantity,
    price: itemobj.price,
    totalPrice: itemobj.totalPrice
  }));
  neworder.items = orderitems;
  await neworder.save();
  res.send(neworder);
};
var createAddress = async (req, res, next) => {
  const { email, receiver, phone, house, street, pincode, city } = req.body;
  const newaddress = new Address({
    userId: req.currentUser.id,
    email,
    receiver,
    house,
    street,
    city,
    pincode,
    phone
  });
  try {
    await newaddress.save();
  } catch (error) {
    console.log("error: ", error);
  }
  res.send({ shipId: newaddress.id });
};

// src/order/routes/update.ts
import { NotAuthorizedError as NotAuthorizedError7, NotFoundError as NotFoundError9 } from "@manprtickets/common";

// src/order/models/payment.ts
import mongoose15 from "mongoose";
var paymentSchema = new mongoose15.Schema(
  {
    orderId: {
      required: true,
      type: String
    },
    stripeId: {
      required: true,
      type: String
    },
    amount: {
      type: Number,
      default: 0,
      required: true
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      }
    }
  }
);
paymentSchema.statics.build = (attrs) => {
  return new Payment(attrs);
};
var Payment = mongoose15.model(
  "Payment",
  paymentSchema
);

// src/order/routes/update.ts
var updateOrder = async (req, res, next) => {
  const order = await Order.findById(req.params.orderid);
  if (!order) {
    throw new NotFoundError9();
  }
  if (order.userId.valueOf() !== req.currentUser.id) {
    throw new NotAuthorizedError7();
  }
  order.set({
    status: req.body.status
    // shippingId: req.body.shipping?
  });
  await order.save();
  res.send({ message: "Order udpated successfully" });
};
var completeOrder = async (req, res, next) => {
  const { shipping } = req.body;
  const order = await Order.findById(req.params.orderid);
  if (!order) {
    throw new NotFoundError9();
  }
  if (order.userId.valueOf() !== req.currentUser.id) {
    throw new NotAuthorizedError7();
  }
  const { id, email, receiver, phone, house, street, pincode, city } = shipping;
  let address = null;
  let existingAddress = false;
  if (id && id !== "") {
    address = await Address.findById(id);
    if (!address) {
      throw new NotFoundError9();
    }
    existingAddress = true;
  } else {
    address = new Address({
      userId: req.currentUser.id,
      email,
      receiver,
      house,
      street,
      city,
      pincode,
      phone
    });
  }
  console.log("shipping id: ", address?.id);
  const payObject = new Payment({
    orderId: order.id,
    stripeId: "adfbbc2332",
    amount: order.orderValue
  });
  order.set({
    shipId: address?.id,
    status: "Complete"
  });
  if (!existingAddress) {
    await address.save();
  }
  await order.save();
  await payObject.save();
  res.send({ message: "Order completed successfully" });
};

// src/reports/order/order_detail.tsx
import { Document, Page, View as View9 } from "@react-pdf/renderer";

// src/reports/report_styles.ts
import { Font, StyleSheet } from "@react-pdf/renderer";
Font.register({
  family: "Oswald",
  src: "https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf"
});
var styles = StyleSheet.create({
  page: {
    fontSize: 11,
    paddingTop: 35,
    paddingBottom: 35,
    paddingHorizontal: 35,
    lineHeight: 1.5,
    flexDirection: "column"
  },
  titleRow: {
    display: "flex",
    width: "100%",
    height: 40,
    borderBottomWidth: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  tableRow: {
    display: "flex",
    width: "100%",
    height: 350,
    borderWidth: 1,
    flexDirection: "column"
  },
  theadRow: {
    display: "flex",
    width: "100%",
    height: "55",
    flexDirection: "row"
  },
  tbodyRow: {
    display: "flex",
    width: "100%",
    height: "35",
    flexDirection: "row"
  },
  tfootRow: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: "50",
    justifyContent: "flex-end"
  },
  signRow: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: "90",
    justifyContent: "flex-end"
  },
  tcells: {
    borderWidth: 1,
    width: "40",
    fontFamily: "Times-Roman",
    justifyContent: "center",
    alignItems: "center"
  },
  tcellxl: {
    borderWidth: 1,
    width: "130",
    fontFamily: "Times-Roman",
    justifyContent: "center",
    alignItems: "center"
  },
  tcelll: {
    borderWidth: 1,
    width: "80",
    fontFamily: "Times-Roman",
    justifyContent: "center",
    alignItems: "center"
  },
  tcellm: {
    borderWidth: 1,
    width: "70",
    fontFamily: "Times-Roman",
    justifyContent: "center",
    alignItems: "center"
  },
  bigSize: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Oswald",
    marginBottom: 20
  },
  orderNumRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    height: 30,
    marginTop: 10
  },
  addressRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    height: 110
  },
  text: {
    margin: 8,
    fontSize: 12,
    textAlign: "left",
    fontFamily: "Times-Roman"
  },
  addresstext: {
    margin: 2,
    fontSize: 11,
    textAlign: "left",
    fontFamily: "Times-Roman",
    lineHeight: "1"
  },
  theadText: {
    margin: 8,
    fontSize: 11,
    fontWeight: "bold",
    textAlign: "left",
    fontFamily: "Times-Roman"
  },
  subHead: {
    fontSize: 13,
    fontFamily: "Oswald",
    marginVertical: 5,
    textAlign: "left"
  },
  footText: { fontSize: 9 },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey"
  },
  footnote: {
    flexDirection: "row",
    position: "absolute",
    justifyContent: "space-between",
    bottom: 0,
    left: 10,
    right: 10,
    color: "grey"
  }
});
var report_styles_default = styles;

// src/reports/snippets/Footer.tsx
import { Text, View } from "@react-pdf/renderer";
import { jsx, jsxs } from "react/jsx-runtime";
var Footer = () => {
  return /* @__PURE__ */ jsxs(View, { style: report_styles_default.footnote, fixed: true, children: [
    /* @__PURE__ */ jsx(Text, { style: report_styles_default.footText, children: "Through ManPrema App" }),
    /* @__PURE__ */ jsx(Text, { style: report_styles_default.footText, children: "@toji_chettan_company" })
  ] });
};
var Footer_default = Footer;

// src/reports/snippets/bill_title.tsx
import { Text as Text2, View as View2 } from "@react-pdf/renderer";
import { jsx as jsx2 } from "react/jsx-runtime";
var ReportTitle = ({ name }) => {
  return /* @__PURE__ */ jsx2(View2, { style: report_styles_default.titleRow, children: /* @__PURE__ */ jsx2(Text2, { style: report_styles_default.bigSize, children: name }) });
};
var bill_title_default = ReportTitle;

// src/reports/snippets/box_nodate.tsx
import { Text as Text3, View as View3 } from "@react-pdf/renderer";
import { jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
var BoxNoDate = ({ name, num_fld, date_fld, style }) => {
  return /* @__PURE__ */ jsxs2(View3, { style: [{ flexDirection: "column", width: "50%" }, style], children: [
    /* @__PURE__ */ jsx3(Text3, { children: `${name} No: ${num_fld}` }),
    /* @__PURE__ */ jsx3(Text3, { children: `${name} Date: ${date_fld}` })
  ] });
};
var box_nodate_default = BoxNoDate;

// src/lib/util_fns.ts
var formattedDate = (inputDate) => `${inputDate.getDate()}-${inputDate.getMonth()}-${inputDate.getFullYear()}`;
var formattedIDNumber = (idStr, maxLength) => {
  if (idStr.length > maxLength) {
    return idStr.slice(0, maxLength);
  } else {
    return idStr;
  }
};

// src/reports/snippets/box_address.tsx
import { Text as Text4, View as View4 } from "@react-pdf/renderer";
import { jsx as jsx4, jsxs as jsxs3 } from "react/jsx-runtime";
var BoxAddress = ({ name, address }) => {
  return /* @__PURE__ */ jsxs3(View4, { style: { flexDirection: "column", width: "33%", height: "160px" }, children: [
    /* @__PURE__ */ jsx4(Text4, { style: report_styles_default.subHead, children: name }),
    /* @__PURE__ */ jsxs3(View4, { children: [
      /* @__PURE__ */ jsx4(Text4, { style: report_styles_default.addresstext, children: address.receiver }),
      /* @__PURE__ */ jsx4(Text4, { style: report_styles_default.addresstext, children: address.house }),
      /* @__PURE__ */ jsx4(Text4, { style: report_styles_default.addresstext, children: address.street }),
      /* @__PURE__ */ jsx4(Text4, { style: report_styles_default.addresstext, children: address.city }),
      /* @__PURE__ */ jsx4(Text4, { style: report_styles_default.addresstext, children: address.pincode })
    ] })
  ] });
};
var box_address_default = BoxAddress;

// src/reports/snippets/bom-table-head.tsx
import { Text as Text5, View as View5 } from "@react-pdf/renderer";
import { jsx as jsx5, jsxs as jsxs4 } from "react/jsx-runtime";
var BOMTableHead = () => {
  return /* @__PURE__ */ jsxs4(View5, { style: report_styles_default.theadRow, children: [
    /* @__PURE__ */ jsx5(View5, { style: report_styles_default.tcells, children: /* @__PURE__ */ jsx5(Text5, { style: report_styles_default.theadText, children: "Sl. No." }) }),
    /* @__PURE__ */ jsx5(View5, { style: report_styles_default.tcellxl, children: /* @__PURE__ */ jsx5(Text5, { style: report_styles_default.theadText, children: "Description" }) }),
    /* @__PURE__ */ jsx5(View5, { style: report_styles_default.tcells, children: /* @__PURE__ */ jsx5(Text5, { style: report_styles_default.theadText, children: "Unit Price" }) }),
    /* @__PURE__ */ jsx5(View5, { style: report_styles_default.tcells, children: /* @__PURE__ */ jsx5(Text5, { style: report_styles_default.theadText, children: "Qty" }) }),
    /* @__PURE__ */ jsx5(View5, { style: report_styles_default.tcellm, children: /* @__PURE__ */ jsx5(Text5, { style: report_styles_default.theadText, children: "Net Amt" }) }),
    /* @__PURE__ */ jsx5(View5, { style: report_styles_default.tcells, children: /* @__PURE__ */ jsx5(Text5, { style: report_styles_default.theadText, children: "Tax Rate" }) }),
    /* @__PURE__ */ jsx5(View5, { style: report_styles_default.tcells, children: /* @__PURE__ */ jsx5(Text5, { style: report_styles_default.theadText, children: "Tax Type" }) }),
    /* @__PURE__ */ jsx5(View5, { style: report_styles_default.tcellm, children: /* @__PURE__ */ jsx5(Text5, { style: report_styles_default.theadText, children: "Tax Amt" }) }),
    /* @__PURE__ */ jsx5(View5, { style: report_styles_default.tcellm, children: /* @__PURE__ */ jsx5(Text5, { style: report_styles_default.theadText, children: "Total Amt" }) })
  ] });
};
var bom_table_head_default = BOMTableHead;

// src/reports/snippets/bom-table-body.tsx
import { Text as Text6, View as View6 } from "@react-pdf/renderer";
import { jsx as jsx6, jsxs as jsxs5 } from "react/jsx-runtime";
var BOMTableBody = ({ items }) => {
  return /* @__PURE__ */ jsx6(View6, { style: { flexDirection: "column" }, children: items.map((orderitem, index) => /* @__PURE__ */ jsxs5(View6, { style: report_styles_default.tbodyRow, children: [
    /* @__PURE__ */ jsx6(View6, { style: report_styles_default.tcells, children: /* @__PURE__ */ jsx6(Text6, { style: report_styles_default.text, children: index + 1 }) }),
    /* @__PURE__ */ jsx6(View6, { style: report_styles_default.tcellxl, children: /* @__PURE__ */ jsx6(Text6, { style: report_styles_default.text, children: orderitem.orderitem.title }) }),
    /* @__PURE__ */ jsx6(View6, { style: report_styles_default.tcells, children: /* @__PURE__ */ jsx6(Text6, { style: report_styles_default.text, children: orderitem.price }) }),
    /* @__PURE__ */ jsx6(View6, { style: report_styles_default.tcells, children: /* @__PURE__ */ jsx6(Text6, { style: report_styles_default.text, children: orderitem.quantity }) }),
    /* @__PURE__ */ jsx6(View6, { style: report_styles_default.tcellm, children: /* @__PURE__ */ jsx6(Text6, { style: report_styles_default.text, children: orderitem.totalPrice }) }),
    /* @__PURE__ */ jsx6(View6, { style: report_styles_default.tcells, children: /* @__PURE__ */ jsx6(Text6, { style: report_styles_default.text, children: "5%" }) }),
    /* @__PURE__ */ jsx6(View6, { style: report_styles_default.tcells, children: /* @__PURE__ */ jsx6(Text6, { style: report_styles_default.text, children: "CGST" }) }),
    /* @__PURE__ */ jsx6(View6, { style: report_styles_default.tcellm, children: /* @__PURE__ */ jsx6(Text6, { style: report_styles_default.text, children: "20.00" }) }),
    /* @__PURE__ */ jsx6(View6, { style: report_styles_default.tcellm, children: /* @__PURE__ */ jsx6(Text6, { style: report_styles_default.text, children: orderitem.totalPrice }) })
  ] }, orderitem.orderitem.id)) });
};
var bom_table_body_default = BOMTableBody;

// src/reports/snippets/bom-footer.tsx
import { Text as Text7, View as View7 } from "@react-pdf/renderer";
import { jsx as jsx7, jsxs as jsxs6 } from "react/jsx-runtime";
var BOMFooter = ({ total }) => {
  return /* @__PURE__ */ jsxs6(View7, { style: report_styles_default.tfootRow, children: [
    /* @__PURE__ */ jsxs6(View7, { style: { flexDirection: "column" }, children: [
      /* @__PURE__ */ jsx7(View7, { style: report_styles_default.tcellm, children: /* @__PURE__ */ jsx7(Text7, { style: report_styles_default.theadText, children: "Tax Total" }) }),
      /* @__PURE__ */ jsx7(View7, { style: report_styles_default.tcellm, children: /* @__PURE__ */ jsx7(Text7, { style: report_styles_default.text, children: total }) })
    ] }),
    /* @__PURE__ */ jsxs6(View7, { style: { flexDirection: "column" }, children: [
      /* @__PURE__ */ jsx7(View7, { style: report_styles_default.tcelll, children: /* @__PURE__ */ jsx7(Text7, { style: report_styles_default.theadText, children: "Grand Total" }) }),
      /* @__PURE__ */ jsx7(View7, { style: report_styles_default.tcelll, children: /* @__PURE__ */ jsx7(Text7, { style: report_styles_default.text, children: total }) })
    ] })
  ] });
};
var bom_footer_default = BOMFooter;

// src/reports/snippets/signature.tsx
import { Text as Text8, View as View8 } from "@react-pdf/renderer";
import { jsx as jsx8, jsxs as jsxs7 } from "react/jsx-runtime";
var Signature = () => {
  return /* @__PURE__ */ jsx8(View8, { style: report_styles_default.signRow, children: /* @__PURE__ */ jsxs7(
    View8,
    {
      style: {
        flexDirection: "column",
        justifyContent: "space-between",
        width: "150"
      },
      children: [
        /* @__PURE__ */ jsx8(Text8, { style: [report_styles_default.text, { textAlign: "right" }], children: "For ManPrema Inc" }),
        /* @__PURE__ */ jsx8(
          Text8,
          {
            style: [
              report_styles_default.text,
              { textAlign: "right", fontWeight: "bold", fontSize: 13 }
            ],
            children: "Authorized Signatory"
          }
        )
      ]
    }
  ) });
};
var signature_default = Signature;

// src/reports/order/order_detail.tsx
import { jsx as jsx9, jsxs as jsxs8 } from "react/jsx-runtime";
var OrderDetail = ({ order }) => {
  return /* @__PURE__ */ jsx9(Document, { children: /* @__PURE__ */ jsxs8(Page, { size: "A4", style: report_styles_default.page, children: [
    /* @__PURE__ */ jsx9(bill_title_default, { name: "Original Tax Invoice/ Bill of Supply/ Cash Memo" }),
    /* @__PURE__ */ jsxs8(View9, { style: report_styles_default.orderNumRow, children: [
      /* @__PURE__ */ jsx9(
        box_nodate_default,
        {
          name: "Order",
          num_fld: formattedIDNumber(order.id, 10),
          date_fld: formattedDate(order.orderDate),
          style: { alignItems: "flex-start" }
        }
      ),
      /* @__PURE__ */ jsx9(
        box_nodate_default,
        {
          name: "Invoice",
          num_fld: formattedIDNumber(order.id, 10),
          date_fld: formattedDate(order.orderDate),
          style: { alignItems: "flex-end" }
        }
      )
    ] }),
    /* @__PURE__ */ jsxs8(View9, { style: report_styles_default.addressRow, children: [
      /* @__PURE__ */ jsx9(box_address_default, { name: "Sold By", address: order.shipping }),
      /* @__PURE__ */ jsx9(box_address_default, { name: "Shipping", address: order.shipping }),
      /* @__PURE__ */ jsx9(box_address_default, { name: "Billing", address: order.shipping })
    ] }),
    /* @__PURE__ */ jsxs8(View9, { style: report_styles_default.tableRow, children: [
      /* @__PURE__ */ jsx9(bom_table_head_default, {}),
      /* @__PURE__ */ jsx9(bom_table_body_default, { items: order.items }),
      /* @__PURE__ */ jsx9(bom_footer_default, { total: order.orderValue })
    ] }),
    /* @__PURE__ */ jsx9(signature_default, {}),
    /* @__PURE__ */ jsx9(Footer_default, {})
  ] }) });
};
var order_detail_default = OrderDetail;

// src/order/routes/pdf-generate.tsx
import { renderToFile, renderToStream } from "@react-pdf/renderer";
import fetch from "node-fetch";

// src/graphql/queries/get-order.ts
function getOrder(idStr) {
  const data = JSON.stringify({
    query: `query OrderByID($orderid: ID!) {
      orderByID(orderid: $orderid) {
        id
        userId
        status
        orderDate
        totalQuantity
        orderValue
        items {
          orderitem {
            id
            itemType
            title
            description
            image
            unit
            dimensions
          }
          quantity
          price
          totalPrice
        }
        shipping {
          id
          email
          receiver
          phone
          house
          street
          pincode
          city
        }
      }
    }`,
    variables: {
      orderid: idStr
    }
  });
  return data;
}

// src/order/routes/pdf-generate.tsx
import { fileURLToPath } from "url";
import path from "path";
import { jsx as jsx10 } from "react/jsx-runtime";
var { dirname } = path;
var downloadPDF = async (req, res, next) => {
  const queryOrderData = getOrder(req.params.orderid);
  const response = await fetch(`${env_default.API_URL}/graphql`, {
    method: "POST",
    body: queryOrderData,
    headers: {
      "Content-Type": "application/json",
      usertoken: req.session?.jwt
    }
  });
  const order = await response.json();
  if (!order) {
    return res.status(404).send("Order not found");
  }
  const orderData = order?.data.orderByID;
  const validatedOrder = orderSchema.safeParse(orderData);
  if (!validatedOrder.success) {
    console.log(validatedOrder.error);
    return res.status(400).send("Invalid order data");
  }
  const pdfStream = await renderToStream(
    /* @__PURE__ */ jsx10(order_detail_default, { order: validatedOrder.data })
  );
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", 'attachment; filename="order-doc.pdf"');
  pdfStream.pipe(res);
  pdfStream.on("end", () => console.log("Done streaming, response sent"));
};
var generateOrderPdf = async (req, res, next) => {
  try {
    const queryOrderData = getOrder(req.params.orderid);
    const response = await fetch(`${env_default.API_URL}/graphql`, {
      method: "POST",
      body: queryOrderData,
      headers: {
        "Content-Type": "application/json",
        usertoken: req.session?.jwt
      }
    });
    const order = await response.json();
    if (!order) {
      return res.status(404).send("Order not found");
    }
    const orderData = order?.data.orderByID;
    const validatedOrder = orderSchema.safeParse(orderData);
    if (!validatedOrder.success) {
      console.log(validatedOrder.error);
      return res.status(400).send("Invalid order data");
    }
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    console.log("dir name: ", __dirname);
    const tempFiles = path.join(__dirname, "temp_files");
    const pdfPath = path.join(tempFiles, "order-doc.pdf");
    console.log("tempDir: ", tempFiles, " creation path: ", pdfPath);
    const relativePathFromCWD = path.relative(process.cwd(), pdfPath);
    console.log("created path: ", relativePathFromCWD);
    await renderToFile(/* @__PURE__ */ jsx10(order_detail_default, { order: validatedOrder.data }), pdfPath);
    const returnObject = {
      id: req.params.orderid,
      filename: "order-doc.pdf",
      fileurl: relativePathFromCWD
    };
    res.send(returnObject);
  } catch (error) {
    console.log("error in process: ", error);
    return { id: req.params.orderid, filename: "error", fileurl: "error url" };
  }
};

// src/order/routes/order-routes.ts
var router8 = express8.Router();
router8.get("/", requireAuth7, getUserOrders);
router8.get("/address", requireAuth7, getAddresses);
router8.get("/address/:id", requireAuth7, getAddressById);
router8.get("/:orderid", requireAuth7, getOrderById);
router8.get("/genpdf/:orderid", requireAuth7, generateOrderPdf);
router8.get("/downpdf/:orderid", requireAuth7, downloadPDF);
router8.post("/", requireAuth7, createOrder);
router8.post("/address", requireAuth7, createAddress);
router8.patch("/complete/:orderid", requireAuth7, completeOrder);
router8.patch("/:orderid", requireAuth7, updateOrder);
router8.delete("/:orderid", requireAuth7, delete_default3);

// src/app.ts
var corsOptions = {
  origin: "*",
  methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD", "DELETE", "PATCH"],
  credentials: true
  // exposedHeaders: ["Set-Cookie"],
};
var app = express9();
var MONGODB_URI = `mongodb+srv://${env_default.MONGO_USER}:${env_default.MONGO_PASSWORD}@cluster0.q4wsrjb.mongodb.net/${env_default.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority&appName=Cluster0`;
app.use(cookieParser(env_default.JWT_KEY));
var httpServer = http.createServer(app);
var { json } = bodyparser;
app.use(json());
app.use(cors(corsOptions));
app.use(
  session({
    secret: [process.env.JWT_KEY],
    resave: false,
    // name: "session.web",
    saveUninitialized: false,
    // cookie: { httpOnly: false, sameSite: "none" },
    store: MongoStore.create({
      mongoUrl: MONGODB_URI,
      ttl: 8 * 60 * 60,
      autoRemove: "interval",
      autoRemoveInterval: 5
    })
  })
);
app.use((req, res, next) => {
  const usertoken = req.headers["usertoken"];
  if (!req.session?.jwt && usertoken) {
    req.session.jwt = usertoken;
  }
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});
app.use(currentUser);
app.use("/api/users", router);
app.use("/api/item", router2);
app.use("/api/part", router3);
app.use("/api/like", router4);
app.use("/api/stock", router5);
app.use("/api/invoice", router6);
app.use("/api/cart", router7);
app.use("/api/order", router8);
app.use(errorHandler);
var startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers: { Date: { ...customResolvers.Date }, ...rootResolvers },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
  });
  await server.start();
  app.use(
    "/graphql",
    cors(corsOptions),
    express9.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const token = req.headers.usertoken;
        const { cache } = server;
        return {
          token,
          dataSources: {
            trackAPI: new TrackAPI({ cache }),
            itemAPI: new ItemAPI({ cache, token }),
            partAPI: new PartAPI({ cache, token }),
            stockAPI: new StockAPI({ cache, token }),
            billAPI: new BillAPI({ cache, token }),
            authAPI: new AuthAPI({ cache, token }),
            cartAPI: new CartAPI({ cache, token }),
            orderAPI: new OrderAPI({ cache, token })
          }
        };
      }
    })
  );
  httpServer.listen(env_default.PORT || 8080, () => {
    console.log(`\u{1F680} Server ready at ${process.env.PORT}`);
  });
};

// src/index.ts
import mongoose16 from "mongoose";
var connectDB = async () => {
  await mongoose16.connect(MONGODB_URI).then((result) => {
    console.log("Connected to MongoDB");
    return result;
  }).catch((err) => {
    console.log(err);
  });
};
connectDB();
startServer();
//# sourceMappingURL=bundle.js.map
