module.exports = (sequelize, DataTypes) => {
    const Story = sequelize.define('Story', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        text: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        parent_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        position: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        updated_at: {
            type: 'TIMESTAMP',
            allowNull: false,
            defaultValue: sequelize.literal('current_timestamp')
        },
    }, {
        timestamps: false,
        freezeTableName: true,
        tableName: 'story',
    });

    return Story;
};