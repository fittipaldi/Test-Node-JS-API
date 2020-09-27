module.exports = (sequelize, DataTypes) => {
    const Token = sequelize.define('Token', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
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
        tableName: 'token',
    });
    return Token;
};