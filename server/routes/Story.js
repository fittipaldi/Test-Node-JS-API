const router = require('express').Router();
const StoryController = require('../lib/controllers/Story');
const passport = require('passport');
const bearerAuth = passport.authenticate('bearer', {session: false});

router.get('/all', bearerAuth, async (req, res) => {
    try {
        const teams = await StoryController.getAll();
        return res.json({
            status: true,
            msg: 'Success',
            data: teams
        });
    } catch (err) {
        const msg = (typeof err.message != 'undefined') ? err.message : err;
        return res.status(500).json({
            status: false,
            msg: msg,
            data: null
        });
    }
});

router.get('/starter', bearerAuth, async (req, res) => {
    try {
        const teams = await StoryController.getStarter();
        return res.json({
            status: true,
            msg: 'Success',
            data: teams
        });
    } catch (err) {
        const msg = (typeof err.message != 'undefined') ? err.message : err;
        return res.status(500).json({
            status: false,
            msg: msg,
            data: null
        });
    }
});

router.get('/item/:id', bearerAuth, async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            throw 'Missing Story ID';
        }
        const item = await StoryController.getItem(id);
        if (!item) {
            return res.json({
                status: false,
                msg: 'Story Not Found',
                data: null
            });
        }
        return res.json({
            status: true,
            msg: 'Success',
            data: item
        });
    } catch (err) {
        const msg = (typeof err.message != 'undefined') ? err.message : err;
        return res.status(500).json({
            status: false,
            msg: msg,
            data: null
        });
    }
});

router.post('/add', bearerAuth, async (req, res) => {
    try {
        const savedItem = await StoryController.setItem(req.body);

        return res.json({
            status: true,
            msg: 'Success',
            data: savedItem
        });
    } catch (err) {
        const msg = (typeof err.message != 'undefined') ? err.message : err;
        return res.status(500).json({
            status: false,
            msg: msg,
            data: null
        });
    }
});

router.put('/edit', bearerAuth, async (req, res) => {
    try {
        const id = (typeof req.body.id != 'undefined') ? parseInt(req.body.id) : 0;
        if (!id) {
            throw 'Missing Story ID';
        }

        const savedItem = await StoryController.editItem(id, req.body);

        return res.json({
            status: true,
            msg: 'Success',
            data: savedItem
        });
    } catch (err) {
        const msg = (typeof err.message != 'undefined') ? err.message : err;
        return res.status(500).json({
            status: false,
            msg: msg,
            data: null
        });
    }
});

router.delete('/del', bearerAuth, async (req, res) => {
    try {
        const id = (typeof req.body.id != 'undefined') ? parseInt(req.body.id) : 0;
        if (!id) {
            throw 'Missing Story ID';
        }

        const match = await StoryController.delItem(id);

        return res.json({
            status: true,
            msg: 'Success',
            data: match
        });
    } catch (err) {
        const msg = (typeof err.message != 'undefined') ? err.message : err;
        return res.status(500).json({
            status: false,
            msg: msg,
            data: null
        });
    }
});

module.exports = router;