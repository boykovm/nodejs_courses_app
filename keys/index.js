if (process.env.NODE_ENV === 'production') {
    module.exports = require('./keys.prod')
} else {
    module.exports = require('./keys.dev')
}
// module.exports = {
//     MONGODB_URI: `mongodb+srv://admin:123@cluster0.bbjw8.mongodb.net/shop?retryWrites=true&w=majority`,
//     SESSION_SECRET: 'some secret value',
//     // SENDGRID_API_KEY: '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',
//     // EMAIL_FROM: 'mococik578@95ta.com',
//     BASE_URL: 'http://localhost:3000'
// }
