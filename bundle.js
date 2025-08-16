import"dotenv/config";import{z as $}from"zod";var Jr=$.object({PORT:$.string(),MONGO_USER:$.string(),MONGO_PASSWORD:$.string(),MONGO_DEFAULT_DATABASE:$.string(),JWT_KEY:$.string(),API_URL:$.string()}).required(),qe=Jr.safeParse(process.env);if(!qe.success){let t=qe.error.issues.map(e=>`${e.path.join(".")} ${e.message}`).join(", ");throw new Error(t)}var g=qe.data;import Te from"express";import mn from"http";import un from"express-session";import ln from"connect-mongo";import{RESTDataSource as Hr}from"@apollo/datasource-rest";var me=class extends Hr{baseURL="https://odyssey-lift-off-rest-api.herokuapp.com/";getTracksForHome(){return this.get("tracks")}getAuthor(e){return this.get(`author/${e}`)}getTrack(e){return this.get(`track/${e}`)}getTrackModules(e){return this.get(`track/${e}/modules`)}getModule(e){return this.get(`module/${e}`)}incrementTrackViews(e){return this.patch(`track/${e}/numberOfViews`)}};import{RESTDataSource as Gr}from"@apollo/datasource-rest";var ee=class extends Gr{baseURL=`${g.API_URL}/api/`;token;constructor(e){super(e),this.token=e.token}willSendRequest(e,s){s.headers.usertoken=this.token}async getItemsBySearch(e,s){let r=e||"all",o=s;return await this.get(`item/search/${s}/${r}/`)}async getItemById(e){return await this.get(`item/${e}`)}async getPart(e){return await this.get(`item/${e}`)}async getItemsByType(e){return await this.get(`item/select/${e}`)}async getAssignments(e){return await this.get(`part/${e}`)}async getAssignedParts(e,s){return await this.get(`part/${s}/${e}`)}async getLikes(){return await this.get("like/")}async changeLike(e){try{return await this.patch(`like/${e}`)}catch(s){return console.log("graphql error: ",s?.extensions),null}}async createAssignments(e){try{return await this.post(`part/assign/${e.id}`,{body:e})}catch(s){return console.log("graphql error: ",s?.extensions),null}}async createItem(e){try{return await this.post("item/new",{body:e})}catch(s){return console.log("graphql error: ",s?.extensions),null}}async updateItem(e){try{return await this.put(`item/${e.id}`,{body:e})}catch(s){return console.log("graphql error: ",s?.extensions),null}}async deleteItem(e){try{return await this.delete(`item/${e}`)}catch(s){return console.log("graphql error: ",s?.extensions),null}}};import{RESTDataSource as Yr}from"@apollo/datasource-rest";var te=class extends Yr{baseURL=`${g.API_URL}/api/`;token;constructor(e){super(e),this.token=e.token}willSendRequest(e,s){s.headers.usertoken=this.token}};import{RESTDataSource as Xr}from"@apollo/datasource-rest";var re=class extends Xr{baseURL=`${g.API_URL}/api/`;token;constructor(e){super(e),this.token=e.token}willSendRequest(e,s){s.headers.usertoken=this.token}async getStockById(e){return await this.get(`stock/${e}`)}async getStockByItemId(e){return await this.get(`stock/item/${e}`)}async getStockByItemType(e){return await this.get(`stock/type/${e}`)}async createStock(e){try{return await this.post("stock/new",{body:e})}catch(s){return console.log("graphql error: ",s?.extensions),null}}async updateStock(e){try{return await this.put("stock/update",{body:e})}catch(s){return console.log("graphql error: ",s?.extensions),null}}async deleteStock(e){try{return await this.delete(`stock/delete/${e}`)}catch(s){return console.log("graphql error: ",s?.extensions),null}}};import{RESTDataSource as Zr}from"@apollo/datasource-rest";var se=class extends Zr{baseURL=`${g.API_URL}/api/`;token;constructor(e){super(e),this.token=e.token}willSendRequest(e,s){s.headers.usertoken=this.token}async getBillById(e){return await this.get(`invoice/${e}`)}async getBillByItemId(e){return await this.get(`invoice/item/${e}`)}async createBill(e){try{return await this.post("invoice/new",{body:e})}catch(s){return console.log("graphql error: ",s?.extensions),null}}async updateBill(e){try{return await this.put("invoice/update",{body:e})}catch(s){return console.log("graphql error: ",s?.extensions),null}}async deleteBill(e){try{return await this.delete(`invoice/delete/${e}`)}catch(s){return console.log("graphql error: ",s?.extensions),null}}};import{RESTDataSource as es}from"@apollo/datasource-rest";var oe=class extends es{baseURL=`${g.API_URL}/api/`;token;constructor(e){super(e),this.token=e.token}willSendRequest(e,s){s.headers.usertoken=this.token}async getCurrentUser(){return await this.get("users/currentuser")}async signin(e){try{return await this.post("users/signin",{body:e})}catch(s){return console.log("graphql error: ",s?.extensions),null}}async signup(e){try{return await this.post("users/signup",{body:e})}catch(s){return console.log("graphql error: ",s?.extensions),null}}async signout(){try{return await this.post("users/signout")}catch{return null}}};import{RESTDataSource as ts}from"@apollo/datasource-rest";var ne=class extends ts{baseURL=`${g.API_URL}/api/`;token;constructor(e){super(e),this.token=e.token}willSendRequest(e,s){s.headers.usertoken=this.token}async getCartUser(){return await this.get("cart/")}async replaceCart(e,s){try{return await this.post("cart/",{body:{cartitems:e,totalQuantity:s}})}catch(r){return console.log("graphql error: ",r?.extensions),null}}};import{RESTDataSource as rs}from"@apollo/datasource-rest";var ie=class extends rs{baseURL=`${g.API_URL}/api/`;token;constructor(e){super(e),this.token=e.token}willSendRequest(e,s){s.headers.usertoken=this.token}async getUserAddresses(){return await this.get("order/address/")}async getAddress(e){return await this.get(`order/address/${e}`)}async getUserOrders(){return await this.get("order/")}async getOrder(e){return await this.get(`order/${e}`)}async getOrderPdf(e){return await this.get(`order/genpdf/${e}`)}async createOrder(e,s){try{return await this.post("order/",{body:{cart:e,value:s}})}catch(r){return console.log("graphql error: ",r?.extensions),null}}async updateOrder(e,s){try{return await this.patch(`order/${e}`,{body:{status:s}})}catch(r){return console.log("graphql error: ",r?.extensions),null}}async cancelOrder(e){try{return await this.delete(`order/${e}`)}catch(s){return console.log("graphql error: ",s?.extensions),null}}async completeOrder(e,s){try{return await this.patch(`order/complete/${e}`,{body:{shipping:s}})}catch(r){return console.log("graphql error: ",r?.extensions),null}}async createAddress(e){try{return await this.post("order/address",{body:{input:e}})}catch(s){return console.log("graphql error: ",s?.extensions),null}}};import zr from"cors";import pn from"cookie-parser";import{expressMiddleware as gn}from"@as-integrations/express4";import{ApolloServer as yn}from"@apollo/server";import{ApolloServerPluginDrainHttpServer as fn}from"@apollo/server/plugin/drainHttpServer";import{gql as ss}from"graphql-tag";var et=ss`
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
    discTotal: Float!
    gstTotal: Float!
    shipping: Address
  }

  type OrderItem {
    orderitem: Item!
    orderId: String!
    quantity: Int!
    price: Float!
    gst: Float!
    discount: Float!
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
    gst: Float!
    discount: Float!
    totalPrice: Float!
    limitQty: Int!
  }

  type CartItem {
    item: Item!
    quantity: Int!
    price: Float!
    gst: Float!
    discount: Float!
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
`;import{GraphQLScalarType as os,Kind as ns}from"graphql";var is=new os({name:"Date",description:"Date custom scalar type",serialize(t){if(t instanceof Date)return t.getTime();throw Error("GraphQL Date Scalar serializer expected a `Date` object")},parseValue(t){if(typeof t=="number")return new Date(t);throw new Error("GraphQL Date Scalar parser expected a `number`")},parseLiteral(t){return t.kind===ns.INT?new Date(parseInt(t.value,10)):null}}),tt={Date:{date:is}};var Oe={Query:{currentUser:(t,e,{dataSources:s})=>s.authAPI.getCurrentUser()},Mutation:{signin:async(t,{input:e},{dataSources:s})=>{try{let r=await s.authAPI.signin(e);if(!r)return{code:401,success:!1,message:"Invalid credentials",user:void 0,token:""};let{user:o,token:n}=r;return{code:200,success:!0,message:"Signed In successfully",user:o,token:n}}catch(r){return{code:r.extensions.response.status,success:!1,message:r.extensions.response.body,user:void 0,token:""}}},signup:async(t,{input:e},{dataSources:s})=>{try{let r=await s.authAPI.signup(e);if(!r)return{code:401,success:!1,message:"Invalid credentials",user:void 0,token:""};let{user:o,token:n}=r;return{code:200,success:!0,message:"Signed Up successfully",user:o,token:n}}catch(r){return{code:r.extensions.response.status,success:!1,message:r.extensions.response.body,user:void 0,token:""}}},signout:async(t,e,{dataSources:s})=>{try{return await s.authAPI.signout(),{code:200,success:!0,message:"Signed out"}}catch(r){return{code:r.extensions.response.status,success:!1,message:r.extensions.response.body}}}}};var De={Query:{billById:(t,{billid:e},{dataSources:s})=>s.billAPI.getBillById(e),billByItemId:(t,{itemid:e},{dataSources:s})=>s.billAPI.getBillByItemId(e)},Mutation:{createBill:async(t,{input:e},{dataSources:s})=>{try{return{code:200,success:!0,message:"Bill created successfully",item:await s.billAPI.createBill(e)}}catch(r){return{code:r.extensions.response.status,success:!1,message:r.extensions.response.body,item:null}}},updateBill:async(t,{input:e},{dataSources:s})=>{try{return{code:200,success:!0,message:"Bill updated successfully",item:await s.billAPI.updateBill(e)}}catch(r){return{code:r.extensions.response.status,success:!1,message:r.extensions.response.body,item:null}}},deleteBill:async(t,{billId:e},{dataSources:s})=>{try{return{code:200,success:!0,message:"Bill deleted successfully",item:await s.billAPI.deleteBill(e)}}catch(r){return{code:r.extensions.response.status,success:!1,message:r.extensions.response.body,item:""}}}}};var ue={Query:{cartUser:(t,e,{dataSources:s})=>s.cartAPI.getCartUser()},CartItem:{item:({itemid:t},e,{dataSources:s})=>s.itemAPI.getPart(t)},Mutation:{replaceCart:async(t,{input:e},{dataSources:s})=>{if(!e)throw new Error("Input is required");let{cartitems:r,totalQuantity:o}=e;try{let n=await s.cartAPI.replaceCart(r,o);return{code:200,success:!0,message:"Cart replaced successfully"}}catch(n){return{code:n.extensions.response.status,success:!1,message:n.extensions.response.body}}}}};import{z as p}from"zod";var Q=(o=>(o.Created="Created",o.Cancelled="Cancelled",o.AwaitingPayment="Awaiting:payment",o.Complete="Complete",o))(Q||{});var z=p.object({message:p.string()}),as=p.object({id:p.string().transform(t=>t&&void 0),email:p.string(),receiver:p.string(),phone:p.string(),house:p.string(),street:p.string(),city:p.string(),pincode:p.string()}),rt=(n=>(n.Product="Product",n.Spare="Spare",n.Equipment="Equipment",n.Package="Package",n.Category="Category",n))(rt||{}),b=p.coerce.number().min(.01).max(1e3).nonnegative().multipleOf(.01),le=p.string().min(6),ds=p.object({id:p.string(),itemType:p.enum(rt),title:le,image:le,description:le,unit:p.string().optional(),dimensions:le.optional(),quantity:b.optional(),price:b.optional(),totalPrice:b.optional(),gst:b.optional(),discount:b.optional()}),cs=p.object({orderitem:ds,orderId:p.string().optional(),quantity:b,price:b,gst:b,discount:b,totalPrice:b}),Ne=p.object({id:p.string(),status:p.enum(Q),items:p.array(cs),orderDate:p.coerce.date(),totalQuantity:b,orderValue:b,discTotal:b,gstTotal:b,shipping:as});var ae={Query:{itemsBySearch:(t,{search:e,itemType:s},{dataSources:r})=>r.itemAPI.getItemsBySearch(e,s),itemById:(t,{id:e},{dataSources:s})=>s.itemAPI.getItemById(e),itemsByType:(t,{itemType:e},{dataSources:s})=>s.itemAPI.getItemsByType(e),assignments:(t,{assign:e},{dataSources:s})=>s.itemAPI.getAssignments(e),assignedParts:(t,{assignid:e,itemtype:s},{dataSources:r})=>r.itemAPI.getAssignedParts(e,s),likes:(t,e,{dataSources:s})=>s.itemAPI.getLikes()},Part:{partitem:({itemid:t},e,{dataSources:s})=>s.itemAPI.getPart(t),assignparent:({assignid:t},e,{dataSources:s})=>s.itemAPI.getPart(t)},LikeItem:{item:({itemId:t},e,{dataSources:s})=>s.itemAPI.getPart(t)},Mutation:{createAssignments:async(t,{input:e},{dataSources:s})=>{try{return{code:200,success:!0,message:"Items assignments created successfully",item:await s.itemAPI.createAssignments(e)}}catch(r){return{code:r.extensions.response.status,success:!1,message:r.extensions.response.body,item:"Assignments failed"}}},createItem:async(t,{input:e},{dataSources:s,token:r})=>{try{return{code:200,success:!0,message:"Item created successfully",item:await s.itemAPI.createItem(e)}}catch(o){return{code:o.extensions.response.status,success:!1,message:o.extensions.response.body,item:null}}},updateItem:async(t,{input:e},{dataSources:s})=>{try{return{code:200,success:!0,message:"Item updated successfully",item:await s.itemAPI.updateItem(e)}}catch(r){return{code:r.extensions.response.status,success:!1,message:r.extensions.response.body,item:null}}},deleteItem:async(t,{id:e},{dataSources:s})=>{try{return{code:200,success:!0,message:"Item deleted successfully",item:await s.itemAPI.deleteItem(e)}}catch(r){return{code:r.extensions.response.status,success:!1,message:r.extensions.response.body,item:""}}},like:async(t,{itemId:e},{dataSources:s})=>{try{let r=await s.itemAPI.changeLike(e),o=z.safeParse(r);return{code:200,success:!0,message:o.success?o.data.message:"Invalid return message"}}catch(r){return console.error("Error updating order:",r),{code:r.extensions?.response?.status||500,success:!1,message:r.extensions?.response?.body||"Internal Server Error"}}}}};var de={Query:{userAddresses:(t,e,{dataSources:s})=>s.orderAPI.getUserAddresses(),userOrders:(t,e,{dataSources:s})=>s.orderAPI.getUserOrders(),orderByID:(t,{orderid:e},{dataSources:s})=>s.orderAPI.getOrder(e),generateOrderPdf:(t,{orderid:e},{dataSources:s})=>s.orderAPI.getOrderPdf(e)},OrderItem:{orderitem:({itemid:t},e,{dataSources:s})=>s.itemAPI.getPart(t)},OrderEntry:{shipping:async({shipId:t},e,{dataSources:s})=>{if(!t)return null;let r=t.toString();return s.orderAPI.getAddress(r)}},Mutation:{createOrder:async(t,{cart:e,value:s},{dataSources:r})=>{try{return{code:200,success:!0,message:"Order created successfully",order:await r.orderAPI.createOrder(e,s)}}catch(o){return console.error("Error creating order:",o),{code:o.extensions?.response?.status||500,success:!1,message:o.extensions?.response?.body||"Internal Server Error",order:null}}},updateOrder:async(t,{orderid:e,status:s},{dataSources:r})=>{try{let o=await r.orderAPI.updateOrder(e,s),n=z.safeParse(o);return{code:200,success:!0,message:n.success?n.data.message:"Invalid return message"}}catch(o){return console.error("Error updating order:",o),{code:o.extensions?.response?.status||500,success:!1,message:o.extensions?.response?.body||"Internal Server Error"}}},cancelOrder:async(t,{orderid:e},{dataSources:s})=>{try{let r=await s.orderAPI.cancelOrder(e),o=z.safeParse(r);return{code:200,success:!0,message:o.success?o.data.message:"Invalid return message"}}catch(r){return console.error("Error cancelling order:",r),{code:r.extensions?.response?.status||500,success:!1,message:r.extensions?.response?.body||"Internal Server Error"}}},completeOrder:async(t,{orderid:e,shipping:s},{dataSources:r})=>{try{let o=await r.orderAPI.completeOrder(e,s),n=z.safeParse(o);return{code:200,success:!0,message:n.success?n.data.message:"Invalid return message"}}catch(o){return console.error("Error cancelling order:",o),{code:o.extensions?.response?.status||500,success:!1,message:o.extensions?.response?.body||"Internal Server Error"}}},createAddress:async(t,{input:e},{dataSources:s})=>{try{return{code:200,success:!0,message:"Address created successfully",order:await s.orderAPI.createAddress(e)}}catch(r){return console.error("Error creating order:",r),{code:r.extensions?.response?.status||500,success:!1,message:r.extensions?.response?.body||"Internal Server Error",order:null}}}}};var pe={Query:{stockById:(t,{stockid:e},{dataSources:s})=>s.stockAPI.getStockById(e),stockByItemId:(t,{itemid:e},{dataSources:s})=>s.stockAPI.getStockByItemId(e),stockByItemType:(t,{itemType:e},{dataSources:s})=>s.stockAPI.getStockByItemType(e)},ItemStock:{item:({itemid:t},e,{dataSources:s})=>s.itemAPI.getPart(t)},Mutation:{createStock:async(t,{input:e},{dataSources:s})=>{try{return{code:200,success:!0,message:"Item created successfully",item:await s.stockAPI.createStock(e)}}catch(r){return{code:r.extensions.response.status,success:!1,message:r.extensions.response.body,item:null}}},updateStock:async(t,{input:e},{dataSources:s})=>{try{return{code:200,success:!0,message:"Item updated successfully",item:await s.stockAPI.updateStock(e)}}catch(r){return{code:r.extensions.response.status,success:!1,message:r.extensions.response.body,item:null}}},deleteStock:async(t,{stockId:e},{dataSources:s})=>{try{return{code:200,success:!0,message:"Item deleted successfully",item:await s.stockAPI.deleteStock(e)}}catch(r){return{code:r.extensions.response.status,success:!1,message:r.extensions.response.body,item:""}}}}};var st={Query:{...ae.Query,...pe.Query,...De.Query,...Oe.Query,...ue.Query,...de.Query},Mutation:{...ae.Mutation,...pe.Mutation,...De.Mutation,...Oe.Mutation,...ue.Mutation,...de.Mutation},Part:{...ae.Part},LikeItem:{...ae.LikeItem},CartItem:{...ue.CartItem},OrderItem:{...de.OrderItem},OrderEntry:{...de.OrderEntry},ItemStock:{...pe.ItemStock}};import{jwtDecode as ms}from"jwt-decode";import it from"node-jose";var{JWE:ot,JWK:us,JWS:nt}=it,ls=()=>{let t=process.env.JWT_PRIVATEKEY,e=process.env.JWT_PUBLICKEY;async function s(){let a=async d=>await us.asKey(d,"pem"),c=await a(e),u=await a(t);return{pub_key:c,prv_key:u}}async function r(a){let{prv_key:c}=await s();if(!a)throw new Error("Missing Data");let u=JSON.stringify(a);return await nt.createSign({format:"compact"},c).update(u).final().then(function(y){return y})}async function o(a){let{pub_key:c}=await s();if(!a)throw new Error("Missing JWS Token");return await nt.createVerify(c).verify(a).then(d=>{let y=it.util.base64url.encode(d.payload);return ms(y,{header:!0})}).catch(d=>{console.log("returned ",d)})}async function n(a){let{pub_key:c}=await s();if(!a)throw new Error("Missing Data");let u=JSON.stringify(a);return await ot.createEncrypt(c).update(u).final()}async function m(a){let{prv_key:c}=await s();if(!a)throw new Error("Missing encrypted arg");return await ot.createDecrypt(c).decrypt(a)}return{encrypt:n,decrypt:m,sign:r,verify:o}},at=ls;var{encrypt:Ti,decrypt:Pi,sign:ps,verify:gs}=at();async function ge(t){return(await ps(t)).toString()}async function dt(t){return await gs(t)}import{z as l}from"zod";import ys from"validator";var{isEmail:ct,isMobilePhone:fs}=ys,mt=l.object({email:l.string().refine(ct,{message:"Invalid email address"}),password:l.string().min(6).max(20),firstName:l.string().min(4),lastName:l.string().min(4),phone:l.string().refine(fs,{message:"Invalid phone number"})}),Ni=l.object({email:l.string().refine(ct,{message:"Invalid email address"}),password:l.string().min(6).max(20)}),ye=l.object({id:l.string(),email:l.string().email(),firstName:l.string(),lastName:l.string()}),Is=l.object({itemid:l.string(),itemtype:l.string(),itemModel:l.string(),name:l.string(),quantity:l.number(),totalPrice:l.number(),price:l.number()}),Bi=l.object({userId:l.string(),items:l.array(Is),firstName:l.string(),lastName:l.string()});import lt from"mongoose";import{scrypt as hs,randomBytes as xs}from"crypto";import{promisify as Ss}from"util";var ut=Ss(hs),K=class{static async toHash(e){let s=xs(8).toString("hex");return`${(await ut(e,s,64)).toString("hex")}.${s}`}static async compare(e,s){let[r,o]=e.split(".");return(await ut(s,o,64)).toString("hex")===r}};var Be=new lt.Schema({firstName:{type:String,required:!0},lastName:{type:String,required:!0},email:{type:String,required:!0},phone:{type:String,required:!0},password:{type:String,required:!0},access:{type:String,default:"user",required:!0}},{toJSON:{transform(t,e){e.id=e._id,delete e._id,delete e.password,delete e.__v}}});Be.pre("save",async function(t){if(this.isModified("password")){let e=await K.toHash(this.get("password"));this.set("password",e)}t()});Be.statics.build=t=>new O(t);var O=lt.model("User",Be);import{BadRequestError as ws}from"@manprtickets/common";var pt=async(t,e,s)=>{if(!t.session?.jwt)return s();try{let r=await dt(t.session.jwt),{id:o,email:n,firstName:m,lastName:a}=ye.parse({...r}),c=await O.findOne({email:n});if(!c)throw new ws("Sorry you are not a valid user in the System");t.currentUser={id:c.id,email:c.email}}catch{}s()};import{errorHandler as In}from"@manprtickets/common";import Ps from"express";import{body as St}from"express-validator";var bs=(t,e)=>{let s=t.currentUser&&ye.safeParse(t.currentUser);s?e.send(s.data):e.send(null)},gt=bs;import{BadRequestError as yt}from"@manprtickets/common";var ks=async(t,e,s)=>{let{email:r,password:o}=t.body,n=await O.findOne({email:r});if(!n)throw new yt("Sorry you entered wrong login Credentials");if(!await K.compare(n.password,o))throw new yt("Invalid Credentials");let a=await ge({id:n.id,email:n.email,firstName:n.firstName,lastName:n.lastName});t.session.jwt=a,e.status(200).send({user:{id:n.id,firstName:n.firstName,lastName:n.lastName,email:n.email,phone:n.phone},token:a})},ft=ks;var Rs=(t,e,s)=>{t.currentUser=void 0,t.session.jwt="",t.session.destroy(r=>{r&&console.log(r),e.send({})})},It=Rs;import{BadRequestError as As}from"@manprtickets/common";var Ts=async(t,e,s)=>{let r=mt.safeParse(t.body);if(!r.success)return e.status(400).send(r.error);let{email:o,password:n,firstName:m,lastName:a,phone:c}=r.data;if(await O.findOne({email:o}))throw new As("Email in use");let d=O.build({email:o,password:n,firstName:m,lastName:a,phone:c});await d.save();let y=await ge({id:d.id,email:d.email,firstName:d.firstName,lastName:d.lastName});t.session.jwt=y,e.status(200).send({user:{id:d.id,firstName:d.firstName,lastName:d.lastName,email:d.email,phone:d.phone},token:y})},ht=Ts;import{validateRequest as qs}from"@manprtickets/common";var xt=async(t,e,s)=>{let r=await O.findById(t.params.id);e.send(r)};var V=Ps.Router();V.get("/currentuser",gt);V.get("/:id",xt);V.post("/signin",[St("email").isEmail().withMessage("Email must be valid"),St("password").trim().notEmpty().withMessage("You must supply a password")],qs,ft);V.post("/signout",It);V.post("/signup",ht);import{requireAuth as Me}from"@manprtickets/common";import Qs from"express";import wt from"mongoose";var j=wt.Schema,Os=["No","Kg","Lts","mm","cm","meter"],Ds=["Product","Equipment","Spare","Package","Category"],ve=new j({itemType:{type:String,enum:Ds,required:!0,index:!0},title:{type:String,required:!0},description:{type:String,required:!0},image:{type:String},userId:{type:j.Types.ObjectId,ref:"User",required:!0}},{discriminatorKey:"itemType",collection:"items",toJSON:{transform(t,e){e.id=e._id,delete e._id}}});ve.statics.build=t=>new f(t);var f=wt.model("Item",ve),Ns=new j({unit:{type:String,enum:Os,required:!0},dimensions:{type:String,required:!0}}),Bs=new j({}),vs=new j({dimensions:{type:String,required:!0}}),Ms=new j({dimensions:{type:String,required:!0}}),_s=new j({dimensions:{type:String,required:!0}});ve.index({title:"text",description:"text",dimensions:"text"});var bt=f.discriminator("Category",Bs),kt=f.discriminator("Product",Ns),Rt=f.discriminator("Equipment",vs),At=f.discriminator("Package",Ms),Tt=f.discriminator("Spare",_s);var Cs=async(t,e,s)=>{let{title:r,unit:o,dimensions:n,description:m,image:a,itemType:c}=t.body,u=null;try{switch(c){case"Product":u=new kt({itemType:c,title:r,description:m,image:a,unit:o,dimensions:n,userId:t.currentUser.id});break;case"Equipment":u=new Rt({itemType:c,title:r,description:m,image:a,dimensions:n,userId:t.currentUser.id});break;case"Category":u=new bt({itemType:c,title:r,description:m,image:a,userId:t.currentUser.id});break;case"Package":u=new At({itemType:c,title:r,description:m,image:a,dimensions:n,userId:t.currentUser.id});break;case"Spare":u=new Tt({itemType:c,title:r,description:m,image:a,dimensions:n,userId:t.currentUser.id});break}await u?.save(),e.status(201).send(u)}catch(d){console.log("errors in creation of item: ",d)}},Pt=Cs;var qt=async(t,e,s)=>{let r,o=t.params.keystr,n=t.params.itemtype,m=f.aggregate([{$match:{itemType:n}},{$addFields:{id:"$_id"}}]);o!=="all"&&(m=f.aggregate([{$match:{itemType:n,$text:{$search:o}}},{$addFields:{id:"$_id"}}]));let a=await m.exec();e.status(200).send(a)},Ot=async(t,e,s)=>{let r=t.params.idstr,o=await f.findById(r);e.status(200).send(o)},Dt=async(t,e,s)=>{let r=t.params.typeStr,o=await f.find({itemType:r},{key:"$_id",label:"$title",_id:0});e.send(o)};import{NotAuthorizedError as Fs,NotFoundError as Us}from"@manprtickets/common";import Es from"validator";var{isEmpty:$s}=Es,Vs=async(t,e,s)=>{let r=t.params.id,{title:o,unit:n,dimensions:m,description:a,image:c,itemType:u}=t.body,d=await f.findOne({_id:r});if(!d)throw new Us;if(d.userId.valueOf()!==t.currentUser.id)throw new Fs;d.set({title:o,description:a,image:$s(c)?d.image:c});try{switch(u){case"Product":d.set({dimensions:m,unit:n});break;case"Equipment":d.set({dimensions:m});break;case"Category":break;case"Package":d.set({dimensions:m});break;case"Spare":d.set({dimensions:m});break}await d.save(),e.status(201).send(d)}catch(y){console.log("errors in updation of item: ",y)}},Nt=Vs;import{NotAuthorizedError as js,NotFoundError as Ls}from"@manprtickets/common";var Bt=async(t,e,s)=>{let r=t.params.id,o=await f.findById(r);if(!o)throw new Ls;if(o.userId.valueOf()!==t.currentUser.id)throw new js;let{deletedCount:n}=await f.deleteOne({_id:r});e.status(201).send(`${n} Item deleted successfully`)};var F=Qs.Router();F.get("/search/:itemtype/:keystr",qt);F.get("/:idstr",Ot);F.get("/select/:typeStr",Dt);F.post("/new",Me,Pt);F.put("/:id",Me,Nt);F.delete("/:id",Me,Bt);import Xs from"express";import{requireAuth as Zs}from"@manprtickets/common";import{NotAuthorizedError as Ks,NotFoundError as Ws,RequestValidationError as Js}from"@manprtickets/common";import Ce from"mongoose";var _e=Ce.Schema,zs=["Product","Equipment","Spare","Package","Category"],Fe=new Ce.Schema({itemid:{type:_e.Types.ObjectId,ref:"Item",required:!0},itemtype:{type:String,enum:zs,required:!0},assignid:{type:_e.Types.ObjectId,ref:"Item",required:!0},assign:{type:String,required:!0},userId:{type:_e.Types.ObjectId,ref:"User",required:!0}},{toJSON:{transform(t,e){e.id=e._id,delete e._id}}});Fe.index({itemid:1,assignid:1},{unique:!0});Fe.statics.build=t=>new W(t);var W=Ce.model("Part",Fe);import Hs from"mongoose";import{MongoBulkWriteError as Gs}from"mongodb";var vt=async(t,e,s)=>{let r=await f.findById(t.params.idStr);if(!r)throw new Ws;if(r.userId.valueOf()!==t.currentUser.id)throw new Ks;let{assignIDs:o,assign:n}=t.body;try{let m=o.map(a=>({itemid:r.id,itemtype:r.itemType,assignid:a,assign:n,userId:t.currentUser.id}));await W.insertMany(m)}catch(m){if(m instanceof Gs&&m.code===11e3)throw Js}e.status(201).send(`selected ${r.itemType} assigned to ${n}`)},Mt=async(t,e,s)=>{let r=t.params.assign;try{let o=await W.aggregate([{$match:{assignid:new Hs.Types.ObjectId(r)}},{$lookup:{from:"items",localField:"assignid",foreignField:"_id",as:"category"}},{$lookup:{from:"items",localField:"itemid",foreignField:"_id",as:"parts"}},{$unwind:"$category"},{$unwind:"$parts"},{$group:{_id:{id:"$category._id",name:"$category.title"},assigned:{$push:{id:"$parts._id",itemType:"$parts.itemType",title:"$parts.title",description:"$parts.description",image:"$parts.image"}}}}]).exec();e.status(201).send(o)}catch(o){console.log("error in assignments: ",o)}};import Ys from"mongoose";var _t=async(t,e,s)=>{try{let r=t.params.assignid,o=t.params.itemtype,n=await W.aggregate([{$match:{$and:[{itemtype:o},{assignid:new Ys.Types.ObjectId(r)}]}},{$project:{itemid:{$toString:"$itemid"},itemtype:1,assignid:{$toString:"$assignid"},assign:1,id:{$toString:"$_id"}}}]);e.status(201).send(n)}catch(r){console.log(r)}};var ce=Xs.Router();ce.get("/:assign",Mt);ce.post("/assign/:idStr",Zs,vt);ce.get("/:itemtype/:assignid",_t);import ro from"express";import{requireAuth as $t}from"@manprtickets/common";import Ue from"mongoose";var Ct=Ue.Schema;var Ft=new Ue.Schema({itemId:{type:Ct.Types.ObjectId,required:!0,ref:"Item"},userId:{type:Ct.Types.ObjectId,ref:"User",required:!0}},{toJSON:{transform(t,e){e.id=e._id,delete e._id}}});Ft.statics.build=t=>new J(t);var J=Ue.model("Like",Ft);var eo=async(t,e,s)=>{try{let r=await J.find({userId:t.currentUser?.id},"itemId userId");e.status(201).send(r)}catch{}},Ut=eo;var to=async(t,e,s)=>{let r={itemId:t.params.itemid,userId:t.currentUser?.id},{deletedCount:o}=await J.deleteMany(r);try{o<=0&&await J.findOneAndUpdate(r,{},{new:!0,upsert:!0})}catch(n){console.log("error in node js: ",n)}e.status(201).send("Successfully updated")},Et=to;var fe=ro.Router();fe.get("/",$t,Ut);fe.patch("/:itemid",$t,Et);import{requireAuth as $e}from"@manprtickets/common";import lo from"express";import*as Lt from"lodash";import Ee from"mongoose";var Vt=Ee.Schema,so=["Product","Equipment","Spare","Package"],oo=["No","Kg","Lts","cm","mm","mtr"],jt=new Ee.Schema({itemid:{type:Vt.Types.ObjectId,ref:"item",required:!0},itemtype:{type:String,enum:so,required:!0},unit:{type:String,enum:oo,required:!0},qtytype:{type:String,default:"Stock",required:!0},quantity:{type:Number,default:0,required:!0},price:{type:Number,default:0,required:!0},gst:{type:Number,default:0,required:!0},discount:{type:Number,default:0,required:!0},userId:{type:Vt.Types.ObjectId,ref:"User",required:!0}},{toJSON:{transform(t,e){e.id=e._id,delete e._id}}});jt.statics.build=t=>new w(t);var w=Ee.model("Stock",jt);var no=async(t,e,s)=>{let{itemid:r,itemtype:o,quantity:n,qtytype:m,unit:a,price:c,gst:u,discount:d}=t.body,y=Lt.upperFirst(o);try{let S=w.build({itemid:r,itemtype:y,quantity:n,qtytype:m,unit:a,price:c,gst:u,discount:d,userId:t.currentUser.id});await S.save(),e.status(201).send(S)}catch(S){console.log("error: ",S)}},Qt=no;import zt from"mongoose";var Kt=async(t,e,s)=>{let r=await w.find({itemtype:"Product"})};var Wt=async(t,e,s)=>{console.log("from stock by item: ",t.params.itemid);let r=await w.find({itemid:new zt.Types.ObjectId(t.params.itemid)});e.send(r)},Jt=async(t,e,s)=>{let r=await w.aggregate([{$match:{itemtype:t.params.itemtype}},{$addFields:{itemid:{$toString:"$itemid"},id:{$toString:"$_id"},userId:{$toString:"$userId"}}},{$project:{_id:0,id:1,itemid:1,quantity:1,qtytype:1,price:1,gst:1,discount:1,userId:1}}]);e.send(r)},Ht=async(t,e,s)=>{let r=await w.findOne({_id:new zt.Types.ObjectId(t.params.id)});e.send(r)};import{NotFoundError as io}from"@manprtickets/common";var ao=async(t,e,s)=>{let{itemid:r,quantity:o,unit:n,price:m,gst:a,discount:c}=t.body,u=await w.findById(r);if(!u)throw new io;u.set({quantity:o,unit:n,price:m,gst:a,discount:c}),await u.save(),e.status(201).send(u)},Gt=ao;import{NotAuthorizedError as co,NotFoundError as mo}from"@manprtickets/common";var uo=async(t,e,s)=>{let r=await w.findById(t.params.id);if(!r)throw new mo;if(r.userId.valueOf()!==t.currentUser.id)throw new co;let{deletedCount:o}=await w.deleteOne({_id:t.params.id});e.status(201).send(`${o} StockItem deleted successfully`)},Yt=uo;var v=lo.Router();v.get("/:id",Ht);v.post("/new",$e,Qt);v.put("/update",$e,Gt);v.delete("/delete/:id",$e,Yt);v.get("/item/:itemid",Wt);v.get("/type/:itemtype",Jt);v.get("/:itemtype",Kt);import{requireAuth as Ie}from"@manprtickets/common";import Ro from"express";import Ve from"mongoose";var Xt=Ve.Schema,po=["Product","Equipment","Spare","Package"],go=["Purchase","Sale","Return","Obsolete","Defective"],yo=["No","Kg","Lts","cm","mm","mtr"],Zt=new Ve.Schema({itemid:{type:Xt.Types.ObjectId,required:!0,ref:"items"},itemtype:{type:String,enum:po,required:!0},unit:{type:String,enum:yo,required:!0},qtytype:{type:String,enum:go,default:"Invoice",required:!0},quantity:{type:Number,default:0,required:!0},price:{type:Number,default:0,required:!0},gst:{type:Number,default:0,required:!0},discount:{type:Number,default:0,required:!0},billtotal:{type:Number,default:0,required:!0},shipping:{type:Number,default:0,required:!0},userId:{type:Xt.Types.ObjectId,ref:"User",required:!0}},{toJSON:{transform(t,e){e.id=e._id,delete e._id}}});Zt.statics.build=t=>new D(t);var D=Ve.model("BillItem",Zt);import fo from"mongoose";var Io=async(t,e,s)=>{let{itemid:r,itemtype:o,quantity:n,unit:m,qtytype:a,price:c,gst:u,discount:d,billtotal:y,shipping:S}=t.body,P=await fo.startSession();P.startTransaction();try{let E=D.build({itemid:r,itemtype:o,quantity:n,qtytype:a,unit:m,price:c,gst:u,discount:d,billtotal:y,shipping:S,userId:t.currentUser.id}),Pe=w.build({itemid:r,itemtype:o,quantity:n,qtytype:"Stock",unit:m,price:c,gst:u,discount:d,userId:t.currentUser.id});await E.save(),await Pe.save(),await P.commitTransaction(),e.status(201).send(E)}catch(E){console.log("error: ",E),await P.abortTransaction()}},er=Io;import ho from"mongoose";var tr=async(t,e,s)=>{let r=await D.find({itemid:t.params.itemid});e.send(r)},rr=async(t,e,s)=>{let r=await D.findOne({_id:new ho.Types.ObjectId(t.params.id)});e.send(r)};import{NotFoundError as xo}from"@manprtickets/common";var So=async(t,e,s)=>{let{itemid:r,quantity:o,unit:n,qtytype:m,price:a,gst:c,discount:u,billtotal:d,shipping:y}=t.body,S=await D.findById(r);if(!S)throw new xo;S.set({quantity:o,unit:n,qtytype:m,price:a,gst:c,discount:u,billtotal:d,shipping:y}),await S.save(),e.status(201).send(S)},sr=So;import{NotAuthorizedError as wo,NotFoundError as bo}from"@manprtickets/common";var ko=async(t,e,s)=>{let r=await D.findById(t.params.id);if(!r)throw new bo;if(r.userId.valueOf()!==t.currentUser.id)throw new wo;let o=await r.deleteOne({_id:t.params.id});e.send(`${o.deletedCount} billItem deleted successfully`)},or=ko;var L=Ro.Router();L.get("/:id",rr);L.get("/item/:itemid",Ie,tr);L.post("/new",Ie,er);L.put("/update",Ie,sr);L.delete("/delete/:id",Ie,or);import{requireAuth as cr}from"@manprtickets/common";import To from"express";import he from"mongoose";var nr=he.Schema;var Ao=new he.Schema({itemid:{type:nr.Types.ObjectId,required:!0,ref:"Item"},quantity:{type:Number,default:0,required:!0},limitQty:{type:Number,default:0,required:!0},price:{type:Number,default:0,required:!0},gst:{type:Number,default:0,required:!0},discount:{type:Number,default:0,required:!0},totalPrice:{type:Number,default:0,required:!0}},{toJSON:{transform(t,e){e.id=e._id,delete e._id}}}),ir=new he.Schema({userId:{type:nr.Types.ObjectId,ref:"User",required:!0},cartitems:{type:[Ao],required:!0},totalQuantity:{type:Number,default:0,required:!0}},{toJSON:{transform(t,e){e.id=e._id,delete e._id}}});ir.statics.build=t=>new H(t);var H=he.model("Cart",ir);var ar=async(t,e,s)=>{let r=await H.findOne({userId:t.currentUser?.id});if(!r)try{let o=H.build({userId:t.currentUser?.id,cartitems:[],totalQuantity:0});return await o.save(),e.send(o)}catch(o){console.log("created errors: ",o)}e.send(r)},dr=async(t,e,s)=>{let{cartitems:r,totalQuantity:o}=t.body,m={userId:t.currentUser?.id},{deletedCount:a}=await H.deleteMany(m);try{await H.findOneAndUpdate(m,{cartitems:r,totalQuantity:o},{new:!0,upsert:!0})}catch(c){console.log("error in node js: ",c)}e.status(201).send("Successfully replaced cart")};var xe=To.Router();xe.get("/",cr,ar);xe.post("/",cr,dr);import{requireAuth as U}from"@manprtickets/common";import cn from"express";import G from"mongoose";var Se=G.Schema,Po=new G.Schema({itemid:{type:Se.Types.ObjectId,required:!0,ref:"Item"},orderId:{type:Se.Types.ObjectId,ref:"Order",required:!0},quantity:{type:Number,default:0,required:!0},price:{type:Number,default:0,required:!0},gst:{type:Number,default:0,required:!0},discount:{type:Number,default:0,required:!0},totalPrice:{type:Number,default:0,required:!0}},{toJSON:{transform(t,e){e.id=e._id,delete e._id}}}),mr=new G.Schema({userId:{type:Se.Types.ObjectId,ref:"User",required:!0},status:{type:String,required:!0,enum:Object.values(Q),default:"Created"},items:{type:[Po]},orderDate:{type:G.Schema.Types.Date,required:!0},expiresAt:{type:G.Schema.Types.Date},totalQuantity:{type:Number,default:0,required:!0},orderValue:{type:Number,default:0,required:!0},shipId:{type:Se.Types.ObjectId,ref:"Address"}},{toJSON:{transform(t,e){e.id=e._id,delete e._id,e.discTotal=Number(e.items.reduce((s,r)=>s+r.price*r.discount/100,0).toFixed(2)),e.gstTotal=Number(e.items.reduce((s,r)=>s+(r.price-r.price*(r.discount/100))*(r.gst/100),0).toFixed(2))}}});mr.statics.build=t=>new R(t);var R=G.model("Order",mr);import{NotAuthorizedError as qo,NotFoundError as Oo}from"@manprtickets/common";var Do=async(t,e,s)=>{let r=await R.findById(t.params.orderid);if(!r)throw new Oo;if(r.userId.valueOf()!==t.currentUser.id)throw new qo;let o=await R.deleteOne({_id:t.params.orderid});e.send({message:`${o.deletedCount} order deleted successfully`})},ur=Do;import je from"mongoose";var No=je.Schema,lr=new je.Schema({userId:{type:No.Types.ObjectId,ref:"User",required:!0},email:{type:String,required:!0},receiver:{type:String,required:!0},house:{type:String,required:!0},street:{type:String,required:!0},pincode:{type:String,required:!0},city:{type:String,required:!0},phone:{type:String,required:!0}},{toJSON:{transform(t,e){e.id=e._id,delete e._id}}});lr.statics.build=t=>new M(t);var M=je.model("Address",lr);import xc from"lodash";var pr=async(t,e,s)=>{try{let r=await R.find({userId:t.currentUser?.id,status:"Complete"});e.status(201).send(r)}catch(r){console.log(r)}};var gr=async(t,e,s)=>{try{let r=await R.findById({_id:t.params.orderid});e.status(201).send(r)}catch(r){console.log(r)}},yr=async(t,e,s)=>{let r=await M.find({userId:t.currentUser?.id});e.status(201).send(r)},fr=async(t,e,s)=>{let r=await M.findById(t.params.id);e.send(r)};var Ir=async(t,e,s)=>{let{cart:{cartitems:o,totalQuantity:n},value:m}=t.body,a=new Date;a.setSeconds(a.getSeconds()+900);let c=new R({userId:t.currentUser.id,status:"Created",orderDate:new Date,orderValue:m,expiresAt:a,items:[],totalQuantity:n,shipId:void 0}),u=o.map(d=>({itemid:d.itemid,orderId:c._id,quantity:d.quantity,price:d.price,gst:d.gst,discount:d.discount,totalPrice:d.totalPrice}));c.items=u,await c.save(),e.send(c)},hr=async(t,e,s)=>{let{email:r,receiver:o,phone:n,house:m,street:a,pincode:c,city:u}=t.body,d=new M({userId:t.currentUser.id,email:r,receiver:o,house:m,street:a,city:u,pincode:c,phone:n});try{await d.save()}catch(y){console.log("error: ",y)}e.send({shipId:d.id})};import{NotAuthorizedError as wr,NotFoundError as Qe}from"@manprtickets/common";import xr from"mongoose";var Sr=new xr.Schema({orderId:{required:!0,type:String},stripeId:{required:!0,type:String},amount:{type:Number,default:0,required:!0}},{toJSON:{transform(t,e){e.id=e._id,delete e._id}}});Sr.statics.build=t=>new Le(t);var Le=xr.model("Payment",Sr);var br=async(t,e,s)=>{let r=await R.findById(t.params.orderid);if(!r)throw new Qe;if(r.userId.valueOf()!==t.currentUser.id)throw new wr;r.set({status:t.body.status}),await r.save(),e.send({message:"Order udpated successfully"})},kr=async(t,e,s)=>{let{shipping:r}=t.body,o=await R.findById(t.params.orderid);if(!o)throw new Qe;if(o.userId.valueOf()!==t.currentUser.id)throw new wr;let{id:n,email:m,receiver:a,phone:c,house:u,street:d,pincode:y,city:S}=r,P=null,E=!1;if(n&&n!==""){if(P=await M.findById(n),!P)throw new Qe;E=!0}else P=new M({userId:t.currentUser.id,email:m,receiver:a,house:u,street:d,city:S,pincode:y,phone:c});let Pe=new Le({orderId:o.id,stripeId:"adfbbc2332",amount:o.orderValue});o.set({shipId:P?.id,status:"Complete"}),E||await P.save(),await o.save(),await Pe.save(),e.send({message:"Order completed successfully"})};import{Document as tn,Page as rn,View as Ge}from"@react-pdf/renderer";import{Font as Bo,StyleSheet as vo}from"@react-pdf/renderer";Bo.register({family:"Oswald",src:"https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf"});var Mo=vo.create({page:{fontSize:11,paddingTop:35,paddingBottom:35,paddingHorizontal:35,lineHeight:1.5,flexDirection:"column"},titleRow:{display:"flex",width:"100%",height:70,borderBottomWidth:1,flexDirection:"column",justifyContent:"center",alignItems:"center"},tableRow:{display:"flex",width:"100%",height:350,borderWidth:1,flexDirection:"column"},theadRow:{display:"flex",width:"100%",height:"55",flexDirection:"row"},tbodyRow:{display:"flex",width:"100%",height:30,flexDirection:"row"},tfootRow:{display:"flex",flexDirection:"row",width:"100%",height:"50",justifyContent:"flex-end"},signRow:{display:"flex",flexDirection:"row",width:"100%",height:"90",justifyContent:"flex-end"},tcells:{borderWidth:1,width:40,fontFamily:"Times-Roman",justifyContent:"center",alignItems:"center"},tcellxl:{borderWidth:1,width:"130",fontFamily:"Times-Roman",justifyContent:"center",alignItems:"center"},tcelll:{borderWidth:1,width:"80",fontFamily:"Times-Roman",justifyContent:"center",alignItems:"center"},tcellm:{borderWidth:1,width:"70",fontFamily:"Times-Roman",justifyContent:"center",alignItems:"center"},bigSize:{fontSize:18,fontWeight:"bold",fontFamily:"Oswald"},orderNumRow:{flexDirection:"row",width:"100%",justifyContent:"space-between",height:30,marginTop:10},addressRow:{flexDirection:"row",width:"100%",justifyContent:"space-between",height:110},text:{margin:4,fontSize:12,textAlign:"left",fontFamily:"Times-Roman"},addresstext:{margin:2,fontSize:11,textAlign:"left",fontFamily:"Times-Roman",lineHeight:"1"},theadText:{margin:8,fontSize:11,fontWeight:"bold",textAlign:"left",fontFamily:"Times-Roman"},subHead:{fontSize:13,fontFamily:"Oswald",marginVertical:5,textAlign:"left"},footText:{fontSize:9},pageNumber:{position:"absolute",fontSize:12,bottom:30,left:0,right:0,textAlign:"center",color:"grey"},footnote:{flexDirection:"row",position:"absolute",justifyContent:"space-between",bottom:0,left:10,right:10,color:"grey"}}),i=Mo;import{Text as Rr,View as _o}from"@react-pdf/renderer";import{jsx as Ar,jsxs as Fo}from"react/jsx-runtime";var Co=()=>Fo(_o,{style:i.footnote,fixed:!0,children:[Ar(Rr,{style:i.footText,children:"Through ManPrema App"}),Ar(Rr,{style:i.footText,children:"@toji_chettan_company"})]}),Tr=Co;import{Text as Vo,View as ze}from"@react-pdf/renderer";import{View as Uo,Image as Eo}from"@react-pdf/renderer";import{jsx as Pr}from"react/jsx-runtime";var $o=()=>Pr(Uo,{style:{flexDirection:"row",alignItems:"center"},children:Pr(Eo,{src:"./assets/icon.jpg",style:{height:50,width:50},fixed:!0})}),qr=$o;import{jsx as we,jsxs as Lo}from"react/jsx-runtime";var jo=({name:t})=>we(ze,{style:i.titleRow,children:Lo(ze,{style:{flexDirection:"row",justifyContent:"space-between",width:"100%",alignContent:"center"},children:[we(qr,{}),we(ze,{style:{justifyContent:"flex-end"},children:we(Vo,{style:i.bigSize,children:t})})]})}),Or=jo;import{Text as Dr,View as Qo}from"@react-pdf/renderer";import{jsx as Nr,jsxs as Ko}from"react/jsx-runtime";var zo=({name:t,num_fld:e,date_fld:s,style:r})=>Ko(Qo,{style:[{flexDirection:"column",width:"50%"},r],children:[Nr(Dr,{children:`${t} No: ${e}`}),Nr(Dr,{children:`${t} Date: ${s}`})]}),Ke=zo;var We=t=>`${t.getDate()}-${t.getMonth()+1}-${t.getFullYear()}`,Je=(t,e)=>t.length>e?t.slice(0,e):t;import{Text as Y,View as Br}from"@react-pdf/renderer";import{jsx as X,jsxs as vr}from"react/jsx-runtime";var Wo=({name:t,address:e})=>vr(Br,{style:{flexDirection:"column",width:"33%",height:"160px"},children:[X(Y,{style:i.subHead,children:t}),vr(Br,{children:[X(Y,{style:i.addresstext,children:e.receiver}),X(Y,{style:i.addresstext,children:e.house}),X(Y,{style:i.addresstext,children:e.street}),X(Y,{style:i.addresstext,children:e.city}),X(Y,{style:i.addresstext,children:e.pincode})]})]}),be=Wo;import{Text as _,View as N}from"@react-pdf/renderer";import{jsx as h,jsxs as Ho}from"react/jsx-runtime";var Jo=()=>Ho(N,{style:i.theadRow,children:[h(N,{style:i.tcells,children:h(_,{style:i.theadText,children:"Sl. No."})}),h(N,{style:i.tcellxl,children:h(_,{style:i.theadText,children:"Description"})}),h(N,{style:i.tcells,children:h(_,{style:i.theadText,children:"Unit Price"})}),h(N,{style:i.tcells,children:h(_,{style:i.theadText,children:"Qty"})}),h(N,{style:i.tcellm,children:h(_,{style:i.theadText,children:"Net Amt"})}),h(N,{style:i.tcells,children:h(_,{style:i.theadText,children:"Tax Rate"})}),h(N,{style:i.tcells,children:h(_,{style:i.theadText,children:"Tax Type"})}),h(N,{style:i.tcellm,children:h(_,{style:i.theadText,children:"Tax Amt"})}),h(N,{style:i.tcellm,children:h(_,{style:i.theadText,children:"Total Amt"})})]}),Mr=Jo;import{Text as C,View as q}from"@react-pdf/renderer";import{jsx as I,jsxs as Yo}from"react/jsx-runtime";var Go=({items:t})=>I(q,{style:{flexDirection:"column"},children:t.map((e,s)=>Yo(q,{style:i.tbodyRow,children:[I(q,{style:i.tcells,children:I(C,{style:i.text,children:s+1})}),I(q,{style:i.tcellxl,children:I(C,{style:i.text,children:e.orderitem.title})}),I(q,{style:i.tcells,children:I(C,{style:i.text,children:e.price})}),I(q,{style:i.tcells,children:I(C,{style:i.text,children:e.quantity})}),I(q,{style:i.tcellm,children:I(C,{style:i.text,children:e.totalPrice})}),I(q,{style:i.tcells,children:I(C,{style:i.text,children:e.gst})}),I(q,{style:i.tcells,children:I(C,{style:i.text,children:"CGST"})}),I(q,{style:i.tcellm,children:I(C,{style:i.text,children:e.discount})}),I(q,{style:i.tcellm,children:I(C,{style:i.text,children:e.totalPrice})})]},e.orderitem.id))}),_r=Go;import{Text as Z,View as B}from"@react-pdf/renderer";import{jsx as A,jsxs as ke}from"react/jsx-runtime";var Xo=({total:t,discount:e,taxTotal:s})=>ke(B,{style:i.tfootRow,children:[ke(B,{style:{flexDirection:"column"},children:[A(B,{style:i.tcellm,children:A(Z,{style:i.theadText,children:"Disc Total"})}),A(B,{style:i.tcellm,children:A(Z,{style:i.text,children:e})})]}),ke(B,{style:{flexDirection:"column"},children:[A(B,{style:i.tcellm,children:A(Z,{style:i.theadText,children:"Tax Total"})}),A(B,{style:i.tcellm,children:A(Z,{style:i.text,children:s})})]}),ke(B,{style:{flexDirection:"column"},children:[A(B,{style:i.tcelll,children:A(Z,{style:i.theadText,children:"Grand Total"})}),A(B,{style:i.tcelll,children:A(Z,{style:i.text,children:t})})]})]}),Cr=Xo;import{Text as Fr,View as Ur}from"@react-pdf/renderer";import{jsx as He,jsxs as en}from"react/jsx-runtime";var Zo=()=>He(Ur,{style:i.signRow,children:en(Ur,{style:{flexDirection:"column",justifyContent:"space-between",width:"150"},children:[He(Fr,{style:[i.text,{textAlign:"right"}],children:"For ManPrema Inc"}),He(Fr,{style:[i.text,{textAlign:"right",fontWeight:"bold",fontSize:13}],children:"Authorized Signatory"})]})}),Er=Zo;import{jsx as T,jsxs as Re}from"react/jsx-runtime";var sn=({order:t})=>{let e={id:"dummyid",email:"dummyemail",receiver:"ManPrema Inc",phone:"dummyphone",house:"ManPrema House",street:"Seattle Street",pincode:"101201",city:"Navi Mumbai"};return T(tn,{children:Re(rn,{size:"A4",style:i.page,children:[T(Or,{name:"Original Tax Invoice/ Bill of Supply/ Cash Memo"}),Re(Ge,{style:i.orderNumRow,children:[T(Ke,{name:"Order",num_fld:Je(t.id,10),date_fld:We(t.orderDate),style:{alignItems:"flex-start"}}),T(Ke,{name:"Invoice",num_fld:Je(t.id,10),date_fld:We(t.orderDate),style:{alignItems:"flex-end"}})]}),Re(Ge,{style:i.addressRow,children:[T(be,{name:"Sold By",address:e}),T(be,{name:"Shipping",address:t.shipping}),T(be,{name:"Billing",address:t.shipping})]}),Re(Ge,{style:i.tableRow,children:[T(Mr,{}),T(_r,{items:t.items}),T(Cr,{total:t.orderValue,discount:t.discTotal,taxTotal:t.gstTotal})]}),T(Er,{}),T(Tr,{})]})})},Ye=sn;import{renderToFile as on,renderToStream as nn}from"@react-pdf/renderer";import $r from"node-fetch";function Xe(t){return JSON.stringify({query:`query OrderByID($orderid: ID!) {
      orderByID(orderid: $orderid) {
        id
        userId
        status
        orderDate
        totalQuantity
        orderValue
        discTotal
        gstTotal
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
          gst
          discount
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
    }`,variables:{orderid:t}})}import{fileURLToPath as an}from"url";import Ae from"path";import{jsx as Lr}from"react/jsx-runtime";var{dirname:dn}=Ae,Vr=async(t,e,s)=>{let r=Xe(t.params.orderid),n=await(await $r(`${g.API_URL}/graphql`,{method:"POST",body:r,headers:{"Content-Type":"application/json",usertoken:t.session?.jwt}})).json();if(!n)return e.status(404).send("Order not found");let m=n?.data.orderByID,a=Ne.safeParse(m);if(!a.success)return console.log(a.error),e.status(400).send("Invalid order data");let c=await nn(Lr(Ye,{order:a.data}));e.setHeader("Content-Type","application/pdf"),e.setHeader("Content-Disposition",'attachment; filename="order-doc.pdf"'),c.pipe(e),c.on("end",()=>console.log("Done streaming, response sent"))},jr=async(t,e,s)=>{try{let r=Xe(t.params.orderid),n=await(await $r(`${g.API_URL}/graphql`,{method:"POST",body:r,headers:{"Content-Type":"application/json",usertoken:t.session?.jwt}})).json();if(!n)return e.status(404).send("Order not found");let m=n?.data.orderByID,a=Ne.safeParse(m);if(!a.success)return console.log(a.error),e.status(400).send("Invalid order data");let c=an(import.meta.url),u=dn(c),d=Ae.join(u,"temp_files"),y=Ae.join(d,"order-doc.pdf"),S=Ae.relative(process.cwd(),y);await on(Lr(Ye,{order:a.data}),y);let P={id:t.params.orderid,filename:"order-doc.pdf",fileurl:S};e.send(P)}catch(r){return console.log("error in process: ",r),{id:t.params.orderid,filename:"error",fileurl:"error url"}}};var k=cn.Router();k.get("/",U,pr);k.get("/address",U,yr);k.get("/address/:id",fr);k.get("/:orderid",gr);k.get("/genpdf/:orderid",jr);k.get("/downpdf/:orderid",U,Vr);k.post("/",U,Ir);k.post("/address",U,hr);k.patch("/complete/:orderid",U,kr);k.patch("/:orderid",U,br);k.delete("/:orderid",U,ur);var Kr={origin:"*",methods:["POST","PUT","GET","OPTIONS","HEAD","DELETE","PATCH"],credentials:!0},x=Te();x.use(Te.json());x.use(Te.urlencoded({extended:!0}));var Ze=`mongodb+srv://${g.MONGO_USER}:${g.MONGO_PASSWORD}@cluster0.q4wsrjb.mongodb.net/${g.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority&appName=Cluster0`;x.use(pn(g.JWT_KEY));var Qr=mn.createServer(x);x.use(zr(Kr));x.use(un({secret:[process.env.JWT_KEY],resave:!1,saveUninitialized:!1,store:ln.create({mongoUrl:Ze,ttl:480*60,autoRemove:"interval",autoRemoveInterval:5})}));x.use((t,e,s)=>{let r=t.headers.usertoken;!t.session?.jwt&&r&&(t.session.jwt=r),e.header("Access-Control-Allow-Origin",t.headers.origin),e.header("Access-Control-Allow-Methods","OPTIONS, GET, POST, PUT, PATCH, DELETE"),e.setHeader("Access-Control-Allow-Credentials","true"),e.header("Access-Control-Allow-Headers","Origin X-Requested-With, Content-Type, Accept, Authorization"),s()});x.use(pt);x.use("/api/users",V);x.use("/api/item",F);x.use("/api/part",ce);x.use("/api/like",fe);x.use("/api/stock",v);x.use("/api/invoice",L);x.use("/api/cart",xe);x.use("/api/order",k);x.use(In);var Wr=async()=>{let t=new yn({typeDefs:et,resolvers:{Date:{...tt.Date},...st},plugins:[fn({httpServer:Qr})]});await t.start(),x.use("/graphql",zr(Kr),Te.json(),gn(t,{context:async({req:e})=>{let s=e.headers.usertoken,{cache:r}=t;return{token:s,dataSources:{trackAPI:new me({cache:r}),itemAPI:new ee({cache:r,token:s}),partAPI:new te({cache:r,token:s}),stockAPI:new re({cache:r,token:s}),billAPI:new se({cache:r,token:s}),authAPI:new oe({cache:r,token:s}),cartAPI:new ne({cache:r,token:s}),orderAPI:new ie({cache:r,token:s})}}}})),Qr.listen(g.PORT||8080,()=>{console.log(`\u{1F680} Server ready at ${process.env.PORT}`)})};import hn from"mongoose";var xn=async()=>{await hn.connect(Ze).then(t=>(console.log("Connected to MongoDB"),t)).catch(t=>{console.log(t)})};xn();Wr();
