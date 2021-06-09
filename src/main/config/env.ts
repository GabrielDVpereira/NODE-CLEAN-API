export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://mongo:27017/clean_node-api',
  port: process.env.PORT || 5050,
  jwtSecret: process.env.JWT_SECRET || '3fc854f6376585d5b379a5c403ad81c7'
}
