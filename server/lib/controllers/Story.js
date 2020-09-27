const {Op} = require('sequelize');
const Story = require('../models').Story;
Story.hasMany(Story, {foreignKey: 'parent_id', targetKey: 'id', as: 'children'});

const StoryController = {

    getAll: async () => {
        const all = await Story.findAll({
            include: [
                {association: 'children'},
            ],
            order: [
                ['id', 'ASC'],
            ],
            where: {}
        });

        return all;
    },

    getStarter: async () => {
        const item = await Story.findOne({
            include: [
                {association: 'children'},
            ],
            order: [
                ['id', 'ASC'],
            ],
            where: {
                parent_id: {[Op.eq]: null}
            }
        });

        if (item) {
            return item.get();
        }

        return item;
    },

    getItem: async (story_id) => {
        const item = await Story.findOne({
            include: [
                {association: 'children'},
            ],
            order: [
                ['id', 'ASC'],
            ],
            where: {
                id: {[Op.eq]: story_id}
            }
        });

        if (item) {
            return item.get();
        }

        return item;
    },

    setItem: async (data) => {
        const text = (typeof data.text != 'undefined') ? data.text.trim() : '';
        const parent_id = (typeof data.parent_id != 'undefined' && data.parent_id) ? data.parent_id : null;
        const position = (typeof data.position != 'undefined') ? data.position.trim() : '';

        if (!text) {
            throw 'Missing Text';
        }
        if (!position) {
            throw 'Missing Position';
        }

        const saved = await new Story({
            text: text,
            parent_id: parent_id,
            position: position
        }).save();

        if (saved) {
            return saved.get();
        }
        return saved;
    },

    editItem: async (id, data) => {
        const text = (typeof data.text != 'undefined') ? data.text.trim() : '';
        const parent_id = (typeof data.parent_id != 'undefined' && data.parent_id) ? data.parent_id : null;
        const position = (typeof data.position != 'undefined') ? data.position.trim() : '';

        if (!text && !parent_id && !position) {
            throw 'Ane field is mandatory.';
        }

        const item = await Story.findOne({
            where: {id: {[Op.eq]: id}}
        });

        if (!item) {
            throw 'Story not Found';
        }

        if (text) {
            item.text = text;
        }
        if (parent_id) {
            item.parent_id = parent_id;
        }
        if (position) {
            item.position = position;
        }
        item.save();

        if (item) {
            item.get();
        }
        return item;
    },

    delItem: async (id) => {
        const item = await Story.findOne({
            where: {
                id: id
            }
        });

        if (!item) {
            throw 'Story not Found';
        }
        item.destroy();

        return item;
    }

};

module.exports = StoryController;