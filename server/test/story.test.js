require('dotenv').config();
let request = require('supertest');
const urlAPI = 'localhost:' + process.env.PORT;
request = request(urlAPI);
const API_TOKEN = 'eyJzdWIiOiJkZmRmc2RmZHMiLCJuYW1lIjo';

describe('Story Test', () => {

    it('getting all story', (done) => {
        request.get('/story/all')
            .set('Authorization', 'Bearer ' + API_TOKEN)
            .expect(200)
            .end((err, res) => {
                console.log(res.body);
                if (err) {
                    return done(err);
                }
                if (!res.body.status) {
                    return done(err);
                }
                done();
            })
    });

});