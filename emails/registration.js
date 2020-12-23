const keys = require('../keys')

module.exports = function (email) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Account created',
        html: `
        <h1>Welcome to our shop</h1>
        <p>You have created account with that email - ${email}</p>
        <hr>
        <a href="${keys.BASE_URL}">Our shop</a>
        `
    }
}
