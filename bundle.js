import"dotenv/config";import{z as E}from"zod";var zr=E.object({PORT:E.string(),MONGO_USER:E.string(),MONGO_PASSWORD:E.string(),MONGO_DEFAULT_DATABASE:E.string(),JWT_KEY:E.string(),API_URL:E.string()}).required(),Ae=zr.safeParse(process.env);if(!Ae.success){let t=Ae.error.issues.map(e=>`${e.path.join(".")} ${e.message}`).join(", ");throw new Error(t)}var g=Ae.data;import Vr from"express";import sn from"http";import on from"express-session";import nn from"connect-mongo";import an from"body-parser";import{RESTDataSource as Kr}from"@apollo/datasource-rest";var ce=class extends Kr{baseURL="https://odyssey-lift-off-rest-api.herokuapp.com/";getTracksForHome(){return this.get("tracks")}getAuthor(e){return this.get(`author/${e}`)}getTrack(e){return this.get(`track/${e}`)}getTrackModules(e){return this.get(`track/${e}/modules`)}getModule(e){return this.get(`module/${e}`)}incrementTrackViews(e){return this.patch(`track/${e}/numberOfViews`)}};import{RESTDataSource as Wr}from"@apollo/datasource-rest";var Z=class extends Wr{baseURL=`${g.API_URL}/api/`;token;constructor(e){super(e),this.token=e.token}willSendRequest(e,s){s.headers.usertoken=this.token}async getItemsBySearch(e,s){let r=e||"all",o=s;return await this.get(`item/search/${s}/${r}/`)}async getItemById(e){return await this.get(`item/${e}`)}async getPart(e){return await this.get(`item/${e}`)}async getItemsByType(e){return await this.get(`item/select/${e}`)}async getAssignments(e){return await this.get(`part/${e}`)}async getAssignedParts(e,s){return await this.get(`part/${s}/${e}`)}async getLikes(){return await this.get("like/")}async changeLike(e){try{return await this.patch(`like/${e}`)}catch(s){return console.log("graphql error: ",s?.extensions),null}}async createAssignments(e){try{return await this.post(`part/assign/${e.id}`,{body:e})}catch(s){return console.log("graphql error: ",s?.extensions),null}}async createItem(e){try{return await this.post("item/new",{body:e})}catch(s){return console.log("graphql error: ",s?.extensions),null}}async updateItem(e){try{return await this.put(`item/${e.id}`,{body:e})}catch(s){return console.log("graphql error: ",s?.extensions),null}}async deleteItem(e){try{return await this.delete(`item/${e}`)}catch(s){return console.log("graphql error: ",s?.extensions),null}}};import{RESTDataSource as Jr}from"@apollo/datasource-rest";var ee=class extends Jr{baseURL=`${g.API_URL}/api/`;token;constructor(e){super(e),this.token=e.token}willSendRequest(e,s){s.headers.usertoken=this.token}};import{RESTDataSource as Gr}from"@apollo/datasource-rest";var te=class extends Gr{baseURL=`${g.API_URL}/api/`;token;constructor(e){super(e),this.token=e.token}willSendRequest(e,s){s.headers.usertoken=this.token}async getStockById(e){return await this.get(`stock/${e}`)}async getStockByItemId(e){return await this.get(`stock/item/${e}`)}async getStockByItemType(e){return await this.get(`stock/type/${e}`)}async createStock(e){try{return await this.post("stock/new",{body:e})}catch(s){return console.log("graphql error: ",s?.extensions),null}}async updateStock(e){try{return await this.put("stock/update",{body:e})}catch(s){return console.log("graphql error: ",s?.extensions),null}}async deleteStock(e){try{return await this.delete(`stock/delete/${e}`)}catch(s){return console.log("graphql error: ",s?.extensions),null}}};import{RESTDataSource as Hr}from"@apollo/datasource-rest";var re=class extends Hr{baseURL=`${g.API_URL}/api/`;token;constructor(e){super(e),this.token=e.token}willSendRequest(e,s){s.headers.usertoken=this.token}async getBillById(e){return await this.get(`invoice/${e}`)}async getBillByItemId(e){return await this.get(`invoice/item/${e}`)}async createBill(e){try{return await this.post("invoice/new",{body:e})}catch(s){return console.log("graphql error: ",s?.extensions),null}}async updateBill(e){try{return await this.put("invoice/update",{body:e})}catch(s){return console.log("graphql error: ",s?.extensions),null}}async deleteBill(e){try{return await this.delete(`invoice/delete/${e}`)}catch(s){return console.log("graphql error: ",s?.extensions),null}}};import{RESTDataSource as Yr}from"@apollo/datasource-rest";var se=class extends Yr{baseURL=`${g.API_URL}/api/`;token;constructor(e){super(e),this.token=e.token}willSendRequest(e,s){s.headers.usertoken=this.token}async getCurrentUser(){return await this.get("users/currentuser")}async signin(e){try{return await this.post("users/signin",{body:e})}catch(s){return console.log("graphql error: ",s?.extensions),null}}async signup(e){try{return await this.post("users/signup",{body:e})}catch(s){return console.log("graphql error: ",s?.extensions),null}}async signout(){try{return await this.post("users/signout")}catch{return null}}};import{RESTDataSource as Xr}from"@apollo/datasource-rest";var oe=class extends Xr{baseURL=`${g.API_URL}/api/`;token;constructor(e){super(e),this.token=e.token}willSendRequest(e,s){s.headers.usertoken=this.token}async getCartUser(){return await this.get("cart/")}async replaceCart(e,s){try{return await this.post("cart/",{body:{cartitems:e,totalQuantity:s}})}catch(r){return console.log("graphql error: ",r?.extensions),null}}};import{RESTDataSource as Zr}from"@apollo/datasource-rest";var ne=class extends Zr{baseURL=`${g.API_URL}/api/`;token;constructor(e){super(e),this.token=e.token}willSendRequest(e,s){s.headers.usertoken=this.token}async getUserAddresses(){return await this.get("order/address/")}async getAddress(e){return await this.get(`order/address/${e}`)}async getUserOrders(){return await this.get("order/")}async getOrder(e){return await this.get(`order/${e}`)}async getOrderPdf(e){return await this.get(`order/genpdf/${e}`)}async createOrder(e,s){try{return await this.post("order/",{body:{cart:e,value:s}})}catch(r){return console.log("graphql error: ",r?.extensions),null}}async updateOrder(e,s){try{return await this.patch(`order/${e}`,{body:{status:s}})}catch(r){return console.log("graphql error: ",r?.extensions),null}}async cancelOrder(e){try{return await this.delete(`order/${e}`)}catch(s){return console.log("graphql error: ",s?.extensions),null}}async completeOrder(e,s){try{return await this.patch(`order/complete/${e}`,{body:{shipping:s}})}catch(r){return console.log("graphql error: ",r?.extensions),null}}async createAddress(e){try{return await this.post("order/address",{body:{input:e}})}catch(s){return console.log("graphql error: ",s?.extensions),null}}};import jr from"cors";import dn from"cookie-parser";import{expressMiddleware as cn}from"@as-integrations/express4";import{ApolloServer as mn}from"@apollo/server";import{ApolloServerPluginDrainHttpServer as un}from"@apollo/server/plugin/drainHttpServer";import{gql as es}from"graphql-tag";var Ye=es`
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
`;import{GraphQLScalarType as ts,Kind as rs}from"graphql";var ss=new ts({name:"Date",description:"Date custom scalar type",serialize(t){if(t instanceof Date)return t.getTime();throw Error("GraphQL Date Scalar serializer expected a `Date` object")},parseValue(t){if(typeof t=="number")return new Date(t);throw new Error("GraphQL Date Scalar parser expected a `number`")},parseLiteral(t){return t.kind===rs.INT?new Date(parseInt(t.value,10)):null}}),Xe={Date:{date:ss}};var Te={Query:{currentUser:(t,e,{dataSources:s})=>s.authAPI.getCurrentUser()},Mutation:{signin:async(t,{input:e},{dataSources:s})=>{try{let r=await s.authAPI.signin(e);if(!r)return{code:401,success:!1,message:"Invalid credentials",user:void 0,token:""};let{user:o,token:n}=r;return{code:200,success:!0,message:"Signed In successfully",user:o,token:n}}catch(r){return{code:r.extensions.response.status,success:!1,message:r.extensions.response.body,user:void 0,token:""}}},signup:async(t,{input:e},{dataSources:s})=>{try{let r=await s.authAPI.signup(e);if(!r)return{code:401,success:!1,message:"Invalid credentials",user:void 0,token:""};let{user:o,token:n}=r;return{code:200,success:!0,message:"Signed Up successfully",user:o,token:n}}catch(r){return{code:r.extensions.response.status,success:!1,message:r.extensions.response.body,user:void 0,token:""}}},signout:async(t,e,{dataSources:s})=>{try{return await s.authAPI.signout(),{code:200,success:!0,message:"Signed out"}}catch(r){return{code:r.extensions.response.status,success:!1,message:r.extensions.response.body}}}}};var Pe={Query:{billById:(t,{billid:e},{dataSources:s})=>s.billAPI.getBillById(e),billByItemId:(t,{itemid:e},{dataSources:s})=>s.billAPI.getBillByItemId(e)},Mutation:{createBill:async(t,{input:e},{dataSources:s})=>{try{return{code:200,success:!0,message:"Bill created successfully",item:await s.billAPI.createBill(e)}}catch(r){return{code:r.extensions.response.status,success:!1,message:r.extensions.response.body,item:null}}},updateBill:async(t,{input:e},{dataSources:s})=>{try{return{code:200,success:!0,message:"Bill updated successfully",item:await s.billAPI.updateBill(e)}}catch(r){return{code:r.extensions.response.status,success:!1,message:r.extensions.response.body,item:null}}},deleteBill:async(t,{billId:e},{dataSources:s})=>{try{return{code:200,success:!0,message:"Bill deleted successfully",item:await s.billAPI.deleteBill(e)}}catch(r){return{code:r.extensions.response.status,success:!1,message:r.extensions.response.body,item:""}}}}};var me={Query:{cartUser:(t,e,{dataSources:s})=>s.cartAPI.getCartUser()},CartItem:{item:({itemid:t},e,{dataSources:s})=>s.itemAPI.getPart(t)},Mutation:{replaceCart:async(t,{input:e},{dataSources:s})=>{if(!e)throw new Error("Input is required");let{cartitems:r,totalQuantity:o}=e;try{let n=await s.cartAPI.replaceCart(r,o);return{code:200,success:!0,message:"Cart replaced successfully"}}catch(n){return{code:n.extensions.response.status,success:!1,message:n.extensions.response.body}}}}};import{z as p}from"zod";var Q=(o=>(o.Created="Created",o.Cancelled="Cancelled",o.AwaitingPayment="Awaiting:payment",o.Complete="Complete",o))(Q||{});var z=p.object({message:p.string()}),os=p.object({id:p.string().transform(t=>t&&void 0),email:p.string(),receiver:p.string(),phone:p.string(),house:p.string(),street:p.string(),city:p.string(),pincode:p.string()}),Ze=(n=>(n.Product="Product",n.Spare="Spare",n.Equipment="Equipment",n.Package="Package",n.Category="Category",n))(Ze||{}),O=p.coerce.number().min(.01).max(1e3).nonnegative().multipleOf(.01),ue=p.string().min(6),ns=p.object({id:p.string(),itemType:p.enum(Ze),title:ue,image:ue,description:ue,unit:p.string().optional(),dimensions:ue.optional(),quantity:O.optional(),price:O.optional(),totalPrice:O.optional(),gst:O.optional(),discount:O.optional()}),is=p.object({orderitem:ns,orderId:p.string().optional(),quantity:O,price:O,totalPrice:O}),Oe=p.object({id:p.string(),status:p.enum(Q),items:p.array(is),orderDate:p.coerce.date(),totalQuantity:O,orderValue:O,shipping:os});var ie={Query:{itemsBySearch:(t,{search:e,itemType:s},{dataSources:r})=>r.itemAPI.getItemsBySearch(e,s),itemById:(t,{id:e},{dataSources:s})=>s.itemAPI.getItemById(e),itemsByType:(t,{itemType:e},{dataSources:s})=>s.itemAPI.getItemsByType(e),assignments:(t,{assign:e},{dataSources:s})=>s.itemAPI.getAssignments(e),assignedParts:(t,{assignid:e,itemtype:s},{dataSources:r})=>r.itemAPI.getAssignedParts(e,s),likes:(t,e,{dataSources:s})=>s.itemAPI.getLikes()},Part:{partitem:({itemid:t},e,{dataSources:s})=>s.itemAPI.getPart(t),assignparent:({assignid:t},e,{dataSources:s})=>s.itemAPI.getPart(t)},LikeItem:{item:({itemId:t},e,{dataSources:s})=>s.itemAPI.getPart(t)},Mutation:{createAssignments:async(t,{input:e},{dataSources:s})=>{try{return{code:200,success:!0,message:"Items assignments created successfully",item:await s.itemAPI.createAssignments(e)}}catch(r){return{code:r.extensions.response.status,success:!1,message:r.extensions.response.body,item:"Assignments failed"}}},createItem:async(t,{input:e},{dataSources:s,token:r})=>{try{return{code:200,success:!0,message:"Item created successfully",item:await s.itemAPI.createItem(e)}}catch(o){return{code:o.extensions.response.status,success:!1,message:o.extensions.response.body,item:null}}},updateItem:async(t,{input:e},{dataSources:s})=>{try{return{code:200,success:!0,message:"Item updated successfully",item:await s.itemAPI.updateItem(e)}}catch(r){return{code:r.extensions.response.status,success:!1,message:r.extensions.response.body,item:null}}},deleteItem:async(t,{id:e},{dataSources:s})=>{try{return{code:200,success:!0,message:"Item deleted successfully",item:await s.itemAPI.deleteItem(e)}}catch(r){return{code:r.extensions.response.status,success:!1,message:r.extensions.response.body,item:""}}},like:async(t,{itemId:e},{dataSources:s})=>{try{let r=await s.itemAPI.changeLike(e),o=z.safeParse(r);return{code:200,success:!0,message:o.success?o.data.message:"Invalid return message"}}catch(r){return console.error("Error updating order:",r),{code:r.extensions?.response?.status||500,success:!1,message:r.extensions?.response?.body||"Internal Server Error"}}}}};var ae={Query:{userAddresses:(t,e,{dataSources:s})=>s.orderAPI.getUserAddresses(),userOrders:(t,e,{dataSources:s})=>s.orderAPI.getUserOrders(),orderByID:(t,{orderid:e},{dataSources:s})=>s.orderAPI.getOrder(e),generateOrderPdf:(t,{orderid:e},{dataSources:s})=>s.orderAPI.getOrderPdf(e)},OrderItem:{orderitem:({itemid:t},e,{dataSources:s})=>s.itemAPI.getPart(t)},OrderEntry:{shipping:async({shipId:t},e,{dataSources:s})=>{if(!t)return null;let r=t.toString();return s.orderAPI.getAddress(r)}},Mutation:{createOrder:async(t,{cart:e,value:s},{dataSources:r})=>{try{return{code:200,success:!0,message:"Order created successfully",order:await r.orderAPI.createOrder(e,s)}}catch(o){return console.error("Error creating order:",o),{code:o.extensions?.response?.status||500,success:!1,message:o.extensions?.response?.body||"Internal Server Error",order:null}}},updateOrder:async(t,{orderid:e,status:s},{dataSources:r})=>{try{let o=await r.orderAPI.updateOrder(e,s),n=z.safeParse(o);return{code:200,success:!0,message:n.success?n.data.message:"Invalid return message"}}catch(o){return console.error("Error updating order:",o),{code:o.extensions?.response?.status||500,success:!1,message:o.extensions?.response?.body||"Internal Server Error"}}},cancelOrder:async(t,{orderid:e},{dataSources:s})=>{try{let r=await s.orderAPI.cancelOrder(e),o=z.safeParse(r);return{code:200,success:!0,message:o.success?o.data.message:"Invalid return message"}}catch(r){return console.error("Error cancelling order:",r),{code:r.extensions?.response?.status||500,success:!1,message:r.extensions?.response?.body||"Internal Server Error"}}},completeOrder:async(t,{orderid:e,shipping:s},{dataSources:r})=>{try{let o=await r.orderAPI.completeOrder(e,s),n=z.safeParse(o);return{code:200,success:!0,message:n.success?n.data.message:"Invalid return message"}}catch(o){return console.error("Error cancelling order:",o),{code:o.extensions?.response?.status||500,success:!1,message:o.extensions?.response?.body||"Internal Server Error"}}},createAddress:async(t,{input:e},{dataSources:s})=>{try{return{code:200,success:!0,message:"Address created successfully",order:await s.orderAPI.createAddress(e)}}catch(r){return console.error("Error creating order:",r),{code:r.extensions?.response?.status||500,success:!1,message:r.extensions?.response?.body||"Internal Server Error",order:null}}}}};var le={Query:{stockById:(t,{stockid:e},{dataSources:s})=>s.stockAPI.getStockById(e),stockByItemId:(t,{itemid:e},{dataSources:s})=>s.stockAPI.getStockByItemId(e),stockByItemType:(t,{itemType:e},{dataSources:s})=>s.stockAPI.getStockByItemType(e)},ItemStock:{item:({itemid:t},e,{dataSources:s})=>s.itemAPI.getPart(t)},Mutation:{createStock:async(t,{input:e},{dataSources:s})=>{try{return{code:200,success:!0,message:"Item created successfully",item:await s.stockAPI.createStock(e)}}catch(r){return{code:r.extensions.response.status,success:!1,message:r.extensions.response.body,item:null}}},updateStock:async(t,{input:e},{dataSources:s})=>{try{return{code:200,success:!0,message:"Item updated successfully",item:await s.stockAPI.updateStock(e)}}catch(r){return{code:r.extensions.response.status,success:!1,message:r.extensions.response.body,item:null}}},deleteStock:async(t,{stockId:e},{dataSources:s})=>{try{return{code:200,success:!0,message:"Item deleted successfully",item:await s.stockAPI.deleteStock(e)}}catch(r){return{code:r.extensions.response.status,success:!1,message:r.extensions.response.body,item:""}}}}};var et={Query:{...ie.Query,...le.Query,...Pe.Query,...Te.Query,...me.Query,...ae.Query},Mutation:{...ie.Mutation,...le.Mutation,...Pe.Mutation,...Te.Mutation,...me.Mutation,...ae.Mutation},Part:{...ie.Part},LikeItem:{...ie.LikeItem},CartItem:{...me.CartItem},OrderItem:{...ae.OrderItem},OrderEntry:{...ae.OrderEntry},ItemStock:{...le.ItemStock}};import{jwtDecode as as}from"jwt-decode";import st from"node-jose";var{JWE:tt,JWK:ds,JWS:rt}=st,cs=()=>{let t=process.env.JWT_PRIVATEKEY,e=process.env.JWT_PUBLICKEY;async function s(){let a=async c=>await ds.asKey(c,"pem"),d=await a(e),u=await a(t);return{pub_key:d,prv_key:u}}async function r(a){let{prv_key:d}=await s();if(!a)throw new Error("Missing Data");let u=JSON.stringify(a);return await rt.createSign({format:"compact"},d).update(u).final().then(function(y){return y})}async function o(a){let{pub_key:d}=await s();if(!a)throw new Error("Missing JWS Token");return await rt.createVerify(d).verify(a).then(c=>{let y=st.util.base64url.encode(c.payload);return as(y,{header:!0})}).catch(c=>{console.log("returned ",c)})}async function n(a){let{pub_key:d}=await s();if(!a)throw new Error("Missing Data");let u=JSON.stringify(a);return await tt.createEncrypt(d).update(u).final()}async function m(a){let{prv_key:d}=await s();if(!a)throw new Error("Missing encrypted arg");return await tt.createDecrypt(d).decrypt(a)}return{encrypt:n,decrypt:m,sign:r,verify:o}},ot=cs;var{encrypt:ki,decrypt:Ri,sign:ms,verify:us}=ot();async function pe(t){return(await ms(t)).toString()}async function nt(t){return await us(t)}import{z as l}from"zod";import ls from"validator";var{isEmail:it,isMobilePhone:ps}=ls,at=l.object({email:l.string().refine(it,{message:"Invalid email address"}),password:l.string().min(6).max(20),firstName:l.string().min(4),lastName:l.string().min(4),phone:l.string().refine(ps,{message:"Invalid phone number"})}),Pi=l.object({email:l.string().refine(it,{message:"Invalid email address"}),password:l.string().min(6).max(20)}),ge=l.object({id:l.string(),email:l.string().email(),firstName:l.string(),lastName:l.string()}),gs=l.object({itemid:l.string(),itemtype:l.string(),itemModel:l.string(),name:l.string(),quantity:l.number(),totalPrice:l.number(),price:l.number()}),Oi=l.object({userId:l.string(),items:l.array(gs),firstName:l.string(),lastName:l.string()});import ct from"mongoose";import{scrypt as ys,randomBytes as fs}from"crypto";import{promisify as Is}from"util";var dt=Is(ys),K=class{static async toHash(e){let s=fs(8).toString("hex");return`${(await dt(e,s,64)).toString("hex")}.${s}`}static async compare(e,s){let[r,o]=e.split(".");return(await dt(s,o,64)).toString("hex")===r}};var qe=new ct.Schema({firstName:{type:String,required:!0},lastName:{type:String,required:!0},email:{type:String,required:!0},phone:{type:String,required:!0},password:{type:String,required:!0},access:{type:String,default:"user",required:!0}},{toJSON:{transform(t,e){e.id=e._id,delete e._id,delete e.password,delete e.__v}}});qe.pre("save",async function(t){if(this.isModified("password")){let e=await K.toHash(this.get("password"));this.set("password",e)}t()});qe.statics.build=t=>new q(t);var q=ct.model("User",qe);import{BadRequestError as hs}from"@manprtickets/common";var mt=async(t,e,s)=>{if(!t.session?.jwt)return s();try{let r=await nt(t.session.jwt),{id:o,email:n,firstName:m,lastName:a}=ge.parse({...r}),d=await q.findOne({email:n});if(!d)throw new hs("Sorry you are not a valid user in the System");t.currentUser={id:d.id,email:d.email}}catch{}s()};import{errorHandler as ln}from"@manprtickets/common";import bs from"express";import{body as It}from"express-validator";var xs=(t,e)=>{let s=t.currentUser&&ge.safeParse(t.currentUser);s?e.send(s.data):e.send(null)},ut=xs;import{BadRequestError as lt}from"@manprtickets/common";var Ss=async(t,e,s)=>{let{email:r,password:o}=t.body,n=await q.findOne({email:r});if(!n)throw new lt("Sorry you entered wrong login Credentials");if(!await K.compare(n.password,o))throw new lt("Invalid Credentials");let a=await pe({id:n.id,email:n.email,firstName:n.firstName,lastName:n.lastName});t.session.jwt=a,e.status(200).send({user:{id:n.id,firstName:n.firstName,lastName:n.lastName,email:n.email,phone:n.phone},token:a})},pt=Ss;var ws=(t,e,s)=>{t.currentUser=void 0,t.session.jwt="",t.session.destroy(r=>{r&&console.log(r),e.send({})})},gt=ws;import{BadRequestError as ks}from"@manprtickets/common";var Rs=async(t,e,s)=>{let r=at.safeParse(t.body);if(!r.success)return e.status(400).send(r.error);let{email:o,password:n,firstName:m,lastName:a,phone:d}=r.data;if(await q.findOne({email:o}))throw new ks("Email in use");let c=q.build({email:o,password:n,firstName:m,lastName:a,phone:d});await c.save();let y=await pe({id:c.id,email:c.email,firstName:c.firstName,lastName:c.lastName});t.session.jwt=y,e.status(200).send({user:{id:c.id,firstName:c.firstName,lastName:c.lastName,email:c.email,phone:c.phone},token:y})},yt=Rs;import{validateRequest as As}from"@manprtickets/common";var ft=async(t,e,s)=>{let r=await q.findById(t.params.id);e.send(r)};var $=bs.Router();$.get("/currentuser",ut);$.get("/:id",ft);$.post("/signin",[It("email").isEmail().withMessage("Email must be valid"),It("password").trim().notEmpty().withMessage("You must supply a password")],As,pt);$.post("/signout",gt);$.post("/signup",yt);import{requireAuth as Ne}from"@manprtickets/common";import Vs from"express";import ht from"mongoose";var V=ht.Schema,Ts=["No","Kg","Lts","mm","cm","meter"],Ps=["Product","Equipment","Spare","Package","Category"],De=new V({itemType:{type:String,enum:Ps,required:!0,index:!0},title:{type:String,required:!0},description:{type:String,required:!0},image:{type:String},userId:{type:V.Types.ObjectId,ref:"User",required:!0}},{discriminatorKey:"itemType",collection:"items",toJSON:{transform(t,e){e.id=e._id,delete e._id}}});De.statics.build=t=>new f(t);var f=ht.model("Item",De),Os=new V({unit:{type:String,enum:Ts,required:!0},dimensions:{type:String,required:!0}}),qs=new V({}),Ds=new V({dimensions:{type:String,required:!0}}),Ns=new V({dimensions:{type:String,required:!0}}),Bs=new V({dimensions:{type:String,required:!0}});De.index({title:"text",description:"text",dimensions:"text"});var xt=f.discriminator("Category",qs),St=f.discriminator("Product",Os),wt=f.discriminator("Equipment",Ds),kt=f.discriminator("Package",Ns),Rt=f.discriminator("Spare",Bs);var vs=async(t,e,s)=>{let{title:r,unit:o,dimensions:n,description:m,image:a,itemType:d}=t.body,u=null;try{switch(d){case"Product":u=new St({itemType:d,title:r,description:m,image:a,unit:o,dimensions:n,userId:t.currentUser.id});break;case"Equipment":u=new wt({itemType:d,title:r,description:m,image:a,dimensions:n,userId:t.currentUser.id});break;case"Category":u=new xt({itemType:d,title:r,description:m,image:a,userId:t.currentUser.id});break;case"Package":u=new kt({itemType:d,title:r,description:m,image:a,dimensions:n,userId:t.currentUser.id});break;case"Spare":u=new Rt({itemType:d,title:r,description:m,image:a,dimensions:n,userId:t.currentUser.id});break}await u?.save(),e.status(201).send(u)}catch(c){console.log("errors in creation of item: ",c)}},bt=vs;var At=async(t,e,s)=>{let r,o=t.params.keystr,n=t.params.itemtype,m=f.aggregate([{$match:{itemType:n}},{$addFields:{id:"$_id"}}]);o!=="all"&&(m=f.aggregate([{$match:{itemType:n,$text:{$search:o}}},{$addFields:{id:"$_id"}}]));let a=await m.exec();e.status(200).send(a)},Tt=async(t,e,s)=>{let r=t.params.idstr,o=await f.findById(r);e.status(200).send(o)},Pt=async(t,e,s)=>{let r=t.params.typeStr,o=await f.find({itemType:r},{key:"$_id",label:"$title",_id:0});e.send(o)};import{NotAuthorizedError as _s,NotFoundError as Ms}from"@manprtickets/common";import Cs from"validator";var{isEmpty:Fs}=Cs,Us=async(t,e,s)=>{let r=t.params.id,{title:o,unit:n,dimensions:m,description:a,image:d,itemType:u}=t.body,c=await f.findOne({_id:r});if(!c)throw new Ms;if(c.userId.valueOf()!==t.currentUser.id)throw new _s;c.set({title:o,description:a,image:Fs(d)?c.image:d});try{switch(u){case"Product":c.set({dimensions:m,unit:n});break;case"Equipment":c.set({dimensions:m});break;case"Category":break;case"Package":c.set({dimensions:m});break;case"Spare":c.set({dimensions:m});break}await c.save(),e.status(201).send(c)}catch(y){console.log("errors in updation of item: ",y)}},Ot=Us;import{NotAuthorizedError as Es,NotFoundError as $s}from"@manprtickets/common";var qt=async(t,e,s)=>{let r=t.params.id,o=await f.findById(r);if(!o)throw new $s;if(o.userId.valueOf()!==t.currentUser.id)throw new Es;let{deletedCount:n}=await f.deleteOne({_id:r});e.status(201).send(`${n} Item deleted successfully`)};var C=Vs.Router();C.get("/search/:itemtype/:keystr",At);C.get("/:idstr",Tt);C.get("/select/:typeStr",Pt);C.post("/new",Ne,bt);C.put("/:id",Ne,Ot);C.delete("/:id",Ne,qt);import Gs from"express";import{requireAuth as Hs}from"@manprtickets/common";import{NotAuthorizedError as Ls,NotFoundError as Qs,RequestValidationError as zs}from"@manprtickets/common";import ve from"mongoose";var Be=ve.Schema,js=["Product","Equipment","Spare","Package","Category"],_e=new ve.Schema({itemid:{type:Be.Types.ObjectId,ref:"Item",required:!0},itemtype:{type:String,enum:js,required:!0},assignid:{type:Be.Types.ObjectId,ref:"Item",required:!0},assign:{type:String,required:!0},userId:{type:Be.Types.ObjectId,ref:"User",required:!0}},{toJSON:{transform(t,e){e.id=e._id,delete e._id}}});_e.index({itemid:1,assignid:1},{unique:!0});_e.statics.build=t=>new W(t);var W=ve.model("Part",_e);import Ks from"mongoose";import{MongoBulkWriteError as Ws}from"mongodb";var Dt=async(t,e,s)=>{let r=await f.findById(t.params.idStr);if(!r)throw new Qs;if(r.userId.valueOf()!==t.currentUser.id)throw new Ls;let{assignIDs:o,assign:n}=t.body;try{let m=o.map(a=>({itemid:r.id,itemtype:r.itemType,assignid:a,assign:n,userId:t.currentUser.id}));await W.insertMany(m)}catch(m){if(m instanceof Ws&&m.code===11e3)throw zs}e.status(201).send(`selected ${r.itemType} assigned to ${n}`)},Nt=async(t,e,s)=>{let r=t.params.assign;try{let o=await W.aggregate([{$match:{assignid:new Ks.Types.ObjectId(r)}},{$lookup:{from:"items",localField:"assignid",foreignField:"_id",as:"category"}},{$lookup:{from:"items",localField:"itemid",foreignField:"_id",as:"parts"}},{$unwind:"$category"},{$unwind:"$parts"},{$group:{_id:{id:"$category._id",name:"$category.title"},assigned:{$push:{id:"$parts._id",itemType:"$parts.itemType",title:"$parts.title",description:"$parts.description",image:"$parts.image"}}}}]).exec();e.status(201).send(o)}catch(o){console.log("error in assignments: ",o)}};import Js from"mongoose";var Bt=async(t,e,s)=>{try{let r=t.params.assignid,o=t.params.itemtype,n=await W.aggregate([{$match:{$and:[{itemtype:o},{assignid:new Js.Types.ObjectId(r)}]}},{$project:{itemid:{$toString:"$itemid"},itemtype:1,assignid:{$toString:"$assignid"},assign:1,id:{$toString:"$_id"}}}]);e.status(201).send(n)}catch(r){console.log(r)}};var de=Gs.Router();de.get("/:assign",Nt);de.post("/assign/:idStr",Hs,Dt);de.get("/:itemtype/:assignid",Bt);import Zs from"express";import{requireAuth as Ft}from"@manprtickets/common";import Me from"mongoose";var vt=Me.Schema;var _t=new Me.Schema({itemId:{type:vt.Types.ObjectId,required:!0,ref:"Item"},userId:{type:vt.Types.ObjectId,ref:"User",required:!0}},{toJSON:{transform(t,e){e.id=e._id,delete e._id}}});_t.statics.build=t=>new J(t);var J=Me.model("Like",_t);var Ys=async(t,e,s)=>{try{let r=await J.find({userId:t.currentUser?.id},"itemId userId");e.status(201).send(r)}catch{}},Mt=Ys;var Xs=async(t,e,s)=>{let r={itemId:t.params.itemid,userId:t.currentUser?.id},{deletedCount:o}=await J.deleteMany(r);try{o<=0&&await J.findOneAndUpdate(r,{},{new:!0,upsert:!0})}catch(n){console.log("error in node js: ",n)}e.status(201).send("Successfully updated")},Ct=Xs;var ye=Zs.Router();ye.get("/",Ft,Mt);ye.patch("/:itemid",Ft,Ct);import{requireAuth as Fe}from"@manprtickets/common";import co from"express";import*as $t from"lodash";import Ce from"mongoose";var Ut=Ce.Schema,eo=["Product","Equipment","Spare","Package"],to=["No","Kg","Lts","cm","mm","mtr"],Et=new Ce.Schema({itemid:{type:Ut.Types.ObjectId,ref:"item",required:!0},itemtype:{type:String,enum:eo,required:!0},unit:{type:String,enum:to,required:!0},qtytype:{type:String,default:"Stock",required:!0},quantity:{type:Number,default:0,required:!0},price:{type:Number,default:0,required:!0},gst:{type:Number,default:0,required:!0},discount:{type:Number,default:0,required:!0},userId:{type:Ut.Types.ObjectId,ref:"User",required:!0}},{toJSON:{transform(t,e){e.id=e._id,delete e._id}}});Et.statics.build=t=>new w(t);var w=Ce.model("Stock",Et);var ro=async(t,e,s)=>{let{itemid:r,itemtype:o,quantity:n,qtytype:m,unit:a,price:d,gst:u,discount:c}=t.body,y=$t.upperFirst(o);try{let S=w.build({itemid:r,itemtype:y,quantity:n,qtytype:m,unit:a,price:d,gst:u,discount:c,userId:t.currentUser.id});await S.save(),e.status(201).send(S)}catch(S){console.log("error: ",S)}},Vt=ro;import jt from"mongoose";var Lt=async(t,e,s)=>{let r=await w.find({itemtype:"Product"})};var Qt=async(t,e,s)=>{console.log("from stock by item: ",t.params.itemid);let r=await w.find({itemid:new jt.Types.ObjectId(t.params.itemid)});e.send(r)},zt=async(t,e,s)=>{let r=await w.aggregate([{$match:{itemtype:t.params.itemtype}},{$addFields:{itemid:{$toString:"$itemid"},id:{$toString:"$_id"},userId:{$toString:"$userId"}}},{$project:{_id:0,id:1,itemid:1,quantity:1,qtytype:1,price:1,gst:1,discount:1,userId:1}}]);e.send(r)},Kt=async(t,e,s)=>{let r=await w.findOne({_id:new jt.Types.ObjectId(t.params.id)});e.send(r)};import{NotFoundError as so}from"@manprtickets/common";var oo=async(t,e,s)=>{let{itemid:r,quantity:o,unit:n,price:m,gst:a,discount:d}=t.body,u=await w.findById(r);if(!u)throw new so;u.set({quantity:o,unit:n,price:m,gst:a,discount:d}),await u.save(),e.status(201).send(u)},Wt=oo;import{NotAuthorizedError as no,NotFoundError as io}from"@manprtickets/common";var ao=async(t,e,s)=>{let r=await w.findById(t.params.id);if(!r)throw new io;if(r.userId.valueOf()!==t.currentUser.id)throw new no;let{deletedCount:o}=await w.deleteOne({_id:t.params.id});e.status(201).send(`${o} StockItem deleted successfully`)},Jt=ao;var B=co.Router();B.get("/:id",Kt);B.post("/new",Fe,Vt);B.put("/update",Fe,Wt);B.delete("/delete/:id",Fe,Jt);B.get("/item/:itemid",Qt);B.get("/type/:itemtype",zt);B.get("/:itemtype",Lt);import{requireAuth as fe}from"@manprtickets/common";import wo from"express";import Ue from"mongoose";var Gt=Ue.Schema,mo=["Product","Equipment","Spare","Package"],uo=["Purchase","Sale","Return","Obsolete","Defective"],lo=["No","Kg","Lts","cm","mm","mtr"],Ht=new Ue.Schema({itemid:{type:Gt.Types.ObjectId,required:!0,ref:"items"},itemtype:{type:String,enum:mo,required:!0},unit:{type:String,enum:lo,required:!0},qtytype:{type:String,enum:uo,default:"Invoice",required:!0},quantity:{type:Number,default:0,required:!0},price:{type:Number,default:0,required:!0},gst:{type:Number,default:0,required:!0},discount:{type:Number,default:0,required:!0},billtotal:{type:Number,default:0,required:!0},shipping:{type:Number,default:0,required:!0},userId:{type:Gt.Types.ObjectId,ref:"User",required:!0}},{toJSON:{transform(t,e){e.id=e._id,delete e._id}}});Ht.statics.build=t=>new D(t);var D=Ue.model("BillItem",Ht);import po from"mongoose";var go=async(t,e,s)=>{let{itemid:r,itemtype:o,quantity:n,unit:m,qtytype:a,price:d,gst:u,discount:c,billtotal:y,shipping:S}=t.body,R=await po.startSession();R.startTransaction();try{let U=D.build({itemid:r,itemtype:o,quantity:n,qtytype:a,unit:m,price:d,gst:u,discount:c,billtotal:y,shipping:S,userId:t.currentUser.id}),be=w.build({itemid:r,itemtype:o,quantity:n,qtytype:"Stock",unit:m,price:d,gst:u,discount:c,userId:t.currentUser.id});await U.save(),await be.save(),await R.commitTransaction(),e.status(201).send(U)}catch(U){console.log("error: ",U),await R.abortTransaction()}},Yt=go;import yo from"mongoose";var Xt=async(t,e,s)=>{let r=await D.find({itemid:t.params.itemid});e.send(r)},Zt=async(t,e,s)=>{let r=await D.findOne({_id:new yo.Types.ObjectId(t.params.id)});e.send(r)};import{NotFoundError as fo}from"@manprtickets/common";var Io=async(t,e,s)=>{let{itemid:r,quantity:o,unit:n,qtytype:m,price:a,gst:d,discount:u,billtotal:c,shipping:y}=t.body,S=await D.findById(r);if(!S)throw new fo;S.set({quantity:o,unit:n,qtytype:m,price:a,gst:d,discount:u,billtotal:c,shipping:y}),await S.save(),e.status(201).send(S)},er=Io;import{NotAuthorizedError as ho,NotFoundError as xo}from"@manprtickets/common";var So=async(t,e,s)=>{let r=await D.findById(t.params.id);if(!r)throw new xo;if(r.userId.valueOf()!==t.currentUser.id)throw new ho;let o=await r.deleteOne({_id:t.params.id});e.send(`${o.deletedCount} billItem deleted successfully`)},tr=So;var j=wo.Router();j.get("/:id",Zt);j.get("/item/:itemid",fe,Xt);j.post("/new",fe,Yt);j.put("/update",fe,er);j.delete("/delete/:id",fe,tr);import{requireAuth as ir}from"@manprtickets/common";import Ro from"express";import Ie from"mongoose";var rr=Ie.Schema;var ko=new Ie.Schema({itemid:{type:rr.Types.ObjectId,required:!0,ref:"Item"},quantity:{type:Number,default:0,required:!0},limitQty:{type:Number,default:0,required:!0},price:{type:Number,default:0,required:!0},totalPrice:{type:Number,default:0,required:!0}},{toJSON:{transform(t,e){e.id=e._id,delete e._id}}}),sr=new Ie.Schema({userId:{type:rr.Types.ObjectId,ref:"User",required:!0},cartitems:{type:[ko],required:!0},totalQuantity:{type:Number,default:0,required:!0}},{toJSON:{transform(t,e){e.id=e._id,delete e._id}}});sr.statics.build=t=>new G(t);var G=Ie.model("Cart",sr);var or=async(t,e,s)=>{let r=await G.findOne({userId:t.currentUser?.id});if(!r)try{let o=G.build({userId:t.currentUser?.id,cartitems:[],totalQuantity:0});return await o.save(),e.send(o)}catch(o){console.log("created errors: ",o)}e.send(r)},nr=async(t,e,s)=>{let{cartitems:r,totalQuantity:o}=t.body,m={userId:t.currentUser?.id},{deletedCount:a}=await G.deleteMany(m);try{await G.findOneAndUpdate(m,{cartitems:r,totalQuantity:o},{new:!0,upsert:!0})}catch(d){console.log("error in node js: ",d)}e.status(201).send("Successfully replaced cart")};var he=Ro.Router();he.get("/",ir,or);he.post("/",ir,nr);import{requireAuth as P}from"@manprtickets/common";import rn from"express";import H from"mongoose";var xe=H.Schema,bo=new H.Schema({itemid:{type:xe.Types.ObjectId,required:!0,ref:"Item"},orderId:{type:xe.Types.ObjectId,ref:"Order",required:!0},quantity:{type:Number,default:0,required:!0},price:{type:Number,default:0,required:!0},totalPrice:{type:Number,default:0,required:!0}},{toJSON:{transform(t,e){e.id=e._id,delete e._id}}}),ar=new H.Schema({userId:{type:xe.Types.ObjectId,ref:"User",required:!0},status:{type:String,required:!0,enum:Object.values(Q),default:"Created"},items:{type:[bo]},orderDate:{type:H.Schema.Types.Date,required:!0},expiresAt:{type:H.Schema.Types.Date},totalQuantity:{type:Number,default:0,required:!0},orderValue:{type:Number,default:0,required:!0},shipId:{type:xe.Types.ObjectId,ref:"Address"}},{toJSON:{transform(t,e){e.id=e._id,delete e._id}}});ar.statics.build=t=>new b(t);var b=H.model("Order",ar);import{NotAuthorizedError as Ao,NotFoundError as To}from"@manprtickets/common";var Po=async(t,e,s)=>{let r=await b.findById(t.params.orderid);if(!r)throw new To;if(r.userId.valueOf()!==t.currentUser.id)throw new Ao;let o=await b.deleteOne({_id:t.params.orderid});e.send({message:`${o.deletedCount} order deleted successfully`})},dr=Po;import Ee from"mongoose";var Oo=Ee.Schema,cr=new Ee.Schema({userId:{type:Oo.Types.ObjectId,ref:"User",required:!0},email:{type:String,required:!0},receiver:{type:String,required:!0},house:{type:String,required:!0},street:{type:String,required:!0},pincode:{type:String,required:!0},city:{type:String,required:!0},phone:{type:String,required:!0}},{toJSON:{transform(t,e){e.id=e._id,delete e._id}}});cr.statics.build=t=>new v(t);var v=Ee.model("Address",cr);import yc from"lodash";var mr=async(t,e,s)=>{try{let r=await b.find({userId:t.currentUser?.id,status:"Complete"});e.status(201).send(r)}catch(r){console.log(r)}};var ur=async(t,e,s)=>{try{let r=await b.findById({_id:t.params.orderid});e.status(201).send(r)}catch(r){console.log(r)}},lr=async(t,e,s)=>{let r=await v.find({userId:t.currentUser?.id});e.status(201).send(r)},pr=async(t,e,s)=>{let r=await v.findById(t.params.id);e.send(r)};var gr=async(t,e,s)=>{let{cart:{cartitems:o,totalQuantity:n},value:m}=t.body,a=new Date;a.setSeconds(a.getSeconds()+900);let d=new b({userId:t.currentUser.id,status:"Created",orderDate:new Date,orderValue:m,expiresAt:a,items:[],totalQuantity:n,shipId:void 0}),u=o.map(c=>({itemid:c.itemid,orderId:d._id,quantity:c.quantity,price:c.price,totalPrice:c.totalPrice}));d.items=u,await d.save(),e.send(d)},yr=async(t,e,s)=>{let{email:r,receiver:o,phone:n,house:m,street:a,pincode:d,city:u}=t.body,c=new v({userId:t.currentUser.id,email:r,receiver:o,house:m,street:a,city:u,pincode:d,phone:n});try{await c.save()}catch(y){console.log("error: ",y)}e.send({shipId:c.id})};import{NotAuthorizedError as hr,NotFoundError as Ve}from"@manprtickets/common";import fr from"mongoose";var Ir=new fr.Schema({orderId:{required:!0,type:String},stripeId:{required:!0,type:String},amount:{type:Number,default:0,required:!0}},{toJSON:{transform(t,e){e.id=e._id,delete e._id}}});Ir.statics.build=t=>new $e(t);var $e=fr.model("Payment",Ir);var xr=async(t,e,s)=>{let r=await b.findById(t.params.orderid);if(!r)throw new Ve;if(r.userId.valueOf()!==t.currentUser.id)throw new hr;r.set({status:t.body.status}),await r.save(),e.send({message:"Order udpated successfully"})},Sr=async(t,e,s)=>{let{shipping:r}=t.body,o=await b.findById(t.params.orderid);if(!o)throw new Ve;if(o.userId.valueOf()!==t.currentUser.id)throw new hr;let{id:n,email:m,receiver:a,phone:d,house:u,street:c,pincode:y,city:S}=r,R=null,U=!1;if(n&&n!==""){if(R=await v.findById(n),!R)throw new Ve;U=!0}else R=new v({userId:t.currentUser.id,email:m,receiver:a,house:u,street:c,city:S,pincode:y,phone:d});console.log("shipping id: ",R?.id);let be=new $e({orderId:o.id,stripeId:"adfbbc2332",amount:o.orderValue});o.set({shipId:R?.id,status:"Complete"}),U||await R.save(),await o.save(),await be.save(),e.send({message:"Order completed successfully"})};import{Document as Go,Page as Ho,View as We}from"@react-pdf/renderer";import{Font as qo,StyleSheet as Do}from"@react-pdf/renderer";qo.register({family:"Oswald",src:"https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf"});var No=Do.create({page:{fontSize:11,paddingTop:35,paddingBottom:35,paddingHorizontal:35,lineHeight:1.5,flexDirection:"column"},titleRow:{display:"flex",width:"100%",height:40,borderBottomWidth:1,flexDirection:"column",justifyContent:"center",alignItems:"center"},tableRow:{display:"flex",width:"100%",height:350,borderWidth:1,flexDirection:"column"},theadRow:{display:"flex",width:"100%",height:"55",flexDirection:"row"},tbodyRow:{display:"flex",width:"100%",height:"35",flexDirection:"row"},tfootRow:{display:"flex",flexDirection:"row",width:"100%",height:"50",justifyContent:"flex-end"},signRow:{display:"flex",flexDirection:"row",width:"100%",height:"90",justifyContent:"flex-end"},tcells:{borderWidth:1,width:"40",fontFamily:"Times-Roman",justifyContent:"center",alignItems:"center"},tcellxl:{borderWidth:1,width:"130",fontFamily:"Times-Roman",justifyContent:"center",alignItems:"center"},tcelll:{borderWidth:1,width:"80",fontFamily:"Times-Roman",justifyContent:"center",alignItems:"center"},tcellm:{borderWidth:1,width:"70",fontFamily:"Times-Roman",justifyContent:"center",alignItems:"center"},bigSize:{fontSize:18,fontWeight:"bold",fontFamily:"Oswald",marginBottom:20},orderNumRow:{flexDirection:"row",width:"100%",justifyContent:"space-between",height:30,marginTop:10},addressRow:{flexDirection:"row",width:"100%",justifyContent:"space-between",height:110},text:{margin:8,fontSize:12,textAlign:"left",fontFamily:"Times-Roman"},addresstext:{margin:2,fontSize:11,textAlign:"left",fontFamily:"Times-Roman",lineHeight:"1"},theadText:{margin:8,fontSize:11,fontWeight:"bold",textAlign:"left",fontFamily:"Times-Roman"},subHead:{fontSize:13,fontFamily:"Oswald",marginVertical:5,textAlign:"left"},footText:{fontSize:9},pageNumber:{position:"absolute",fontSize:12,bottom:30,left:0,right:0,textAlign:"center",color:"grey"},footnote:{flexDirection:"row",position:"absolute",justifyContent:"space-between",bottom:0,left:10,right:10,color:"grey"}}),i=No;import{Text as wr,View as Bo}from"@react-pdf/renderer";import{jsx as kr,jsxs as _o}from"react/jsx-runtime";var vo=()=>_o(Bo,{style:i.footnote,fixed:!0,children:[kr(wr,{style:i.footText,children:"Through ManPrema App"}),kr(wr,{style:i.footText,children:"@toji_chettan_company"})]}),Rr=vo;import{Text as Mo,View as Co}from"@react-pdf/renderer";import{jsx as br}from"react/jsx-runtime";var Fo=({name:t})=>br(Co,{style:i.titleRow,children:br(Mo,{style:i.bigSize,children:t})}),Ar=Fo;import{Text as Tr,View as Uo}from"@react-pdf/renderer";import{jsx as Pr,jsxs as $o}from"react/jsx-runtime";var Eo=({name:t,num_fld:e,date_fld:s,style:r})=>$o(Uo,{style:[{flexDirection:"column",width:"50%"},r],children:[Pr(Tr,{children:`${t} No: ${e}`}),Pr(Tr,{children:`${t} Date: ${s}`})]}),je=Eo;var Le=t=>`${t.getDate()}-${t.getMonth()}-${t.getFullYear()}`,Qe=(t,e)=>t.length>e?t.slice(0,e):t;import{Text as Y,View as Or}from"@react-pdf/renderer";import{jsx as X,jsxs as qr}from"react/jsx-runtime";var Vo=({name:t,address:e})=>qr(Or,{style:{flexDirection:"column",width:"33%",height:"160px"},children:[X(Y,{style:i.subHead,children:t}),qr(Or,{children:[X(Y,{style:i.addresstext,children:e.receiver}),X(Y,{style:i.addresstext,children:e.house}),X(Y,{style:i.addresstext,children:e.street}),X(Y,{style:i.addresstext,children:e.city}),X(Y,{style:i.addresstext,children:e.pincode})]})]}),Se=Vo;import{Text as _,View as N}from"@react-pdf/renderer";import{jsx as h,jsxs as Lo}from"react/jsx-runtime";var jo=()=>Lo(N,{style:i.theadRow,children:[h(N,{style:i.tcells,children:h(_,{style:i.theadText,children:"Sl. No."})}),h(N,{style:i.tcellxl,children:h(_,{style:i.theadText,children:"Description"})}),h(N,{style:i.tcells,children:h(_,{style:i.theadText,children:"Unit Price"})}),h(N,{style:i.tcells,children:h(_,{style:i.theadText,children:"Qty"})}),h(N,{style:i.tcellm,children:h(_,{style:i.theadText,children:"Net Amt"})}),h(N,{style:i.tcells,children:h(_,{style:i.theadText,children:"Tax Rate"})}),h(N,{style:i.tcells,children:h(_,{style:i.theadText,children:"Tax Type"})}),h(N,{style:i.tcellm,children:h(_,{style:i.theadText,children:"Tax Amt"})}),h(N,{style:i.tcellm,children:h(_,{style:i.theadText,children:"Total Amt"})})]}),Dr=jo;import{Text as M,View as T}from"@react-pdf/renderer";import{jsx as I,jsxs as zo}from"react/jsx-runtime";var Qo=({items:t})=>I(T,{style:{flexDirection:"column"},children:t.map((e,s)=>zo(T,{style:i.tbodyRow,children:[I(T,{style:i.tcells,children:I(M,{style:i.text,children:s+1})}),I(T,{style:i.tcellxl,children:I(M,{style:i.text,children:e.orderitem.title})}),I(T,{style:i.tcells,children:I(M,{style:i.text,children:e.price})}),I(T,{style:i.tcells,children:I(M,{style:i.text,children:e.quantity})}),I(T,{style:i.tcellm,children:I(M,{style:i.text,children:e.totalPrice})}),I(T,{style:i.tcells,children:I(M,{style:i.text,children:"5%"})}),I(T,{style:i.tcells,children:I(M,{style:i.text,children:"CGST"})}),I(T,{style:i.tcellm,children:I(M,{style:i.text,children:"20.00"})}),I(T,{style:i.tcellm,children:I(M,{style:i.text,children:e.totalPrice})})]},e.orderitem.id))}),Nr=Qo;import{Text as we,View as L}from"@react-pdf/renderer";import{jsx as F,jsxs as ze}from"react/jsx-runtime";var Ko=({total:t})=>ze(L,{style:i.tfootRow,children:[ze(L,{style:{flexDirection:"column"},children:[F(L,{style:i.tcellm,children:F(we,{style:i.theadText,children:"Tax Total"})}),F(L,{style:i.tcellm,children:F(we,{style:i.text,children:t})})]}),ze(L,{style:{flexDirection:"column"},children:[F(L,{style:i.tcelll,children:F(we,{style:i.theadText,children:"Grand Total"})}),F(L,{style:i.tcelll,children:F(we,{style:i.text,children:t})})]})]}),Br=Ko;import{Text as vr,View as _r}from"@react-pdf/renderer";import{jsx as Ke,jsxs as Jo}from"react/jsx-runtime";var Wo=()=>Ke(_r,{style:i.signRow,children:Jo(_r,{style:{flexDirection:"column",justifyContent:"space-between",width:"150"},children:[Ke(vr,{style:[i.text,{textAlign:"right"}],children:"For ManPrema Inc"}),Ke(vr,{style:[i.text,{textAlign:"right",fontWeight:"bold",fontSize:13}],children:"Authorized Signatory"})]})}),Mr=Wo;import{jsx as A,jsxs as ke}from"react/jsx-runtime";var Yo=({order:t})=>A(Go,{children:ke(Ho,{size:"A4",style:i.page,children:[A(Ar,{name:"Original Tax Invoice/ Bill of Supply/ Cash Memo"}),ke(We,{style:i.orderNumRow,children:[A(je,{name:"Order",num_fld:Qe(t.id,10),date_fld:Le(t.orderDate),style:{alignItems:"flex-start"}}),A(je,{name:"Invoice",num_fld:Qe(t.id,10),date_fld:Le(t.orderDate),style:{alignItems:"flex-end"}})]}),ke(We,{style:i.addressRow,children:[A(Se,{name:"Sold By",address:t.shipping}),A(Se,{name:"Shipping",address:t.shipping}),A(Se,{name:"Billing",address:t.shipping})]}),ke(We,{style:i.tableRow,children:[A(Dr,{}),A(Nr,{items:t.items}),A(Br,{total:t.orderValue})]}),A(Mr,{}),A(Rr,{})]})}),Je=Yo;import{renderToFile as Xo,renderToStream as Zo}from"@react-pdf/renderer";import Cr from"node-fetch";function Ge(t){return JSON.stringify({query:`query OrderByID($orderid: ID!) {
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
    }`,variables:{orderid:t}})}import{fileURLToPath as en}from"url";import Re from"path";import{jsx as Er}from"react/jsx-runtime";var{dirname:tn}=Re,Fr=async(t,e,s)=>{let r=Ge(t.params.orderid),n=await(await Cr(`${g.API_URL}/graphql`,{method:"POST",body:r,headers:{"Content-Type":"application/json",usertoken:t.session?.jwt}})).json();if(!n)return e.status(404).send("Order not found");let m=n?.data.orderByID,a=Oe.safeParse(m);if(!a.success)return console.log(a.error),e.status(400).send("Invalid order data");let d=await Zo(Er(Je,{order:a.data}));e.setHeader("Content-Type","application/pdf"),e.setHeader("Content-Disposition",'attachment; filename="order-doc.pdf"'),d.pipe(e),d.on("end",()=>console.log("Done streaming, response sent"))},Ur=async(t,e,s)=>{try{let r=Ge(t.params.orderid),n=await(await Cr(`${g.API_URL}/graphql`,{method:"POST",body:r,headers:{"Content-Type":"application/json",usertoken:t.session?.jwt}})).json();if(!n)return e.status(404).send("Order not found");let m=n?.data.orderByID,a=Oe.safeParse(m);if(!a.success)return console.log(a.error),e.status(400).send("Invalid order data");let d=en(import.meta.url),u=tn(d);console.log("dir name: ",u);let c=Re.join(u,"temp_files"),y=Re.join(c,"order-doc.pdf");console.log("tempDir: ",c," creation path: ",y);let S=Re.relative(process.cwd(),y);console.log("created path: ",S),await Xo(Er(Je,{order:a.data}),y);let R={id:t.params.orderid,filename:"order-doc.pdf",fileurl:S};e.send(R)}catch(r){return console.log("error in process: ",r),{id:t.params.orderid,filename:"error",fileurl:"error url"}}};var k=rn.Router();k.get("/",P,mr);k.get("/address",P,lr);k.get("/address/:id",P,pr);k.get("/:orderid",P,ur);k.get("/genpdf/:orderid",P,Ur);k.get("/downpdf/:orderid",P,Fr);k.post("/",P,gr);k.post("/address",P,yr);k.patch("/complete/:orderid",P,Sr);k.patch("/:orderid",P,xr);k.delete("/:orderid",P,dr);var Lr={origin:"*",methods:["POST","PUT","GET","OPTIONS","HEAD","DELETE","PATCH"],credentials:!0},He=`mongodb+srv://${g.MONGO_USER}:${g.MONGO_PASSWORD}@cluster0.q4wsrjb.mongodb.net/${g.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority&appName=Cluster0`,x=Vr();x.use(jr(Lr));var{json:pn}=an;x.use(pn());x.use(dn(g.JWT_KEY));var $r=sn.createServer(x);x.use(on({secret:[process.env.JWT_KEY],resave:!1,saveUninitialized:!1,store:nn.create({mongoUrl:He,ttl:480*60,autoRemove:"interval",autoRemoveInterval:5})}));x.use((t,e,s)=>{let r=t.headers.usertoken;!t.session?.jwt&&r&&(t.session.jwt=r),e.header("Access-Control-Allow-Origin",t.headers.origin),e.header("Access-Control-Allow-Methods","OPTIONS, GET, POST, PUT, PATCH, DELETE"),e.setHeader("Access-Control-Allow-Credentials","true"),e.header("Access-Control-Allow-Headers","Origin X-Requested-With, Content-Type, Accept, Authorization"),s()});x.use(mt);x.use("/api/users",$);x.use("/api/item",C);x.use("/api/part",de);x.use("/api/like",ye);x.use("/api/stock",B);x.use("/api/invoice",j);x.use("/api/cart",he);x.use("/api/order",k);x.use(ln);var Qr=async()=>{let t=new mn({typeDefs:Ye,resolvers:{Date:{...Xe.Date},...et},plugins:[un({httpServer:$r})]});await t.start(),x.use("/graphql",jr(Lr),Vr.json(),cn(t,{context:async({req:e})=>{let s=e.headers.usertoken,{cache:r}=t;return{token:s,dataSources:{trackAPI:new ce({cache:r}),itemAPI:new Z({cache:r,token:s}),partAPI:new ee({cache:r,token:s}),stockAPI:new te({cache:r,token:s}),billAPI:new re({cache:r,token:s}),authAPI:new se({cache:r,token:s}),cartAPI:new oe({cache:r,token:s}),orderAPI:new ne({cache:r,token:s})}}}})),$r.listen(g.PORT||8080,()=>{console.log(`\u{1F680} Server ready at ${process.env.PORT}`)})};import gn from"mongoose";var yn=async()=>{await gn.connect(He).then(t=>(console.log("Connected to MongoDB"),t)).catch(t=>{console.log(t)})};yn();Qr();
